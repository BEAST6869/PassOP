const jwt = require('jsonwebtoken');

// This single function now handles creating and sending the token in a cookie.
const sendTokenResponse = (res, user, redirectUrl = null) => {
  const token = jwt.sign({ sub: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  if (redirectUrl) {
    return res.redirect(redirectUrl);
  }

  // For API responses, send back user info without the password hash.
  return res.json({
    ok: true,
    user: { id: user._id, email: user.email }
  });
};

module.exports = { sendTokenResponse };