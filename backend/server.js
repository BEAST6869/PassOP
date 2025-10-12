// backend/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const passport = require('passport');
require('./auth/passport-setup');

const authRoutes = require('./routes/auth');
const secretRoutes = require('./routes/secrets');
const oauthRoutes = require('./routes/oauth');

const app = express();

app.use(helmet());
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use(rateLimit({ windowMs: 15*60*1000, max: 200 }));
app.use(passport.initialize());

const FRONTEND = process.env.FRONTEND_URL || 'http://localhost:5173';
app.use(cors({ origin: FRONTEND, credentials: true }));

app.use('/api/auth', authRoutes);
app.use('/api/secrets', secretRoutes);
app.use('/auth', oauthRoutes);

app.get('/', (req, res) => res.send('Password manager API'));

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`API listening on ${port}`));
  })
  .catch(err => { console.error('Mongo connect error', err); process.exit(1); });
