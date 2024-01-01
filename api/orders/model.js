const { Schema, model } = require('mongoose')

const OrderSchema = new Schema({

    items: {
        type: Array,
        required: true
    },
    totalBill: {
        type: String,
        required: true
    },
    customerAddresss: {
        type: String,
        required: true
    },
    customerContact: {
        type: String,
        required: true
    },
    customerName: {
        type: String,
        required: true
    },
    status : {
        type : String,
        default : "In progress"
    },
    order_at : {
        type : Date,
        default : Date.now
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

const orderCount = model("orderCount", CounterSchema);
const orderDB = model("order", OrderSchema);
module.exports = {orderDB, orderCount}