const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 3,
        max: 20
    }
});

const Category = mongoose.model('Category', categorySchema );

module.exports.categorySchema =  categorySchema
module.exports.Category = Category;