const express = require('express');
const router = express.Router();
const stock = require('../models/Stock.js');

router.get('/', async (req, res, next) => {
    try {
        const stocks = await stock.find().populate('item_code', 'name');
        res.json(stocks);
    } catch (err) {
        next(err);
    }
});

module.exports = router;