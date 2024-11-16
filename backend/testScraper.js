const puppeteer = require('puppeteer');

let cachedMatches = null;

const getMatches = async () => {
  try {
    console.log("Hämtar nya matcher från scraper...");
    cachedMatches = await scrapeBasicMatchData(); // Kör alltid scrapern
    console.log("Scrapade matcher:", cachedMatches);
    return cachedMatches;
  } catch (error) {
    console.error("Error fetching matches:", error);
    throw error;
  }
};

module.exports = { getMatches };
