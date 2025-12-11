const express = require('express');
const router = express.Router();
const passport = require('passport');
const { sendTokenResponse } = require('../utils/authUtils');

router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account'
}));

router.get('/google/callback',
    passport.authenticate('google', {
        session: false,
        failureRedirect: `${process.env.FRONTEND_URL}/?auth=fail`
    }),
    (req, res) => {
        console.log("==============================================");
        console.log(">>> OAUTH CALLBACK HANDLER TRIGGERED <<<");
        console.log("Value of process.env.API_BASE_URL:", process.env.API_BASE_URL);
        console.log("Value of process.env.FRONTEND_URL:", process.env.FRONTEND_URL);
        console.log("==============================================");

        sendTokenResponse(res, req.user, process.env.FRONTEND_URL || 'http://localhost:5173');
    }
);

module.exports = router;