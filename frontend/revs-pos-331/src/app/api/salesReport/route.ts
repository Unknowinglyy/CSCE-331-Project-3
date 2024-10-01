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
                f."foodID",
                f.name,
                COUNT(ft."foodID") AS food_usage,
                ROUND(CAST(SUM(f.price) as numeric), 2) AS revenue
            FROM
                food f
            LEFT JOIN (
                SELECT 
                    ft."foodID",
                    ft."ticketID",
                    ft.amount
                FROM 
                    foodticket ft
                JOIN 
                    ticket t ON ft."ticketID" = t."ticketID"
                WHERE
                    t."timeOrdered" BETWEEN $1 AND $2
            ) AS ft ON f."foodID" = ft."foodID"
            GROUP BY
                f."foodID", f.name
            ORDER BY
                "foodID" ASC;
                `
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