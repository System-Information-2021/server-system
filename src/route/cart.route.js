const { Router } = require('express');
const express = require('express')
const controller = require('../controller/cart.controller')

const router = express.Router()

router.post('/order',controller.order);
router.put('/update/:id/:st',controller.updateStatus);
router.get('/filter/:status',controller.filterOrder)
router.put('/cancel/:id',controller.cancel)
router.get('/getorderbyuser/:id_user',controller.getOrderbyUser)
module.exports = router;