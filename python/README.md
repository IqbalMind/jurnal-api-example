# Jurnal API - Python Example

This example demonstrates how to integrate with the Mekari Jurnal Open API in Python using HMAC-SHA256 authentication.

## Features
- Reusable `JurnalApi` class with automatic HMAC-SHA256 signature generation.
- Correct RFC 7231 / HTTP-date formatting in UTC/GMT.
- Automatic query parameter handling (ensuring query parameters are signed in the request line).
- Supports `GET`, `POST`, `PUT`, `DELETE` methods.
- Switch between `sandbox` and `production` environments seamlessly.

## Prerequisites
- Python 3.8+
- Mekari Jurnal HMAC credentials (`CLIENT_ID` and `CLIENT_SECRET`). See the [Credentials Guide Slide](https://docs.google.com/presentation/d/1Oc5Z_2BoQX6cm6wQ_l1nkScWfSORv_rpT-d-c4WE8xM/edit?usp=sharing).

## Installation

```bash
cd python
pip install -r requirements.txt
```

## Quick Start

### 1. Configure Credentials
Set your credentials in `example.py` or export them as environment variables:

```bash
export JURNAL_CLIENT_ID="your_client_id"
export JURNAL_CLIENT_SECRET="your_client_secret"
export JURNAL_ENV="sandbox" # or "production"
```

### 2. Run Example
```bash
python example.py
```

## Code Example

```python
from jurnal_api import JurnalApi

# Initialize client
client = JurnalApi(
    username="your_client_id",
    secret="your_client_secret",
    environment="sandbox" # or "production"
)

# 1. GET Request
response = client.get("/public/jurnal/api/v1/sales_invoices/2963983")
print(response.json())

# 2. GET Request with Query Parameters
response = client.get(
    "/public/jurnal/api/v1/sales_invoices",
    params={"page": 1, "page_size": 25}
)
print(response.json())

# 3. POST Request with JSON Body
invoice_payload = {
    "sales_invoice": {
        "transaction_date": "2026-10-15",
        "due_date": "2026-11-15",
        # ... other invoice fields
    }
}
response = client.post("/public/jurnal/api/v1/sales_invoices", data=invoice_payload)
print(response.json())
```

## HMAC Signature Details
- **Request Line**: `[METHOD] [PATH] HTTP/1.1` (e.g., `GET /public/jurnal/api/v1/sales_invoices/2963983 HTTP/1.1`)
- **Date Header**: RFC 7231 GMT string (e.g., `Thu, 15 Oct 2026 04:09:20 GMT`)
- **String to Sign**: `date: <dateString>\n<requestLine>`
- **Authorization Header**:
  `hmac username="<username>", algorithm="hmac-sha256", headers="date request-line", signature="<base64-signature>"`
- **Freshness**: The signature is generated fresh on every single request. Never reuse signatures across requests.
