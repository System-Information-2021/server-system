const express = require('express')
const productController = require('../controller/product.controller')
const categoryController = require('../controller/categories.controller')
const brandController = require('../controller/brand.controller')

const router = express.Router()

router.get('/product',productController.getAllProductForCustomer)
router.get('/product/filter', productController.filterProduct)
router.get('/product/:id', productController.getProductById)
router.get('/category', categoryController.selectCategoryOption)
router.get('/brand', brandController.selectBrandOption)

module.exports = router;
