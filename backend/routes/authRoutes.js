const express = require('express');
const { register, login, profile } = require('../controllers/authController'); // Lägg till `profile` i importen

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', profile); // Route för att hämta profildata

module.exports = router;
