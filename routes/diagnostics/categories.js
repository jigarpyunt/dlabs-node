const express = require('express');
const router = express.Router();
const Joi = require('joi');

const { Category } = require('../../models/diagnostics/categories');


router.get('/:id?', async function( request, response ) {
    if( request.query.id ) {
        try {
            let category = await Category.findById( request.query.id );
            response.status(200).send(category);
        } catch( err ) {
            console.log( err );
            response.status(500).send('Something went wrong'); 
        }
    } else {
        try {
            let categories = await Category.find();
            response.status(200).send(categories);
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
    let newCategory = new Category( data );

    try {
        await newCategory.save();
        response.status(200).send(newCategory);
        
    } catch( err ) {
        console.log( err );
        response.status(500).send('Something went wrong'); 
    }
    
});

router.delete('/:id?', async function( request, resposne ) {
    let categoryId =  request.query.id;
    try {
        let category = await Category.findByIdAndDelete(categoryId);
        if( !category) {
            return response.status(404).send('The Resource with this ID not found');
        }
        return response.status(200).send(categoryId);
    }  catch( err ) {
        console.log(err);
        response.status(500).send( 'Something went wrong' );
    }
});

function validateRequest( dataBundler ) {
    const schema = Joi.object({
        name: Joi.string().required().min(3).max(20).label("Category Name")
    });

    return schema.validate( dataBundler );
}
module.exports =  router;