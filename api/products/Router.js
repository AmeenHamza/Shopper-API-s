const express = require('express')
const router = express.Router()

const { getProducts, addProduct, updateProduct, deleteProduct, productByName, byCategory } = require('./Controller')

// Get All Products
// Add Products
router.post('/addProduct', addProduct)
router.get('/get-products', getProducts)
router.put('/update-product', updateProduct)
router.delete('/delete-product', deleteProduct)
router.get('/find-product', productByName)
router.get('/by-category', byCategory)

module.exports = router