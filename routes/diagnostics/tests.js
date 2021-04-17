const express = require('express');
const router = express.Router();
const Joi = require('joi');
const mongoose =  require('mongoose');


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
        response.status(200).send(res);
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