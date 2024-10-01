const pool = require("../../db")
import type { NextApiRequest, NextApiResponse } from 'next'
import { NextRequest } from 'next/server';
interface DbFoodRow extends FoodItem {
    [key: string]: any; // Allow additional properties from the database
}
export async function GET(request: Request) {
    try {
        const result = await pool.query('SELECT * FROM food where onmenu = 1 ORDER BY \"foodType\" ASC;');
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
        return new Response(JSON.stringify(menuItems), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ message: "nooo" }))
    }
}
export async function PATCH(request: Request) {
    try {
        const json = await request.json();
        console.log(json);
        if(json.newIngredients){
            for (const ingredient of json.newIngredients){
                const result = await pool.query(
                    `INSERT INTO foodingredient (\"foodID\", \"ingredientID\", amount) VALUES ($1, $2, $3);`,
                    [json.foodID, ingredient, 1]
                );
            }
        }
        //populate the sql query with data from json
        
        const result = await pool.query(
            `UPDATE food SET name = $1, price = $2, \"foodType\" = $3, startMonth = $4, endMonth = $5 WHERE \"foodID\" = $6 and onmenu = 1;`,
            [json.name, json.price, json.type, json.start, json.end, json.foodID] 
        );
                return new Response(JSON.stringify({ message: "Success" }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    catch (err) {
        console.log(err);
        return new Response(JSON.stringify({ message: err }));
    }
}
export async function POST(request: Request) {
    try {
        const data = await request.json();
       // console.log(data);

        if (!data) {
            return new Response(JSON.stringify({ message: "Bad request" }))
        }
        else {
            // const sql_ID_statement = "SELECT MAX(\"foodID\") AS highest_id FROM food";
            const re = await pool.query("SELECT MAX(\"foodID\") AS highest_id FROM food");
            const highest = (re.rows[0].highest_id) + 1
            let startDate = 0;
            let endDate = 0;
            if(data.startDate && data.endDate){
                startDate = Number(data.startDate.replace(/-/g, ''));
                endDate = Number(data.endDate.replace(/-/g, ''));
            }
           
            console.log([
                highest,
                data.name,
                data.price,
                data.foodType,
                1, // Set 'onmenu' as true for new items 
                startDate,
                endDate
            ]);
            const temp = data.temperature;
            const result = await pool.query(
                'INSERT INTO food (\"foodID\", name, price, \"foodType\",onmenu,startMonth,endMonth,temperature) VALUES  ($1, $2, $3, $4, $5, $6, $7,$8);',
                [
                    highest,
                    data.name,
                    data.price,
                    data.foodType,
                    1, // Set 'onmenu' as true for new items 
                    startDate,
                    endDate,
                    temp
                ]
            );
            const items = data.items;
            
            console.log(items);
            for (const ingredientName of items) {
                const ingredientResult = await pool.query('SELECT "ingredientID" FROM ingredient WHERE name = $1', [ingredientName]);
                const ingredientID = ingredientResult.rows[0].ingredientID;
                const result = await pool.query(
                    `INSERT INTO foodingredient ("foodID", "ingredientID", amount) VALUES ($1, $2, $3);`,
                    [highest, ingredientID, 1]
                );
            }
            if (result) {
                return new Response(JSON.stringify(result), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' },
                });
            }
            else {
                return new Response(JSON.stringify({ message: "Bad addition" }), { status: 500 });
            }
        }
    }
    catch (err) {
        console.log(err);
        return new Response(JSON.stringify({ message: err }), { status: 502 })
    }
}

export async function DELETE(req: NextRequest) {
    //console.log(req.nextUrl.searchParams.get('foodID'));
    const result = await pool.query(`UPDATE food SET \"onmenu\" = 0 WHERE \"foodID\" = ${req.nextUrl.searchParams.get('foodID')} and onmenu = 1`);
    console.log(result);
    if(result){
        return new Response(JSON.stringify({message:"Success"}),{status:200});
    }
    else{
        return new Response(JSON.stringify({message:"Failure"}),{status:500});
    }
    // Use the postId here to fetch data or perform actions
} 
export async function PUT(request: Request) {
    try {
        const json  = await request.json();
        const name = json.name;
        console.log(name)
        const foodResult = await pool.query('SELECT \"foodID\" FROM food WHERE name = $1', [name]);
        const foodID = foodResult.rows[0].foodID;

        const result = await pool.query(`
            SELECT i.\"ingredientID\", i.name, i.stock
            FROM ingredient AS i
            JOIN foodingredient AS fi ON i.\"ingredientID\" = fi.\"ingredientID\"
            WHERE fi.\"foodID\" = $1
        `, [foodID]);
        const ingredients = result.rows.map((row: any) => ({
            ingredientID: row.ingredientID,
            name: row.name,
            quantity: row.quantity
        }));
        console.log(foodID);
        return new Response(JSON.stringify(ingredients), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ message: "Error" }), { status: 500 });
    }
}
