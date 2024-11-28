const Stock = require('../models/Stock');

exports.getStocks = async (req, res, next) => {
    try {
        const stocks = await Stock.find().populate('item_code', 'name').lean();
        res.json(stocks);
    } catch (err) {
        next(err);
    }
};

