# Jurnal API - PHP Native Example

This example demonstrates how to use the Jurnal API with PHP native code using HMAC authentication. The example includes a `JurnalApi` class that you can reuse to easily authenticate and send requests.

## Getting Started

1. Clone this repository.
2. Open the `JurnalApi.php` file and replace `your-username` and `your-secret` with your HMAC credentials.

### Usage

```php
require 'JurnalApi.php';

$jurnalApi = new JurnalApi('your-username', 'your-secret');
$response = $jurnalApi->request('GET', '/public/jurnal/api/v1/sales_invoices/2963983');
echo $response;
