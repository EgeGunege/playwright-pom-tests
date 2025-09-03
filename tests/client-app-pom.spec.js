import { test } from '@playwright/test';
import { POManager } from '../page-objects/po-manager.js';

test('Client app test', async ({ page }) => {
  const po = new POManager(page);
  const itemName = 'ZARA COAT 3';

  // navigate and login
  await po.login.goTo(process.env.CLIENT_URL);
  await po.login.validLogin(process.env.USER, process.env.PASS);
  await po.login.waitForLoadState('networkidle');

  // add product and go to cart
  await po.dashboard.addProductToCart(itemName);
  await po.dashboard.navigateToMenuLinks('cart');

  await po.cart.expectItemInCart(itemName);
  await po.cart.clickCheckout();

  // place order
  const orderNumber = await po.checkout.placeOrder({
    countryName: 'Canada',
    expectedUsername: process.env.USER,
  });

  // verify in orders
  await po.dashboard.navigateToMenuLinks('orders');
  await po.orders.openOrderById(orderNumber);
  await po.orders.expectOrderSummaryTitle();
});
