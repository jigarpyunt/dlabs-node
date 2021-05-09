
const express = require('express');
const router = express.Router();
const Joi = require('joi');

const { Methadology } = require('../../models/diagnostics/methadologies');


router.get('/:id?', async function( request, response ) {
    if( request.query.id ) {
        try {
            let methadology = await Methadology.findById( request.query.id );
            response.status(200).send(methadology);
        } catch( err ) {
            console.log( err );
            response.status(500).send('Something went wrong'); 
        }
    } else {
        try {
            let methadologies = await Methadology.find();
            response.status(200).send(methadologies);
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
    const express = require('express');
    const router = express.Router();
    const Joi = require('joi');
    
    const { Methadology } = require('../../models/diagnostics/methadologies');
    
    
    let newMethadology = new Methadology( data );

    try {
        await newMethadology.save();
        response.status(200).send(newMethadology);
        
    } catch( err ) {
        console.log( err );
        response.status(500).send('Something went wrong'); 
    }
    
});

router.delete('/:id?', async function( request, resposne ) {
    let methadologyId =  request.query.id;
    try {
        let methadology = await Methadology.findByIdAndDelete(methadology);
        if( !methadology) {
            return response.status(404).send('The Resource with this ID not found');
        }
        return response.status(200).send(methadologyId);
    }  catch( err ) {
        console.log(err);
        response.status(500).send( 'Something went wrong' );
    }
});

function validateRequest( dataBundler ) {
    const schema = Joi.object({
        name: Joi.string().required().min(3).max(20).messages({
            "string.empty": "Methadology name should not be empty",
            "string.min": "Methadology name cannot be less than 3 characters",
            "string.max": "Methadology name cannot be more than 20 characters"
        }),
        description: Joi.string().max(1000).allow(null).allow('').messages({
            "string.max": "Methadology description cannot be more than 1000 characters"
        }),
    });

    return schema.validate( dataBundler );
}
module.exports =  router;