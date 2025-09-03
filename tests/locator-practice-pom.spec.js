import { test, expect } from '@playwright/test';
import { LocatorPracticePage } from '../page-objects/pages/locator-practice-page.js';

test('Playwright special locators with POM', async ({ page }) => {
  const practice = new LocatorPracticePage(page);

  await practice.goTo(process.env.LOCATOR_PRACTICE_URL);

  await practice.fillForm({ gender: 'Female', password: 'abc123' });
  await practice.submitForm();

  await practice.navigateToShop();
  await practice.addProductToCart('Nokia Edge');
});
