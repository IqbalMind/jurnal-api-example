# Jurnal API - React.js Integration Example

This example demonstrates how to integrate the Mekari Jurnal Open API with a React.js application using HMAC-SHA256 authentication.

## Architecture

```
[ React.js Frontend ]  ---- HTTP Request ---->  [ Node.js Backend Proxy (Port 3001) ]
                                                          |
                                                  Signs HMAC Header
                                                          |
                                                          v
                                            [ Mekari Jurnal Open API ]
```

> **Why a Backend Proxy?**
> HMAC credentials include a `CLIENT_SECRET`. Secrets must **never** be exposed in client-side code running in a browser. The backend proxy securely computes the HMAC signature and attaches the `Authorization` and `Date` headers before forwarding the request to Mekari.

## Prerequisites
- Node.js 16+
- Mekari Jurnal HMAC credentials (`CLIENT_ID` and `CLIENT_SECRET`). See the [Credentials Guide Slide](https://docs.google.com/presentation/d/1Oc5Z_2BoQX6cm6wQ_l1nkScWfSORv_rpT-d-c4WE8xM/edit?usp=sharing).

## Setup & Running

### 1. Install Dependencies
```bash
cd react
npm install
```

### 2. Configure Environment Variables
Set your credentials in terminal or inside `server.js`:
```bash
export JURNAL_CLIENT_ID="your_client_id"
export JURNAL_CLIENT_SECRET="your_client_secret"
export JURNAL_ENV="sandbox" # or "production"
```

### 3. Start the Backend Proxy
```bash
npm run server
```
The server will listen at `http://localhost:3001`.

### 4. Use in React
In your React application (e.g., Create React App, Next.js, or Vite), import and render `App.jsx`, or use `fetch('/api/sales-invoices/2963983')`.

## Endpoints Provided by Proxy
- `GET /api/sales-invoices/:id` - Fetch sales invoice by ID.
- `GET /api/sales-invoices?page=1&page_size=10` - List sales invoices with pagination.
