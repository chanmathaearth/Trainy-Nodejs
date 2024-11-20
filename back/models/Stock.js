const mongoose = require('mongoose');

const StockSchema = new mongoose.Schema({
    item_code: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
    lot: { type: String, required: true },
    amount: { type: String, required: true },
    import_datetime: { type: Date, required: true },
    note: { type: String, default: '' },
    exp_datetime: { type: Date, required: true },
});

module.exports = mongoose.model('Stock', StockSchema, 'stock');