import { useEffect, useState } from "react";
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
interface ExcessFormData {
    startDate: string | null;
    endDate: string | null;
}

interface IngredientUsage {
    ingredientID: number;
    name: string;
    stock: number;
}

const RestockReport = () => {
    const [results, setResults] = useState<IngredientUsage[]>([]);
    const columns = ["Ingredient ID", "Ingredient Name", "Stock"];

    const fetchInventoryItems = async () => {
        try {
            const response = await fetch('/api/inventory'); // Replace with your API endpoint
            const data = await response.json();
            setResults(data);
        } catch (error) {
            console.error('Error fetching inventory items:', error);
        }
    };
    useEffect(() => {
        const interval = setInterval(() => {
            fetchInventoryItems();
        }, 2000);
        fetchInventoryItems();
    }, []);



    return (
        <div>
            {results.length > 0 && (
                <Table aria-label="Example table with dynamic content">
                    <TableHeader>
                        {columns.map((column) => (
                            <TableColumn key={column}>{column}</TableColumn>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {results.filter((item) => item.stock < 20).map((item) => (

                            <TableRow key={item.ingredientID}>
                                <TableCell>{item.ingredientID}</TableCell>
                                <TableCell>{item.name} </TableCell>
                                <TableCell>{item.stock}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
    );
};

export default RestockReport; 
