const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const HMAC_USERNAME = process.env.JURNAL_CLIENT_ID || 'your-client-id';
const HMAC_SECRET = process.env.JURNAL_CLIENT_SECRET || 'your-client-secret';
const API_URL =
  process.env.JURNAL_ENV === 'production'
    ? 'https://api.mekari.com'
    : 'https://sandbox-api.mekari.com';

/**
 * Generate HMAC-SHA256 signature and Date header.
 */
function generateHmacSignature(method, path) {
  const dateString = new Date().toUTCString();
  const requestLine = `${method.toUpperCase()} ${path} HTTP/1.1`;
  const stringToSign = `date: ${dateString}\n${requestLine}`;

  const signature = crypto
    .createHmac('sha256', HMAC_SECRET)
    .update(stringToSign)
    .digest('base64');

  const hmacHeader = `hmac username="${HMAC_USERNAME}", algorithm="hmac-sha256", headers="date request-line", signature="${signature}"`;

  return {
    date: dateString,
    hmacHeader,
    requestLine,
  };
}

// GET Sales Invoices list with optional query params
app.get('/api/sales-invoices', async (req, res) => {
  const queryStr = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
  const requestPath = `/public/jurnal/api/v1/sales_invoices${queryStr}`;
  const { date, hmacHeader } = generateHmacSignature('GET', requestPath);

  try {
    const response = await axios.get(`${API_URL}${requestPath}`, {
      headers: {
        Authorization: hmacHeader,
        Date: date,
        Accept: 'application/json',
      },
    });
    res.json(response.data);
  } catch (error) {
    const status = error.response ? error.response.status : 500;
    res.status(status).json(error.response ? error.response.data : { error: error.message });
  }
});

// GET Single Sales Invoice by ID
app.get('/api/sales-invoices/:id', async (req, res) => {
  const requestPath = `/public/jurnal/api/v1/sales_invoices/${req.params.id}`;
  const { date, hmacHeader } = generateHmacSignature('GET', requestPath);

  try {
    const response = await axios.get(`${API_URL}${requestPath}`, {
      headers: {
        Authorization: hmacHeader,
        Date: date,
        Accept: 'application/json',
      },
    });
    res.json(response.data);
  } catch (error) {
    const status = error.response ? error.response.status : 500;
    res.status(status).json(error.response ? error.response.data : { error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`React Backend Proxy running on http://localhost:${PORT}`);
  console.log(`Proxying requests to: ${API_URL}`);
});
