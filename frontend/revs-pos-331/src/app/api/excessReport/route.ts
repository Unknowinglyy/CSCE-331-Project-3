const pool = require("../../db")

export async function GET(request: Request) {
    try {
        const parsedUrl = new URL(request.url);
        const searchParams = parsedUrl.searchParams;

        // Extracting specific parameters
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');


        if (startDate && endDate) {
            const stmt = `
                SELECT 
                    i."ingredientID",
                    i."name",
                    SUM(fi.amount * ft.amount) AS ingredient_usage
                FROM 
                    ticket t
                JOIN 
                    foodTicket ft ON t."ticketID" = ft."ticketID"
                JOIN 
                    foodIngredient fi ON ft."foodID" = fi."foodID"
                JOIN 
                    ingredient i ON fi."ingredientID" = i."ingredientID"
                WHERE 
                    t."timeOrdered" BETWEEN $1 AND $2
                GROUP BY 
                    i."ingredientID", i.name, i.stock
                HAVING 
                    SUM(fi.amount * ft.amount) < 0.1 * i.stock;`;
            const result = await pool.query(stmt, [startDate, endDate]);

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