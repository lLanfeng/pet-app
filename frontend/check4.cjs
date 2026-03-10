const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Collect console errors
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });

  try {
    await page.goto('http://localhost:5300/', { waitUntil: 'networkidle', timeout: 20000 });

    const bodyText = await page.evaluate(() => document.body.innerText.substring(0, 600));
    console.log('Page content:');
    console.log(bodyText);

    if (errors.length > 0) {
      console.log('\nErrors:');
      errors.forEach(e => console.log('  -', e));
    }

  } catch (e) {
    console.error('Error:', e.message);
  }

  await browser.close();
})();
