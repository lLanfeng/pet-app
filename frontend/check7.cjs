const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    await page.goto('http://localhost:5300/', { waitUntil: 'networkidle', timeout: 20000 });

    // Check for TabBar
    const hasTabBar = await page.evaluate(() => {
      return document.querySelector('.tab-bar') !== null;
    });
    console.log('Has TabBar:', hasTabBar);

    // Check HTML structure
    const html = await page.content();
    console.log('\nApp div content:');
    console.log(html.substring(html.indexOf('<div id="app"'), html.indexOf('</div>', html.indexOf('<div id="app"')) + 200));

  } catch (e) {
    console.error('Error:', e.message);
  }

  await browser.close();
})();
