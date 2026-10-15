# Jurnal API - PHP Native Example

This example demonstrates how to use the Mekari Jurnal Open API with native PHP using HMAC-SHA256 authentication. The example includes a reusable `JurnalApi` class.

## Getting Started

1. Set your HMAC credentials (`CLIENT_ID` and `CLIENT_SECRET`).
   - See the [Credentials Guide Slide](https://docs.google.com/presentation/d/1Oc5Z_2BoQX6cm6wQ_l1nkScWfSORv_rpT-d-c4WE8xM/edit?usp=sharing) on how to generate credentials in Mekari Developer Center (MDC).
2. Run the example:

```bash
cd PHP
php example.php
```

### Usage

```php
require 'JurnalApi.php';

// Initialize with your client ID and secret
$jurnalApi = new JurnalApi('your-client-id', 'your-client-secret', 'sandbox');

// 1. GET Request
$response = $jurnalApi->get('/public/jurnal/api/v1/sales_invoices/2963983');
print_r($response['data']);

// 2. GET Request with Query Parameters
$response = $jurnalApi->get('/public/jurnal/api/v1/sales_invoices', [
    'page' => 1,
    'page_size' => 20
]);
print_r($response['data']);

// 3. POST Request
$payload = [
    'sales_invoice' => [
        'transaction_date' => '2026-10-15',
        // ...
    ]
];
$response = $jurnalApi->post('/public/jurnal/api/v1/sales_invoices', $payload);
print_r($response['data']);
```

### Configuration
- **Environment**: Set `'production'` as the third parameter when initializing `JurnalApi` for live API (`https://api.mekari.com`), or leave as default `'sandbox'` (`https://sandbox-api.mekari.com`).
- **Dependencies**: PHP 7.4+ with `curl` and `json` extensions.

For full documentation, visit [Mekari Jurnal Open API Documentation](https://api-doc.jurnal.id/).
