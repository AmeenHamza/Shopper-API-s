const { Schema, model } = require('mongoose');

const ProductsSchema = new Schema({
    id: {
        type: String
    },
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category : {
        type : String,
        required : true
    },
    image: {
        type: String,
        required: true
    },
    rating: {
        rate: {
            type: Number,
            default: 5
        },
        count: {
            type: Number,
            default: 0
        }
    }
})

const CounterSchema = new Schema({
    id: {
        type: String
    },
    seq: {
        type: Number
    }
})

const productCount = model("productCount", CounterSchema)
const productDB = model("products", ProductsSchema)
module.exports = { productDB, productCount }