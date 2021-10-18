const express = require('express')
const controller = require('../controller/categories.controller')
const { authorization } = require('../auth/auth.middleware')

const router = express.Router()

router.post('/add', authorization ,controller.addCategory)
router.get('/:id_category', controller.getCategoryById)
router.put('/update/:id_category', authorization , controller.updateCategory)
router.delete('/delete/:id_category', authorization , controller.deleteCategory)
router.get('/', controller.getAllCategories)

module.exports = router;
