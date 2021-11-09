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
    if (request.query['step'] == 2) {
        let result = await executeStep2(request.body, request.query['mobile']);
        if (result.error) {
            return response.status(400).send(result);
        } else {
            return response.status(200).send(result.data.toString());
        }
    }
    if (request.query['step'] == 3) {
        let result = await executeStep3(request.body, request.query['mobile']);
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
        console.log(e);
    }

}
async function executeStep2(dataBundler, mobile){

    // Validating Request
    const { error } = await validateRequestForStep2(dataBundler);
    if (error) {
        return {
            error: true,
            msg: error.details[0].message,
        }
    } // If this bypass means no errors


    // Get Users based on mobile number so that we check is user verfied or not
    const user = await LabRegistration.find({ 'mobile.number': mobile });
    if (user[0]['mobile']['lastOTP'] != dataBundler['otp']) {
        return {
            error: true,
            msg: 'Otp is incorrect',
            stepsCompleted: 1
        }
    }

    //Updating Record In Database
    try {
        const updatedUser = await LabRegistration.findOneAndUpdate({ "mobile.number": mobile}, {
            "mobile.isOTPVerified": true,
            "stepsCompleted": 2
        });
        if( updatedUser ) {
            return {
                error: false,
                data: 'Otp is correct',
            };  
        }
    } catch(e) {
       console.log(e.response.data);
    }

}
async function executeStep3(dataBundler, mobile){

    // Validating Request
    const { error } = await validateRequestForStep3(dataBundler);
    if (error) {
        return {
            error: true,
            msg: error.details[0].message,
        }
    } // If this bypass means no errors

    //Updating Record In Database
    try {
        const updatedUser = await LabRegistration.findOneAndUpdate({ "mobile.number": mobile}, {
            "companyInfo.labName": dataBundler['labName'],
            "companyInfo.labAddress": dataBundler['labAddress'],
            "companyInfo.labTel": dataBundler['labTel'],
            "companyInfo.labEmail": dataBundler['labEmail'],
            "stepsCompleted": 3
        });
        if( updatedUser ) {
            return {
                error: false,
                data: 'Lab info updated successfully',
            };  
        }
    } catch(e) {
       console.log(e.response.data);
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

async function validateRequestForStep2(dataHandler) {
    const schema = Joi.object({
        'otp': Joi.string().required().min(4).max(4).messages({
            'string.empty': 'OTP is required',
            'string.min': 'OTP must be only 4 numbers long',
            'string.max': 'OTP must be only 4 numbers long',
            'any.required': 'OTP is required'
        }),
    });

    let result = await schema.validate(dataHandler);
    return result;

}

async function validateRequestForStep3(dataHandler) {
    const schema = Joi.object({
        'labName': Joi.string().required().min(3).max(50).messages({
            'string.empty': 'Lab name is required',
            'string.min': 'Lab name must be only 3 numbers long',
            'string.max': 'Lab name must be only 50 numbers long',
            'any.required': 'Lab name is required'
        }),
        'labAddress': Joi.string().required().min(4).max(150).messages({
            'string.empty': 'Lab address is required',
            'string.min': 'Lab address must be only 4 numbers long',
            'string.max': 'Lab address must be only 150 numbers long',
            'any.required': 'Lab address is required'
        }),
        'labTel': Joi.string().required().min(10).max(15).messages({
            'string.empty': 'Lab telephone is required',
            'string.min': 'Lab telephone must be only 10 numbers long',
            'string.max': 'Lab telephone must be only 15 numbers long',
            'any.required': 'Lab address is required'
        }),
        'labEmail': Joi.string().required().messages({
            'string.empty': 'Lab email is required',
            'any.required': 'Lab email is required'
        }),
    });

    let result = await schema.validate(dataHandler);
    return result;

}

module.exports = router;