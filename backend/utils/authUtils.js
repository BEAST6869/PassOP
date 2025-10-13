const jwt = require('jsonwebtoken');

const sendTokenResponse = (res, user, redirectUrl = null) => {
  const token = jwt.sign({ sub: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

  const isProduction = process.env.NODE_ENV === 'production';

  res.cookie('token', token, {
    httpOnly: true,
    secure: isProduction, // Cookie is only sent over HTTPS in production
    // This is the crucial change:
    // 'lax' is fine for development on localhost
    // 'none' is required for cross-site cookies in production
    sameSite: isProduction ? 'none' : 'lax', 
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  if (redirectUrl) {
    return res.redirect(redirectUrl);
  }

  return res.json({
    ok: true,
    user: { id: user._id, email: user.email }
  });
};

module.exports = { sendTokenResponse };