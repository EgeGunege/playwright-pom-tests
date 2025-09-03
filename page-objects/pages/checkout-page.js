import { expect } from '@playwright/test';
import { Base } from '../utils/base';

export class CheckoutPage extends Base {
  constructor(page) {
    super(page);
    this.sel = {
      countryBox: "[placeholder*='Country']",
      canadaOption: 'Canada',
      usernameText: '.user__name label[type="text"]',
      placeOrderBtn: '.action__submit',
      thankyouMessage: '.hero-primary',
      orderNumber: 'label[class="ng-star-inserted"]',
    };
  }

  async placeOrder({ countryName, expectedUsername } = {}) {
    if (!countryName) throw new Error('countryName is required');

    const box = this.getElement('locator', this.sel.countryBox);
    await this.waitForElement(box, 'visible');
    await this.clickElement(box);

    await this.pressSequentially(box, countryName);

    const option = this.getElement('text', countryName);
    await this.waitForElement(option, 'visible');
    await this.clickElement(option);

    if (expectedUsername) {
      await expect(this.getElement('locator', this.sel.usernameText)).toHaveText(expectedUsername);
    }

    await this.clickElement(this.getElement('locator', this.sel.placeOrderBtn));
    await expect(this.getElement('locator', this.sel.thankyouMessage)).toHaveText(
      /thankyou for the order/i
    );

    const raw = await this.getTextContent(this.getElement('locator', this.sel.orderNumber));
    return raw
      .split(' ')
      .find((x) => x.trim().length > 1)
      ?.trim();
  }
}
