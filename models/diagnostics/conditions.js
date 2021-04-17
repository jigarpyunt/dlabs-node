const mongoose = require('mongoose');

const conditionSchema = mongoose.Schema({
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

const Condition = mongoose.model('Condition', conditionSchema );

module.exports.conditionSchema =  conditionSchema
module.exports.Condition = Condition;