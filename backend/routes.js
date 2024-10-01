const express = require("express")
const router = express.Router()
const pool = require("./db")
router.get('/ingredients', async (req, res) => {
    try {
        console.log("getting ingredients")
        const result = await pool.query('SELECT * FROM ingredient;');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving ingredients');
    }
});
router.get('/menu', async (req, res) => {
    try {
        console.log("getting menu")
        const result = await pool.query('SELECT * FROM food;')
        res.json(result.rows);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving ingredients');
    }
})
router.get('/orders', async (req, res) => {
    try {
        console.log("getting orders")

        const result = await pool.query('SELECT * FROM ticket;')
        res.json(result.rows);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving ingredients');
    }
})
module.exports = router