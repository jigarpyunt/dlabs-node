const { response } = require('express');
const express = require('express');
const router = express.Router();
const Joi = require('joi');

const OTP = require('../../algo/otp-generation');
const { LabRegistration } = require('../../models/registrations/lab');


router.post('/:step?', async function (request, response) {
    if (request.query['step'] == 1) {

        let result = await executeStep1(request.body);
        if (result.error) {
            return response.status(400).send(result);
        } else {
            return response.status(200).send(result.data.toString());
        }

    }
});

async function executeStep1(dataBundler) {

    // Validating Request
    const { error } = await validateRequest(dataBundler);
    if (error) {
        return {
            error: true,
            msg: error.details[0].message,
        }
    } // If this bypass means no errors


    // Get Users based on mobile number so that we check is user verfied or not

    const user = await LabRegistration.find({ 'mobile.number': dataBundler['mobile'] });
    if (user.length != 0  && user[0]['mobile']['isOTPVerified'] == true && user[0]['stepsCompleted'] == '3') {
        return {
            error: true,
            msg: 'Mobile number is already in use',
            stepsCompleted: 3
        }
    }
    if (user.length != 0 && user[0]['mobile']['isOTPVerified'] == false && user[0]['stepsCompleted'] == '1') {
        return {
            error: true,
            msg: 'Your mobile is already with us, however you have not uploaded otp yet, so please press resent otp and verify it. Thanks',
            stepsCompleted: 1
        }
    }
    if (user.length != 0 && user[0]['mobile']['isOTPVerified'] == true && user[0]['stepsCompleted'] == '2') {

        return {
            error: true,
            msg: 'Your mobile is already verified, however you have not provided company details last time, so please fill in the details. Thanks',
            stepsCompleted: 2
        }
    }

    //Generating OTP
    let otp = new OTP();
    let newOTP =  otp.generateOTP(1000, 9999);

    //Saving Record In Database
    try {

        let newLab = {
            mobile: {
                number: dataBundler['mobile'],
                lastOTP: newOTP
            },
            password: dataBundler['password'],
            companyInfo: {},
            stepsCompleted: 1
        }

        let registrationData = new LabRegistration(newLab);
        result = await registrationData.save();

        if( result ) {
            return {
                error: false,
                data: newOTP,
            };  
        }
    } catch(e) {
        // if( e.code == 11000 ) {
        //     return {
        //         error: true,
        //         msg: 'Mobile number is already in use',
        //     }
        // }
    }

}


async function validateRequest(dataHandler) {
    const schema = Joi.object({
        'mobile': Joi.string().required().min(10).max(10).messages({
            'string.empty': 'Mobile is required',
            'string.min': 'Mobile must be only 10 numbers long',
            'string.max': 'Mobile must be only 10 numbers long',
            'any.required': 'Mobile is required'
        }),
        'password': Joi.string().required().min(5).messages({
            'string.empty': 'Password is required',
            'string.min': 'Password must be atleast 5 characters',
            'any.required': 'Password is required'
        })
    });

    let result = await schema.validate(dataHandler);
    return result;

}

module.exports = router;