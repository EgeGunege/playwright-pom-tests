import { test, expect, request } from '@playwright/test';
import { APIUtils } from '../page-objects/utils/api-utils.js';

let token = '';
let orderId = '';

test.beforeAll(async () => {
  const apiUrl = 'https://rahulshettyacademy.com/api/ecom/auth/login';
  const username = 'anshika@gmail.com';
  const password = 'Iamking@000';
  const apiContext = await request.newContext();
  const apiUtils = new APIUtils(apiContext);
  token = await apiUtils.getToken(apiUrl, username, password);
});

test('Create order from api', async ({ page }) => {
  const orderApiUrl = 'https://rahulshettyacademy.com/api/ecom/order/create-order';
  const orderPayload = {
    orders: [
      {
        country: 'Canada',
        productOrderedId: '68a961459320a140fe1ca57a',
      },
    ],
  };

  const fakePayLoadOrders = { data: [], message: 'No Orders' };
  const myOrders = page.locator('button[routerlink*="myorders"]');
  const orderRow = page.locator('tr[class="ng-star-inserted"]');

  const apiContext = await request.newContext();
  const apiUtils = new APIUtils(apiContext);
  orderId = await apiUtils.createOrder(orderApiUrl, token, orderPayload);

  page.addInitScript((value) => {
    window.localStorage.setItem('token', value);
  }, token);
  await page.goto('https://rahulshettyacademy.com/client/');
  const routeApiUrl = 'https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*';
  await page.route(routeApiUrl, async (route) => {
    const response = await page.request.fetch(route.request());
    let body = JSON.stringify(fakePayLoadOrders);
    route.fulfill({
      response,
      body,
    });
  });

  await myOrders.click();
  await page.waitForResponse(routeApiUrl);
  console.log(await page.locator('.mt-4').textContent());

  // await orderRow.first().waitFor();
  // const countOrders = await orderRow.count();
  // for (let k = 0; k < countOrders; k++) {
  //   const order = orderRow.nth(k);
  //   const cellText = (await order.locator('th').textContent())?.trim();

  //   if (cellText === orderId) {
  //     await order.locator('td button:has-text("View")').click();
  //     break;
  //   }
  // }

  // await expect(emailTitle).toHaveText(' order summary ');
});
