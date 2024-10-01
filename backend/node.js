
const express = require('express');
const dotenv = require('dotenv');
const routes = require("./routes")

dotenv.config();
const app = express();
const port = process.env.PORT || 3002;

// Create a new PostgreSQL pool
// const pool = new Pool({
// 	user: process.env.PSQL_USER,
// 	host: process.env.PSQL_HOST,
// 	database: process.env.PSQL_DATABASE,
// 	password: process.env.PSQL_PASSWORD,
// 	port: process.env.PSQL_PORT,
// 	ssl: { rejectUnauthorized: false }
// });
app.use("/api", routes);
app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
// Connect to the database
// pool
// 	.connect()
// 	.then(() => {
// 		console.log('Connected to PostgreSQL database');

// 		// Execute SQL queries here

// pool.query('SELECT * FROM food', (err, result) => {
// 	if (err) {
// 		console.error('Error executing query', err);
// 	} else {
// 		console.log('Query result:', result.rows);
// 	}

// 			// Close the connection when done
// 			pool
// 				.end()
// 				.then(() => {
// 					console.log('Connection to PostgreSQL closed');
// 				})
// 				.catch((err) => {
// 					console.error('Error closing connection', err);
// 				});
// 		});
// 	})
// 	.catch((err) => {
// 		console.error('Error connecting to PostgreSQL database', err);
// 	});