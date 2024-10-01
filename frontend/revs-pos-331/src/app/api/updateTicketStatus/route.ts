const pool = require("../../db")

export async function POST(request: Request) {
    try {
        const parsedUrl = new URL(request.url);
        const searchParams = parsedUrl.searchParams;
        const ticketID = searchParams.get('"ticketID"');
        console.log("ticket Read:", ticketID);
        const isStarted = searchParams.get('"isStarted"');
        const isOverdue = searchParams.get('"isOverdue"');
        const isCompleted = searchParams.get('"isCompleted"');
        console.log("flags Read:", isStarted, isOverdue, isCompleted);
        const stmt = `
                UPDATE ticket
                SET "isStarted" = $1,
                "isOverdue" = $2,
                "isCompleted" = $3
                WHERE "ticketID" = $4
                RETURNING *;
                `
        const result = await pool.query(stmt, [isStarted, isOverdue, isCompleted, ticketID]);

        if (result) {
            return new Response(JSON.stringify(result), {
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
