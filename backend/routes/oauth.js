const express = require('express');
const router = express.Router();
const passport = require('passport');
const { sendTokenResponse } = require('../utils/authUtils');

// This route starts the Google login process.
// The 'prompt: select_account' option ensures the user can always choose which Google account to use.
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account'
}));

// This is the callback route that Google redirects to after the user signs in.
router.get('/google/callback',
    passport.authenticate('google', {
        session: false, // We use JWTs, not sessions.
        failureRedirect: `${process.env.FRONTEND_URL}/?auth=fail`
    }),
    (req, res) => {
        // If successful, create a JWT, set it as a cookie, and redirect to the frontend.
        sendTokenResponse(res, req.user, process.env.FRONTEND_URL || 'http://localhost:5173');
    }
);

module.exports = router;