import { LoginPage } from './pages/login-page.js';
import { DashboardPage } from './pages/dashboard-page.js';
import { CartPage } from './pages/cart-page.js';
import { CheckoutPage } from './pages/checkout-page.js';
import { OrdersPage } from './pages/orders-page.js';

/**
 * Page Object Manager
 *
 * Single entry point to access all page objects.
 * - ESM (import/export)
 * - Lazy initialization: creates each POM only when accessed
 * - Recommended: one instance per test
 */
export class POManager {
  /**
   * @param {import('@playwright/test').Page} page - Playwright Page instance
   */
  constructor(page) {
    /** @private */ this.page = page;

    /** @private */ this._login = undefined;
    /** @private */ this._dashboard = undefined;
    /** @private */ this._cart = undefined;
    /** @private */ this._checkout = undefined;
    /** @private */ this._orders = undefined;
  }

  /** @returns {LoginPage} */
  get login() {
    return (this._login ??= new LoginPage(this.page));
  }

  /** @returns {DashboardPage} */
  get dashboard() {
    return (this._dashboard ??= new DashboardPage(this.page));
  }

  /** @returns {CartPage} */
  get cart() {
    return (this._cart ??= new CartPage(this.page));
  }

  /** @returns {CheckoutPage} */
  get checkout() {
    return (this._checkout ??= new CheckoutPage(this.page));
  }

  /** @returns {OrdersPage} */
  get orders() {
    return (this._orders ??= new OrdersPage(this.page));
  }

  /** @returns {LoginPage} */
  getLoginPage() {
    return this.login;
  }
  /** @returns {DashboardPage} */
  getDashboardPage() {
    return this.dashboard;
  }
  /** @returns {CartPage} */
  getCartPage() {
    return this.cart;
  }
  /** @returns {CheckoutPage} */
  getCheckoutPage() {
    return this.checkout;
  }
  /** @returns {OrdersPage} */
  getOrdersPage() {
    return this.orders;
  }

  /**
   * Clear cached POM instances while keeping the same Page.
   * Useful after significant navigation/auth changes.
   */
  reset() {
    this._login = this._dashboard = this._cart = this._checkout = this._orders = undefined;
  }
}
