const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  matchId: { type: String, required: true, unique: true }, // matchId som unikt fält
  teamA: { type: String, required: true },
  teamB: { type: String, required: true },
  dateTime: { type: String, required: true },
  odds: {
    teamA: { type: Number },
    draw: { type: Number },
    teamB: { type: Number },
  },
});

module.exports = mongoose.model('Match', matchSchema);

