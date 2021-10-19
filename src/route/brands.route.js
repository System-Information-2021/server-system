const express = require('express')
const controller = require('../controller/brand.controller')
const { authorization } = require('../auth/auth.middleware')

const router = express.Router()

router.post('/add', authorization ,controller.addBrand)
router.get('/:id_brand', controller.getBrandById)
router.put('/update/:id_brand', authorization , controller.updateBrand)
router.delete('/delete/:id_brand', authorization , controller.deleteBrand)
router.get('/', controller.getAllBrand)

module.exports = router;