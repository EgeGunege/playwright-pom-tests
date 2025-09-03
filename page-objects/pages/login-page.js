import { Base } from '../utils/base.js';

export class LoginPage extends Base {
  constructor(page) {
    super(page);
    this.sel = {
      email: '#userEmail',
      password: '#userPassword',
      signBtn: '[value="Login"]',
    };
  }

  /**
   * Perform valid login
   * @param {string} userName
   * @param {string} password
   */
  async validLogin(userName, password) {
    await this.fillElement(this.getElement('locator', this.sel.email), userName);
    await this.fillElement(this.getElement('locator', this.sel.password), password);
    await this.clickElement(this.getElement('locator', this.sel.signBtn));
  }
}
