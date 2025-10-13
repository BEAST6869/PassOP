const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { sendTokenResponse } = require('../utils/authUtils'); // Import the utility

router.post('/signup', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

        const existing = await User.findOne({ email });
        if (existing) return res.status(409).json({ error: 'User with this email already exists' }); // 409 Conflict is more specific

        const passwordHash = await bcrypt.hash(password, 12);
        const user = await User.create({ email, passwordHash });
        sendTokenResponse(res, user); // Use the utility
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error during signup' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

        const user = await User.findOne({ email });
        if (!user || !user.passwordHash) return res.status(401).json({ error: 'Invalid credentials' }); // 401 Unauthorized

        const match = await bcrypt.compare(password, user.passwordHash);
        if (!match) return res.status(401).json({ error: 'Invalid credentials' });

        sendTokenResponse(res, user); // Use the utility
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error during login' });
    }
});

router.post('/logout', (req, res) => {
    res.clearCookie('token', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' });
    res.json({ ok: true, message: 'Logged out successfully' });
});

// Renamed for clarity. This route checks the current session based on the token.
router.get('/session', require('../middleware/auth'), (req, res) => {
    // The requireAuth middleware already attached the user
    res.json({ user: { id: req.user._id, email: req.user.email } });
});

module.exports = router;