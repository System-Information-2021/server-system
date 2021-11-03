const { Router } = require('express');
const express = require('express')
const controller = require('../controller/cart.controller')

const router = express.Router()

router.post('/order',controller.order);
router.get('/getcart',controller.getcart);
router.put('/update/:id',controller.updateStatus);
router.get('/filter',controller.filterOrder)
router.get('/detail/:id',controller.orderdetail)
module.exports = router;