'use client';
import Link from 'next/link';
import "./kitchenpage.css";
import React, { useEffect, useState, useRef } from "react";
import {
    Input,
    Table,
    TableHeader,
    TableBody,
    TableColumn,
    TableRow,
    TableCell,
    Button
} from '@nextui-org/react';

interface Ticket {
    ticketID: number;
    status: 'pending' | 'inProgress' | 'overdue' | 'completed';
}

// main page
export default function Home() {
    const [results, setResults] = useState<Ticket[]>([]);
    const resultsRef = useRef(results);
    resultsRef.current = results;

    // Backbone function of the kitchen page, grabs all ticket information needed to be displayed
    const fetchTickets = async () => {
        try {
            // establish api call via url
            const baseUrl = '/api/ticketList';
            const url = new URL(baseUrl, window.location.origin);
            const response = await fetch(url.toString(), {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }

            });
            // receive and parse the response from api
            if (response.ok) {
                const data = await response.json();
                console.log("Fetched items:", data);
                if (data && Array.isArray(data)) {
                    setResults(data.map(ticket => ({ ...ticket, status: getStatus(ticket) })));
                }
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };
    // This function serves to estimate how long each order should take to cook
    const getCookTime = async (ticket: number) => {
        try {
            // establish api call via url
            const baseUrl = '/api/getTicketTime';
            const url = new URL(baseUrl, window.location.origin);
            url.searchParams.append('"ticketID"', ticket.toString());

            const response = await fetch(url.toString(), {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }

            });
            // parse response
            if (response.ok) {
                const data = await response.json();
                const { totalcooktimeseconds } = data[0];
                console.log("Fetched time:", totalcooktimeseconds);
                return totalcooktimeseconds;
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    }
    // This function serves to grab the current status of all orders flowing through the system
    const getStatus = (ticket: any): 'pending' | 'inProgress' | 'overdue' | 'completed' => {
        // statements check flags tied to each order
        if (ticket.isCompleted) return 'completed';
        if (ticket.isOverdue) return 'overdue';
        if (ticket.isStarted) return 'inProgress';
        return 'pending';
    };
    // This is a top level handler function that manages the statuses of each order
    const handleStatusChange = async (ticketID: number, newStatus: 'inProgress' | 'overdue' | 'completed') => {
        // Immediately sets ticket to new status
        changeStatus(ticketID, newStatus);

        // If the ticket is being set to 'In Progress', start a timer for estimated time
        if (newStatus === 'inProgress') {
            receiptHandler(ticketID);
            setTimeout(async () => {
                const ticket = resultsRef.current.find(t => t.ticketID === ticketID);
                console.log(ticket);
                // If the order is still in progress when the timer expires, set the status to overdue
                if (ticket && ticket.status === 'inProgress') {
                    changeStatus(ticketID, 'overdue');
                }
            }, await getCookTime(ticketID) * 1000);
        }
    };
    // This function sends API calls to the database to update the flags for each order in the kitchen
    const changeStatus = async (ticketID: number, newStatus: 'inProgress' | 'overdue' | 'completed') => {
        // establish api call via url
        const baseURL = 'api/updateTicketStatus';
        const url = new URL(baseURL, window.location.origin);
        url.searchParams.append('"ticketID"', ticketID.toString());
        if (newStatus == 'inProgress') {
            url.searchParams.append('"isStarted"', '1');
            url.searchParams.append('"isOverdue"', '0');
            url.searchParams.append('"isCompleted"', '0');
        } else if (newStatus == 'overdue') {
            console.log("Setting overdue");
            url.searchParams.append('"isStarted"', '0');
            url.searchParams.append('"isOverdue"', '1');
            url.searchParams.append('"isCompleted"', '0');
        } else if (newStatus == 'completed') {
            url.searchParams.append('"isStarted"', '0');
            url.searchParams.append('"isOverdue"', '0');
            url.searchParams.append('"isCompleted"', '1');
        }
        const response = await fetch(url.toString(), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        // once database is updated change the flags on the orders in the UI
        if (response.ok) {
            setResults(currentResults => currentResults.map(ticket =>
                ticket.ticketID === ticketID ? { ...ticket, status: newStatus } : ticket
            ));
        } else {
            console.error('Failed to update ticket status:', await response.text());
        }
    }
    // This function handles the database call for a given tickets information and prints it from a local ticket printer
    // (temporarily it downloads a .txt file with the receipt info)
    const receiptHandler = async (ticketID: number) => {
        try {
            const baseUrl = '/api/ticketReceipt';
            const url = new URL(baseUrl, window.location.origin);
            url.searchParams.append('"ticketID"', ticketID.toString());
            const response2 = await fetch(url.toString(), {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }

            });
            // once the response is received parse it and create the receipt .txt file to print
            if (response2.ok) {
                const data2 = await response2.json();
                console.log("grabbed this:", data2);
                const { ticketID, items } = data2;
                const content = `Ticket Number: ${ticketID}\nMenu Items:\n${items.join('\n')}`;
                // create file
                const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
                const href = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = href;
                link.download = `ticket_receipt_${ticketID}.txt`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(href);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    }
    // This function automatically fetches new tickets every 2 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            fetchTickets();
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <main className="flex min-h-screen flex-col items-center">
                <nav>
                    <span className="nav-title">REVs American Grill</span>
                </nav>
                {results.length > 0 && (
                    <Table aria-label="Static content table" className='Tableone'>
                        <TableHeader>
                            {["Pending", "In Progress", "Overdue", "Completed"].map((column) => (
                                <TableColumn key={column} className='items-center'>{column}</TableColumn>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {results.map((item) => (
                                <TableRow key={item.ticketID} className='Table-Row'>
                                    <TableCell className='pendingColumn'>{item.status === 'pending' && (
                                        <div className='flex items-center justify-center next-button'>
                                            {item.ticketID}
                                            <button onClick={() => handleStatusChange(item.ticketID, 'inProgress')} className='begin-button'>Begin</button>
                                        </div>
                                    )}</TableCell>
                                    <TableCell className='inProgressColumn'>{item.status === 'inProgress' && (
                                        <div className='flex items-center justify-center next-button'>
                                            {item.ticketID}
                                            <button onClick={() => changeStatus(item.ticketID, 'completed')} className='ontime-complete-button'>Complete</button>
                                        </div>
                                    )}</TableCell>
                                    <TableCell className='overdueColumn'>{item.status === 'overdue' && (
                                        <div className='flex items-center justify-center next-button'>
                                            {item.ticketID}
                                            <button onClick={() => changeStatus(item.ticketID, 'completed')} className='overdue-complete-button'>Complete</button>
                                        </div>
                                    )}</TableCell>
                                    <TableCell className='completeColumn'>{item.status === 'completed' && item.ticketID}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
                <div className="order-container">
                    <div className="order-content">
                        {/* <h3 className="item-in-order">Items in Order - Total: ${totalPrice.toFixed(2)}</h3>
                    {order.map((item, index) => (
                        <div key={index} className="order-item">
                            <span>{item.name}</span>
                        </div>
                    ))}
                    <button className="order-action-btn" onClick={finishOrder}>Finish Order</button>
                    <button className="order-action-btn" onClick={cancelOrder}>Cancel Order</button> */}
                    </div>
                </div>
            </main>
        </>
    );
}