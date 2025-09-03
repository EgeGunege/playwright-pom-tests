// tests/more-validations.spec.js
import { test } from '@playwright/test';
import { MoreValidations } from '../page-objects/pages/more-validations-page.js';

test('Popup validations (POM)', async ({ page }) => {
  const mv = new MoreValidations(page);

  await mv.goTo(process.env.AUTOMATION_PRACTICE_URL);

  await mv.expectTextboxVisible();
  await mv.hideTextbox();
  await mv.expectTextboxHidden();

  await mv.clickConfirmAndAccept();

  // (Optional) Hover menüsünden "Top" tıkla
  // await mv.hoverAndClickTop();

  await mv.clickAllAccessInFrame();
  const subText = await mv.getSubscriptionNumberText();
  console.log('Subscription text:', subText);
});
