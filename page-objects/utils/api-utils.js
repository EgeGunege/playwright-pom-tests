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
    const payload = {
      userEmail: userName,
      userPassword: password,
    };

    const loginResponse = await this.apiContext.post(url, {
      headers: { 'Content-Type': 'application/json' },
      data: payload,
    });

    const body = await loginResponse.json().catch(() => ({}));

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
    const orderResponse = await this.apiContext.post(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      data: orderPayload,
    });

    const body = await orderResponse.json().catch(() => ({}));

    expect(orderResponse.ok()).toBeTruthy();
    return body.orders?.[0];
  }
}
