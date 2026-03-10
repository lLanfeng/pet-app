const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Collect console messages
  const logs = [];
  page.on('console', msg => logs.push(`[${msg.type()}] ${msg.text()}`));

  try {
    await page.goto('http://localhost:5174/', { waitUntil: 'networkidle', timeout: 15000 });

    // Get page title
    const title = await page.title();
    console.log('Page title:', title);

    // Check for specific elements
    const hasNewContent = await page.evaluate(() => {
      const body = document.body.innerText || '';
      return body.includes('萌宠家园') || body.includes('宠友社区');
    });

    console.log('Has new content:', hasNewContent);

    // Print first 500 chars of body
    const bodyText = await page.evaluate(() => document.body.innerText.substring(0, 500));
    console.log('\nPage content preview:');
    console.log(bodyText);

  } catch (e) {
    console.error('Error:', e.message);
  }

  // Print logs
  if (logs.length > 0) {
    console.log('\nConsole logs:');
    logs.forEach(l => console.log(l));
  }

  await browser.close();
})();
