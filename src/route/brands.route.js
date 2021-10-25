const express = require('express')
const controller = require('../controller/brand.controller')

const router = express.Router()

router.post('/add' ,controller.addBrand)
router.get('/:id_brand', controller.getAllProductByBrand)
router.put('/update/:id_brand' , controller.updateBrand)
router.delete('/delete/:id_brand' , controller.deleteBrand)
router.get('/', controller.getAllBrand)

module.exports = router;