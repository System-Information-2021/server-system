const { Router } = require('express');
const express = require('express')
const controller = require('../controller/cart.controller')

const router = express.Router()

router.post('/order',controller.order);
router.get('/getcart',controller.getcart);
router.get('/update/:id/:st',controller.updateStatus);
router.get('/filter/:status',controller.filterOrder)
router.get('/detail/:id',controller.orderdetail)
router.get('/cancel/:id',controller.cancel)
router.get('/getorderbyuser',controller.getOrderbyUser)
module.exports = router;