const express = require('express')
const router = express.Router()

const {signup, login, getAllUsers} = require('./Controller')

router.post('/login', login)
router.post('/signup', signup)
router.get('/getAllUsers', getAllUsers)

module.exports = router