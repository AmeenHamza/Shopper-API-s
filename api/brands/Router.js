const express = require('express')
const router = express.Router()

const { AddBrand, brandById, getAllBrands, updateBrand, deleteBrand } = require('./Controller')

router.post('/add-brand', AddBrand)
router.get('/brandbyid', brandById)
router.get('/get-all-brands', getAllBrands)
router.put('/update-brand', updateBrand)
router.delete('/delete-brand', deleteBrand)

module.exports = router