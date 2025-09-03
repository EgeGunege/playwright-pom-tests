import { Base } from '../utils/base.js';
import { expect } from '@playwright/test';

export class LoginPracticePage extends Base {
  constructor(page) {
    super(page);
    this.sel = {
      blinkingLink: '[href*="documents-request"]',
      username: '#username',
      redText: '.red',
    };
  }

  /** Clicks the blinking link and returns the popup Page */
  async openDocsPopup() {
    const [popup] = await Promise.all([
      this.page.waitForEvent('popup'),
      this.clickElement(this.getElement('locator', this.sel.blinkingLink)),
    ]);
    return popup;
  }

  /** Reads the red text in the given popup and extracts domain (after '@') */
  async extractDomainFromPopup(popup) {
    const red = this.getElement('locator', this.sel.redText, {}, popup);
    await this.waitForElement(red, 'visible');
    const raw = await this.getTextContent(red);

    const afterAt = (raw ?? '').split('@')[1] ?? '';
    const domain = afterAt.split(/\s+/)[0] ?? '';
    if (!domain) throw new Error('Domain could not be parsed from popup text');
    return domain;
  }

  /** Fills the username field with the provided value */
  async fillUsername(value) {
    const user = this.getElement('locator', this.sel.username);
    await this.waitForElement(user, 'visible');
    await this.fillElement(user, value);
    await expect(user).toHaveValue(value);
  }

  /** Convenience: does the whole flow and fills the username with parsed domain */
  async fillUsernameWithDomainFromDocs() {
    const popup = await this.openDocsPopup();
    const domain = await this.extractDomainFromPopup(popup);
    await this.fillUsername(domain);
    return domain;
  }
}
