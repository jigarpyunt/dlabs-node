const express = require('express');
const router = express.Router();
const Joi = require('joi');


// Getting Test Model
const { Test }  =  require('../../models/diagnostics/tests');

router.get('/:id?', async function ( request, response )  {
   
    if( request.query.id ) {

        let testId = request.query.id;
        try {
            let test  = await Test.findById({ _id : testId });  
            if( ! test ) {
                return response.status(404).send('Resource not found');
            }
            return response.status(200).send(test);

        } catch( err ) {
            console.log(err);
            return response.status(500).send(err);
        }

    } else {
        try {
            let tests = await Test.find().sort({ name : 1});
            return response.status(200).send(tests);
        } catch( err ) {
            console.log(err);
            return response.status(500).send(err);
        }
        
    }    
});

router.post('/', async function ( request , response ) {
    let { error } = validateRequest(request.body);
    if( error ) {
        return response.status(400).send( error.details[0].message )
    }

    let newTest = new Test( request.body );
    try {
        await newTest.save();
        response.status(200).send(newTest);
    } catch (err) {
        console.log(err);
        response.status(500).send( 'Something went wrong' );
    }
}); 

router.delete('/:id?', async function( request, response ) {
    let testId =  request.query.id;
    try {
        let test = await Test.findByIdAndDelete(testId);
        if( !test) {
            return response.status(404).send('The Resource with this ID not found');
        }
        return response.status(200).send(test);
    }  catch( err ) {
        console.log(err);
        response.status(500).send( 'Something went wrong' );
    }
}); 


function validateRequest ( dataBundler ) {
    const schema = Joi.object({
        name: Joi.string().required().min(3).max(30).messages({
            'string.base': 'Test name should be text',
            'string.empty': 'Test name should not be empty',
            'string.min': 'Test name should be minium 5 characters',
            'string.max': 'Test name should be maximum 30 characters'
        }),
        unit: Joi.string().required().max(10).messages({
            'string.base': 'Test unit should be text',
            'string.empty': 'Test unit should not be empty',
            'string.min': 'Test unit should be minium 5 characters',
            'string.max': 'Test unit should be maximum 30 characters'
        }),
        range: Joi.string().required().messages({
            'string.base': 'Test range should be text',
            'string.empty': 'Test range should not be empty',
        }),
        price: Joi.string().required().messages({
            'string.base': 'Test price should be text',
            'string.empty': 'Test price should not be empty',
        }),
        codePrefix: Joi.string().required().messages({
            'string.base': 'Test code prefix should be text',
            'string.empty': 'Test code prefix should not be empty',
        }),
        code: Joi.string().required().messages({
            'string.base': 'Test code should be text',
            'string.empty': 'Test code should not be empty',
        }),
        preTestInformation: Joi.string().required().max(1000).messages({
            'string.base': 'Test pre information should be text',
            'string.empty': 'Test pre information should not be empty',
            'string.max': 'Test pre information should be maximum 1000 characters'
        }),
        speciality: Joi.object().allow(null).allow(''),
        methadology:  Joi.object().allow(null).allow(''),
        category:  Joi.object().allow(null).allow(''),
        reportAvailibilityTime:  Joi.string().allow(null).allow(''),
        description:  Joi.string().allow(null).allow('')
    });

    return schema.validate( dataBundler );
}






module.exports = router;