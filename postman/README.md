# Jurnal API - Postman Collection & HMAC Script

This folder contains the complete Postman configuration and Pre-request script to automatically sign and authenticate API requests to Mekari Jurnal Open API using HMAC-SHA256.

## Resources
- **Official Public Postman Collection**: [Mekari Jurnal Collection on Postman](https://www.postman.com/qbl-playground/public/collection/b5e7lzc/jurnal-new)
- **Credential Generation Guide Slide**: [MDC How-To Slide](https://docs.google.com/presentation/d/1Oc5Z_2BoQX6cm6wQ_l1nkScWfSORv_rpT-d-c4WE8xM/edit?usp=sharing)
- **Official Documentation**: [api-doc.jurnal.id](https://api-doc.jurnal.id/)

---

## Quick Setup Guide

### 1. Import Environment Template
1. In Postman, click **Import** (top left).
2. Select `mekari-jurnal-environment.json` from this folder.
3. Edit the imported environment and set:
   - `BASE_URL`: `https://sandbox-api.mekari.com` (for testing) or `https://api.mekari.com` (for production)
   - `CLIENT_ID`: Your Application Client ID from MDC
   - `CLIENT_SECRET`: Your Application Client Secret from MDC

### 2. Configure Pre-request Script
You can place the pre-request script at the **Collection level** so that every request in the collection automatically inherits HMAC signing:

1. Right-click your Jurnal Collection -> **Edit**.
2. Go to the **Pre-request Scripts** tab.
3. Copy the script from `pre-request-script.js` and paste it there.
4. Save the collection.

Now, every time you send a request (e.g., `GET {{BASE_URL}}/public/jurnal/api/v1/sales_invoices/2963983`), the script will automatically calculate the HMAC signature and attach the required headers:
- `Authorization`: `hmac username="...", algorithm="hmac-sha256", headers="date request-line", signature="..."`
- `Date`: `<current GMT UTC date>`
- `Accept`: `application/json`

---

## Pre-request Script Reference

```javascript
// 🔐 Credentials
const hmac_username = pm.environment.get("CLIENT_ID") || "YOUR_CLIENT_ID";
const hmac_secret = pm.environment.get("CLIENT_SECRET") || "YOUR_CLIENT_SECRET";

// 📌 Request details
const path = pm.request.url.getPathWithQuery();
const requestLine = pm.request.method + ' ' + path + ' HTTP/1.1';

// 🕒 Date header
const dateString = new Date().toUTCString();

// 🔑 Create signature
const stringToSign = 'date: ' + dateString + '\n' + requestLine;
const digest = CryptoJS.HmacSHA256(stringToSign, hmac_secret);
const signature = CryptoJS.enc.Base64.stringify(digest);

// 📦 Authorization header
const hmac_header =
  `hmac username="${hmac_username}", algorithm="hmac-sha256", headers="date request-line", signature="${signature}"`;

// 📤 Attach headers
pm.request.headers.upsert({ key: "Authorization", value: hmac_header });
pm.request.headers.upsert({ key: "Date", value: dateString });
pm.request.headers.upsert({ key: "Accept", value: "application/json" });

// 🧪 Debug (optional)
console.log('Hmac Header', hmac_header);
console.log('Path:', path);
```

---

## Debugging Common Issues

### 1. Check the Postman Console
Click the **Console** button at the bottom-left corner of the Postman window (or `View` -> `Show Postman Console`). Verify that:
- `Request Line` follows the exact format: `[METHOD] [PATH] HTTP/1.1` (e.g. `GET /public/jurnal/api/v1/sales_invoices HTTP/1.1`).
- `Path` includes query parameters (e.g. `/public/jurnal/api/v1/sales_invoices?page=1&page_size=10`).
- `Date` is formatted in GMT / UTC.

### 2. 401 Unauthorized Error
- Ensure your `CLIENT_ID` and `CLIENT_SECRET` have not been regenerated or revoked in MDC.
- Ensure the HMAC signature is generated dynamically on every request. **Never reuse a previous signature.**
- Ensure the request method and path in the signature match the actual HTTP request.
