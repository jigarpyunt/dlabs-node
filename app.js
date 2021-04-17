const express = require('express');
const app = express();

// Checking MongoDb Connection
const { ConnectToMongoDb } = require('./db/connectivity');
ConnectToMongoDb();


// Middleware plugins
app.use(express.json());
app.use(express.urlencoded({ extended : true }));


// Using Routes
const tests = require('./routes/diagnostics/tests');
const profiles = require('./routes/diagnostics/profiles');
const categories = require('./routes/diagnostics/categories');
const conditions = require('./routes/diagnostics/conditions');


app.use('/api/diagnostics/tests' , tests);
app.use('/api/diagnostics/profiles', profiles);
app.use('/api/diagnostics/categories', categories);
app.use('/api/diagnostics/conditions', conditions);



// Defining Ports
let port = 3000;
app.listen(port, ()=> {
    console.log(`Listening on port ${port}`);
});