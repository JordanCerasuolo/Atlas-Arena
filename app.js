//import sql from 'mssql';
const sql = require('mssql');
const express = require('express');
const app = express();

const server = process.env.AZURE_SQL_SERVER;
const database = process.env.AZURE_SQL_DATABASE;
const port = parseInt(process.env.AZURE_SQL_PORT);
const authenticationType = process.env.AZURE_SQL_AUTHENTICATIONTYPE;

// For system-assigned managed identity.
const config = {
    server,
    port,
    database,
    authentication: {
        type: authenticationType
    },
    options: {
        encrypt: true
    }
};  

let pool; // shared connection

// Initialize DB connection once
async function initDB() {
    try {
        pool = await sql.connect(config);
        console.log('Connected to database');
    } catch (err) {
        console.error('DB connection failed:', err);
    }
}

// Route: Top 5 users
app.get('/', async (req, res) => {
    try {
        const result = await pool.request()
            .query('SELECT TOP 3 * FROM users');

        res.json(result.recordset);
    } catch (err) {
        console.log('Could not get users')
        console.error(err);
        res.status(500).send('Error fetching users');
    }
});

const serverPort = process.env.PORT || 3000;

async function startServer() {
    await initDB(); // ensure DB is ready first

    app.listen(serverPort, () => {
        console.log(`Server running on port ${serverPort}`);
    });
}

startServer();


