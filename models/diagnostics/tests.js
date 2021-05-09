const mongoose = require('mongoose');

const testSchema = mongoose.Schema({
    name: String,
    unit: String,
    range: String,
    price: String,
    codePrefix: String,
    code: String,
    preTestInformation: String,
    speciality: Object,
    methadology: Object,
    category: Object,
    reportAvailibilityTime: String,
    description: String
});

const Test = mongoose.model('Test', testSchema);

module.exports.testSchema = testSchema;
module.exports.Test =  Test;

