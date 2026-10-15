/**
 * Mekari Jurnal Open API - Postman Pre-request Script
 * 
 * Paste this script into:
 *   Postman Collection -> Pre-request Scripts (applies to all requests in collection)
 *   OR individual request -> Pre-request Scripts
 * 
 * Environment Variables required:
 *   - CLIENT_ID: Your Mekari Application Client ID
 *   - CLIENT_SECRET: Your Mekari Application Client Secret
 */

// 🔐 Credentials
const hmac_username = pm.environment.get("CLIENT_ID") || "YOUR_CLIENT_ID";
const hmac_secret = pm.environment.get("CLIENT_SECRET") || "YOUR_CLIENT_SECRET";

// 📌 Request details
// Ensure the request path includes query parameters if present
const path = pm.request.url.getPathWithQuery();
const requestLine = pm.request.method + ' ' + path + ' HTTP/1.1';

// 🕒 Date header (must be RFC 7231 / HTTP-date GMT format)
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

// 🧪 Debug (Open Postman Console: View -> Show Postman Console)
console.log('--- Mekari Jurnal HMAC Debug ---');
console.log('HMAC Header:', hmac_header);
console.log('Date Header:', dateString);
console.log('Request Line:', requestLine);
console.log('Path:', path);
console.log('String To Sign:\n' + stringToSign);
