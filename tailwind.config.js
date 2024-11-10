// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          DEFAULT: '#1a1a1a',   // Nästan svart bakgrundsfärg
          lighter: '#2a2a2a',  // Lättare nyans av mörkgrå
          lightest: '#3a3a3a', // Ytterligare ljusare nyans för variation
        },
      },
    },
  },
  plugins: [],
};
