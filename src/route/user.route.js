const express = require('express')
const controller = require('../controller/user.controller')

const router = express.Router()

router.get('/',controller.getAllUsers)
router.post('/:id/change-password', controller.changePassword)
router.put('/:id/update', controller.updateUser)

module.exports = router;
