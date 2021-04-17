
const express = require('express');
const router = express.Router();
const Joi = require('joi');

const { Speciality } = require('../../models/diagnostics/specialities');


router.get('/:id?', async function( request, response ) {
    if( request.query.id ) {
        try {
            let speciality = await Speciality.findById( request.query.id );
            response.status(200).send(speciality);
        } catch( err ) {
            console.log( err );
            response.status(500).send('Something went wrong'); 
        }
    } else {
        try {
            let specialities = await Speciality.find();
            response.status(200).send(specialities);
        } catch( err) {
            console.log( err );
            response.status(500).send('Something went wrong'); 
        }
    }
});

router.post('/', async function( request, response) {
    let data = request.body;
    let { error } = validateRequest( data );

    if( error ) {
        return response.status(400).send(error.details[0].message );
    }
    let newSpeciality = new Category( data );

    try {
        await newSpeciality.save();
        response.status(200).send(newSpeciality);
        
    } catch( err ) {
        console.log( err );
        response.status(500).send('Something went wrong'); 
    }
    
});

router.delete('/:id?', async function( request, resposne ) {
    let specialityId =  request.query.id;
    try {
        let speciality = await Speciality.findByIdAndDelete(speciality);
        if( !speciality) {
            return response.status(404).send('The Resource with this ID not found');
        }
        return response.status(200).send(specialityId);
    }  catch( err ) {
        console.log(err);
        response.status(500).send( 'Something went wrong' );
    }
});

function validateRequest( dataBundler ) {
    const schema = Joi.object({
        name: Joi.string().required().min(3).max(20).label("Speciality Name"),
        description: Joi.string().max(1000).allow(null).allow('').label("Speciality Description"),
    });

    return schema.validate( dataBundler );
}
module.exports =  router;