import sql from 'mssql';
//const sql = require('mssql');
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

this.poolconnection = await sql.connect(config);

app.get('/', async (req, res) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request().query('SELECT TOP 3 * FROM users');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.get('/', async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query('SELECT TOP 5 * FROM [user] ORDER BY score DESC'); // adjust column name
        res.json(result.recordset); // sends JSON
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching users');
    }
});

const serverPort = 3000;
app.listen(serverPort, () => console.log(`Server running on port ${serverPort}`));





