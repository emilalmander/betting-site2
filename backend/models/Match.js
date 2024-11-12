const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  teamA: { type: String, required: true },
  teamB: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  odds: {
    teamA: { type: Number, required: true },
    teamB: { type: Number, required: true },
    draw: { type: Number, required: true },
  },
});

module.exports = mongoose.model('Match', matchSchema);
