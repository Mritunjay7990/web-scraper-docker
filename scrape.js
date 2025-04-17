const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
    headless: 'new',  // Use new headless mode
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--disable-software-rasterizer',
      '--disable-features=dbus',
      '--single-process'
    ],
    protocolTimeout: 120000,  // 2 minute timeout
    dumpio: true  // Enable logging
  });

  try {
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(120000);
    
    console.log(`Navigating to: ${process.env.SCRAPE_URL}`);
    await page.goto(process.env.SCRAPE_URL, {
      waitUntil: 'networkidle0',
      timeout: 120000
    });

    const data = {
      url: process.env.SCRAPE_URL,
      title: await page.title(),
      headings: await page.evaluate(() => 
        Array.from(document.querySelectorAll('h1, h2, h3'))
          .map(el => el.textContent.trim())
          .filter(Boolean)
      ),
      timestamp: new Date().toISOString()
    };

    fs.writeFileSync('/app/scraped_data.json', JSON.stringify(data, null, 2));
    console.log('Scraping completed successfully');
  } catch (error) {
    console.error('Scraping failed:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
