import { Base } from '../utils/base.js';

export class LocatorPracticePage extends Base {
  constructor(page) {
    super(page);
    this.sel = {
      icecreamLabel: 'Check me out if you Love IceCreams!',
      employedLabel: 'Employed',
      genderLabel: 'Gender',
      passwordPh: 'Password',
      submitBtnRole: { role: 'button', opts: { name: 'Submit' } },
      shopLinkRole: { role: 'link', opts: { name: 'Shop' } },
      productCards: 'app-card',
    };
  }

  async fillForm({ gender = '', password = '' } = {}) {
    await this.checkElement(this.getElement('label', this.sel.icecreamLabel));
    await this.checkElement(this.getElement('label', this.sel.employedLabel));
    await this.selectElement(this.getElement('label', this.sel.genderLabel), gender);
    await this.fillElement(this.getElement('placeholder', this.sel.passwordPh), password);
  }

  async submitForm() {
    const { role, opts } = this.sel.submitBtnRole;
    await this.clickElement(this.getElement('role', role, opts));
  }

  async navigateToShop() {
    const { role, opts } = this.sel.shopLinkRole;
    await this.clickElement(this.getElement('role', role, opts));
  }

  async addProductToCart(productName) {
    const cards = this.getElement('locator', this.sel.productCards);
    const card = cards.filter({ has: this.getElement('text', productName) });
    await this.clickElement(this.getElement('role', 'button', {}, card));
  }
}
