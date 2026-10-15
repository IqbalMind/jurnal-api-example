import crypto from 'crypto';

export interface SignatureResult {
  date: string;
  requestLine: string;
  signature: string;
  authorizationHeader: string;
}

const CLIENT_ID = process.env.JURNAL_CLIENT_ID || '';
const CLIENT_SECRET = process.env.JURNAL_CLIENT_SECRET || '';
const API_URL =
  process.env.JURNAL_ENV === 'production'
    ? 'https://api.mekari.com'
    : 'https://sandbox-api.mekari.com';

/**
 * Generates HMAC-SHA256 signature for Mekari Jurnal Open API.
 * Always executed strictly server-side.
 */
export function generateHmacSignature(method: string, path: string): SignatureResult {
  const dateString = new Date().toUTCString();
  const requestLine = `${method.toUpperCase()} ${path} HTTP/1.1`;
  const stringToSign = `date: ${dateString}\n${requestLine}`;

  const signature = crypto
    .createHmac('sha256', CLIENT_SECRET)
    .update(stringToSign)
    .digest('base64');

  const authorizationHeader = `hmac username="${CLIENT_ID}", algorithm="hmac-sha256", headers="date request-line", signature="${signature}"`;

  return {
    date: dateString,
    requestLine,
    signature,
    authorizationHeader,
  };
}

export async function proxyToJurnal(
  method: string,
  apiPath: string,
  body?: any
): Promise<Response> {
  const sig = generateHmacSignature(method, apiPath);

  const headers: Record<string, string> = {
    Authorization: sig.authorizationHeader,
    Date: sig.date,
    Accept: 'application/json',
  };

  const init: RequestInit = {
    method: method.toUpperCase(),
    headers,
  };

  if (body && method.toUpperCase() !== 'GET' && method.toUpperCase() !== 'DELETE') {
    headers['Content-Type'] = 'application/json';
    init.body = typeof body === 'string' ? body : JSON.stringify(body);
  }

  const url = `${API_URL}${apiPath}`;
  return fetch(url, init);
}
