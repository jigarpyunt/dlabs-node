const express = require('express');
const app = express();
const cors = require('cors');

// Checking MongoDb Connection
const { ConnectToMongoDb } = require('./db/connectivity');
ConnectToMongoDb();


// Middleware plugins
app.use(express.json());
app.use(express.urlencoded({ extended : true }));
app.use(cors());



// Using Routes
const tests = require('./routes/diagnostics/tests');
const profiles = require('./routes/diagnostics/profiles');
const categories = require('./routes/diagnostics/categories');
const methadologies = require('./routes/diagnostics/methadologies');
const specialities = require('./routes/diagnostics/specialities');

app.use('/api/diagnostics/tests' , tests);
app.use('/api/diagnostics/profiles', profiles);
app.use('/api/diagnostics/categories', categories);
app.use('/api/diagnostics/methadologies', methadologies);
app.use('/api/diagnostics/specialities', specialities);




// Defining Ports
let port = 3000;
app.listen(port, ()=> {
    console.log(`Listening on port ${port}`);
});