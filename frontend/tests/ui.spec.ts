import { test, expect } from '@playwright/test';

test('full UI flow', async ({ page }, testInfo) => {
  page.on('pageerror', err => {
    // eslint-disable-next-line no-console
    console.error('PAGEERROR', err);
  });
  page.on('console', msg => {
    if (msg.type() === 'error') {
      // eslint-disable-next-line no-console
      console.error('CONSOLE', msg.text());
    }
  });
  const phone = `139${Math.floor(10000000 + Math.random() * 89999999)}`;
  const nickname = 'UI测试用户';
  const password = 'TestPass123';

  // Register
  await page.goto('/register');
  await page.getByPlaceholder('请输入手机号').fill(phone);
  await page.getByPlaceholder('请输入昵称').fill(nickname);
  await page.getByPlaceholder('请输入密码（至少6位）').fill(password);
  await page.getByPlaceholder('确认密码').fill(password);
  page.on('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: '注册' }).click();

  // Go home (registration navigates via alert, but ensure we land on home)
  await page.waitForTimeout(800);
  await page.goto('/');
  await page.waitForSelector('#app');
  if (await page.locator('.home-container').count() === 0) {
    await page.goto('/login');
    await page.getByRole('button', { name: '立即体验' }).click();
    await page.waitForTimeout(800);
    await page.goto('/');
  }
  const homeCount = await page.locator('.home-container').count();
  if (homeCount === 0) {
    const html = await page.content();
    await testInfo.attach('page.html', { body: html, contentType: 'text/html' });
    await page.screenshot({ path: testInfo.outputPath('page.png'), fullPage: true });
    throw new Error('Home container not found');
  }

  // Go to pets list
  await page.locator('.action-item', { hasText: '我的宠物' }).click();
  await page.waitForURL('**/pets');

  // Add pet
  await page.getByText('添加').click();
  await page.waitForURL('**/pets/add');
  await page.getByPlaceholder('给你的宠物起个名字').fill('小团子');
  await page.getByRole('button', { name: /创建宠物/ }).click();
  await page.waitForTimeout(1000);
  await page.goBack();

  // Go to shop
  await page.goto('/shop');
  await expect(page.getByText('宠物商店')).toBeVisible();

  // Buy first product
  const buyButtons = page.getByText('购买');
  await buyButtons.first().click();
  await page.getByRole('button', { name: '确认购买' }).click();

  // Open inventory tab
  await page.getByText('背包').click();
  await expect(page.getByText('我的背包')).toBeVisible();

  // Select first pet chip
  const petChip = page.locator('.pet-chip').first();
  await petChip.click();

  // Use first inventory item if exists
  const useButtons = page.getByText('使用');
  if (await useButtons.count()) {
    await useButtons.first().click();
  }

  // Go to tasks
  await page.goto('/tasks');
  await expect(page.getByText('每日任务')).toBeVisible();

  // Go to achievements
  await page.goto('/achievements');
  await expect(page.getByText('成就系统')).toBeVisible();
});
