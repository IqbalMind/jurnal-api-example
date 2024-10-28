# Jurnal API - Laravel Integration

This folder demonstrates how to integrate the Jurnal API with a Laravel 11 project using a custom service.

## Getting Started

1. Copy `JurnalApi.php` into `app/Services/`.
2. Register the service in `AppServiceProvider.php`.
3. Add your credentials to `.env` and `config/services.php`.

## Configuration

1. In `.env` file:

    ```plaintext
    JURNAL_USERNAME=your-username
    JURNAL_SECRET=your-secret
    JURNAL_ENVIRONMENT=sandbox # Change to 'production' for live API
    ```

2. In `config/services.php`:

    ```php
    'jurnal' => [
        'username' => env('JURNAL_USERNAME'),
        'secret' => env('JURNAL_SECRET'),
        'environment' => env('JURNAL_ENVIRONMENT', 'sandbox')
    ],
    ```

## Example Usage in a Controller

Inject `JurnalApi` into a controller to make requests:

```php
use App\Services\JurnalApi;

class ApiTestController extends Controller
{
    public function index(JurnalApi $jurnalApi) {
        $response = $jurnalApi->request('GET', '/public/jurnal/api/v1/sales_invoices/2963983');
        return response()->json(json_decode($response, true));
    }
}
```

### Additional Notes
- Environment: To use the production API, ensure JURNAL_ENVIRONMENT is set to production in the .env file.
- Dependencies: The JurnalApi service depends on the curl extension, which is enabled by default in most PHP installations.

For full documentation, visit [Mekari Jurnal Open API Documentation](https://api-doc.jurnal.id/).
