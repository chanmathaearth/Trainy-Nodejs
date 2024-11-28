const mongoose = require('mongoose');
const ItemSchema = new mongoose.Schema({
    name: { type: String, required: true  },
    expire_in: { type: Number, required: true  },
    expire_in_type: { type: String, required: true  }
})

module.exports = mongoose.model('Item', ItemSchema, 'item')