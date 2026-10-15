# Jurnal API - CodeIgniter Integration

This directory contains a CodeIgniter library for integrating with the Mekari Jurnal Open API using HMAC-SHA256 authentication.

## Getting Started

1. Place the `JurnalApi.php` library file into your application's `application/libraries/` folder.
2. Load the library in your controller and pass your credentials.

> Need credentials? Follow the [Credentials Guide Slide](https://docs.google.com/presentation/d/1Oc5Z_2BoQX6cm6wQ_l1nkScWfSORv_rpT-d-c4WE8xM/edit?usp=sharing).

### Example Usage

```php
// In your controller:
$this->load->library('JurnalApi', [
    'username'    => 'your-client-id',
    'secret'      => 'your-client-secret',
    'environment' => 'sandbox' // Use 'production' for live API
]);

// 1. GET request
$response = $this->jurnalapi->get('/public/jurnal/api/v1/sales_invoices/2963983');
print_r($response['data']);

// 2. GET with query parameters
$response = $this->jurnalapi->get('/public/jurnal/api/v1/sales_invoices', [
    'page' => 1,
    'page_size' => 10
]);
print_r($response['data']);

// 3. POST request
$payload = [
    'sales_invoice' => [
        'transaction_date' => '2026-10-15',
        // ...
    ]
];
$response = $this->jurnalapi->post('/public/jurnal/api/v1/sales_invoices', $payload);
print_r($response['data']);
```

### Configuration
- **Environment**: `'sandbox'` (`https://sandbox-api.mekari.com`) or `'production'` (`https://api.mekari.com`).
- **Dependencies**: PHP cURL extension.

For full documentation, visit [Mekari Jurnal Open API Documentation](https://api-doc.jurnal.id/).
