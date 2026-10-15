# Jurnal API - Laravel Integration

This folder demonstrates how to integrate the Mekari Jurnal Open API with a Laravel 11 project using a custom service and HMAC-SHA256 authentication.

## Getting Started

1. Copy `JurnalApi.php` into your Laravel app's `app/Services/` directory.
2. Register the service in `AppServiceProvider.php` (see example in this folder).
3. Add your credentials to `.env` and `config/services.php`.

> Need credentials? Follow the [Credentials Guide Slide](https://docs.google.com/presentation/d/1Oc5Z_2BoQX6cm6wQ_l1nkScWfSORv_rpT-d-c4WE8xM/edit?usp=sharing).

## Configuration

1. In `.env` file:

```plaintext
JURNAL_USERNAME=your-client-id
JURNAL_SECRET=your-client-secret
JURNAL_ENVIRONMENT=sandbox # Change to 'production' for live API
```

2. In `config/services.php`:

```php
'jurnal' => [
    'username' => env('JURNAL_USERNAME'),
    'secret' => env('JURNAL_SECRET'),
    'environment' => env('JURNAL_ENVIRONMENT', 'sandbox'),
],
```

## Example Usage in a Controller

Inject `JurnalApi` into a controller:

```php
namespace App\Http\Controllers;

use App\Services\JurnalApi;
use Illuminate\Http\JsonResponse;

class InvoiceController extends Controller
{
    public function show(JurnalApi $jurnalApi, $id): JsonResponse
    {
        $response = $jurnalApi->get("/public/jurnal/api/v1/sales_invoices/{$id}");
        return response()->json(json_decode($response, true));
    }

    public function index(JurnalApi $jurnalApi): JsonResponse
    {
        $response = $jurnalApi->get('/public/jurnal/api/v1/sales_invoices', [
            'page' => 1,
            'page_size' => 15,
        ]);
        return response()->json(json_decode($response, true));
    }
}
```

### Additional Notes
- **Environment**: To use the production API, ensure `JURNAL_ENVIRONMENT` is set to `production` in your `.env` file (`https://api.mekari.com`).
- **Dependencies**: Uses PHP cURL extension.

For full documentation, visit [Mekari Jurnal Open API Documentation](https://api-doc.jurnal.id/).
