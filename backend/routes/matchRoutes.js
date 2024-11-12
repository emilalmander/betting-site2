const express = require('express');
const router = express.Router();
const Match = require('../models/Match');

console.log('matchRoutes loaded'); // Kontrollera att filen laddas

// POST /api/matches/add-test-matches - Lägg till testmatcher
router.post('/add-test-matches', async (req, res) => {
  try {
    const testMatches = [
      {
        teamA: 'Team Alpha',
        teamB: 'Team Beta',
        date: new Date('2024-11-20'),
        time: '18:00',
        odds: { teamA: 1.5, teamB: 2.8, draw: 3.0 },
      },
      {
        teamA: 'Team Gamma',
        teamB: 'Team Delta',
        date: new Date('2024-11-21'),
        time: '20:00',
        odds: { teamA: 2.0, teamB: 2.5, draw: 3.2 },
      },
    ];

    const matches = await Match.insertMany(testMatches);
    res.status(201).json(matches);
  } catch (error) {
    res.status(500).json({ error: 'Kunde inte lägga till matcher' });
  }
});

// GET /api/matches - Hämta alla matcher
router.get('/', async (req, res) => {
  try {
    const matches = await Match.find();
    res.json(matches);
  } catch (error) {
    res.status(500).json({ error: 'Kunde inte hämta matcher' });
  }
});

// GET /api/matches/:id - Hämta en specifik match
router.get('/:id', async (req, res) => {
  console.log("ID mottaget:", req.params.id);  // Felsökningslogg
  try {
    const match = await Match.findById(req.params.id);
    if (!match) {
      return res.status(404).json({ error: 'Matchen hittades inte' });
    }
    res.json(match);
  } catch (error) {
    res.status(500).json({ error: 'Kunde inte hämta matchen' });
  }
});

// POST /api/matches - Skapa en ny match
router.post('/', async (req, res) => {
  try {
    const { teamA, teamB, date, time, odds } = req.body;
    const newMatch = new Match({ teamA, teamB, date, time, odds });
    await newMatch.save();
    res.status(201).json(newMatch);
  } catch (error) {
    res.status(500).json({ error: 'Kunde inte skapa match' });
  }
});

module.exports = router;
