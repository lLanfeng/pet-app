const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    await page.goto('http://localhost:5500/', { waitUntil: 'networkidle', timeout: 20000 });

    const bodyText = await page.evaluate(() => document.body.innerText.substring(0, 600));
    console.log('Page content:');
    console.log(bodyText);

    const hasTabBar = await page.evaluate(() => document.querySelector('.tab-bar') !== null);
    console.log('\nHas TabBar:', hasTabBar);

  } catch (e) {
    console.error('Error:', e.message);
  }

  await browser.close();
})();
