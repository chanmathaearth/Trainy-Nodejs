const express = require('express');
const router = express.Router();
const stockController = require('../controllers/StockController.js');
const stockV2Controller = require('../controllers/NewStockController.js');

router.get('/stocks', stockController.getStocks);
router.get('/stocksv2', stockV2Controller.getStocks);
router.post("/stocks/filter", stockV2Controller.filterStocks);

module.exports = router;

