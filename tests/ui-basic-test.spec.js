import { test, expect } from '@playwright/test';

test('First Playwright test', async ({ page }) => {
  await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
  const usernameBox = page.locator('#username');
  const passwordBox = page.locator('[type="password"]');
  const signButton = page.locator('#signInBtn');
  const cardTitles = page.locator('.card-body a');
  const dropDown = page.locator('select[class="form-control"]');
  const adminRadio = page.locator('.radiotextsty').first();
  const userRadio = page.locator('.radiotextsty').last();
  const okayButton = page.locator('#okayBtn');
  const checkBox = page.locator('#terms');
  const blinkingText = page.locator('[href*="documents-request"]');

  await usernameBox.fill('rahulshettyacademy');
  await passwordBox.fill('learning');
  await dropDown.selectOption('consult');
  await userRadio.click();
  await okayButton.click();
  await expect(userRadio).toBeChecked();
  await checkBox.click();
  await expect(checkBox).toBeChecked();
  await checkBox.uncheck();
  expect(await checkBox.isChecked()).toBeFalsy(); //await expect(checkBox).not.toBeChecked();
  await expect(blinkingText).toHaveAttribute('class', 'blinkingText');

  // await signButton.click()
  // const firstCardTitle = await page.locator('.card-body a').nth(0);
  // console.log(await firstCardTitle.textContent());
  // await page.waitForLoadState('networkidle')
  // const cardTitleStrings = cardTitles.allTextContents()
  // console.log(cardTitleStrings[1])
});
