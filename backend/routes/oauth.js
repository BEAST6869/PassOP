// backend/routes/oauth.js
const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

function sendTokenAndRedirect(res, user) {
  const token = jwt.sign({ sub: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7*24*60*60*1000
  });
  res.redirect(process.env.FRONTEND_URL || 'http://localhost:3000');
}

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_URL}/?auth=fail` }), (req, res) => {
  sendTokenAndRedirect(res, req.user);
});

module.exports = router;
