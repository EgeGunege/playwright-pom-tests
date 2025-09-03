// tests/api-order.spec.js
import { test, expect, request } from '@playwright/test';
import { APIUtils } from '../page-objects/utils/api-utils.js';
import 'dotenv/config';

let apiContext;
let apiUtils;
let token = '';
let orderId = '';

const API_URL_LOGIN =
  process.env.API_URL_LOGIN ?? 'https://rahulshettyacademy.com/api/ecom/auth/login';

const API_URL_CREATE_ORDER =
  process.env.API_URL_CREATE_ORDER ?? 'https://rahulshettyacademy.com/api/ecom/order/create-order';

const USERNAME = process.env.USER ?? 'anshika@gmail.com';
const PASSWORD = process.env.PASS ?? 'Iamking@000';
const PRODUCT_ID = process.env.PRODUCT_ID ?? '68a961459320a140fe1ca57a';

test.beforeAll(async () => {
  apiContext = await request.newContext();
  apiUtils = new APIUtils(apiContext);

  token = await apiUtils.getToken(API_URL_LOGIN, USERNAME, PASSWORD);
  expect(token, 'token should be non-empty').toBeTruthy();
});

test.afterAll(async () => {
  await apiContext.dispose();
});

test('Create order via API', async () => {
  const orderPayload = {
    orders: [{ country: 'Canada', productOrderedId: PRODUCT_ID }],
  };

  orderId = await apiUtils.createOrder(API_URL_CREATE_ORDER, token, orderPayload);

  expect(orderId, 'orderId should be returned').toBeTruthy();

  expect(orderId).toMatch(/^[a-f0-9]{24}$/i);
});
