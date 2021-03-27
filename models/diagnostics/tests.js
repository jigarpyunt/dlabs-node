const mongoose = require('mongoose');

const testSchema = mongoose.Schema({
    name: String,
    unit: String,
    range: String,
    price: String,
    codePrefix: String,
    code: String,
    preTestInformation: String,
    speciality: String,
    organ: String,
    condition: String,
    category: String,
    reportAvalibilityTime: String,
    description: String
});

const Test = mongoose.model('test', testSchema);

module.exports.testSchema = testSchema;
module.exports.Test =  Test;

