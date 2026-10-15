const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const hmacUsername = process.env.JURNAL_CLIENT_ID || 'your-username';
const hmacSecret = process.env.JURNAL_CLIENT_SECRET || 'your-secret';
const apiUrl =
  process.env.JURNAL_ENV === 'production'
    ? 'https://api.mekari.com'
    : 'https://sandbox-api.mekari.com';

function generateHmacSignature(requestMethod, requestPath) {
  const dateString = new Date().toUTCString();
  const requestLine = `${requestMethod.toUpperCase()} ${requestPath} HTTP/1.1`;
  const dataToSign = `date: ${dateString}\n${requestLine}`;
  const signature = crypto.createHmac('sha256', hmacSecret).update(dataToSign).digest('base64');
  return {
    date: dateString,
    hmacHeader: `hmac username="${hmacUsername}", algorithm="hmac-sha256", headers="date request-line", signature="${signature}"`,
  };
}

// GET single invoice
app.get('/api/sales-invoices/:id', async (req, res) => {
  const requestMethod = 'GET';
  const requestPath = `/public/jurnal/api/v1/sales_invoices/${req.params.id}`;
  const { date, hmacHeader } = generateHmacSignature(requestMethod, requestPath);

  try {
    const response = await axios.get(`${apiUrl}${requestPath}`, {
      headers: {
        Authorization: hmacHeader,
        Date: date,
        Accept: 'application/json',
      },
    });
    res.json(response.data);
  } catch (error) {
    res.status(error.response ? error.response.status : 500).json(
      error.response ? error.response.data : { error: error.message }
    );
  }
});

// GET list of invoices with query params
app.get('/api/sales-invoices', async (req, res) => {
  const requestMethod = 'GET';
  const queryStr = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
  const requestPath = `/public/jurnal/api/v1/sales_invoices${queryStr}`;
  const { date, hmacHeader } = generateHmacSignature(requestMethod, requestPath);

  try {
    const response = await axios.get(`${apiUrl}${requestPath}`, {
      headers: {
        Authorization: hmacHeader,
        Date: date,
        Accept: 'application/json',
      },
    });
    res.json(response.data);
  } catch (error) {
    res.status(error.response ? error.response.status : 500).json(
      error.response ? error.response.data : { error: error.message }
    );
  }
});

app.listen(PORT, () => console.log(`Backend server running on http://localhost:${PORT}`));
