const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  matchId: { type: String, required: true, unique: true },
  teamA: { type: String, required: true },
  teamB: { type: String, required: true },
  dateTime: { type: String, required: true },
  odds: {
    teamA: { type: Number, default: null },
    draw: { type: Number, default: null },
    teamB: { type: Number, default: null },
  },
});


module.exports = mongoose.model('Match', matchSchema);
