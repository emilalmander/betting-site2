const express = require('express');
const router = express.Router();
const Guess = require('../models/Guess');
const Match = require('../models/Match'); // Din matchmodell
const mongoose = require('mongoose');
const { scrapeBasicMatchData } = require('../scraper/scraper');

let cachedMatches = null; // Cache för alla matcher
let lastScrapeTime = null; // Tidpunkt för senaste scraping
const CACHE_DURATION = 60 * 60 * 1000; // 1 timme

console.log('guessRoutes loaded');


// Skapa gissning
router.post('/', async (req, res) => {
  console.log('Data mottagen från frontend:', req.body);
  try {
    const { matchId, userId, exactScore, winningTeam, totalGoals } = req.body;

    console.log('Kontrollerar om matchId är giltigt...');
    const match = await Match.findOne({ matchId });
    if (!match) {
      console.error(`Ingen match hittades för matchId: ${matchId}`);
      return res.status(400).json({ error: 'Ogiltigt matchId' });
    }

    console.log('Hittad match:', match);

    const existingGuess = await Guess.findOne({ user: userId, match: match._id });
    if (existingGuess) {
      console.error('Användaren har redan gjort en gissning:', existingGuess);
      return res.status(400).json({ error: 'Du har redan gjort en gissning för denna match.' });
    }

    const newGuess = new Guess({
      match: match._id,
      user: userId,
      exactScore,
      winningTeam,
      totalGoals,
    });

    console.log('Försöker spara ny gissning:', newGuess);
    await newGuess.save();
    console.log('Ny gissning sparad:', newGuess);

    res.status(201).json(newGuess);
  } catch (error) {
    console.error('Fel vid sparning av gissning:', error.message, error.stack);
    res.status(500).json({ error: 'Kunde inte skapa gissning', details: error.message });
  }
});

router.get('/user/:userId/ongoing', async (req, res) => {
  try {
    const { userId } = req.params;

    // Hämta alla gissningar för användaren och populera match
    const guesses = await Guess.find({ user: userId }).populate('match').exec();

    // Filtrera endast gissningar med en giltig match och en framtida `dateTime`
    const ongoingGuesses = guesses.filter(
      (guess) => guess.match && new Date(guess.match.dateTime) > new Date()
    );

    res.json(ongoingGuesses);
  } catch (error) {
    console.error('Kunde inte hämta pågående gissningar:', error);
    res.status(500).json({ error: 'Kunde inte hämta pågående gissningar' });
  }
});

// Kontrollera om en användare redan gissat för en specifik match
router.get('/check/:userId/:matchId', async (req, res) => {
  try {
    const { userId, matchId } = req.params;

    // Kontrollera om matchen finns
    let match = await Match.findOne({ matchId });
    if (!match) {
      console.warn(`Match med matchId ${matchId} hittades inte. Försöker lägga till från skrapning...`);

      // Försök att skrapa matchdetaljer och lägga till den i databasen
      const scrapedMatch = await scrapeMatchDetails(matchId);
      if (scrapedMatch) {
        match = await Match.create({
          matchId,
          teamA: scrapedMatch.teamA,
          teamB: scrapedMatch.teamB,
          dateTime: scrapedMatch.dateTime,
          odds: scrapedMatch.odds,
        });
        console.log('Ny match tillagd:', match);
      } else {
        console.error(`Match med matchId ${matchId} kunde inte skrapas.`);
        return res.status(400).json({ error: 'Ogiltigt matchId' });
      }
    }

    // Kontrollera om användaren redan har gissat på matchen
    const guess = await Guess.findOne({ user: userId, match: match._id });
    res.json({ exists: !!guess, guessId: guess?._id || null });
  } catch (error) {
    console.error('Kunde inte kontrollera gissning:', error);
    res.status(500).json({ error: 'Kunde inte kontrollera gissning', details: error.message });
  }
});

// Poängberäkning
function calculatePoints(guess, matchResult) {
  let points = 0;

  if (
    guess.exactScore.teamA === matchResult.teamA &&
    guess.exactScore.teamB === matchResult.teamB
  ) {
    points += 10;
  } else if (
    guess.winningTeam === (matchResult.teamA > matchResult.teamB ? 'teamA' : 'teamB')
  ) {
    points += 5;
  }

  const actualMargin = Math.abs(matchResult.teamA - matchResult.teamB);
  if (guess.winMargin === actualMargin) {
    points += 3;
  }

  const actualTotalGoals = matchResult.teamA + matchResult.teamB;
  if (Math.abs(guess.totalGoals - actualTotalGoals) <= 2) {
    points += 2;
  }

  return points;
}
router.put('/:guessId', async (req, res) => {
  try {
    const { guessId } = req.params;
    const { exactScore, winningTeam, totalGoals } = req.body;

    // Hämta och uppdatera gissningen
    const updatedGuess = await Guess.findByIdAndUpdate(
      guessId,
      { exactScore, winningTeam, totalGoals },
      { new: true } // Returnera den uppdaterade gissningen
    );

    if (!updatedGuess) {
      return res.status(404).json({ error: 'Gissning hittades inte.' });
    }

    res.status(200).json(updatedGuess);
  } catch (error) {
    console.error('Kunde inte uppdatera gissning:', error);
    res.status(500).json({ error: 'Kunde inte uppdatera gissning', details: error.message });
  }
});
// Uppdatera poängen för en gissning
router.put('/update-points/:guessId', async (req, res) => {
  try {
    const guessId = req.params.guessId.trim();
    const { matchResult } = req.body;

    const guess = await Guess.findById(guessId);
    if (!guess) {
      return res.status(404).json({ error: 'Gissning hittades inte' });
    }

    guess.pointsEarned = calculatePoints(guess, matchResult);
    await guess.save();

    res.json(guess);
  } catch (error) {
    console.error('Kunde inte uppdatera poäng:', error);
    res.status(500).json({ error: 'Kunde inte uppdatera poäng' });
  }
});

module.exports = router;
