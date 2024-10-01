const pool = require("../../db")
interface DbFoodRow extends FoodItem {
    [key: string]: any; // Allow additional properties from the database
}
export async function POST(request: Request) {
    try {
        const data = await request.headers.get("foodType");
        console.log("the data is " + data);
        //const foodType = request.headers.get("foodType")
        const result = await pool.query('SELECT * FROM food where onmenu = 1 and "foodType" = \'' + data + "'");
        const menuItems: FoodItem[] = result.rows.map((row: DbFoodRow) => ({
            foodID: row.foodID, // Adjust column names if needed
            name: row.name,
            price: row.price,
            foodType: row.foodType,
            onmenu: row.onmenu,
            startmonth: row.startmonth,
            endmonth: row.endmonth
        }));
        return new Response(JSON.stringify(menuItems), { 
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        }); 
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ message: "nooo" }))
    }
}