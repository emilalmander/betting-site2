const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Importera routes
const authRoutes = require('./routes/authRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const matchRoutes = require('./routes/matchRoutes');
const guessRoutes = require('./routes/guessRoutes');
const groupRoutes = require('./routes/groupRoutes'); // Grupphanterings-routen


console.log('server.js loaded');

// Initiera express-appen
const app = express();

// Middleware för CORS-inställningar
app.use(cors({
  origin: 'http://localhost:3000', // Tillåt frontend att ansluta
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json()); // Middleware för att parsa JSON

// Använd routes
app.use('/api/auth', authRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/guesses', guessRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/groups', groupRoutes); // Grupphanterings-routen
app.use('/api/groups', require('./routes/groupRoutes'));


// Anslut till MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Enkel testroute för att säkerställa att servern fungerar
app.get('/test', (req, res) => {
  res.send('Server is working!');
});

// Hantera 404 (om ingen route matchar)
app.use((req, res, next) => {
  res.status(404).send('API endpoint not found.');
});
const cache = new Map();

app.get('/api/matches', async (req, res) => {
  try {
      const matches = await scrapeBasicMatchData();
      cache.clear(); // Rensa cachen
      cache.set('matches', matches); // Lägg till i cachen igen
      res.json(matches);
  } catch (error) {
      console.error('Error fetching matches:', error);
      res.status(500).send('Kunde inte hämta matcher');
  }
});


// Fånga upp serverfel
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Starta servern
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
