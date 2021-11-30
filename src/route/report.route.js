const { Router } = require('express');
const express = require('express')
const controller = require('../controller/report.controller')

const router = express.Router()

router.get('/revenue/:id', controller.reportRevenue);
router.get('/product', controller.reportProduct);
router.get('/order',controller.reportOrder);

module.exports = router;