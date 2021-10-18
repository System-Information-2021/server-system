const express = require('express')
const controller = require('../controller/categories.controller')

const router = express.Router()

router.post('/add',controller.addCategory)
router.get('/:id_category', controller.getCategoryById)
router.put('/update/:id_category', controller.updateCategory)
router.delete('/delete/:id_category', controller.deleteCategory)

module.exports = router;
