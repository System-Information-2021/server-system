const express = require('express')

const controller = require('../controller/user.controller')
const router = express.Router()


router.post('/login' ,controller.authentication)

router.post('/register',controller.register)

router.get('/get-user-by-token',controller.getUserByToken)
module.exports = router;