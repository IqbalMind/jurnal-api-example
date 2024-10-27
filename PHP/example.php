<?php
require 'JurnalApi.php'; // Make sure this file path is correct

// Replace with your actual HMAC username and secret
$hmacUsername = 'your-username';
$hmacSecret = 'your-secret';

// Initialize the JurnalApi class (defaults to sandbox)
$jurnalApi = new JurnalApi($hmacUsername, $hmacSecret);

// Define the request method and endpoint path
$requestMethod = 'GET';
$requestPath = '/public/jurnal/api/v1/sales_invoices/2963983';

// Make the API request
$jurnalApi->request($requestMethod, $requestPath);
