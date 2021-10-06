const express = require('express')
const controller = require('../controller/user.controller')

const router = express.Router()

router.get('/',controller.getAllUsers)
router.post('/create', controller.createUser)
router.post('/login', controller.authentication)
router.get('/auth', controller.authorization , controller.getAllUsers)

module.exports = router;

