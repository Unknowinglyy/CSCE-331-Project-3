import { NextApiRequest, NextApiResponse } from "next";
import  pool  from "../../db";
import bodyParser from 'body-parser';
import { NextRequest } from "next/server";
import { format, addDays } from 'date-fns';
function getFutureDate(dateStr: string, interval: number, dateFormat: string = "yyyy-MM-dd"): string {
    // 1. Parse the date string
    const dateObj = new Date(dateStr);
  
    // 2. Check if the provided string is a valid date
    if (isNaN(dateObj.getTime())) {
      throw new Error('Invalid date string provided');
    }
  
    // 3. Add the interval
    dateObj.setDate(dateObj.getDate() + interval);
  
    // 4. Format the future date back into a string
    return format(dateObj, dateFormat);
  }
export async function POST(req:NextRequest){
    
        // gets all foods with the ingredient
        
        try{
            const json = await req.json()
            //console.log(json);
            const interval:number = json.interval;
            const startDay:string = "\'"+ json.startDay + "\'";
            const endDate:string = "\'"+ json.endDate+ "\'";
            //console.log(startDay,endDate,json.ingredient);
            // const startYear = req.body.startYear;
            // const amountOfTime = req.body.amountOfTime;
            const sql = "SELECT \"ingredientID\" FROM ingredient WHERE name =\'"+json.ingredient+"\'";
            console.log(sql);
            const ingredientID = await pool.query(sql);
            console.log(ingredientID.rows[0].ingredientID);
            let foodIDList = await pool.query("SELECT \"foodID\" FROM foodIngredient WHERE \"ingredientID\" = \'"+ingredientID.rows[0].ingredientID+"\'");
            console.log(foodIDList.rows);
            // gets all foodIDs with the ingredient
            //const amountSold: Record<string, number> = {};

            const data: { name: string; usage: number }[] = []; 

            let currentDate = new Date(startDay);
            let weekNum = 1;
            while (currentDate <= new Date(endDate)) {
                const formattedDate = format(currentDate, 'yyyy-MM-dd');
                const weekStart = format(currentDate, 'yyyy-MM-dd');
                let totalUsage = 0;
                for (let i = 0; i < foodIDList.rows.length; i++) {
                const foodID = foodIDList.rows[i].foodID;
                const nextDate = getFutureDate(formattedDate, interval);

                const foodSoldQuery = `SELECT COUNT(*) AS ticket_count
                    FROM ticket 
                    JOIN foodTicket ON ticket."ticketID" = foodTicket."ticketID"
                    WHERE foodTicket."foodID" = ${foodID} 
                    AND ticket."timeOrdered" BETWEEN '${formattedDate}' AND '${nextDate}' 
                `;
                const foodSold = await pool.query(foodSoldQuery);
                totalUsage+= Number(foodSold.rows[0].ticket_count);
               // amountSold[formattedDate] = Number(foodSold.rows[0].ticket_count); 
                }
                data.push({
                    name: `${weekStart.substring(5,weekStart.length)}`, // Or customize the label
                    usage: totalUsage,
                  });
                currentDate = addDays(currentDate, interval);
                weekNum+=1;
            }
            console.log(data)
            //console.log(amountSold);

            
        
             return new Response(JSON.stringify(data), {status: 200, headers: {'Content-Type': 'application/json'}});
    
            
        }
        catch(error){
            console.log(error);
            return new Response(JSON.stringify(error), {status: 502, headers: {'Content-Type': 'application/json'}});

        }
        // gets food id
        
} 
