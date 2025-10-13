require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const passport = require('passport');

// --- Pre-loading & Setup ---
require('./models/User'); // Ensure models are registered before use
require('./models/Secret');
require('./auth/passport-setup');
const authRoutes = require('./routes/auth');
const secretRoutes = require('./routes/secrets');
const oauthRoutes = require('./routes/oauth');

const app = express();

// --- Middleware ---
app.set('trust proxy', 1); // Important for rate-limiting and secure cookies behind a proxy
app.use(helmet());
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200, standardHeaders: true, legacyHeaders: false }));
app.use(passport.initialize());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));

// --- Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/secrets', secretRoutes);
app.use('/auth', oauthRoutes); // Google OAuth routes

app.get('/api', (req, res) => res.send('Password Manager API is running.'));

// --- Database & Server Start ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => console.log(`API server listening on port ${PORT}`));
    })
    .catch(err => {
        console.error('Failed to connect to MongoDB', err);
        process.exit(1);
    });