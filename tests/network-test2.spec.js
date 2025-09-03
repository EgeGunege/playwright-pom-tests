import { test, expect, request } from '@playwright/test';
import { APIUtils } from '../page-objects/utils/api-utils.js';

let token = '';

test.beforeAll(async () => {
  const apiUrl = 'https://rahulshettyacademy.com/api/ecom/auth/login';
  const username = 'anshika@gmail.com';
  const password = 'Iamking@000';
  const apiContext = await request.newContext();
  const apiUtils = new APIUtils(apiContext);
  token = await apiUtils.getToken(apiUrl, username, password);
});

test('Security test request interception', async ({ page }) => {
  const viewButton = page.locator("button:has-text('View')");
  const myOrders = page.locator('button[routerlink*="myorders"]');
  const errorMessage = page.locator('[class="blink_me"]');

  page.addInitScript((value) => {
    window.localStorage.setItem('token', value);
  }, token);

  await page.goto('https://rahulshettyacademy.com/client/');

  const routeApiUrl = 'https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=*';
  const routeFakeApiUrl =
    'https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=68b5b60df669d6cb0aac25e2';
  await page.route(routeApiUrl, async (route) => {
    route.continue({ url: routeFakeApiUrl });
  });
  await myOrders.click();
  await viewButton.first().click();
  await expect(errorMessage).toHaveText('You are not authorize to view this order');
});
