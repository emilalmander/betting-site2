const bcrypt = require('bcryptjs');

bcrypt.hash('1', 10, (err, hash) => {
  if (err) console.error(err);
  else console.log("Manuellt genererad hash för '1':", hash);
});