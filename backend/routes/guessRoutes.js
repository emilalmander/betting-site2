const express = require('express');
const router = express.Router();
console.log('guessRoutes loaded');
const Guess = require('../models/Guess');

router.post('/', async (req, res) => {
  console.log('Data mottagen:', req.body);
  try {
    const { matchId, userId, exactScore, winMargin, winningTeam, totalGoals } = req.body;

    const newGuess = new Guess({
      match: matchId,
      user: userId,
      exactScore,
      winMargin,
      winningTeam,
      totalGoals,
    });

    await newGuess.save();
    res.status(201).json(newGuess);
  } catch (error) {
    console.error('Kunde inte skapa gissning:', error); 
    res.status(500).json({ error: 'Kunde inte skapa gissning', details: error.message });
  }
});

router.get('/user/:userId', async (req, res) => {
    try {
      const guesses = await Guess.find({ user: req.params.userId }).populate('match');
      res.json(guesses);
    } catch (error) {
      console.error('Kunde inte hämta gissningar:', error);
      res.status(500).json({ error: 'Kunde inte hämta gissningar', details: error.message });
    }
  });

router.get('/check/:userId/:matchId', async (req, res) => {
    try {
      const guess = await Guess.findOne({ user: req.params.userId, match: req.params.matchId });
      res.json({ exists: !!guess });
    } catch (error) {
      console.error('Kunde inte kontrollera gissning:', error);
      res.status(500).json({ error: 'Kunde inte kontrollera gissning' });
    }
  });

// Lägg till poängberäkning och uppdatera gissningspoängen
function calculatePoints(guess, matchResult) {
  let points = 0;

  // Exakt resultat
  if (
    guess.exactScore.teamA === matchResult.teamA &&
    guess.exactScore.teamB === matchResult.teamB
  ) {
    points += 10;
  }
  // Rätt vinnande lag
  else if (
    guess.winningTeam === (matchResult.teamA > matchResult.teamB ? 'teamA' : 'teamB')
  ) {
    points += 5;
  }

  // Rätt segermarginal
  const actualMargin = Math.abs(matchResult.teamA - matchResult.teamB);
  if (guess.winMargin === actualMargin) {
    points += 3;
  }

  // Rätt antal totala mål inom en viss marginal
  const actualTotalGoals = matchResult.teamA + matchResult.teamB;
  if (Math.abs(guess.totalGoals - actualTotalGoals) <= 2) {
    points += 2;
  }

  return points;
}

// Routen för att uppdatera poängen för en gissning
router.put('/update-points/:guessId', async (req, res) => {
    try {
      const guessId = req.params.guessId.trim();
      const { matchResult } = req.body; // matchresultat skickas från klienten
  
      const guess = await Guess.findById(guessId);
      if (!guess) {
        return res.status(404).json({ error: 'Gissning hittades inte' });
      }
  
      // Räkna ut poängen baserat på `matchResult` och uppdatera `pointsEarned`
      guess.pointsEarned = calculatePoints(guess, matchResult);
      await guess.save();
  
      res.json(guess);
    } catch (error) {
      console.error('Kunde inte uppdatera poäng:', error);
      res.status(500).json({ error: 'Kunde inte uppdatera poäng' });
    }
  });

module.exports = router;
