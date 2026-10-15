# Mekari Jurnal API Example with Vue.js

This example demonstrates how to integrate the Mekari Jurnal Open API with a Vue.js frontend, using a Node.js backend to securely handle HMAC-SHA256 authentication.

## Architecture Overview

1. **Vue.js** frontend to display data and interact with the user.
2. **Node.js** backend (Express) to securely generate HMAC signatures with `CLIENT_ID` and `CLIENT_SECRET` and proxy calls to the Mekari Jurnal Open API.

> ⚠️ **Important Security Note**: Client secrets must **never** be stored or signed inside client-side Vue code running in the browser, as they can be easily extracted by users. Always sign requests server-side!

## Prerequisites

- [Node.js](https://nodejs.org/) (v16+) and npm installed.
- Valid Mekari Jurnal HMAC credentials. Follow the [Credentials Guide Slide](https://docs.google.com/presentation/d/1Oc5Z_2BoQX6cm6wQ_l1nkScWfSORv_rpT-d-c4WE8xM/edit?usp=sharing).

## Setup & Running

### 1. Install Backend Dependencies
```bash
cd Vue.js
npm install
```

### 2. Configure Credentials & Start Backend
Set your credentials in terminal or inside `index.js`:
```bash
export JURNAL_CLIENT_ID="your_client_id"
export JURNAL_CLIENT_SECRET="your_client_secret"
export JURNAL_ENV="sandbox" # or "production"

npm start
```

The backend server runs on `http://localhost:3000`.

### 3. Frontend Usage
In your Vue component (`src/App.vue`), make API calls to the backend proxy:
```javascript
const response = await axios.get(`http://localhost:3000/api/sales-invoices/${this.invoiceId}`);
this.invoiceData = response.data;
```

## Available Endpoints
- `GET /api/sales-invoices/:id` - Retrieve sales invoice details.
- `GET /api/sales-invoices?page=1&page_size=10` - List sales invoices with pagination.
