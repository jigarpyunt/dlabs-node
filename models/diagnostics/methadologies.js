const mongoose = require('mongoose');

const methadologySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 3,
        max: 20
    },
    description: {
        type: String,
        max: 1000
    }
});

const Methadology = mongoose.model('Methadology', methadologySchema );

module.exports.methadologySchema =  methadologySchema
module.exports.Methadology = Methadology;