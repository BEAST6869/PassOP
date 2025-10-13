const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/auth');
const Secret = require('../models/Secret');

// This middleware protects all routes in this file
router.use(requireAuth);

// GET all secrets for the logged-in user
router.get('/', async (req, res) => {
    const secrets = await Secret.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(secrets);
});

// POST a new secret
router.post('/', async (req, res) => {
    const { site, username, ciphertext, iv, salt } = req.body;
    if (!ciphertext || !iv || !salt) {
        return res.status(400).json({ error: 'Missing required encrypted data fields' });
    }
    const secret = await Secret.create({ userId: req.user._id, site, username, ciphertext, iv, salt });
    res.status(201).json(secret);
});

// GET a single secret by ID
router.get('/:id', async (req, res) => {
    const secret = await Secret.findOne({ _id: req.params.id, userId: req.user._id });
    if (!secret) return res.status(404).json({ error: 'Secret not found' });
    res.json(secret);
});

// PUT (update) a secret by ID -- ADDED
router.put('/:id', async (req, res) => {
    const { site, username, ciphertext, iv, salt } = req.body;
    if (!ciphertext || !iv || !salt) {
        return res.status(400).json({ error: 'Missing required encrypted data fields' });
    }
    const updatedSecret = await Secret.findOneAndUpdate(
        { _id: req.params.id, userId: req.user._id },
        { site, username, ciphertext, iv, salt },
        { new: true } // This option returns the updated document
    );
    if (!updatedSecret) return res.status(404).json({ error: 'Secret not found' });
    res.json(updatedSecret);
});

// DELETE a secret by ID
router.delete('/:id', async (req, res) => {
    const deleted = await Secret.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!deleted) return res.status(404).json({ error: 'Secret not found' });
    res.json({ ok: true, message: 'Secret deleted successfully' });
});

module.exports = router;