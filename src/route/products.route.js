const express = require('express')
const controller = require('../controller/product.controller')
const upload = require('../../utils/upload')

const router = express.Router()

router.post('/add', upload.array('images', 3) , controller.addProduct)
router.get('/:id', controller.getProductById)
router.delete('/delete/:id', controller.deleteProduct)
router.put('/update/:id', controller.updateProductInfo)
router.post('/active/:id_product', controller.activeProduct)
router.get('/', controller.getAllProduct)

module.exports = router;
