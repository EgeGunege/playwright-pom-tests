import { Base } from '../utils/base';
import { expect } from '@playwright/test';

export class OrdersPage extends Base {
  constructor(page) {
    super(page);
    this.sel = {
      orderRow: 'tr[class="ng-star-inserted"]',
      summaryTitle: "[class='email-title']",
      viewBtnInRow: 'td button:has-text("View")',
      orderIdCell: 'th',
    };
  }

  async openOrderById(orderNumber) {
    const rows = this.getElement('locator', this.sel.orderRow);

    await this.waitForFirst(rows);

    const count = await rows.count();
    for (let i = 0; i < count; i++) {
      const row = this.getNth(rows, i);

      const cellText = await this.getTextContent(
        this.getElement('locator', this.sel.orderIdCell, {}, row)
      );

      if (cellText.trim() === orderNumber) {
        await this.clickElement(this.getElement('locator', this.sel.viewBtnInRow, {}, row));
        return;
      }
    }
    throw new Error(`Order ${orderNumber} not found in Orders table`);
  }

  async expectOrderSummaryTitle() {
    await expect(this.getElement('locator', this.sel.summaryTitle)).toHaveText(' order summary ');
  }
}
