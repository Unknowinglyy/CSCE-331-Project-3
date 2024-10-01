const pool = require("../../db")
import { unstable_noStore as noStore } from 'next/cache';
import type { NextApiRequest, NextApiResponse } from 'next'
import { NextRequest } from 'next/server';
interface FoodItem {
    foodID: number;
    name: string;
    price: number;
    foodType: string;
    recipe:string,
    onmenu: number; // Assuming onmenu is meant to be boolean 
    startmonth: number;
    endmonth: number;
  }
interface DbFoodRow extends FoodItem {
    [key: string]: any; // Allow additional properties from the database
}
export async function GET(request: Request) {
    try {
        const result = await pool.query(`
        SELECT "f".*
FROM "food" "f"
WHERE "f"."onmenu" = 1
AND NOT EXISTS (
    SELECT 1
    FROM (
        SELECT "fi"."foodID", "fi"."ingredientID", COUNT(*) AS "ingredient_count"
        FROM "foodingredient" "fi"
        GROUP BY "fi"."foodID", "fi"."ingredientID"
    ) "req"
    JOIN "ingredient" "i" ON "i"."ingredientID" = "req"."ingredientID"
    WHERE "req"."foodID" = "f"."foodID"
    AND "i"."stock" < "req"."ingredient_count"
)
ORDER BY "f"."foodType" ASC;
        `);
        const menuItems: FoodItem[] = result.rows.map((row: DbFoodRow) => ({
            foodID: row.foodID, // Adjust column names if needed
            name: row.name,
            price: row.price,
            foodType: row.foodType,
            onmenu: row.onmenu,
            startmonth: row.startmonth,
            endmonth: row.endmonth,
            temperature: row.temperature
        }));
        //console.log(menuItems);
        noStore();
        return new Response(JSON.stringify(menuItems), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (err) {
        noStore();
        console.error(err);
        return new Response(JSON.stringify({ message: "nooo" }))
    }
}