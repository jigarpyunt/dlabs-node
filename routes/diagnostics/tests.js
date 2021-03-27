const express = require('express');
const router = express.Router();
const Joi = require('joi');
const mongoose =  require('mongoose');


// Getting Test Model
const { Test }  =  require('../../models/diagnostics/tests');

router.get('/', async function( request, response ) {
    let tests = await Test.find().sort({ name : 1});
    response.status(200).send(tests);
});

router.post('/', async function( request , response ) {
    let { error } = validateRequest(request.body);
    if( error ) {
        return response.status(400).send( error.details[0].message )
    }

    const newTest = new Test( request.body );
    const res = await newTest.save();
    response.status(200).send(res);
}); 


function validateRequest ( dataBundler ) {
    const schema = Joi.object({
        name: Joi.string().required().min(5).max(30).label('Name'),
        unit: Joi.string().required().max(10).label('Unit'),
        range: Joi.string().required().label('Range'),
        price: Joi.string().required().label('Price'),
        codePrefix: Joi.string().required().label('Prefix'),
        code: Joi.string().required().label('Code'),
        preTestInformation: Joi.string().required().max(1000).label('Information'),
        speciality: Joi.string().allow(null).allow(''),
        organ:  Joi.string().allow(null).allow(''),
        condition:  Joi.string().allow(null).allow(''),
        category:  Joi.string().allow(null).allow(''),
        reportAvalibilityTime:  Joi.string().allow(null).allow(''),
        description:  Joi.string().allow(null).allow('')
    });

    return schema.validate( dataBundler );
}






module.exports = router;