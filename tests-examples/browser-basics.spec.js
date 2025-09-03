import { test, expect } from '@playwright/test';

test.only('Control Browser tests', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  const blinkingText = page.locator('[href*="documents-request"]');
  await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
  const userName = page.locator('#username');
  const [newPage] = await Promise.all([context.waitForEvent('page'), blinkingText.click()]);
  const domain = (await newPage.locator('.red').textContent()).split('@')[1].split(' ')[0];
  await userName.fill(domain);
  console.log(await userName.textContent());
});
