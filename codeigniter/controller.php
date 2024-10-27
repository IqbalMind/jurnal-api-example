<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class ApiTest extends CI_Controller {

    public function index() {
        // Load the JurnalApi library with parameters
        $this->load->library('JurnalApi', [
            'username' => 'your-username',   // Replace with your HMAC username
            'secret' => 'your-secret',       // Replace with your HMAC secret
            'environment' => 'sandbox'       // Use 'production' for live API
        ]);

        // Define the request method and endpoint
        $requestMethod = 'GET';
        $requestPath = '/public/jurnal/api/v1/sales_invoices/2963983';

        // Make the API request and capture the response
        $response = $this->jurnalapi->request($requestMethod, $requestPath);

        // Display the response
        echo "<pre>";
        print_r($response);
        echo "</pre>";
    }
}
