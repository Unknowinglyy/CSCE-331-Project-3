const pool = require("../../db")

export async function GET(request: Request) {
    try {
        const parsedUrl = new URL(request.url);
        const searchParams = parsedUrl.searchParams;

        const stmt = `
        
        (
            SELECT "ticketID", "isStarted", "isOverdue", "isCompleted"
            FROM ticket
            ORDER BY "ticketID" DESC
            LIMIT 10
        )
        UNION
        (
            SELECT "ticketID", "isStarted", "isOverdue", "isCompleted"
            FROM ticket
            WHERE "isCompleted" = 0
        )
        ORDER BY "ticketID" ASC;
                `
        const result = await pool.query(stmt);

        if (result) {
            return new Response(JSON.stringify(result.rows), {
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
