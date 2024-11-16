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
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Blockera onödiga resurser för snabbare laddning
  await page.setRequestInterception(true);
  page.on('request', (request) => {
    const blockedResources = ['image', 'stylesheet', 'font', 'media'];
    if (blockedResources.includes(request.resourceType())) {
      request.abort();
    } else {
      request.continue();
    }
  });

  await page.goto(`https://www.flashscore.se/match/${matchId}/#/matchsummering/matchsummering`, {
    waitUntil: 'domcontentloaded',
  });

  // Vänta lite extra för att säkerställa att sidan laddas klart
  await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 3000)));

  const details = await page.evaluate(() => {
    const oddsWrapper = document.querySelector('.oddsWrapper');
    const getOdds = () => {
      if (!oddsWrapper) return { teamA: 'N/A', draw: 'N/A', teamB: 'N/A' };
      const cellWrappers = oddsWrapper.querySelectorAll('.cellWrapper');
      const oddsArray = Array.from(cellWrappers).map(wrapper => {
        const oddsValueInner = wrapper.querySelector('.oddsValueInner');
        return oddsValueInner ? oddsValueInner.textContent.trim() : 'N/A';
      });
      return {
        teamA: oddsArray[0] || 'N/A',
        draw: oddsArray[1] || 'N/A',
        teamB: oddsArray[2] || 'N/A',
      };
    };

    return {
      teamA: document.querySelector('.duelParticipant__home .participant__participantName')?.textContent.trim() || 'N/A',
      teamB: document.querySelector('.duelParticipant__away .participant__participantName')?.textContent.trim() || 'N/A',
      dateTime: document.querySelector('.duelParticipant__startTime')?.textContent.trim() || 'N/A',
      odds: getOdds(),
    };
  });

  console.log("Scraped Match Details:", details);

  await browser.close();
  return details;
};

module.exports = { scrapeBasicMatchData, scrapeMatchDetails };
