const express = require('express');
const router = express.Router();
const passport = require('passport');
const { sendTokenResponse } = require('../utils/authUtils');

// This route starts the Google login process.
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
        // --- THIS IS THE DEBUGGING BLOCK ---
        // It will print the values of your environment variables to the Render logs
        // so we can see what the live server is actually using.
        console.log("==============================================");
        console.log(">>> OAUTH CALLBACK HANDLER TRIGGERED <<<");
        console.log("Value of process.env.API_BASE_URL:", process.env.API_BASE_URL);
        console.log("Value of process.env.FRONTEND_URL:", process.env.FRONTEND_URL);
        console.log("==============================================");
        // ------------------------------------

        // This line remains the same.
        sendTokenResponse(res, req.user, process.env.FRONTEND_URL || 'http://localhost:5173');
    }
);

module.exports = router;