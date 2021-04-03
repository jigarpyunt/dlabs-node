const express = require('express');
const app = express();

// Checking MongoDb Connection
const { ConnectToMongoDb } = require('./db/connectivity');
ConnectToMongoDb();

const tests = require('./routes/diagnostics/tests');

// Middleware plugins
app.use(express.json());
app.use(express.urlencoded({ extended : true }));


// Using Routes
app.use('/api/diagnostics/tests' , tests);

// Defining Ports
let port = 3000;
app.listen(port, ()=> {
    console.log(`Listening on port ${port}`);
});