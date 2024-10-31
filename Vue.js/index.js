const express = require('express');
const crypto = require('crypto');
const axios = require('axios');

const app = express();
app.use(express.json());

const hmacUsername = 'your-username';
const hmacSecret = 'your-secret';
const apiUrl = 'https://sandbox-api.mekari.com';

function generateHmacSignature(requestMethod, requestPath) {
    const dateString = new Date().toUTCString();
    const requestLine = `${requestMethod} ${requestPath} HTTP/1.1`;
    const dataToSign = `date: ${dateString}\n${requestLine}`;
    const signature = crypto.createHmac('sha256', hmacSecret).update(dataToSign).digest('base64');
    return { date: dateString, hmacHeader: `hmac username="${hmacUsername}", algorithm="hmac-sha256", headers="date request-line", signature="${signature}"` };
}

app.get('/api/sales-invoices/:id', async (req, res) => {
    const requestMethod = 'GET';
    const requestPath = `/public/jurnal/api/v1/sales_invoices/${req.params.id}`;
    const { date, hmacHeader } = generateHmacSignature(requestMethod, requestPath);

    try {
        const response = await axios.get(`${apiUrl}${requestPath}`, {
            headers: {
                'Authorization': hmacHeader,
                'Date': date,
                'Accept': 'application/json'
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(error.response ? error.response.status : 500).json({ error: error.message });
    }
});

app.listen(3000, () => console.log('Backend server running on http://localhost:3000'));
