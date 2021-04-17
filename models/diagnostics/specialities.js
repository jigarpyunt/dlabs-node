const mongoose = require('mongoose');

const specialitySchema = mongoose.Schema({
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

const Speciality = mongoose.model('Speciality', specialitySchema );

module.exports.specialitySchema =  specialitySchema
module.exports.Speciality = Speciality;