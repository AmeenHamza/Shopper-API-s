const { Schema, model } = require('mongoose')

const CategorySchema = new Schema({
    id: {
        type: String
    },
    CategoryName: {
        type: String,
        unique: true,
        required: true,
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

const CounterDB = model('catCount', CounterSchema)
const CategoryDB = model('Category', CategorySchema)
module.exports = { CategoryDB, CounterDB }