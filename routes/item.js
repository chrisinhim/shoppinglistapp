const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const ShoppingList = require('../models/ShoppingList');
const authenticateToken = require('../middleware/auth');

// Add item to shopping list
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, quantity, shoppingList } = req.body;
    const item = new Item({ name, quantity, shoppingList });
    await item.save();
    await ShoppingList.findByIdAndUpdate(shoppingList, { $push: { items: item._id } });
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update item
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete item
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    await ShoppingList.findByIdAndUpdate(item.shoppingList, { $pull: { items: item._id } });
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
