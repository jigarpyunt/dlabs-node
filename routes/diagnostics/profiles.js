const express = require('express');
const router = express.Router();
const Joi = require('joi');
const { Profile }  = require('../../models/diagnostics/profiles');



router.get('/:id?', async function ( request, response ) {

    if( request.query.id ) {
        try {
            let profile = await Profile.findById( request.query.id );
            if( !profile ) {
                return response.status(404).send('Resource not found');
            }
            return response.status(200).send(profile);
        } catch( err ) {
            console.log(err);
            return response.status(500).send(err);
        }

    } else {
        try {
            let  profiles = await Profile.find();
            return response.status(200).send(profiles);
        } catch( err ) {
            console.log(err);
            return response.status(500).send(err);
        }
        
    }
});


router.post('/', async function ( request, response ) {

    let data = request.body;

    const { error } = validateRequest( data );
    if( error ) {
        return response.status(400).send(error.details[0].message);
    }

    let newProfile = new Profile( data );

    try {
        await newProfile.save();
        response.status(200).send( newProfile );
    } catch ( err ) {
        console.log(err);
        response.status(500).send( 'Something went wrong' );
    }
});


router.delete('/:id?', async function( request, response ) {
    let profileId =  request.query.id;
    try {
        let profile = await Test.findByIdAndDelete(profileId);
        if( !profile) {
            return response.status(404).send('The Resource with this ID not found');
        }
        return response.status(200).send(profile);
    }  catch( err ) {
        console.log(err);
        response.status(500).send( 'Something went wrong' );
    }
}); 

function validateRequest( dataBundler ) {
    const schema = Joi.object({
        name: Joi.string().required().min(3).max(20).label('Name'),
        availibility: Joi.string().valid('One Day','Within 2 Days','Less than 5 days','Greater than 5 days').required().label('Availibility'),
        price: Joi.string().required().label('Price'),
        testsInProfile: Joi.array().required().label('Tests in profile'),
        description: Joi.string().max(1000).allow(null).allow('').label('Description'),
        preInformation: Joi.string().max(1000).allow(null).allow('').label('Pre Information')
    });    

    return schema.validate(dataBundler);
}

module.exports = router;