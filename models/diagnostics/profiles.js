const mongoose = require('mongoose');

const profileSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 3,
        max: 20
    },
    availibility: {
        type: String,
        enum: ['One Day', 'Within 2 Days', 'Less than 5 days', 'Greater than 5 days'],
        required: true
    },
    price: {
        type: String,
        required: true
    },
    testsInProfile: {
        type: Array,
        required: true
    },
    description: {
        type: String,
        max: 1000
    },
    preTestInformation: {
        type: String,
        max: 1000
    }
});

const Profile = mongoose.model('Profile', profileSchema );

module.exports.profileSchema = profileSchema;
module.exports.Profile = Profile;