const express = require('express')
const controller = require('../controller/user.controller')

const router = express.Router()

router.get('/',controller.getAllUsers)
router.post('/register', controller.createUser)
router.post('/login', controller.authentication)
router.post('/auth', controller.authorization , controller.getAllUsers)

module.exports = router;
