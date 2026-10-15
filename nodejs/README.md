# Jurnal API - Node.js Example

This package provides a reusable Node.js client for communicating with the Mekari Jurnal Open API using HMAC-SHA256 authentication.

## Features
- Complete HMAC-SHA256 signature generator (`Date`, `request-line`, and `Authorization` headers).
- Automatic UTC / GMT RFC 7231 date string creation.
- Query string serialization integrated into both signature and request URL.
- Convenience helper methods: `get()`, `post()`, `put()`, `delete()`, and raw `request()`.
- Error and HTTP status code normalization.

## Prerequisites
- Node.js 16+
- Mekari Jurnal HMAC credentials (`CLIENT_ID` and `CLIENT_SECRET`). See the [Credentials Guide Slide](https://docs.google.com/presentation/d/1Oc5Z_2BoQX6cm6wQ_l1nkScWfSORv_rpT-d-c4WE8xM/edit?usp=sharing).

## Installation

```bash
cd nodejs
npm install
```

## Quick Start

```bash
# Set credentials (optional if editing example.js directly)
export JURNAL_CLIENT_ID="your_client_id"
export JURNAL_CLIENT_SECRET="your_client_secret"
export JURNAL_ENV="sandbox"

# Run example
npm start
```

## Usage

```javascript
const JurnalApi = require('./JurnalApi');

const jurnal = new JurnalApi(
  'your-client-id',
  'your-client-secret',
  'sandbox' // or 'production'
);

// GET request
async function getInvoice() {
  const result = await jurnal.get('/public/jurnal/api/v1/sales_invoices/2963983');
  if (result.success) {
    console.log('Invoice:', result.data);
  } else {
    console.error('Error:', result.error);
  }
}

// GET request with query params
async function listInvoices() {
  const result = await jurnal.get('/public/jurnal/api/v1/sales_invoices', {
    page: 1,
    page_size: 10,
  });
  console.log(result.data);
}

// POST request
async function createInvoice() {
  const payload = {
    sales_invoice: {
      transaction_date: '2026-10-15',
      // ... fields
    },
  };
  const result = await jurnal.post('/public/jurnal/api/v1/sales_invoices', payload);
  console.log(result);
}
```

## HMAC Signature Specification
- **Request Line**: `[METHOD] [PATH] HTTP/1.1` (e.g., `GET /public/jurnal/api/v1/sales_invoices/2963983 HTTP/1.1`)
- **Date Header**: RFC 7231 GMT string (e.g., `Thu, 15 Oct 2026 04:09:20 GMT`)
- **String to Sign**: `date: <dateString>\n<requestLine>`
- **Authorization Header**:
  `hmac username="<username>", algorithm="hmac-sha256", headers="date request-line", signature="<base64-signature>"`
- **Important**: HMAC signature must be freshly generated on every request. Reusing signatures will result in `401 Unauthorized`.
