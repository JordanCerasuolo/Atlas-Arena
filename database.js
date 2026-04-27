// Azure SQL constants, should not be changed
const sql = require('mssql');
const server = process.env.AZURE_SQL_SERVER;
const database = process.env.AZURE_SQL_DATABASE;
const port = parseInt(process.env.AZURE_SQL_PORT);
const authenticationType = process.env.AZURE_SQL_AUTHENTICATIONTYPE;

let pool; // shared connection

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
};  // end Azure SQL constants


// export azure sql variables to be used in app.js (needed until all queries moved to database.js)
exports.getPool = () => pool;
exports.config = config;
exports.server = server;
exports.database = database;
exports.port = port;
exports.authenticationType = authenticationType;


// Initialize DB connection
async function initDB() {
    try {
        pool = await sql.connect(config);
        console.log('Connected to database');
    } catch (err) {
        console.error('Database connection failed:', err);
    }
}

let cities;

async function getCities() { // get all cities to be used in app.js for interactive pins.
    try {
        if (!pool) {
            throw new Error("Database connection not established");
        }
        const result = await pool.request().query('SELECT * FROM cities');
        return result.recordset;
    } catch (err) {
        console.error('Error retrieving cities: ', err);
        return [];
    }
}


async function getQuiz(city) { // build a quiz and return its components to app.js
    try {
        if (!pool) {
            throw new Error("Database connection not established");
        }
        // request all cities except for input city
        const result2 = await pool.request().query(`SELECT * FROM cities WHERE id != '${city.id}'`);
        const citiesTable = result2.recordset;
        // request 5 random questions
        const result = await pool.request().query('SELECT TOP 5 * FROM questions ORDER BY NEWID();');
        const questionsTable = result.recordset;

        // make a list of questions and possible cities that dont have duplicate answers.
        let qData = [];
        questionsTable.forEach(q => {
            let cData = [];
            citiesTable.forEach(c => {
                if (c[q.field] != city[q.field]) {
                    cData.push(c);
                }
            });
            qData.push({ question: q, cityChoices: cData });
        });
        //console.log('qData: '+qData);
        let toReturn = [];
        qData.forEach(q => {
            const answers = [city[q.question.field], ...q.cityChoices.map(item => item[q.question.field]).slice(0,3)].sort(() => Math.random() - 0.5)
            toReturn.push({ question: q.question, choices: answers} );
        });
        // build a list of 4 answer choices by taking the answer from the input city and the answers from the next 3 cities from citiesTable. Finally randomize list
        return toReturn;
//
        
        
        
        return { city: city, questions: result.recordset, cities: result2.recordset };
    } catch (err) {
        console.error('Quiz Error: ', err);
        return [];

        console.error('Quiz Error:', err);
        return { city: city, questions: [], cities: [] };
    }
}


// export functions to be used by app.js 
exports.initDB = initDB;
exports.dbCities = getCities;
exports.dbQuiz = getQuiz;