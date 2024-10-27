<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\JurnalApi;

class ApiTestController extends Controller
{
    private $jurnalApi;

    public function __construct(JurnalApi $jurnalApi)
    {
        $this->jurnalApi = $jurnalApi;
    }

    public function index()
    {
        try {
            // Define the request method and endpoint
            $requestMethod = 'GET';
            $requestPath = '/public/jurnal/api/v1/sales_invoices/2963983';

            // Make the API request
            $response = $this->jurnalApi->request($requestMethod, $requestPath);

            // Display the response
            return response()->json(json_decode($response, true));

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
