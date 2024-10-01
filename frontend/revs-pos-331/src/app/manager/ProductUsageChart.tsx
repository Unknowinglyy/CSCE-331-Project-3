import React from 'react';
import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Label } from 'recharts';
import internal from 'stream';
import { format } from 'date-fns';
import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownSection,
    DropdownItem,
    Button
  } from "@nextui-org/react";

// const data = [
//     { name: 'Jan', usage: 400 },
//     { name: 'Feb', usage: 300 },
//     { name: 'Mar', usage: 200 },
//     { name: 'Apr', usage: 500 },
//     { name: 'May', usage: 600 },
//     { name: 'Jun', usage: 800 },
// ];
const productChartFunction = (startDate:Date,ingredient:string) =>{
    
    
}
const ProductUsageChart: React.FC = () => {
    const [data, setData] = useState([]);
    const [startDate, setStartDate] = useState("05/05/2023");
    const [endDate, setEndDate] = useState("06/05/2023");
    const [ingredient, setIngredient] = useState('');
    const [inventoryItems, setInventoryItems] = useState([]);
    const [inventoryItem, setInventoryItem] = useState("")
    const [invalidDate,setInvalidDate] = useState(false);
    const fetchInventoryItems = async () => {
        try {
            const response = await fetch('/api/inventory'); // Replace with your API endpoint
            const data = await response.json();
            setInventoryItems(data);
        } catch (error) {
            console.error('Error fetching inventory items:', error);
        }
    };
    const fetchData = async () => {
        if (new Date(startDate) > new Date(endDate)) {
            setInvalidDate(true);
            return;
        }
        else{
            setInvalidDate(false);
        }
        try {
            const response = await fetch('/api/productUsage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ingredient: ingredient,
                    startDay: startDate,
                    endDate: endDate,
                    interval: 7
                })
            });
            const result = await response.json();
            setData(result);
            console.log(result);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        fetchInventoryItems();
        if(endDate === '' || startDate === ''){
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        // Format dates using date-fns for consistent display
        setStartDate(format(startOfMonth, 'yyyy-MM-dd'));
        setEndDate(format(today, 'yyyy-MM-dd')); 
        }
        
        
        
    }, [ingredient, startDate, endDate]);
    return (
        <div className="bg-white h-fit">
            <div className='flex chartSettings'>
            <Dropdown className="text-black">
                <DropdownTrigger>
                    <Button 
                    className="text-black"
                    variant="bordered" 
                    onClick={() => {}}
                    >
                    {inventoryItem || 'Choose Ingredient'} 
                    </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Dynamic Actions" items={inventoryItems}>
                    {(item:InventoryItem) => (
                    <DropdownItem
                        key={item.ingredientID}
                        onClick={() => {setInventoryItem(item.name)
                                    setIngredient(item.name)
                        }}
                    >
                        {item.name}
                    </DropdownItem>
                    )}
                </DropdownMenu>
            </Dropdown>
            Start Date
            <input
                className="text-black"
                type="date"
                value={startDate || ''} // Set value if startDate exists, otherwise empty string
                onChange={(e) => setStartDate(e.target.value)}
                placeholder={!startDate ? "Start Date" : undefined} // Conditional placeholder
            />
            End Date
            <input
                className="text-black"
                type="date"
                value={endDate || ''} // Set value if startDate exists, otherwise empty string
                onChange={(e) => setEndDate(e.target.value)}
                placeholder={!endDate ? "Start Date" : undefined} // Conditional placeholder
            />
            <Button className="text-black" variant="bordered" onClick={()=>fetchData()}>Load Chart!</Button>
            </div>
            
                    {invalidDate && <h1 className="text-red-500">Start Date must be before End Date</h1>}
                        <h1 className='font-bold text-center'>Product Usage Chart of {ingredient || ""}</h1>
            <div className='items-center flex justify-center'>
                            
                <LineChart width={600} height={400} data={data} margin={{top: 5, right: 20, left: 20, bottom: 30}}>
                
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis className="text-xs" dataKey="name" angle={15} >
                        <Label position='bottom'>
                            Week #
                        </Label>
                    </XAxis>
                    <YAxis >
                    <Label angle={270} position='insideLeft' style={{ textAnchor: 'middle' }}>
                        Units Consumed
                    </Label>
                    </YAxis>
                    <Tooltip />
                    
                    <Line type="monotone" dataKey="usage" stroke="#8884d8" />
                    <title>Performance</title>
                </LineChart>
            </div>
        </div>
    );
};

export default ProductUsageChart;