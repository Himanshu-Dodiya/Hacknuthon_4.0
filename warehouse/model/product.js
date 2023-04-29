// creat a schema for producy

const mongoose = require('mongoose');


const ProductSchema = new mongoose.Schema({
    product_id: {
        type: String,
        required: true,
        unique: true
    },
    product_name: {
        type: String,
        required: true
    },
    product_price: {
        type: Number,
        required: true
    },
    product_quantity: {
        type: Number,
        required: true
    },
    product_change: {
        type: String,
    }
});

module.exports = mongoose.model('Product', ProductSchema);    