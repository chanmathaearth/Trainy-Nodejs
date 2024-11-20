const express = require('express');
const router = express.Router();
const item = require('../models/Item.js');

router.get('/', async (req, res, next) => {
    try {
        const items = await item.find();
        res.json(items);
    } catch (err) {
        next(err);
    }
});

module.exports = router;