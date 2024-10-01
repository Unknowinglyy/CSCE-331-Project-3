import { useState } from 'react';
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

import "./managerpage.css"
interface PairFormData {
    startDate: string | null;
    endDate: string | null;
}

interface PairCount {
    foodid1: number;
    foodname1: string;
    foodid2: number;
    foodname2: string;
    timessoldtogether: number;
}

const CommonPairsForm: React.FC = () => {
    const [formData, setFormData] = useState<PairFormData>({
        startDate: null,
        endDate: null
    });
    const [results, setResults] = useState<PairCount[]>([]);
    const columns = ["1st Item ID", "1st Item Name", "2nd Item ID", "2nd Item Name", "Times Sold"];

    const handleDateChange = (name: string, value: string | null) => {
        setFormData({ ...formData, [name]: value || null });
        //console.log('Name: %d Value: %d', name, value);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const baseUrl = '/api/commonPairs';
            const url = new URL(baseUrl, window.location.origin);
            if (formData.startDate) {
                url.searchParams.append('startDate', formData.startDate);
            }
            if (formData.endDate) {
                url.searchParams.append('endDate', formData.endDate);
            }

            const response = await fetch(url.toString(), {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }

            });

            if (response.ok) {
                const data = await response.json();
                const items = data.rows;
                console.log("Fetched items:", items);
                if (Array.isArray(items)) { // Ensure that items is an array
                    console.log("is an array");
                    setResults(items);
                    console.log(results);
                } else {
                    console.log("not an array");
                    setResults([]); // Reset to empty array if items is not an array
                }
            } else {
                console.error('Error fetching data:', await response.text());
                setResults([]); // Reset to empty array on error
            }
            console.log(results);

        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Start Date</label>
                    <Input
                        type="date"
                        name="startDate"
                        value={formData.startDate || ''} // Handle potential null value
                        onChange={(event) => handleDateChange('startDate', event.target.value)}
                        width="100%"
                    />
                </div>
                <div>
                    <label>End Date</label>
                    <Input
                        type="date"
                        name="endDate"
                        value={formData.endDate || ''} // Handle potential null value
                        onChange={(event) => handleDateChange('endDate', event.target.value)}
                        width="100%"
                    />
                </div>
                <div className="mt-4">
                    <Button type="submit">Search</Button>
                </div>
            </form>

            {results.length > 0 && (
                <Table aria-label="Example table with dynamic content">
                    <TableHeader>
                        {columns.map((column) => (
                            <TableColumn key={column}>{column}</TableColumn>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {results.map((item, index) => (

                            <TableRow key={index}>
                                <TableCell>{item.foodid1}</TableCell>
                                <TableCell>{item.foodname1} </TableCell>
                                <TableCell>{item.foodid2}</TableCell>
                                <TableCell>{item.foodname2} </TableCell>
                                <TableCell>{item.timessoldtogether}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

            )}
        </>
    );
};

export default CommonPairsForm; 
