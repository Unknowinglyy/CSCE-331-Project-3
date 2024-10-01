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
                ft1."foodID" AS FoodID1,
                f1.name AS FoodName1,
                ft2."foodID" AS FoodID2,
                f2.name AS FoodName2,
                COUNT(*) AS TimesSoldTogether
            FROM 
                foodTicket ft1
            INNER JOIN 
                foodTicket ft2 ON ft1."ticketID" = ft2."ticketID" AND ft1."foodID" < ft2."foodID"
            INNER JOIN 
                ticket t ON ft1."ticketID" = t."ticketID"
            INNER JOIN 
                food f1 ON ft1."foodID" = f1."foodID"
            INNER JOIN 
                food f2 ON ft2."foodID" = f2."foodID"
            WHERE 
                t."timeOrdered" BETWEEN $1 AND $2
            GROUP BY 
                ft1."foodID", f1.name, ft2."foodID", f2.name
            ORDER BY 
                TimesSoldTogether DESC;
            `;
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