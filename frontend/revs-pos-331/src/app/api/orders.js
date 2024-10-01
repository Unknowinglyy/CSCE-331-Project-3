const pool = require("../db")
export default async function handler(req, res) {
    try {
        console.log("getting tickets")
        const result = await pool.query('SELECT * FROM ticket;');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving tickets');
    }
}