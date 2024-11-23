// models/Guess.js
const mongoose = require('mongoose');

const guessSchema = new mongoose.Schema({
  match: { type: mongoose.Schema.Types.ObjectId, ref: 'Match', required: true }, // match referens
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  exactScore: {
    teamA: { type: Number, required: true },
    teamB: { type: Number, required: true },
  },
  winningTeam: { type: String, required: true },
  totalGoals: { type: Number, required: true },
  pointsEarned: { type: Number, default: 0 },
});

module.exports = mongoose.model('Guess', guessSchema);
