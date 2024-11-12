const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register function
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Kontrollera om användaren redan finns
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hasha lösenordet innan sparning
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashat lösenord vid registrering:", hashedPassword);

    // Skapa ny användare med hashat lösenord
    user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    console.error("Fel vid registrering:", error);
    res.status(500).json({ message: 'Registration failed', error });
  }
};

// Login function
exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log("Inloggningsförsök med e-post:", email);
  
      const user = await User.findOne({ email });
      if (!user) {
        console.log("Användare hittades inte");
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      console.log("Användare hittad:", user.email);
      console.log("Lösenord i databasen (hash):", user.password);
      console.log("Inmatat lösenord:", password);
  
      const isMatch = await bcrypt.compare(password, user.password);
      console.log("Lösenord matchar:", isMatch);
  
      if (!isMatch) {
        console.log("Lösenordet matchar inte");
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });
      console.log("Inloggning lyckades, token genererad:", token);
  
      res.json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (error) {
      console.error("Fel under inloggning:", error);
      res.status(500).json({ message: 'Login failed', error });
    }
  };
  
  exports.profile = async (req, res) => {
    try {
      const token = req.headers.authorization.split(' ')[1];  // Hämta token från headern
      const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Verifiera token med JWT_SECRET
  
      const user = await User.findById(decoded.id).select('-password');  // Hämta användaren utan lösenordet
      if (!user) {
        return res.status(404).json({ message: 'Användare hittades inte' });
      }
      res.json({ user });
    } catch (error) {
      console.error('Kunde inte hämta profilinfo', error);
      res.status(500).json({ message: 'Serverfel', error });
    }
  };