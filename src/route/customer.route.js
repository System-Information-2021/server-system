const express = require('express')
const controller = require('../controller/product.controller')

const router = express.Router()

router.get('/product',controller.getAllProductForCustomer)
router.get('/product/filter', controller.filterProduct)
router.get('/product/:id', controller.getProductById)

module.exports = router;
