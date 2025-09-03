import { Base } from '../utils/base.js';
import { expect } from '@playwright/test';

export class MoreValidations extends Base {
  constructor(page) {
    super(page);
    this.sel = {
      // main page
      displayedText: '#displayed-text',
      hideTextboxBtn: '#hide-textbox',
      confirmBtn: '#confirmbtn',
      hoverBtn: '#mousehover',
      topLink: { type: 'role', value: 'link', opts: { name: /top/i } },

      // iframe & inside
      frame: '#courses-iframe',
      allAccessLink: { type: 'role', value: 'link', opts: { name: /All Access plan/i } },
      subNumber: '.text h2 span',
    };
  }

  /** Expect visible textbox */
  async expectTextboxVisible() {
    await expect(this.getElement('locator', this.sel.displayedText)).toBeVisible();
  }

  /** Hide textbox via button */
  async hideTextbox() {
    await this.clickElement(this.getElement('locator', this.sel.hideTextboxBtn));
  }

  /** Expect textbox hidden */
  async expectTextboxHidden() {
    await expect(this.getElement('locator', this.sel.displayedText)).toBeHidden();
  }

  /** Click confirm and accept the dialog (generic handler from Base) */
  async clickConfirmAndAccept() {
    await this.handleNextDialog(
      () => this.clickElement(this.getElement('locator', this.sel.confirmBtn)),
      { accept: true }
    );
  }

  /** Hover the hover button and click "Top" */
  async hoverAndClickTop() {
    await this.hoverElement(this.getElement('locator', this.sel.hoverBtn));
    const { type, value, opts } = this.sel.topLinkRole;
    await this.clickElement(this.getElement(type, value, opts));
  }

  /** Click "All Access" link inside iframe */
  async clickAllAccessInFrame() {
    const { type, value, opts } = this.sel.allAccessLink;
    await this.clickInFrame(this.sel.frame, type, value, opts);
  }

  /** Get subscription number text inside iframe */
  async getSubscriptionNumberText() {
    return await this.getTextInFrame(this.sel.frame, 'locator', this.sel.subNumber);
  }
}
