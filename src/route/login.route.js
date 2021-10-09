const express = require('express')

const controller = require('../auth/auth.middleware')
const router = express.Router()

router.post('/', controller.authentication)

module.exports = router;