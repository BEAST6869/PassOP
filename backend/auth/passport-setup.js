// backend/auth/passport-setup.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_ID,
  clientSecret: process.env.GOOGLE_SECRET,
  callbackURL: `${process.env.API_BASE_URL}/auth/google/callback`
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails && profile.emails[0] && profile.emails[0].value;
    let user = await User.findOne({ 'oauth.provider': 'google', 'oauth.providerId': profile.id });
    if (!user) {
      if (email) {
        user = await User.findOne({ email });
      }
      if (!user) {
        user = await User.create({ email, oauth: { provider: 'google', providerId: profile.id } });
      } else {
        user.oauth = { provider: 'google', providerId: profile.id };
        await user.save();
      }
    }
    done(null, user);
  } catch (err) {
    done(err);
  }
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => done(null, await User.findById(id)));
