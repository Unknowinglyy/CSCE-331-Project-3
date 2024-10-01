import { NextRequest } from "next/server";

const pool = require("../../db")

export async function GET(request: Request) {
    try {
        const result = await pool.query('SELECT * FROM ingredient ORDER BY \"ingredientID\" ASC;');
        //console.log(result.rows);
        //console.log(inventoryItems);
        const inventoryItems = result.rows.map((row: any) => ({
            ingredientID: row.ingredientID,
            name: row.name,
            stock: row.stock
        }));
        return new Response(JSON.stringify(inventoryItems), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ message: "nooo" }),{status:500})
    }
}
export async function PATCH(request:NextRequest) {
    try {
        const json = await request.json();
        console.log(json, "is the json");
        const result = await pool.query(
            `UPDATE ingredient SET stock = $1 WHERE \"ingredientID\" = $2;`,
            [json.stock, json.ingredientID]
        );
        console.log("Success!");
        return new Response(JSON.stringify(result), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    catch (err) {
        console.log(err);
        return new Response(JSON.stringify({ message: err }),{status:500});
    }
}
export async function POST(request: NextRequest) {
    try {
        const json = await request.json();
        const highestIngredientIDResult = await pool.query('SELECT MAX("ingredientID") FROM ingredient;');
        const highestIngredientID = highestIngredientIDResult.rows[0].max;
        const newIngredientID = highestIngredientID + 1;
        const result = await pool.query(
            `INSERT INTO ingredient ("ingredientID", "name", "stock") VALUES ($1, $2, 0);`,
            [newIngredientID, json.name]
        );
        console.log("Success!");
        return new Response(JSON.stringify(result), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (err) {
        console.log(err);
        return new Response(JSON.stringify({ message: err }), { status: 500 });
    }
}
export async function DELETE(request: NextRequest) {
    const json = await request.json();
    console.log(JSON.stringify(json))
    const name = json.name;
    const casc = json.casc;
    console.log(casc)
    let ingredientID = await pool.query("SELECT \"ingredientID\" FROM ingredient WHERE name =\'"+name+"\'");
   // console.log(ingredientID.rows[0].ingredientID)
    let foodIDList = await pool.query("SELECT \"foodID\" FROM foodIngredient WHERE \"ingredientID\" = \'"+ingredientID.rows[0].ingredientID+"\'");
    try {
        if(casc){
            console.log("Cascading")
            for(let i = 0; i < foodIDList.rows.length; i++){
                console.log(foodIDList.rows[i])
                await pool.query("DELETE FROM foodIngredient WHERE \"foodID\" = \'"+foodIDList.rows[i].foodID+"\'");
            }
        }
        const result = await pool.query(
            `DELETE FROM ingredient WHERE "name" = $1;`,
            [name]
        );
        console.log("Success!");
        return new Response(JSON.stringify(result), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (err) {
        console.log("Uh oh big issue detected",err)
        
        
        if(foodIDList.rows.length > 0){
            
            const foodNamesResult = await pool.query("SELECT name FROM food WHERE \"foodID\" IN (" + foodIDList.rows.map((row: any) => row.foodID).join(",") + ")");
            const foodNamesList = foodNamesResult.rows.map((row: any) => row.name);
            const mess = "Ingredient is used in food items: " + foodNamesList.join(", ");
            console.log(mess)
            return new Response(JSON.stringify({ message: mess }), {status: 501 });
            
        }
        
        return new Response(JSON.stringify({ message: err }), { status: 502 });
    }
}
export async function PUT(request: NextRequest) {
    try {
        const json = await request.json();
        const foodName = json.foodName;
        const ingredients = json.ingredients;
        
        // Get the menu item ID based on the name
        const foodIDResult = await pool.query('SELECT \"foodID\" FROM food WHERE name = $1;', [foodName]);
        const foodID = foodIDResult.rows[0].foodID;
        console.log(foodID);
        // Remove the ingredients from the join table
        for (const ingredient of ingredients) {
            const ingredientIDResult = await pool.query('SELECT "ingredientID" FROM ingredient WHERE name = $1;', [ingredient]);
            const ingredientID = ingredientIDResult.rows[0].ingredientID;
            await pool.query('DELETE FROM foodIngredient WHERE "foodID" = $1 AND "ingredientID" = $2;', [foodID, ingredientID]);
        }

        console.log("Success!");
        return new Response(JSON.stringify({ message: "Ingredients removed successfully" }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (err) {
        console.log(err);
        return new Response(JSON.stringify({ message: err }), { status: 500 });
    }
}
