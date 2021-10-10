const express = require('express')

const controller = require('../controller/user.service')
const router = express.Router()

router.post('/login', controller.authentication)
router.post('/register', controller.register)

module.exports = router;