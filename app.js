const sql = require('mssql');
const express = require('express');
const app = express();

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER, // e.g., 'yourserver.database.windows.net'
    database: process.env.DB_NAME,
    options: { encrypt: true, trustServerCertificate: false }
};

app.get('/', async (req, res) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request().query('SELECT TOP 10 * FROM yourTable');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));