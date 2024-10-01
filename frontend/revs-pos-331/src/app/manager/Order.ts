interface Order {
    ticketID: number; // Adjust types to match your actual data
    items: Food[];
    timeOrdered: string;
    totalCost: number;
    payment: string;
    
}