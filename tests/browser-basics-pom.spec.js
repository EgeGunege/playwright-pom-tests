import { test, expect } from '@playwright/test';
import { LoginPracticePage } from '../page-objects/pages/login-practice-page.js';

test('Control Browser tests', async ({ page }) => {
  const practice = new LoginPracticePage(page);

  await practice.goTo(process.env.LOGIN_PAGE_PRACTICE_URL);

  const domain = await practice.fillUsernameWithDomainFromDocs();

  await expect(practice.getElement('locator', practice.sel.username)).toHaveValue(domain);

  // console.log('Filled domain:', domain);
});
