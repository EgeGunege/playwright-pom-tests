import { test, expect, request } from '@playwright/test';

const url = 'https://rahulshettyacademy.com/AutomationPractice/';

test('Popup validations', async ({ page }) => {
  const displayText = page.locator('#displayed-text');
  const hideButton = page.locator('#hide-textbox');
  const alertConfirmButton = page.locator('#confirmbtn');
  const hoverButton = page.locator('#mousehover');
  const topButton = page.locator('a:has-text("top")');
  const framePage = page.frameLocator('#courses-iframe');
  const allAccess = framePage.locator('[href="lifetime-access"]');
  const subNumber = framePage.locator('[class="text"] h2 span');

  await page.goto(url);
  page.on('dialog', (dialog) => dialog.accept());

  await expect(displayText).toBeVisible();
  await hideButton.click();
  await expect(displayText).toBeHidden();

  await alertConfirmButton.click();

  // await hoverButton.hover()
  // await page.pause()
  // await topButton.hover()
  // await topButton.click()

  await allAccess.click();
  console.log(await subNumber.textContent());
});
