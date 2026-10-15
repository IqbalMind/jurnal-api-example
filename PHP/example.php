<?php
require 'JurnalApi.php';

// Replace with your actual HMAC credentials
// Or pass them via environment variables
$hmacUsername = getenv('JURNAL_CLIENT_ID') ?: 'your-client-id';
$hmacSecret = getenv('JURNAL_CLIENT_SECRET') ?: 'your-client-secret';
$environment = getenv('JURNAL_ENV') ?: 'sandbox'; // 'sandbox' or 'production'

// Initialize the JurnalApi class
$jurnalApi = new JurnalApi($hmacUsername, $hmacSecret, $environment);

// Define request details
$requestMethod = 'GET';
$requestPath = '/public/jurnal/api/v1/sales_invoices/2963983';

echo "Making {$requestMethod} request to {$requestPath} ({$environment})...\n";

// Make the API request
$response = $jurnalApi->request($requestMethod, $requestPath);

// Output response
echo "Status Code: " . $response['status'] . "\n";
echo "Response:\n";
print_r($response['data'] ?: $response['error']);
