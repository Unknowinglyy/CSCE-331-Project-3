'use client';
import Link from 'next/link';
import "./managerpage.css";
import { useEffect, useState } from "react";
import {
    Button, Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Input,
    Checkbox,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownSection,
    DropdownItem,
    Table,
    TableBody,
    TableHeader,
    TableColumn,
    TableCell,
    TableRow

} from "@nextui-org/react";
import React from 'react';
import { Providers } from '../Providers';
import AddFoodForm from './AddFoodForm';
import OrderView from '../components/OrderView';
import ExcessForm from './ExcessForm';
import CommonPairsForm from './CommonPairsForm';
import SalesReportForm from './SalesReportForm';
import InventoryManager from "./InventoryManager"
import ProductUsageChart from './ProductUsageChart';
import RestockReport from "./RestockReport";
export default function Home() {
    const [menuItems, setMenuItems] = useState([]);
    const [shownInterface, setShownInterface] = useState('inventory');
    const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [openModals, setOpenModals] = useState<{ [key: number]: boolean }>({});
    const [searchQuery, setSearchQuery] = useState("");
    const fetchMenuItems = async () => {

        if (shownInterface != "menuItems") {
            setShownInterface("menuItems");
            updateMenuItems();
        }
        else {
            setShownInterface("");
        }

    };
    const updateMenuItems = async () => {
        try { // Add error handling
            const response = await fetch(`/api/menu?search=`, {
                method: 'GET'
            }); // Correct URL path
            const json = await response.json(); // Await the JSON parsing 
            setMenuItems(json);
            //this filters for the name in the search bar
            //console.log(json);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }


    const search = async (search = "") => {
        setSearchQuery(search);
    };
    //this filters rows for what is in the search bar
    const filteredRows = searchQuery === "" ? menuItems : menuItems.filter((menuItems: { name: any; }) => String(menuItems.name).toLowerCase().includes(searchQuery.toLowerCase()));

    const handleEditClick = (item: FoodItem) => {
        setSelectedItem(item);
        isOpen
    };

    // Function to close modal


   
    interface FoodItem {
        foodID: number;
        name: string;
        price: number;
        foodType: string;
        recipe:string;
        start: string;
        end: string;
    }

    interface FoodItemFormData {
        foodID: number,
        name: string;
        price: number,
        type: string,
        start: string,
        end: string,
        newIngredients: number[],
        cutIngredients:string[]
    }


    function MenuChangeForm({ item, onSubmit }: { item: FoodItem | null; onSubmit: (formData: FoodItemFormData) => void }) {
        const [formData, setFormData] = useState<FoodItemFormData>(item ? {
            foodID: item.foodID,
            name: item.name,
            price: item.price,
            type: item.foodType,
            start: item.start,
            end: item.end,
            newIngredients:[],
            cutIngredients:[]

        } : {
            foodID: 0,
            name: '',
            price: 0,
            type: '',
            start: "",
            end: "",
            newIngredients:[],
            cutIngredients:[]

        });
        const [recipe, setRecipe] = useState<string[]>([]);
        const [allIngredients, setAllIngredients] = useState([]);
        const [uncheckedIngredients, setUncheckedIngredients] = useState<string[]>([]);

        const fetchInventoryItems = async () => {
            try {
                const response = await fetch('/api/inventory'); // Replace with your API endpoint
                const data = await response.json();
                setAllIngredients(data);
            } catch (error) {
                console.error('Error fetching inventory items:', error);
            }
        };
        const fetchIngredients = async (itemName: string) => {
            try {
                const response = await fetch(`/api/menu`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name:itemName })
                });
                 const json = await response.json();
               //  console.log(json)
                setRecipe(json.map((ingredient: { ingredientID: number, name: string }) => ingredient.name));
                // Process the data
            } catch (error) {
                console.error('Error fetching ingredients:', error);
            }
        };
        useEffect(() => {
            if (item) {
                fetchIngredients(item.name);
                fetchInventoryItems();
                //console.log(recipe)
            }
            
        }, [item]);
        const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            // Handle general form changes (name, price, type)
            if (event.target.name) { 
                setFormData({ ...formData, [event.target.name]: event.target.value });
            }
    
            // Handle ingredient checkbox changes
            if (event.target.type === "checkbox" && event.target.name === "ingredients") {
                const ingredient = event.target.value;
                const isChecked = event.target.checked;
                
                if (isChecked) {
                    setUncheckedIngredients(prevIngredients => prevIngredients.filter(i => i !== ingredient));
                } else {
                    console.log("updating uncehcked")
                    setUncheckedIngredients([...uncheckedIngredients, ingredient]);
                    setFormData({ ...formData, cutIngredients: uncheckedIngredients }); 
                }
            }
        };

        const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            console.log(uncheckedIngredients);
            fetch('/api/inventory/', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ingredients: uncheckedIngredients,
                    foodName: formData.name
                })
            });
            onSubmit(formData);
            onClose(formData.foodID); 
        };
        useEffect(() => {
            // If you need to do something when formData changes, do it here
            if (formData.cutIngredients.length > 0) {
                console.log("Ingredients to remove:", uncheckedIngredients)
              // Example: Send data to your backend API
              // fetch('/api/update-ingredients', { ... }) 
            }
          }, [uncheckedIngredients, formData.cutIngredients]);

        return (
            <form onSubmit={handleSubmit} className='flex-col items-center'>
            <div className=''>
            <label className="flex " >Modify Name:</label>
            <Input className="flex w-full text-center" type="text" name="name" value={formData.name} onChange={handleChange} placeholder='Enter new name' />
            </div>
            <div className=''>
            <label>Modify Price:</label>
            <Input className="w-full" type="number" name="price" value={formData.price.toString()} onChange={handleChange} placeholder='Enter new price' />
            </div>
            <div>
            <label>Modify Type:</label>
            <Input className="" type="text" name="type" value={formData.type} onChange={handleChange} placeholder='Enter new type' />
            </div>
            <div>
            <label>Modify Ingredients</label>
            {recipe.map((ingredient: string) => (
            <div key={ingredient}>
            <input checked={!uncheckedIngredients.includes(ingredient) && recipe.includes(ingredient)}
             type="checkbox" name="ingredients" value={ingredient} onChange={(event) => {
                handleChange(event);
                //console.log(uncheckedIngredients);
               
            }} />
            <label className="px-2">{ingredient}</label>
            </div>
            ))}
            <Dropdown >
                <DropdownTrigger>
                    <Button 
                    variant="bordered" 
                    >
                    Add new ingredient
                    </Button>
                </DropdownTrigger>
            <DropdownMenu className="h-fit dropdown-menu"aria-label="Static Actions">
                {allIngredients.map((ingredient: { ingredientID: number, name: string }) => (
                    <DropdownItem  className="text-black text-xs"key={ingredient.ingredientID} 
                    onClick={() => {
                    setRecipe([...recipe, ingredient.name])
                    setFormData({...formData, newIngredients: [...formData.newIngredients, ingredient.ingredientID]})
                    }}>{ingredient.name}</DropdownItem>
                    ))}
            </DropdownMenu>
            </Dropdown>
            </div>
            <Button className="mt-2 bg-green-500" type="submit">Submit</Button>
            </form>
        );
    }
    const addNewFoodItem = () => {
        if (shownInterface !== "addFood") {
            setShownInterface("addFood")
        }
        else {
            setShownInterface("");
        }
    }
    const deleteItem = async (foodID: number) => {
        try { // Add error handling
            console.log(foodID);
            const response = await fetch(`api/menu?foodID=${foodID}`, {
                method: 'DELETE'
            }); // Correct URL path
            const json = await response.json(); // Await the JSON parsing 

            console.log(json);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
        updateMenuItems();
    }
    const viewOrders = () => {
        if (shownInterface != "pastOrders") {
            setShownInterface("pastOrders");
        }
        else {
            setShownInterface("")
        }
    }
    const findCommonPairs = () => {
        if (shownInterface != "commonPairs") {
            setShownInterface("commonPairs");
        }
        else {
            setShownInterface("");
        }
    }
    const findExcess = () => {
        if (shownInterface != "excessReport") {
            setShownInterface("excessReport");
        }
        else {
            setShownInterface("");
        }
    }
    const findSales = () => {
        if (shownInterface != "salesReport") {
            setShownInterface("salesReport");
        }
        else {
            setShownInterface("");
        }
    }
    const editItems = (data: FoodItemFormData) => {
        console.log(data);
        fetch('api/menu', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => response.json())
        
        updateMenuItems();
        return
    }
    const onClose = (itemId: number) => { // Assuming foodID is a string
        setOpenModals({ ...openModals, [itemId]: false });
    };

   const productUsage = () =>{
         fetch("api/menu")
         if (shownInterface != "productUsage"){
              setShownInterface("productUsage")
         }
         else{
              setShownInterface("")
         }
   }

   const findRestock = () => {
    if (shownInterface != "restockReport") {
        setShownInterface("restockReport");
    }
    else {
        setShownInterface("");
    }
}
   
    return (
            <main className="managerMain lex min-h-screen flex-col items-center">
                <div className="managerNav text-xl flex w-full items-center">
                    <div className="w-1/3 justify-items-center items-center text-center">
                    <Link href="/"><button className="navButton rounded-full">Home</button></Link>
                    </div>
                    <h1 className="managerTitle w-1/3 text-center">Revs Grill Management</h1>
                </div>
                <div className="bodyContainer flex w-full">
                    <div className="managerButtonsContainer flex  flex-col w-1/5">
                        <Button onClick={fetchMenuItems} className={'managerButton menuToggler bg-white px-1 ' + (shownInterface === "menuItems" ? "bg-purple-500" : "bg-white")}>{shownInterface === "menuItems" ? `Hide` : `View and Edit Menu`}</Button>
                        <Button onClick={addNewFoodItem} className={"managerButton addFoodToggler bg-white px-1 " + (shownInterface === "addFood" ? "bg-purple-500" : "bg-white")}>{shownInterface === "addFood" ? `Hide` : `Add Food Items`}</Button>
                        <Button onClick={viewOrders} className={"managerButton pastOrdersToggler bg-white px-1 " + (shownInterface === "pastOrders" ? "bg-purple-500" : "bg-white")}>{shownInterface === "pastOrders" ? `Hide` : `View Past Orders`}</Button>
                        <Button onClick={findCommonPairs} className={"managerButton commonPairsToggler bg-white px-1 " + (shownInterface === "commonPairs" ? "bg-purple-500" : "bg-white")}>{shownInterface === "commonPairs" ? `Hide` : `View Commonly Ordered Pairs`}</Button>
                        <Button onClick={findSales} className={"managerButton salesReportToggler bg-white px-1 " + (shownInterface === "salesReport" ? "bg-purple-500" : "bg-white")}>{shownInterface === "salesReport" ? `Hide` : `View Sales Report`}</Button>
                        <Button onClick={findExcess} className={"managerButton excessReportToggler bg-white px-1" + (shownInterface === "excessreport" ? "bg-purple-500" : "bg-white")}>{shownInterface === "excessReport" ? `Hide` : `View Excess Report`}</Button>
                        <Button onClick={productUsage}className={"managerButton productUsageToggler hover:bg-purple-300 bg-white px-1"+(shownInterface === "productUsage" ? "bg-purple-500" :"bg-white")}>{shownInterface === "productUsage" ? `Hide` : `View Product Usage Chart`}</Button>
                        <Button onClick={findRestock}className={"managerButton restockReportToggler hover:bg-purple-300 bg-white px-1"+(shownInterface === "restockReport" ? "bg-purple-500" :"bg-white")}>{shownInterface === "restockReport" ? `Hide` : `View Restock Report`}</Button>



                    </div>


                    <div className="w-2/5 flex justify-center text-center">
                        <InventoryManager />
                    </div>

                    {shownInterface === "menuItems" &&
                        <div className="flex-col justify-center">
                            <h1 className="text-center text-gray-600 bg-gray-200 rounded-full my-2">Menu Modifier</h1>
                            <div className="menuBodyContainer flex-col">
                                <div className="search-bar">
                                    <Input
                                        placeholder="Search Food Name"
                                        value={searchQuery}
                                        onChange={(e) => search(e.target.value)}
                                    />
                                </div>
                                
                                <Table>
                                    <TableHeader>
                                        <TableColumn> </TableColumn>
                                        <TableColumn className="text-center">Edit</TableColumn>
                                        <TableColumn className="text-center">Name</TableColumn>
                                        <TableColumn className="text-center">Price</TableColumn>
                                        <TableColumn className="text-center">Type</TableColumn>
                                        <TableColumn className="text-center">Delete</TableColumn>
                                    </TableHeader>
                                    <TableBody>
                                    {filteredRows && filteredRows.map((item: FoodItem) => (
                                            <TableRow key={item.foodID} className="" id={`${item.foodID}`}>
                                                <TableCell>
                                                    <Modal isOpen={openModals[item.foodID] || false} onOpenChange={onOpenChange} className="text-black" onClose={() => onClose(item.foodID)}>
                                                        <ModalContent>
                                                            {(onClose) => (
                                                                <>
                                                                    <ModalHeader className="flex flex-col gap-1">Edit {item.name}</ModalHeader>
                                                                    <ModalBody>
                                                                        <MenuChangeForm item={item} onSubmit={(formData) => editItems(formData)} />
                                                                    </ModalBody>
                                                                    <ModalFooter>
                                                                        <Button color="danger" variant="light" onPress={onClose}>
                                                                            Close
                                                                        </Button>
                                                                        
                                                                    </ModalFooter>
                                                                </>
                                                            )}
                                                        </ModalContent>
                                                    </Modal>
                                                </TableCell>
                                               
                                                <TableCell className="px-2"> <Button onPress={() => setOpenModals({ ...openModals, [item.foodID]: true })} className="rounded-full bg-green-500 px-2 ">Edit</Button></TableCell>
                                                <TableCell className="py-1 text-center text-black">{item.name}</TableCell>
                                                <TableCell className="px-2 text-center text-black">${item.price.toFixed(2)}</TableCell>
                                                <TableCell className="px-2 text-center text-black">{item.foodType}</TableCell>
                                                <TableCell>
                                                    <button onClick={() => deleteItem(item.foodID)} className="bin-button">
                                                        <svg
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
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                
                                <div id="editContainer" className="flex flex-col items-start bg-zinc-400">


                                </div>
                            </div>
                        </div>

                    }
                    {
                        shownInterface === "addFood" &&
                        <div className="w-full flex justify-center">
                            <div className="addFoodContainer w-1/2 align-center flex flex-col">
                                <label>Add new food item:</label>
                                <AddFoodForm/>
                            </div>
                        </div>
                    }
                    <div>

                    </div>
                    <div className='flex'>
                        {
                            shownInterface === "pastOrders" &&
                            <div className="pastOrderContainer w-full flex">
                                <OrderView />
                            </div>
                        }


                    </div>

                    {
                        shownInterface === "excessReport" &&
                        <div className="excessReportContainer w-3/8 align-center flex flex-col">
                            <label><p>View Excess From Today &rarr; Any past Date:</p></label>
                            <ExcessForm />
                        </div>
                    }


                    {
                        shownInterface === "commonPairs" &&
                        <div className="PairsReportContainer w-3/8 align-center flex flex-col">
                            <label><p>View Items Commonly Sold Together From Start Date &rarr; End Date:</p></label>
                            <CommonPairsForm />
                        </div>
                    }
                    {
                        shownInterface === "salesReport" &&
                        <div className="SalesReportContainer w-3/8 align-center flex flex-col">
                            <label><p>Sales Report From Start Date &rarr; End Date:</p></label>
                            <SalesReportForm />
                        </div>
                    }

                    {shownInterface === "productUsage" &&
                        
                        <ProductUsageChart/>
                    }

                    {
                        shownInterface === "restockReport" &&
                        <div className="restockReport w-3/8 align-center flex flex-col">
                            <label><p>View Items That Need To Be Restocked</p></label>
                            <RestockReport />
                        </div>
                    }
                    
                    </div>
            </main>
        
    );
}
