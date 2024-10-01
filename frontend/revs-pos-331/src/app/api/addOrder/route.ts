const pool = require("../../db")
interface DbFoodRow extends FoodItem {
    [key: string]: any; // Allow additional properties from the database
}

export async function POST(request: Request) {
    try {
        const orderIDHolder = await pool.query('SELECT max("ticketID") FROM ticket;');
        const ticketID = orderIDHolder.rows[0].max;
        // const orderID: FoodItem[] = orderIDHolder.rows.map((row: DbFoodRow) => ({
        //     foodID: row.ticketID + 1 // Adjust column names if needed
        // }));
        console.log(ticketID);
        const foodID = ticketID + 1;
        console.log(foodID);
        const data = await request.json();
        console.log(data);
        let price = 0;
        for(const item of data){
            price += item.price;
        }
        price = Math.ceil(price * 100) / 100
        console.log("the data is " + price);
        //const foodType = request.headers.get("foodType")
        await pool.query("INSERT INTO ticket (\"ticketID\", \"timeOrdered\", \"totalCost\", payment) VALUES ("
        + foodID + ", date (LOCALTIMESTAMP), " + price + ", '" + "Cash"
        + "');");


        for(const item of data){
            //insert int foodticket the item and then decrease the ingredient amounts
            await pool.query("INSERT INTO foodticket (\"amount\", \"ticketID\", \"foodID\") VALUES (1," + foodID + ", " + item.foodID + ");\n" + 
            "UPDATE ingredient\n"+
            "SET stock = stock - (\n"+
                "SELECT SUM(fi.amount)\n"+
                "FROM foodIngredient fi\n"+
                "WHERE fi.\"foodID\" = "+item.foodID+ "\n"+
                "AND fi.\"ingredientID\" = ingredient.\"ingredientID\"\n"+
            ")\n"+
            "WHERE \"ingredientID\" IN (\n"+
                "SELECT fi.\"ingredientID\"\n"+
                "FROM foodIngredient fi\n"+
                "WHERE fi.\"foodID\" = "+item.foodID+"\n"+
            ");"
            );

        }
        return new Response(JSON.stringify({ message: "nooo" }))
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ message: "nooo" }))
    }


}
