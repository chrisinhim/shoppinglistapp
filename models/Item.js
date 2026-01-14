const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, default: 1 },
  purchased: { type: Boolean, default: false },
  shoppingList: { type: mongoose.Schema.Types.ObjectId, ref: 'ShoppingList', required: true }
});

module.exports = mongoose.model('Item', ItemSchema);
