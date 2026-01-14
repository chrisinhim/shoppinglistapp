const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authenticateToken = require('../middleware/auth');


// Get all users (admin only)
router.get('/', authenticateToken, async (req, res) => {
  if (req.user && req.user.userId) {
    const requestingUser = await User.findById(req.user.userId);
    if (requestingUser && requestingUser.role === 'admin') {
      const users = await User.find();
      return res.json(users);
    }
  }
  return res.status(403).json({ error: 'Forbidden' });
});


// Get user by ID
router.get('/:id', authenticateToken, async (req, res) => {
  if (req.user && req.user.userId) {
    const requestingUser = await User.findById(req.user.userId);
    if (requestingUser) {
      // Admin can get any user, user can get only self
      if (requestingUser.role === 'admin' || req.user.userId === req.params.id) {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        return res.json(user);
      }
    }
  }
  return res.status(403).json({ error: 'Forbidden' });
});


// Update user
router.put('/:id', authenticateToken, async (req, res) => {
  if (req.user && req.user.userId) {
    const requestingUser = await User.findById(req.user.userId);
    if (requestingUser) {
      // Admin can update any user, user can update only self
      if (requestingUser.role === 'admin' || req.user.userId === req.params.id) {
        // Prevent non-admins from changing their own role
        if (requestingUser.role !== 'admin' && req.body.role) {
          delete req.body.role;
        }
        try {
          const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
          if (!user) return res.status(404).json({ error: 'User not found' });
          return res.json(user);
        } catch (err) {
          return res.status(400).json({ error: err.message });
        }
      }
    }
  }
  return res.status(403).json({ error: 'Forbidden' });
});


// Delete user
router.delete('/:id', authenticateToken, async (req, res) => {
  if (req.user && req.user.userId) {
    const requestingUser = await User.findById(req.user.userId);
    if (requestingUser) {
      // Admin can delete any user, user can delete only self
      if (requestingUser.role === 'admin' || req.user.userId === req.params.id) {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        return res.json({ message: 'User deleted' });
      }
    }
  }
  return res.status(403).json({ error: 'Forbidden' });
});

module.exports = router;
