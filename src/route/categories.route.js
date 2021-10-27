const express = require('express')
const controller = require('../controller/categories.controller')

const router = express.Router()

router.post('/add' ,controller.addCategory)
router.get('/all', controller.selectCategoryOption)
router.get('/:id_category', controller.getAllProductByCategory)
router.put('/update/:id_category' , controller.updateCategory)
router.delete('/delete/:id_category' , controller.deleteCategory)
router.get('/', controller.getAllCategories)


module.exports = router;
