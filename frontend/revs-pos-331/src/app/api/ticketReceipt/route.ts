const pool = require("../../db")

export async function GET(request: Request) {
    try {
        const parsedUrl = new URL(request.url);
        const searchParams = parsedUrl.searchParams;
        const ticketID = searchParams.get('"ticketID"');

        const stmt = `
                SELECT t."ticketID", array_agg(f."name") AS items
                FROM ticket t
                JOIN foodTicket ft ON t."ticketID" = ft."ticketID"
                JOIN food f ON ft."foodID" = f."foodID"
                WHERE t."ticketID" = $1
                GROUP BY t."ticketID";
                `
        const result = await pool.query(stmt, [ticketID]);
        console.log(result);
        if (result) {
            return new Response(JSON.stringify(result.rows[0]), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },

            });

        }
        else {

            return new Response(JSON.stringify({ message: "Bad addition" }), { status: 500 });
        }
    } catch (err) {
        console.log(err);
        return new Response(JSON.stringify({ message: err }), { status: 502 })
    }
}
