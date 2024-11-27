const puppeteer = require('puppeteer');


const scrapeBasicMatchData = async () => {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('https://www.flashscore.se/handboll/', { waitUntil: 'networkidle2' });

    const matches = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.event__match')).map((match) => ({
        
        matchId: match.id.split('_')[2],
        teamA: match.querySelector('.event__participant--home')?.textContent.trim() || 'N/A',
        teamB: match.querySelector('.event__participant--away')?.textContent.trim() || 'N/A',
        time: match.querySelector('.event__time')?.textContent.trim() || 'N/A',
        date: new Date().toLocaleDateString(),
        // odds tas bort
      }));
    });

    console.log("Scraped matches:", matches);

    await browser.close();
    console.log("Browser closed after scrapeBasicMatchData...");

    return matches;
  } catch (error) {
    console.error('Error in scrapeBasicMatchData:', error);
    throw error;
  }
};


const scrapeMatchDetails = async (matchId) => {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(`https://www.flashscore.se/match/${matchId}`, { waitUntil: 'domcontentloaded' });

    const details = await page.evaluate(() => {
      const teamA = document.querySelector('.duelParticipant__home .participant__participantName')?.textContent.trim();
      const teamB = document.querySelector('.duelParticipant__away .participant__participantName')?.textContent.trim();
      const dateTime = document.querySelector('.duelParticipant__startTime')?.textContent.trim();

      if (!teamA || !teamB || !dateTime) {
        return null; // Returnera null om data saknas
      }

      return { teamA, teamB, dateTime };
    });

    await browser.close();
    if (!details) {
      throw new Error('Scraping misslyckades. Data saknas.');
    }

    return { matchId, ...details };
  } catch (error) {
    console.error('Error in scrapeMatchDetails:', error);
    throw error;
  }
};

module.exports = { scrapeBasicMatchData, scrapeMatchDetails };
