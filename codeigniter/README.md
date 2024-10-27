# Jurnal API - CodeIgniter Integration

This directory contains a CodeIgniter library for integrating with the Jurnal API using HMAC authentication. 

## Getting Started

1. Place the `JurnalApi.php` library file into `application/libraries/`.
2. Add your HMAC credentials when loading the library in a controller.

### Example Usage

1. Load the library in a controller:

```php
$this->load->library('JurnalApi', [
    'username' => 'your-username',
    'secret' => 'your-secret',
    'environment' => 'sandbox' // Change to 'production' for live API
]);
```
2. Make an API request:
```php
$response = $this->jurnalapi->request('GET', '/public/jurnal/api/v1/sales_invoices/2963983');
echo $response;
```

### Configuration
- Environment: To switch to production, set 'production' as the third parameter when initializing JurnalApi.
- Dependencies: This code only uses PHP’s built-in curl library.

For full documentation, visit [Mekari Jurnal Open API Documentation](https://api-doc.jurnal.id/).
