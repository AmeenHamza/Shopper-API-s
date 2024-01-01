const express = require('express')
const router = express.Router()

const { getOrders, addOrders, updateOrder, orderById, deleteOrder } = require('./Controller')

router.get("/get-orders", getOrders)
router.post('/place-order', addOrders)
router.put('/update-order', updateOrder)
router.get('/order-by-id', orderById)
router.delete('/delete-order', deleteOrder)

module.exports = router