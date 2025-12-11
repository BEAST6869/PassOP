const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: `${process.env.API_BASE_URL}/auth/google/callback`
},
async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
            return done(new Error("No email found from Google profile."), null);
        }

        let user = await User.findOne({ 'oauth.providerId': profile.id });

        if (!user) {
            user = await User.findOne({ email });

            if (user) {
                user.oauth = { provider: 'google', providerId: profile.id };
                await user.save();
            } else {
                user = await User.create({
                    email,
                    oauth: { provider: 'google', providerId: profile.id }
                });
            }
        }
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));
