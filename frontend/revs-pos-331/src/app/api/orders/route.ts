import { reportWebVitals } from "next/dist/build/templates/pages";

const pool = require("../../db")
export async function GET(request: Request) {
  try {
    const limit = "50"
    let offset = parseInt(new URL(request.url).searchParams.get('offset') || '0');
    const searchQuery = parseInt(new URL(request.url).searchParams.get('searchQuery') || "");
    const foodSearch = new URL(request.url).searchParams.get('searchQuery') || "";
    console.log(foodSearch)
    //if asked to search by foodID
    if(searchQuery){
      const stmt = "SELECT * FROM ticket where \"ticketID\" = $1 ORDER BY \"ticketID\" DESC";
      const result = await pool.query(stmt, [searchQuery]);
      const foodstmt = `
      SELECT "ticketID", string_agg(CONCAT(f.name, ' (', ft.amount, ')'), ', ') AS items
          FROM (
          SELECT t."ticketID", f.name, ft.amount
          FROM ticket t
          JOIN foodticket ft ON $1 = ft."ticketID"
          JOIN food f ON ft."foodID" = f."foodID"
          ORDER BY t."ticketID" DESC
          ) AS ordered_tickets
          GROUP BY "ticketID"
          ORDER BY "ticketID" DESC
          LIMIT 1 OFFSET 0;
          `;
      const foodsResult = await pool.query(foodstmt, [searchQuery]);
      const ordersMap: Map<number, string[]> = new Map(); // A map to store orders by ticketI
      let orderList: Order[] = []
      //console.log(foodsResult.rows)
      const foodItemsByTicket = {};
      for (let i = 0; i < result.rows.length; i++) {
        const row = result.rows[i];
        // Assuming items for each ticket are aligned by index in foodsResult.rows
        let t: Order = {
          ticketID: row.ticketID,
          items: foodsResult.rows[i].items.toString(),
          timeOrdered: row.timeOrdered,
          totalCost: row.totalCost,
          payment: row.payment,
        };
        orderList.push(t);
      }
      return new Response(JSON.stringify(orderList), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    //if searching for a food gathering all the ID's
    let stmt;
    let result;
    if(foodSearch){
      stmt = `SELECT *
      FROM ticket
      WHERE "ticketID" IN (
          SELECT t."ticketID"
          FROM ticket t
          JOIN foodticket tf ON t."ticketID" = tf."ticketID"
          JOIN food f ON tf."foodID" = f."foodID"
          WHERE f.name = $1
      )
      ORDER BY "ticketID" DESC
      LIMIT $2 OFFSET $3;`
      result = await pool.query(stmt, [foodSearch,limit, offset]);
    }
    else{
      stmt = "SELECT * FROM ticket ORDER BY \"ticketID\" DESC LIMIT $1 OFFSET $2";
      result = await pool.query(stmt, [limit, offset]);
    }
    //if it is a foodSearch instead
    let foodstmt;
    let foodsResult;
    if(foodSearch){
      foodstmt = `
      SELECT "ticketID", string_agg(name, ', ') AS items
      FROM (
          SELECT t."ticketID", f.name
          FROM ticket t
          JOIN foodticket tf ON t."ticketID" = tf."ticketID"
          JOIN food f ON tf."foodID" = f."foodID"
          WHERE t."ticketID" IN (
              SELECT t2."ticketID"
              FROM ticket t2
              JOIN foodticket tf2 ON t2."ticketID" = tf2."ticketID"
              JOIN food f2 ON tf2."foodID" = f2."foodID"
              WHERE f2.name = $1
          )
          ORDER BY t."ticketID" DESC
      ) AS ordered_tickets
      GROUP BY "ticketID"
      ORDER BY "ticketID" DESC
      LIMIT $2 OFFSET $3;
        `;
        foodsResult = await pool.query(foodstmt, [foodSearch,limit, offset]);
    }
    //if it isnt searching for a food
    else{
      foodstmt = `
      SELECT \"ticketID\", string_agg(name, ', ') AS items
        FROM (
            SELECT t.\"ticketID\", f.name
            FROM ticket t
            JOIN foodticket tf ON t.\"ticketID\" = tf.\"ticketID\"
            JOIN food f ON tf.\"foodID\" = f.\"foodID\"
            ORDER BY t.\"ticketID\" DESC
        ) AS ordered_tickets
        GROUP BY \"ticketID\"
        ORDER BY \"ticketID\" DESC
        LIMIT $1 OFFSET $2;
        `;
        foodsResult = await pool.query(foodstmt, [limit, offset]);
    }
    const ordersMap: Map<number, string[]> = new Map(); // A map to store orders by ticketI
    let orderList: Order[] = []
    //console.log(foodsResult.rows)
    const foodItemsByTicket = {};
    for (let i = 0; i < result.rows.length; i++) {
      const row = result.rows[i];
      // Assuming items for each ticket are aligned by index in foodsResult.rows
      let t: Order = {
        ticketID: row.ticketID,
        items: foodsResult.rows[i].items.toString(),
        timeOrdered: row.timeOrdered,
        totalCost: row.totalCost,
        payment: row.payment,
      };
      orderList.push(t);
    }
    return new Response(JSON.stringify(orderList), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: err }), { status: 501 })
  }
}
export async function PATCH(request: Request){
  try {
    interface MenuItem {
      name: string;
      quantity: number;
    }
    interface CurrentMenuItem {
      name: string;
    }
    const json = await request.json();
    const ticketID = json.ticketID;
    const items = json.items;
    const timeOrdered = json.timeOrdered;
    const totalCost = json.totalCost;
    const payment = json.payment;
    // console.log(ticketID,items,totalCost);
    //const {ticketID, items, timeOrdered, totalCost, payment } = await request.json();
    const stmt = `
      UPDATE ticket
      SET "timeOrdered" = $2, "totalCost" = $3, payment = $4
      WHERE "ticketID" = $1
    `;
    await pool.query(stmt, [ticketID, timeOrdered, totalCost, payment]);
    const itemsTyped = items as MenuItem[];
    const currentMenuItems = await pool.query(`
      SELECT f.name
      FROM food f
      JOIN foodticket ft ON ft."foodID" = f."foodID"
      WHERE ft."ticketID" = $1
    `, [ticketID]);
    
    let newItems:MenuItem[] = []
    let goneItems:object[]=[]
    for (let i = 0; i < itemsTyped.length; i++) {
      const item = itemsTyped[i];
      if (!currentMenuItems.rows.some((row:CurrentMenuItem) => row.name === item.name)) { // Compare 'name' property
        
        newItems.push(item);
      }
    }
    
    for (let i = 0; i < currentMenuItems.rows.length; i++) {
      const currentItem = currentMenuItems.rows[i].name;
      if (!itemsTyped.some((item) => item.name === currentItem)) { // Compare 'name' property
        goneItems.push(currentItem);
      }
    }
    
    for (let i = 0; i < goneItems.length; i++) {
      const itemName = goneItems[i];
      await pool.query(`
        DELETE FROM foodticket
        WHERE "ticketID" = $1 AND "foodID" IN (
          SELECT "foodID" FROM food WHERE name = $2
        )
      `, [ticketID, itemName]);
    }
    for (let i = 0; i < newItems.length; i++) {
      const itemName = newItems[i].name;
      console.log(itemName);
      const foodIDResult = await pool.query('SELECT \"foodID\" FROM food WHERE name = $1;', [itemName]);
      console.log(foodIDResult.rows[0]);
      const foodID = foodIDResult.rows[0].foodID;
      console.log(newItems[i].quantity);
      for(let j = 0;j<newItems[i].quantity;j++){
        await pool.query(`
        INSERT INTO foodticket ("ticketID", "foodID", amount)
        VALUES ($1, $2, $3)
      `, [ticketID, foodID, 1]);
      }
      
    }
    return new Response(JSON.stringify({ message: "Ticket updated successfully" }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: err }), { status: 500 });
  }
}
export async function DELETE(request:Request){
  try {
    const {ticketID} = await request.json();
    if (!ticketID) {
      return new Response(JSON.stringify({ message: "Ticket ID is required" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    // Delete entries from foodticket table
    await pool.query('DELETE FROM foodticket WHERE "ticketID" = $1', [ticketID]);
    // Delete ticket from ticket table
    await pool.query('DELETE FROM ticket WHERE "ticketID" = $1', [ticketID]);
    return new Response(JSON.stringify({ message: "Ticket deleted successfully" }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: err }), { status: 500 });
  }
}
