const mongoose = require('mongoose');


function ConnectToMongoDb () {
    mongoose.connect('mongodb://localhost/dlabs', { useNewUrlParser: true,useUnifiedTopology: true, useCreateIndex:true } )
    .then(()=> console.log('Connected to mongodb....'))
    .catch(err => { console.debug(`Could not connect to mongodb ${err}`)});
}

module.exports.ConnectToMongoDb =  ConnectToMongoDb;

