const { bool } = require('joi');
const mongoose = require('mongoose');

const labRegistrationSchema = mongoose.Schema({
    mobile: {
        number: {
           type: String,
           required: true,
           min: 10,
           max: 10 
        },
        isOTPVerified: {
           type: Boolean,
           default: false,
        },
        lastOTP: {
            type: String,
            default: null
        },
        lastOTPExpiration: {
            type: Date,
            default: mongoose.now()
        }
    },
    password: {
        type: String,
        required: true,
        min: 5
    },
    companyInfo: {
        labName: {
            type: String,
            default: null
        },
        labAddress: {
            type: String,
            default: null
        },
        labTel: {
            type: String,
            default: null
        },
        labEmail: {
            type: String,
            default: null
        },
    },
    stepsCompleted: {
        type: String,
        default: '0',
    }
});

const LabRegistration = mongoose.model('LabRegistration', labRegistrationSchema );

module.exports.labRegistrationSchema =  labRegistrationSchema;
module.exports.LabRegistration = LabRegistration;