# Mekari Jurnal Open API Examples

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Status: All Released](https://img.shields.io/badge/Release-Everything%20Released%20Today-brightgreen.svg)](#implementation-status)
[![Authentication: HMAC-SHA256](https://img.shields.io/badge/Auth-HMAC--SHA256-blue.svg)](#hmac-authentication-specification)

This repository provides production-ready, verified integration examples for the **Mekari Jurnal Open API** using HMAC-SHA256 authentication across a wide range of programming languages, frameworks, and tools.

---

## 📖 Table of Contents
1. [How to Generate Credentials (MDC)](#-how-to-generate-credentials-in-mekari-developer-center-mdc)
2. [HMAC Authentication Specification](#-hmac-authentication-specification)
3. [Testing with Postman](#-testing-with-postman)
4. [Available Implementations](#-available-implementations)
5. [Implementation Status](#-implementation-status)
6. [Contributing](#-contributing)
7. [Official Documentation](#-official-documentation)

---

## 🔑 How to Generate Credentials in Mekari Developer Center (MDC)

> 📘 **Step-by-Step Slide Guide**:  
> For visual walkthrough slides with screenshots, please see:  
> **[Generate HMAC Credentials via MDC Guide (Google Slides)](https://docs.google.com/presentation/d/1Oc5Z_2BoQX6cm6wQ_l1nkScWfSORv_rpT-d-c4WE8xM/edit?usp=sharing)**

### 1. Developer Center & Sandbox URLs

| Portal | URL | Description |
|---|---|---|
| **MDC Sandbox** | [sandbox-developers.mekari.com](https://sandbox-developers.mekari.com) | Dashboard for Sandbox Apps & Credentials (Jurnal & KlikPajak) |
| **MDC Production** | [developers.mekari.com](https://developers.mekari.com) | Dashboard for Live / Production Apps & Credentials |
| **Jurnal Sandbox Web** | [sandbox.jurnal.id](https://sandbox.jurnal.id) | Sandbox web interface (Register: [Registration link](https://sandbox.jurnal.id/registers/index)) |
| **API Base URL (Sandbox)** | `https://sandbox-api.mekari.com` | Sandbox API gateway for testing |
| **API Base URL (Production)**| `https://api.mekari.com` | Production API gateway for live data |

> ℹ️ **Sandbox Quota & Trial Extension**:  
> - Jurnal Sandbox accounts have a free quota of **2,000 hits/month** and a rate limit of **40 requests/minute**.  
> - To extend your trial period for a Sandbox account, send an email to `squadron@mekari.com` with the subject:  
>   `Request Extend Trial Sandbox Account - CID <YOUR_SANDBOX_CID> - <DURATION>` *(make sure to provide your Sandbox CID, not your production CID)*.

### 2. Steps to Obtain Client ID & Client Secret
1. Sign in to [sandbox-developers.mekari.com](https://sandbox-developers.mekari.com) (or [developers.mekari.com](https://developers.mekari.com) for production) using your Mekari account. *(Note: You must have an Owner or Admin role to create applications)*.
2. Go to **Applications** and click **Create Application**.
3. Fill in the **Application Name** (minimum 4 characters).
4. Select the required **Scopes** for your integration *(Note: Please wait until the scopes scroll list completely loads before selecting)*.
5. Once created, go to **Application Details > Credentials**.
6. Copy your **Client ID** (`hmac_username`) and **Client Secret** (`hmac_secret`).
7. **Expiration Note**: The Client ID and Client Secret do not expire unless you explicitly click **Regenerate Client Secret** (which will immediately revoke the previous secret).

---

## 🔒 HMAC Authentication Specification

Mekari Jurnal API uses the **HMAC-SHA256 HTTP Signature** standard. Every request must carry dynamic `Authorization` and `Date` headers.

### Formula

1. **Request Line**:
   ```
   [HTTP_METHOD] [PATH_WITH_QUERY] HTTP/1.1
   ```
   *Example*: `GET /public/jurnal/api/v1/sales_invoices/2963983 HTTP/1.1`  
   *Note*: If you pass query parameters (e.g. `?page=1&page_size=10`), they **must** be included in the signed path exactly as sent.

2. **Date Header**:
   RFC 7231 / HTTP-date GMT string.
   *Example*: `Thu, 15 Oct 2026 04:09:20 GMT`

3. **String to Sign**:
   ```
   date: [dateString]
   [requestLine]
   ```
   *(Note: separated by a newline `\n` without any extra spaces)*

4. **Signature**:
   Base64 representation of the HMAC-SHA256 digest of `String to Sign` using your `Client Secret`:
   ```
   signature = Base64(HMAC_SHA256(String to Sign, CLIENT_SECRET))
   ```

5. **Authorization Header**:
   ```http
   Authorization: hmac username="CLIENT_ID", algorithm="hmac-sha256", headers="date request-line", signature="[SIGNATURE]"
   ```

### ⚠️ Critical Security Rules
- **Generate Fresh for Every Request**: The HMAC signature is valid only for that exact request at that exact time. **Never cache or reuse signatures across requests**; doing so will result in `401 Unauthorized`.
- **Keep Secrets Server-Side**: Never expose your `CLIENT_SECRET` in client-side applications (Single Page Apps / Mobile apps). Always use a backend server or proxy to sign requests.

---

## 🧪 Testing with Postman

You can test the Mekari Jurnal Open API directly in Postman using the public collection and pre-request script.

- **Official Public Postman Collection**: [Mekari Jurnal Collection](https://www.postman.com/qbl-playground/public/collection/b5e7lzc/jurnal-new)
- **Pre-configured Postman Files in this Repo**: See the [`/postman`](./postman) folder.

### Postman Pre-request Script

Add this script to your Postman Collection's **Pre-request Scripts** tab to automatically sign all outgoing requests:

```javascript
// 🔐 Credentials
const hmac_username = pm.environment.get("CLIENT_ID") || "CLIENT_ID";
const hmac_secret = pm.environment.get("CLIENT_SECRET") || "CLIENT_SECRET";

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

// 🧪 Debug (View -> Show Postman Console)
console.log('Hmac Header', hmac_header);
console.log('Path:', path);
```

---

## 🚀 Available Implementations

Every stack is structured with a reusable client, complete examples for CRUD / query parameters, and setup instructions:

| Language / Framework | Directory | Category | Description |
|---|---|---|---|
| **Python** | [`/python`](./python) | Backend | Native Python 3 client with `requests`, HMAC signing, and query handling |
| **Node.js** | [`/nodejs`](./nodejs) | Backend | Clean Node.js client with `axios` and standard `crypto` |
| **Java** | [`/java`](./java) | Enterprise / Backend | Zero-dependency Java 11+ client (`HttpClient` & `Mac`) for Spring Boot or ERPs |
| **.NET / C#** | [`/dotnet`](./dotnet) | Enterprise / Desktop | Modern .NET 8 C# client using `HttpClient` and `HMACSHA256` |
| **Go (Golang)** | [`/golang`](./golang) | Backend / Microservices | Zero-dependency Go client using standard `crypto/hmac` & `net/http` |
| **Swift** | [`/swift`](./swift) | Mobile / Desktop | Native Swift (iOS/macOS) using Apple's `CryptoKit` and `URLSession` |
| **Kotlin** | [`/kotlin`](./kotlin) | Mobile / Backend | Idiomatic Kotlin for Android POS devices, Ktor, or Spring Boot |
| **Next.js** | [`/nextjs`](./nextjs) | Fullstack Web | Next.js 14+ App Router with server-side proxy route handlers |
| **Google Apps Script**| [`/google-apps-script`](./google-apps-script) | Automation / Sheets | Sync Google Sheets directly to Mekari Jurnal without a server |
| **Dart & Flutter** | [`/dart`](./dart) | Mobile / POS | Cross-platform Dart & Flutter client for mobile POS and scanner apps |
| **Ruby** | [`/ruby`](./ruby) | Backend | Zero-gem Ruby client using `net/http` and `openssl` for Rails or scripts |
| **Bash / cURL CLI** | [`/bash`](./bash) | DevOps / CLI | Shell script using `curl` and `openssl` for instant terminal testing and cron |
| **Rust** | [`/rust`](./rust) | Systems / High-Perf | Async Rust client using `reqwest`, `tokio`, and `hmac` |
| **PHP (Native)** | [`/PHP`](./PHP) | Backend | Native PHP client class with cURL and full verb support |
| **Laravel 11** | [`/laravel-11`](./laravel-11) | Backend Framework | Laravel 11 service integration with dependency injection |
| **CodeIgniter** | [`/codeigniter`](./codeigniter) | Backend Framework | CodeIgniter library integration |
| **React.js** | [`/react`](./react) | Frontend Web | React frontend with secure Node.js signing backend proxy |
| **Vue.js** | [`/Vue.js`](./Vue.js) | Frontend Web | Vue.js frontend with secure Node.js signing backend proxy |
| **Postman** | [`/postman`](./postman) | Testing & QA | Pre-request script and ready-to-import Postman environment template |

---

## 📊 Implementation Status

All requested and primary language stacks have been **completed and released today**. There is no pending backlog.

Want to see an implementation in your preferred language or framework? **[Submit your request here](https://forms.gle/FVvMKwrpmUzZx2fs9)**

| Language / Framework | Status | Release Date |
|---|---|---|
| **Python** | 🟢 Released | Today |
| **Node.js** | 🟢 Released | Today |
| **Java** | 🟢 Released | Today |
| **.NET / C#** | 🟢 Released | Today |
| **Go (Golang)** | 🟢 Released | Today |
| **Swift (iOS / macOS)** | 🟢 Released | Today |
| **Kotlin (Android / Backend)** | 🟢 Released | Today |
| **Next.js (App Router)** | 🟢 Released | Today |
| **Google Apps Script (Google Sheets)** | 🟢 Released | Today |
| **Dart & Flutter** | 🟢 Released | Today |
| **Ruby** | 🟢 Released | Today |
| **Bash / cURL CLI** | 🟢 Released | Today |
| **Rust** | 🟢 Released | Today |
| **PHP (Native)** | 🟢 Released | Today |
| **Laravel 11** | 🟢 Released | Today |
| **CodeIgniter** | 🟢 Released | Today |
| **React.js** | 🟢 Released | Today |
| **Vue.js** | 🟢 Released | Today |
| **Postman** | 🟢 Released | Today |

---

## 🤝 Contributing New Implementations

We welcome community contributions for additional stacks and integrations!

1. Follow the standard directory layout:
   ```bash
   /{language-or-framework}/
   ├── README.md           # Setup and usage instructions
   ├── example.{ext}       # Complete usage example
   └── ...                 # Reusable client / dependency configs
   ```
2. Ensure the HMAC signing follows the formula specified above.
3. Submit a pull request with a clear description.

---

## 📚 Official Documentation

- **Official API Documentation**: [https://api-doc.jurnal.id/](https://api-doc.jurnal.id/)
- **Mekari Developer Center (Sandbox)**: [https://sandbox-developers.mekari.com](https://sandbox-developers.mekari.com)
- **Mekari Developer Center (Production)**: [https://developers.mekari.com](https://developers.mekari.com)
- **Credential Generation Slide Guide**: [Google Slides Presentation](https://docs.google.com/presentation/d/1Oc5Z_2BoQX6cm6wQ_l1nkScWfSORv_rpT-d-c4WE8xM/edit?usp=sharing)
- **Official Public Postman Collection**: [Postman Collection](https://www.postman.com/qbl-playground/public/collection/b5e7lzc/jurnal-new)

---

## 📄 License

This repository is open-sourced under the [MIT License](LICENSE).
