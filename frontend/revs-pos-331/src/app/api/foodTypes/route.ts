const pool = require("../../db")
interface DbFoodRow extends FoodItem {
    [key: string]: any; // Allow additional properties from the database
}
export async function GET(request: Request) {
    try {
        const result = await pool.query('SELECT DISTINCT "foodType" FROM food WHERE onMenu = 1');
        const menuItems: FoodItem[] = result.rows.map((row: DbFoodRow) => ({
            foodID: row.foodID, // Adjust column names if needed
            foodType: row.foodType,
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