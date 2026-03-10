const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    await page.goto('http://localhost:5200/', { waitUntil: 'networkidle', timeout: 15000 });

    const bodyText = await page.evaluate(() => document.body.innerText.substring(0, 800));
    console.log('Page content:');
    console.log(bodyText);

  } catch (e) {
    console.error('Error:', e.message);
  }

  await browser.close();
})();
