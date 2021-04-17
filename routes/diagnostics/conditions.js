
const express = require('express');
const router = express.Router();
const Joi = require('joi');

const { Condition } = require('../../models/diagnostics/conditions');


router.get('/:id?', async function( request, response ) {
    if( request.query.id ) {
        try {
            let condition = await Condition.findById( request.query.id );
            response.status(200).send(condition);
        } catch( err ) {
            console.log( err );
            response.status(500).send('Something went wrong'); 
        }
    } else {
        try {
            let conditions = await Condition.find();
            response.status(200).send(conditions);
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
    let newCondition = new Condition( data );

    try {
        await newCondition.save();
        response.status(200).send(newCondition);
        
    } catch( err ) {
        console.log( err );
        response.status(500).send('Something went wrong'); 
    }
    
});

router.delete('/:id?', async function( request, resposne ) {
    let conditionId =  request.query.id;
    try {
        let condition = await Condition.findByIdAndDelete(condition);
        if( !condition) {
            return response.status(404).send('The Resource with this ID not found');
        }
        return response.status(200).send(conditionId);
    }  catch( err ) {
        console.log(err);
        response.status(500).send( 'Something went wrong' );
    }
});

function validateRequest( dataBundler ) {
    const schema = Joi.object({
        name: Joi.string().required().min(3).max(20).label("Condition Name"),
        description: Joi.string().max(1000).allow(null).allow('').label("Condition Description"),
    });

    return schema.validate( dataBundler );
}
module.exports =  router;