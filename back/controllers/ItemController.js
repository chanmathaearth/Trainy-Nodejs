const Item = require('../models/Item.js');

exports.getItems = async (req, res, next) => {
    try {
        const items = await Item.find().lean();
        res.json(items);
    } catch (err) {
        next(err);
    }
};
