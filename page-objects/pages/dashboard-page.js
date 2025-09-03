import { Base } from '../utils/base';

export class DashboardPage extends Base {
  constructor(page) {
    super(page);
    this.sel = {
      home: '[routerlink*="dashboard"]',
      cart: '[routerlink*="cart"]',
      orders: 'button[routerlink*="myorders"]',
      cardBodies: '.card-body',
    };
  }

  async navigateToMenuLinks(menuLink) {
    const links = { home: this.sel.home, orders: this.sel.orders, cart: this.sel.cart };
    const locator = this.getElement('locator', links[menuLink] ?? this.sel.home);
    await this.clickElement(locator);
  }

  async signOut() {
    const locator = this.getElement('role', 'button', { name: 'Sign Out' });
    await this.clickElement(locator);
  }

  async addProductToCart(productName) {
    const cards = this.getElement('locator', this.sel.cardBodies);

    await this.waitForFirst(cards);

    const card = cards.filter({
      has: this.getElement('role', 'heading', { name: productName }),
    });

    const count = await card.count();
    if (count === 0) throw new Error(`Product not found: ${productName}`);
    if (count > 1) throw new Error(`Multiple products found with name: ${productName}`);

    await this.waitForFirst(card);

    const addBtn = this.getElement('role', 'button', { name: /add to cart/i }, card.first());
    await this.clickElement(addBtn);
  }
}
