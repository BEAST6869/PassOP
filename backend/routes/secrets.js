// backend/routes/secrets.js
const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/auth');
const Secret = require('../models/Secret');

router.use(requireAuth);

router.post('/', async (req, res) => {
  const { site, username, ciphertext, iv, salt } = req.body;
  if (!ciphertext || !iv || !salt) return res.status(400).json({ error: 'Missing encrypted data' });
  const secret = await Secret.create({ userId: req.user._id, site, username, ciphertext, iv, salt });
  res.json(secret);
});

router.get('/', async (req, res) => {
  const secrets = await Secret.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json(secrets);
});

router.get('/:id', async (req, res) => {
  const secret = await Secret.findOne({ _id: req.params.id, userId: req.user._id });
  if (!secret) return res.status(404).json({ error: 'Not found' });
  res.json(secret);
});

router.delete('/:id', async (req, res) => {
  const deleted = await Secret.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  if (!deleted) return res.status(404).json({ error: 'Not found' });
  res.json({ ok: true });
});

module.exports = router;
