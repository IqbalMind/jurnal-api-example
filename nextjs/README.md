# Jurnal API - Next.js (App Router) Example

This example demonstrates how to integrate the Mekari Jurnal Open API with Next.js (14+) using the App Router.

## Architecture

HMAC authentication requires a `CLIENT_SECRET`. Because secrets must **never** be exposed to browser clients, this integration uses a Next.js Route Handler (`app/api/jurnal/[...path]/route.ts`) as a secure server-side proxy.

```
[ Next.js Client Component ] 
            |  fetch('/api/jurnal/sales_invoices/2963983')
            v
[ Next.js Server Route Handler (app/api/jurnal/...) ]
            |  Generates fresh HMAC-SHA256 signature
            v
[ Mekari Jurnal Open API (https://sandbox-api.mekari.com) ]
```

## Prerequisites
- Node.js 18+
- Mekari Jurnal HMAC credentials (`CLIENT_ID` and `CLIENT_SECRET`). See the [Credentials Guide Slide](https://docs.google.com/presentation/d/1Oc5Z_2BoQX6cm6wQ_l1nkScWfSORv_rpT-d-c4WE8xM/edit?usp=sharing).

## Quick Start

### 1. Install Dependencies
```bash
cd nextjs
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in `nextjs/`:
```env
JURNAL_CLIENT_ID=your_client_id
JURNAL_CLIENT_SECRET=your_client_secret
JURNAL_ENV=sandbox # or production
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## How to Call the Proxy in Your Frontend

Any call to `/api/jurnal/<endpoint>` is automatically forwarded to `/public/jurnal/api/v1/<endpoint>` with valid HMAC signatures:

```typescript
// Fetch a sales invoice
const res = await fetch('/api/jurnal/sales_invoices/2963983');
const invoice = await res.json();

// Fetch sales invoices with query params
const resList = await fetch('/api/jurnal/sales_invoices?page=1&page_size=20');
const invoices = await resList.json();

// Create a sales invoice
const resPost = await fetch('/api/jurnal/sales_invoices', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ sales_invoice: { ... } })
});
```
