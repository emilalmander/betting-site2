// leaderboardRoutes.js
const express = require('express');
const router = express.Router();
const Guess = require('../models/Guess');
const User = require('../models/User');
const Group = require('../models/Group');

// GET /api/leaderboard - Hämtar leaderboard-data för alla användare
router.get('/', async (req, res) => {
  try {
    // Hämta alla användare
    const users = await User.find();
    
    // Samla poäng för varje användare
    const leaderboard = await Promise.all(users.map(async (user) => {
      const guesses = await Guess.find({ user: user._id });
      const totalPoints = guesses.reduce((sum, guess) => sum + (guess.pointsEarned || 0), 0);
      return { userId: user._id, name: user.name, totalPoints };
    }));

    // Sortera i fallande ordning efter totalPoints
    leaderboard.sort((a, b) => b.totalPoints - a.totalPoints);

    res.json(leaderboard);
  } catch (error) {
    console.error('Kunde inte hämta leaderboard:', error);
    res.status(500).json({ error: 'Kunde inte hämta leaderboard' });
  }
});
router.get('/group/:groupId', async (req, res) => {
    try {
      const group = await Group.findById(req.params.groupId).populate('members');
      if (!group) {
        return res.status(404).json({ error: 'Gruppen hittades inte' });
      }
  
      // Hämta poäng för varje medlem
      const leaderboard = await Promise.all(
        group.members.map(async (member) => {
          const guesses = await Guess.find({ user: member._id });
          const totalPoints = guesses.reduce((sum, guess) => sum + (guess.pointsEarned || 0), 0);
          return {
            userId: member._id,
            name: member.name,
            totalPoints,
          };
        })
      );
  
      res.json(leaderboard);
    } catch (error) {
      console.error('Kunde inte hämta gruppens leaderboard:', error);
      res.status(500).json({ error: 'Kunde inte hämta gruppens leaderboard' });
    }
  });

module.exports = router;
