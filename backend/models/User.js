const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Ingen pre-save-hook behövs, eftersom lösenordet hashas i register-funktionen

module.exports = mongoose.model('User', userSchema);
