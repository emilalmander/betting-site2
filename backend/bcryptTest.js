const bcrypt = require('bcryptjs');

// Lösenord som vi ska hasha
const plainPassword = "4";

// Generera en hash och testa sedan bcrypt.compare
bcrypt.hash(plainPassword, 10, (err, hash) => {
  if (err) {
    console.error("Fel vid hashning:", err);
  } else {
    console.log("Genererad hash:", hash);

    // Testa jämförelsen direkt efter hashningen
    bcrypt.compare(plainPassword, hash, (err, isMatch) => {
      if (err) console.error("Fel vid bcrypt.compare:", err);
      else console.log("Matchar lösenordet?", isMatch); // Förväntat resultat: true
    });
  }
});
