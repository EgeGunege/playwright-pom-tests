import { expect } from '@playwright/test';

export class APIUtils {
  constructor(apiContext) {
    this.apiContext = apiContext;
  }

  /**
   * Get login token through API
   * @param {string} url
   * @param {string} userName
   * @param {string} password
   * @returns {Promise<string>} login token
   */
  async getToken(url, userName, password) {
    const loginResponse = await this.apiContext.post(url, {
      json: {
        userEmail: userName,
        userPassword: password,
      },
    });

    const body = await loginResponse.json().catch(() => ({}));
    console.log('Response:', loginResponse.status(), body);
    expect(loginResponse.ok()).toBeTruthy();
    return String(body?.token ?? '');
  }

  /**
   * Create order through API
   * @param {string} url
   * @param {string} token
   * @param {object} orderPayload
   * @returns {Promise<string>} orderId
   */
  async createOrder(url, token, orderPayload) {
    const auth = /^Bearer\s/i.test(token ?? '') ? token : `Bearer ${token}`;

    const orderResponse = await this.apiContext.post(url, {
      json: orderPayload,
      headers: { Authorization: auth },
    });

    expect(orderResponse.ok()).toBeTruthy();
    const body = await orderResponse.json();
    return body.orders?.[0];
  }
}
