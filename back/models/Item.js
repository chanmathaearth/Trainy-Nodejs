const mongoose = require('mongoose');
const ItemSchema = new mongoose.Schema({
    name: { type: String },
    expire_in: { type: Number },
    expire_in_type: { type: String }
})

module.exports = mongoose.model('Item', ItemSchema, 'item')