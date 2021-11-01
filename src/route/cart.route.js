const { Router } = require('express');
const express = require('express')
const controller = require('../controller/cart.controller')

const router = express.Router()

router.get('/addtocart/:id' ,controller.AddtoCart);
router.get('/cart', controller.getCart);
router.delete('/delete/:id',controller.deleteCart);
router.get('/delete',controller.deleteCartAll);
router.get('/increase/:id',controller.increaseqty);
router.get('/decrease/:id',controller.decreaseqty);
router.post('/order',controller.order);
module.exports = router;