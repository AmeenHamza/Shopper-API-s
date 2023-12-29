const { Schema, model } = require('mongoose');

const BrandsSchema = new Schema({
    id : {
        type : String
    },
    BrandName: {
        type: String,
        required: true
    },
    BrandImage: {
        type: String,
        required: true
    },
    Category: {
        type: String,
        required: true
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


const BrandCount = model('BrandCount', CounterSchema);
const brandDB = model('brand', BrandsSchema);
module.exports = { brandDB, BrandCount };
