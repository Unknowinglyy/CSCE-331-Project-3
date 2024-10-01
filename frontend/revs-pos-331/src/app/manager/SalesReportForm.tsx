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
interface SalesReportFormData {
    startDate: string | null;
    endDate: string | null;
}

interface IngredientUsage {
    foodID: number;
    name: string;
    food_usage: number;
    revenue: number;
}

const SalesReportForm: React.FC = () => {
    const [formData, setFormData] = useState<SalesReportFormData>({
        startDate: null,
        endDate: null
    });
    const [results, setResults] = useState<IngredientUsage[]>([]);
    const columns = ["Item ID", "Item Name", "Total Sales", "Total Revenue"];

    const handleDateChange = (name: string, value: string | null) => {
        setFormData({ ...formData, [name]: value || null });
        //console.log('Name: %d Value: %d', name, value);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const baseUrl = '/api/salesReport';
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
                    setResults(items);
                } else {
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
                        {results.map((item) => (

                            <TableRow key={item.foodID}>
                                <TableCell>{item.foodID}</TableCell>
                                <TableCell>{item.name} </TableCell>
                                <TableCell>{item.food_usage}</TableCell>
                                <TableCell>{item.food_usage == 0 ? 0 : item.revenue}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </>
    );
};

export default SalesReportForm; 
