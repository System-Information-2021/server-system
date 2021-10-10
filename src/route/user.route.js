const express = require('express')
const controller = require('../controller/user.controller')

const router = express.Router()

router.get('/',controller.getAllUsers)

module.exports = router;
