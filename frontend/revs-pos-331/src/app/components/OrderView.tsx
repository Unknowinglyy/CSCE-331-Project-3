import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownSection,
    DropdownItem,
    Table,
    TableHeader,
    TableBody,
    TableColumn,
    TableRow,
    TableCell,
    Button,
    Input,
    Modal, 
    ModalContent, 
    ModalHeader, 
    ModalBody, 
    ModalFooter,
    useDisclosure
} from "@nextui-org/react";
import "./orderViewStyles.css";
import "./OrderForm";
import { useState, useEffect, SetStateAction } from "react";
import OrderForm from "./OrderForm";
import { Niconne } from "next/font/google";

interface Ticket {
    ticketID: number; // Adjust types to match your actual data
    items: string;
    timeOrdered: string;
    totalCost: number;
    payment: string;
    
}
interface item{
    name:string;
    quantity:number;
}
interface formData{
    ticketID: number; // Adjust types to match your actual data
    items: item[];
    timeOrdered: string;
    totalCost: number;
    payment: string;

}

const OrderView = () => {
    const [rows, setRows] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [offset, setOffset] = useState(0);
    const [ingredient, setIngredient] = useState('');
    const [searchQuery, setSearchQuery] = useState("");
    const [inventoryItems, setInventoryItems] = useState([]);
    const [inventoryItem, setInventoryItem] = useState("")
    const {isOpen, onOpen, onClose} = useDisclosure();
    //const [searchFoodName, setSearchFoodName] = useState("");

    const columns = ["Ticket ID", "Items", "Time Ordered", "Total Cost", "Payment", "Edit",""];
    const [modalOpen, setModalOpen] = useState(false);
    const [currentRow, setCurrentRow] = useState<Ticket>({
        ticketID: 0, // Adjust types to match your actual data
        items: "",
        timeOrdered: "",
        totalCost: 0,
        payment: ""
        
    }
    );
    const [openModals, setOpenModals] = useState({});
    
    const handleOpen = (row:any) => {
        setCurrentRow(row);
        onOpen();
      }


    const fetchData = async (page = 1,search = "") => {
        const limit = 50; // Items per page
        const offset = (page - 1) * limit;
        if(search === "NaN"){
            search = "";
        }
        try {
            const response = await fetch(`/api/orders?limit=${limit}&offset=${offset}&searchQuery=${search}`, { method: "GET" });
            const orders = await response.json(); // Type the response
            setRows(orders);
            console.log(orders)
            setCurrentPage(page);
            setOffset(offset);
        }
        catch (error) {
            console.log(error);
        }
    };

    
    const handleSubmission = async(formData: any)=>{
        console.log(formData)
        const jsonString = JSON.stringify(formData);
        const response = await fetch('/api/orders',
        {
            method:'PATCH',
            headers:{
                'Content-Type':'application/json'
            },
            body:jsonString})
        const json = await response.json;
        console.log(json);
        fetchData();
    }
    

    const fetchInventoryItems = async () => {
        try {
            const response = await fetch('/api/menu'); // Replace with your API endpoint
            const data = await response.json();
            setInventoryItems(data);
        } catch (error) {
            console.error('Error fetching inventory items:', error);
        }
    };

    const search = async (search = "") => {
        setSearchQuery(search);
        //makes it so that they can only search numbers
        
        const protectSearch = String(parseInt(search));
        fetchData(1,String(protectSearch));
        
    };
    const searchFood = async (search = "") => {
        setSearchQuery(search);
        //makes it so that they can only search numbers
        fetchData(1,search);
    };

    useEffect(() => {
        fetchInventoryItems();
        fetchData(); // Execute the fetch on component mount 
    }, []);


    return (
        <div className="mr-2">
            <div className="search-bar">
                <Input
                    placeholder="Search Order ID"
                    value={searchQuery}
                    onChange={(e) => search(e.target.value)}
                />
            </div>
            <div className="food-type-dropdown">
                <Dropdown>
                    <DropdownTrigger>
                        <Button 
                        onClick={() => {}}
                        >
                        {inventoryItem || 'Choose Ingredient'} 
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu className="h-fit dropdown-menu" aria-label="Dynamic Actions" items={inventoryItems}>
                        {(item:FoodItem) => (
                        <DropdownItem
                            className="text-black"
                            key={item.foodID}
                            onClick={() => {setInventoryItem(item.name)
                                searchFood(item.name)
                            }}
                        >
                            {item.name}
                        </DropdownItem>
                        )}
                    </DropdownMenu>
                </Dropdown>
            </div>
            <div className="pagination-controls flex justify-between">
                <Button onClick={() => fetchData(currentPage - 1)} disabled={currentPage === 1}>Previous</Button>
                <Button onClick={() => fetchData(currentPage + 1)}>Next</Button>
            </div>

            <Table className="w-full" aria-label="Table with order information in column order ticketID, items, time ordered, total cost, and payment method">
                <TableHeader>
                    {columns.map((column) => (
                        <TableColumn className="text-center" key={column}>{column}</TableColumn>
                    ))}
                </TableHeader>
                <TableBody aria-label="Dynamic Actions" items={rows}>
                    {rows.length > 0 ? (
                        rows.map((row:Ticket) => (
                            <TableRow className="text-center" key={row.ticketID}>
                            <TableCell className="text-center">{row.ticketID}</TableCell>
                            <TableCell className="text-center">
                            {
                            row.items
                            }
                             </TableCell>
                            <TableCell className="text-center">{row.timeOrdered.substring(0, 10) + " " + row.timeOrdered.substring(11, 16)}</TableCell>
                            <TableCell className="text-center">{row.totalCost.toFixed(2)}</TableCell>
                            <TableCell className="text-center">{row.payment}</TableCell>
                            <TableCell>
                                <Button onClick={() => handleOpen(row)}>Edit</Button>
                            </TableCell>

                            <TableCell className="text-black">
                                {/* Only render Modal if currentRow matches the iterated row */}
                                {currentRow && currentRow.ticketID === row.ticketID && ( // Check for match
                                    <Modal
                                    className="p-4"
                                        isOpen={isOpen}
                                        onClose={onClose}
                                         // Pass currentRow
                                    >
                                        <ModalContent>
                                            {(onClose) => (
                                                <>
                                                    <OrderForm order={row} onSubmit={(formData:any)=> handleSubmission(formData)}/>
                                                    <ModalFooter>
                                                        {/* ... Buttons ... */}
                                                        <Button color="primary" onPress={() => {
                                                            onClose();
                                                            setCurrentRow({
                                                                ticketID: 0, // Adjust types to match your actual data
                                                                items: "",
                                                                timeOrdered: "",
                                                                totalCost: 0,
                                                                payment: ""
                                                                
                                                            }); // Clear selection
                                                        }}>
                                                            Close
                                                        </Button>
                                                    </ModalFooter>
                                                </>
                                            )}
                                        </ModalContent>
                                    </Modal>
                                )}
                            </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell>No Orders Found</TableCell>
                            <TableCell> </TableCell>
                            <TableCell> </TableCell>
                            <TableCell> </TableCell>
                            <TableCell> </TableCell>
                            <TableCell> </TableCell>
                            <TableCell> </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default OrderView;