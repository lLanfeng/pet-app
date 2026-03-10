const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const logs = [];
  const errors = [];

  page.on('console', msg => {
    logs.push(`[${msg.type()}] ${msg.text()}`);
    if (msg.type() === 'error') errors.push(msg.text());
  });

  page.on('pageerror', err => errors.push(err.message));

  try {
    await page.goto('http://localhost:5300/', { waitUntil: 'networkidle', timeout: 20000 });

    console.log('All console logs:');
    logs.forEach(l => console.log(l));

    if (errors.length > 0) {
      console.log('\nErrors:');
      errors.forEach(e => console.log('  ERROR:', e));
    }

  } catch (e) {
    console.error('Page error:', e.message);
  }

  await browser.close();
})();
