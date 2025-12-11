const mongoose = require('mongoose');

const SecretSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  site: String,
  username: String,
  ciphertext: String,
  iv: String,
  salt: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Secret', SecretSchema);
