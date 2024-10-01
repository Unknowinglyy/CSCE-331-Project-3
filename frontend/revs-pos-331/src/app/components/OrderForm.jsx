import { Input, Button, Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownSection,
    DropdownItem } from "@nextui-org/react";
import React, { useState, useEffect } from 'react';

const OrderForm = ({ order, onSubmit }) => {
    const [formOrder, setFormOrder] = useState(order);
    const [items, setItems] = useState([])
    const [menu, setMenu] = useState([])
    
    let year = order.timeOrdered.substring(0,5)
    let month =order.timeOrdered.substring(6,8)
    let day = order.timeOrdered.substring(9,11)
    const fetchMenu = async() =>{
        try {
            const response = await fetch(`/api/menu`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                
            });
             const json = await response.json();
           //  console.log(json)
            setMenu(json)
           
            // Process the data
        } catch (error) {
            console.error('Error fetching ingredients:', error);
        }
    }
    useEffect(() => {
        fetchMenu()
        setFormOrder(order);
        let stringItems = order.items.split(",")
        let itemList = [];
        stringItems.forEach(item => {
            itemList.push({ name: item, quantity: 1 });
        });
        setItems(itemList)
        console.log(order.items.split(","))
    }, [order]);

    const handleChange = (event) => {
        console.log(event.target.type)
        if (event.target.type === 'checkbox') {
            if (!event.target.checked) {
                const updatedItems = items.filter(item => item.name !== event.target.name);
                setItems(updatedItems);
            }
        }
        else if(event.target.name.includes("quantity")){
            console.log(event.target.value);
            console.log(items);
            let itemname = event.target.name.substring(9,event.target.name.length);
            let updatedItems = items.map(item => {
                const xIndex = item.name.indexOf("x") + 1;
                let name = (item.name.substring(xIndex,item.name.length))
                if (name === itemname) {
                    console.log('yessir')
                    return { ...item, quantity: event.target.value };
                }
                return item;
            });
            
            
            let totalCost = 0;
            updatedItems.forEach(item => {
                const menuItem = menu.find(menuItem => menuItem.name === item.name);
                if (menuItem) {
                    totalCost += menuItem.price * item.quantity;
                }
            });
            setFormOrder({ ...formOrder, totalCost });
            console.log(updatedItems)
            setItems(updatedItems);
        }
        else{
            setFormOrder({ ...formOrder, [event.target.name]: event.target.value });
        }
        
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const updatedOrder = { ...formOrder };
        // 2. Update the items field
        let itemList=[];
        items.forEach(item => {
            itemList.push({ name: item.name, quantity:item.quantity });
        });
        updatedOrder.items = itemList; 
        console.log(updatedOrder)
        setFormOrder(updatedOrder)
        onSubmit(updatedOrder);
    };
  
    return (
        <form className="text-black"onSubmit={handleSubmit}>
            <h1 className="text-black text-center">Order {formOrder?.ticketID}</h1>
            <div>
                <h2>Items/Quantities:</h2>
            {
                items.map((item) => (
                    <div key={item.name} className="flex justify-between py-1">
                        <input type="checkbox" name={item.name} defaultChecked onChange={(event)=>handleChange(event)}/>
                        <label htmlFor={item.name}>{item.name}</label>
                        <input className="text-right w-1/4 bg-slate-100 rounded-full"
                            type="number"
                            name={`quantity-${item.name}`}
                            value={item.quantity}
                            onChange={handleChange}
                        />
                    </div>
                ))
            }
            </div>
          
            <Dropdown >
                <DropdownTrigger>
                    <Button 
                    variant="bordered" 
                    >
                    Add new item
                    </Button>
                </DropdownTrigger>
                <DropdownMenu className="h-fit dropdown-menu"aria-label="Static Actions">
                    {menu.map((item) => (
                        <DropdownItem  className="text-black text-xs"key={item.foodID} 
                        onClick={() => {
                        setItems([...items, { name: item.name, quantity: 1 }]);
                        setFormOrder({ ...formOrder, totalCost: formOrder.totalCost+item.price });
                        
                        console.log(items)
                        }}>{item.name}</DropdownItem>
                        ))}
                </DropdownMenu>
            </Dropdown>
            <Input name="timeOrdered" label="Time" value={formOrder?.timeOrdered.substring(0, 10) + " " + formOrder?.timeOrdered.substring(11, 16)} onChange={handleChange} />
            <Input name="totalCost" label="Cost" value={formOrder?.totalCost} onChange={handleChange} />
            <Input name="payment" label="Payment Method" value={formOrder?.payment} onChange={handleChange} />
            <Button auto type="submit">Save</Button>
        </form>
    );
};

export default OrderForm;