const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Go directly to /home
    await page.goto('http://localhost:5300/home', { waitUntil: 'networkidle', timeout: 15000 });

    const bodyText = await page.evaluate(() => document.body.innerText.substring(0, 600));
    console.log('Content at /home:');
    console.log(bodyText);

  } catch (e) {
    console.error('Error:', e.message);
  }

  await browser.close();
})();
