const express = require('express');
const router = express.Router();
const ShoppingList = require('../models/ShoppingList');
const authenticateToken = require('../middleware/auth');

// Get all shopping lists for user
router.get('/', authenticateToken, async (req, res) => {
  const lists = await ShoppingList.find({ user: req.user.userId }).populate('items');
  res.json(lists);
});

// Create shopping list
router.post('/', authenticateToken, async (req, res) => {
  try {
    const list = new ShoppingList({ ...req.body, user: req.user.userId });
    await list.save();
    res.status(201).json(list);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get shopping list by ID
router.get('/:id', authenticateToken, async (req, res) => {
  const list = await ShoppingList.findOne({ _id: req.params.id, user: req.user.userId }).populate('items');
  if (!list) return res.status(404).json({ error: 'List not found' });
  res.json(list);
});

// Update shopping list
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const list = await ShoppingList.findOneAndUpdate({ _id: req.params.id, user: req.user.userId }, req.body, { new: true });
    if (!list) return res.status(404).json({ error: 'List not found' });
    res.json(list);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete shopping list
router.delete('/:id', authenticateToken, async (req, res) => {
  const list = await ShoppingList.findOneAndDelete({ _id: req.params.id, user: req.user.userId });
  if (!list) return res.status(404).json({ error: 'List not found' });
  res.json({ message: 'List deleted' });
});

module.exports = router;
