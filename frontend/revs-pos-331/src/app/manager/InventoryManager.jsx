import React, { useEffect, useState } from 'react';
import {
    Table,
    TableHeader,
    TableBody,
    TableColumn,
    TableRow,
    TableCell,
    Button,
    Modal, 
    ModalContent, 
    ModalHeader, 
    ModalBody, 
    ModalFooter,
    useDisclosure
} from "@nextui-org/react";
import styles from "./managerpage.css"
const InventoryManager = () => {
    const [inventoryItems, setInventoryItems] = useState([]);
    const columns = ["Delete Item","Ingredient Name", "Current Stock"];
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    const fetchInventoryItems = async () => {
        try {
            const response = await fetch('/api/inventory'); // Replace with your API endpoint
            const data = await response.json();
            setInventoryItems(data);
        } catch (error) {
            console.error('Error fetching inventory items:', error);
        }
    };
    useEffect(() => {
        fetchInventoryItems();

    }, []);

    const handleStockChange = async (id, stock) => {

        const stockInfo = {
            ingredientID: id,
            stock: stock
        }
        console.log(inventoryItems);
        console.log(stockInfo);
        const response = await fetch('/api/inventory', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(stockInfo),
        });
        if (response.ok) {
            fetchInventoryItems();
        } else {
            console.error('Error updating inventory item:', response);
        }
    }
    const deleteInventory = async (itemName) => {
        try {
            console.log("Deleting item:", itemName);

            const response = await fetch('/api/inventory', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: itemName }),
            });
            
            if (response.status === 200) {
                console.log("Success!")
                fetchInventoryItems();
            } else if(response.status === 501){
                const txt = await response.text();
                const msg = txt.substring(12,txt.length-2) + ". Deleting it will affect those menu items as well, is that ok?"
                //alert(msg);
                const confirmDelete = window.confirm(msg);
                console.log(confirmDelete);
                const body = {
                    casc:true,
                    name: itemName
                }
                if (confirmDelete) {
                    console.log("roger doger, delete item", itemName)
                    const response = await fetch('/api/inventory', {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(body),
                    });

                    if (response.status === 200) {
                        console.log("Success!")
                        fetchInventoryItems();
                    } else {
                        console.error('Error deleting inventory item:', response);
                    }
                } else {
                    console.log("Deletion cancelled");
                }
                //console.error('Error deleting inventory item:', response);
                
            }
        } catch (error) {
            console.error('Error deleting inventory item:', error);
            const json = await error.json;
            console.error(json);
        }
    };
    
        const addNewItem = async (itemName) => {
            try {
                console.log("Adding new item:", itemName);

                const response = await fetch('/api/inventory', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name: itemName }),
                });
                if (response.ok) {
                    console.log("Success!")
                    fetchInventoryItems();
                } else {
                    console.error('Error adding new inventory item:', response);
                }
            } catch (error) {
                console.error('Error adding new inventory item:', error);
            }
        };
    
    const handleAddItem = (itemName) => {
        addNewItem(itemName);
        onOpenChange(false);
    };

    return (
        <div className={styles.tableContainer + "ml-2"} >
            <h1 className="mb-2">
                Inventory manager
            </h1>
            
            <Table aria-label="Table containing inventory information in each row where the first column is a delete button, second column is the ingredient name, and the third column is quantity">
                <TableHeader>
                    {columns.map((column) => (
                        <TableColumn className="text-center bg-rose-400 text-white text-center"key={column}>{column}</TableColumn>
                    ))}
                </TableHeader>
                <TableBody>

                    {inventoryItems.map((item) => (
                        <TableRow className="text-center"key={item.ingredientID}>
                            <TableCell>
                            <button alt={"delete" + item.name} onClick={() => deleteInventory(item.name)} className="bin-button text-white">
                                                        <svg alt="delete icon"
                                                            className="bin-top"
                                                            viewBox="0 0 39 7"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                                <line y1="5" x2="39" y2="5" stroke="white" stroke-width="4"></line>
                                                                <line
                                                                    x1="12"
                                                                    y1="1.5"
                                                                    x2="26.0357"
                                                                    y2="1.5"
                                                                    stroke="white"
                                                                    stroke-width="3"
                                                                ></line>
                                                                </svg>
                                                                <svg
                                                                    className="bin-bottom"
                                                                    viewBox="0 0 33 39"
                                                                    fill="none"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                >
                                                                    <mask id="path-1-inside-1_8_19" fill="white">
                                                                        <path
                                                                            d="M0 0H33V35C33 37.2091 31.2091 39 29 39H4C1.79086 39 0 37.2091 0 35V0Z"
                                                                        ></path>
                                                                    </mask>

                                                                    <path
                                                                        d="M0 0H33H0ZM37 35C37 39.4183 33.4183 43 29 43H4C-0.418278 43 -4 39.4183 -4 35H4H29H37ZM4 43C-0.418278 43 -4 39.4183 -4 35V0H4V35V43ZM37 0V35C37 39.4183 33.4183 43 29 43V35V0H37Z"
                                                                        fill="white"
                                                                        mask="url(#path-1-inside-1_8_19)"
                                                                    ></path>
                                                                    <path d="M12 6L12 29" stroke="white" stroke-width="4"></path>
                                                                    <path d="M21 6V29" stroke="white" stroke-width="4"></path>
                                                        </svg>
                            </button>
                            </TableCell>
                            <TableCell>{item.name} </TableCell>
                            <TableCell>
                                <div className={styles.input}>
                                    <input
                                    title={item.name + "stock"}
                                        className={styles.input + "text-center"}
                                        type="number"
                                        placeholder={item.stock}
                                        value={item.stock}
                                        onChange={(e) => {
                                            if(item.stock<=0 && e.target.value<0){
                                                e.target.value = 0;
                                            }
                                            handleStockChange(item.ingredientID, e.target.value);
                                        }}
                                    />
                                </div>
                            </TableCell>
                            

                        </TableRow>
                    ))}
                    <TableRow>
                        <TableCell></TableCell>
                        <TableCell>
                        <Button onPress={onOpen}>+ New Inventory Item</Button>
                            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                                <ModalContent>
                                {(onClose) => (
                                    <>
                                    <ModalHeader className="flex flex-col gap-1 text-black">Modal Title</ModalHeader>
                                    <ModalBody className='text-black'>
                                        <h1>Add Item Name</h1>
                                       <input type="text" placeholder="Item Name" className="w-full p-2 border border-gray-300 rounded-lg mb-2" />
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="danger" variant="light" onPress={onClose}>
                                        Close
                                        </Button>
                                        <Button color="primary" onPress={() => handleAddItem(document.querySelector('input[type="text"]').value)}>
                                        Add
                                        </Button>
                                    </ModalFooter>
                                    </>
                                )}
                                </ModalContent>
                            </Modal>
                        </TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    );
};

export default InventoryManager;