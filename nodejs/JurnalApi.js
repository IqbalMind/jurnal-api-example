const crypto = require('crypto');
const axios = require('axios');

class JurnalApi {
  /**
   * @param {string} username - Mekari Client ID (hmac_username)
   * @param {string} secret - Mekari Client Secret (hmac_secret)
   * @param {'sandbox'|'production'} [environment='sandbox']
   */
  constructor(username, secret, environment = 'sandbox') {
    if (!username || !secret) {
      throw new Error('Mekari Jurnal credentials (username and secret) are required.');
    }
    this.username = username;
    this.secret = secret;
    this.environment = environment.toLowerCase();
    this.apiUrl =
      this.environment === 'production'
        ? 'https://api.mekari.com'
        : 'https://sandbox-api.mekari.com';
  }

  /**
   * Generate HMAC signature and date header.
   * @param {string} method - HTTP method (GET, POST, etc.)
   * @param {string} path - Request path with query string if any
   * @returns {{ date: string, signature: string, authorization: string }}
   */
  generateSignature(method, path) {
    // RFC 7231 / HTTP-date (e.g. Thu, 15 Oct 2026 04:09:20 GMT)
    const dateString = new Date().toUTCString();
    const requestLine = `${method.toUpperCase()} ${path} HTTP/1.1`;
    const dataToSign = `date: ${dateString}\n${requestLine}`;

    const signature = crypto
      .createHmac('sha256', this.secret)
      .update(dataToSign)
      .digest('base64');

    const authorization = `hmac username="${this.username}", algorithm="hmac-sha256", headers="date request-line", signature="${signature}"`;

    return {
      date: dateString,
      signature,
      authorization,
      requestLine,
    };
  }

  /**
   * Build query string from params object.
   * @param {Object} [params]
   * @returns {string}
   */
  buildQueryString(params) {
    if (!params || Object.keys(params).length === 0) return '';
    return (
      '?' +
      Object.entries(params)
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
        .join('&')
    );
  }

  /**
   * Make authenticated request to Mekari Jurnal API.
   * @param {string} method - HTTP method
   * @param {string} path - API endpoint path
   * @param {Object} [data] - JSON request payload
   * @param {Object} [params] - URL query parameters
   * @returns {Promise<any>}
   */
  async request(method, path, data = null, params = null) {
    const upperMethod = method.toUpperCase();
    const queryString = this.buildQueryString(params);
    const fullPath = `${path}${queryString}`;

    const { date, authorization } = this.generateSignature(upperMethod, fullPath);

    const headers = {
      Authorization: authorization,
      Date: date,
      Accept: 'application/json',
    };

    const config = {
      method: upperMethod,
      url: `${this.apiUrl}${fullPath}`,
      headers,
    };

    if (data && upperMethod !== 'GET' && upperMethod !== 'DELETE') {
      config.data = data;
      config.headers['Content-Type'] = 'application/json';
    }

    try {
      const response = await axios(config);
      return {
        status: response.status,
        success: true,
        data: response.data,
      };
    } catch (error) {
      if (error.response) {
        return {
          status: error.response.status,
          success: false,
          error: error.response.data || error.message,
        };
      }
      return {
        status: 500,
        success: false,
        error: error.message,
      };
    }
  }

  get(path, params) {
    return this.request('GET', path, null, params);
  }

  post(path, data, params) {
    return this.request('POST', path, data, params);
  }

  put(path, data, params) {
    return this.request('PUT', path, data, params);
  }

  delete(path, params) {
    return this.request('DELETE', path, null, params);
  }
}

module.exports = JurnalApi;
