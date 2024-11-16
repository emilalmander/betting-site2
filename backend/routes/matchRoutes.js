const express = require('express');
const router = express.Router();
const Match = require('../models/Match');
const { scrapeBasicMatchData, scrapeMatchDetails } = require('../scraper/scraper');



let cachedMatches = null; // Cache för matcherna
let lastCacheTime = null; // Tid när cachen senast uppdaterades
const CACHE_DURATION = 5 * 60 * 1000; // 5 minuter


router.get('/scrape', async (req, res) => {
  try {
    const matches = await scrapeBasicMatchData();
    res.json(matches);
  } catch (error) {
    console.error('Error scraping matches:', error);
    res.status(500).json({ error: 'Kunde inte scrapea matcher' });
  }
});




// Route för att hämta alla matcher
router.get('/', async (req, res) => {
  try {
    const currentTime = Date.now();
    
    // Kontrollera om cachen är giltig
    if (cachedMatches && (currentTime - lastCacheTime) < CACHE_DURATION) {
      console.log('Använder cachade matcher');
      return res.json(cachedMatches);
    }

    console.log('Hämtar nya matcher från scraper...');
    const matches = await scrapeBasicMatchData();

    // Uppdatera cache
    cachedMatches = matches;
    lastCacheTime = currentTime;

    res.json(matches);
  } catch (error) {
    console.error('Error fetching matches:', error);
    res.status(500).json({ error: 'Kunde inte hämta matcher' });
  }
});

// Hämta detaljer för en specifik match
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const matchDetails = await scrapeMatchDetails(id); // Hämta detaljer från scraper
    res.json(matchDetails);
  } catch (error) {
    console.error(`Error fetching details for match ${id}:`, error);
    res.status(500).json({ error: 'Kunde inte hämta matchdetaljer' });
  }
});
router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const guesses = await Guess.find({ userId });
    res.json({ totalGuesses: guesses.length });
  } catch (error) {
    console.error('Error fetching user guesses:', error);
    res.status(500).json({ error: 'Kunde inte hämta gissningar' });
  }
});
router.get('/leaderboard/user/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const guesses = await Guess.find({ userId });
    const totalPoints = guesses.reduce((sum, guess) => sum + guess.points, 0);
    res.json({ totalPoints });
  } catch (error) {
    console.error('Error fetching user points:', error);
    res.status(500).json({ error: 'Kunde inte hämta poäng' });
  }
});
router.get('/history', async (req, res) => {
  try {
    const matches = await Match.find({ date: { $lt: new Date() } }); // Matcher innan dagens datum
    res.json(matches);
  } catch (error) {
    console.error('Error fetching match history:', error);
    res.status(500).json({ error: 'Kunde inte hämta matchhistorik' });
  }
});


module.exports = router;
