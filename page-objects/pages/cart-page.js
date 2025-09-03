import { expect } from '@playwright/test';
import { Base } from '../utils/base';

export class CartPage extends Base {
  constructor(page) {
    super(page);
    this.sel = {
      cartSection: '[class="cartSection"]',
      itemTitle: 'h3',
      checkoutButton: "button:has-text('Checkout')",
    };
  }

  async expectItemInCart(itemName) {
    const section = this.getElement('locator', this.sel.cartSection);
    const title = this.getElement('locator', this.sel.itemTitle, {}, section);

    await this.waitForFirst(title);
    await expect(title).toContainText(itemName);
  }

  async clickCheckout() {
    await this.clickElement(this.getElement('locator', this.sel.checkoutButton));
  }
}
