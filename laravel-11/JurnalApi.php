<?php

namespace App\Services;

use Exception;

class JurnalApi {
    private $hmacUsername;
    private $hmacSecret;
    private $apiUrl;

    public function __construct($username, $secret, $environment = 'sandbox') {
        $this->hmacUsername = $username;
        $this->hmacSecret = $secret;

        // Set the environment (default to sandbox)
        $this->apiUrl = $environment === 'production' 
                        ? 'https://api.mekari.com' 
                        : 'https://sandbox-api.mekari.com';
    }

    private function generateSignature($method, $path) {
        $dateString = gmdate('D, d M Y H:i:s') . ' GMT';
        $requestLine = $method . ' ' . $path . ' HTTP/1.1';
        $dataToSign = 'date: ' . $dateString . "\n" . $requestLine;
        $signature = base64_encode(hash_hmac('sha256', $dataToSign, $this->hmacSecret, true));

        return [
            'signature' => $signature,
            'date' => $dateString
        ];
    }

    public function request($method, $path, $data = null, array $queryParams = []) {
        $method = strtoupper($method);
        if (!empty($queryParams)) {
            $queryString = http_build_query($queryParams);
            $path .= (strpos($path, '?') === false ? '?' : '&') . $queryString;
        }

        $signatureData = $this->generateSignature($method, $path);
        $hmacHeader = 'hmac username="' . $this->hmacUsername . '", algorithm="hmac-sha256", headers="date request-line", signature="' . $signatureData['signature'] . '"';

        $headers = [
            'Authorization: ' . $hmacHeader,
            'Date: ' . $signatureData['date'],
            'Accept: application/json'
        ];

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $this->apiUrl . $path);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);

        if ($method !== 'GET' && $method !== 'DELETE' && $data !== null) {
            $jsonData = is_string($data) ? $data : json_encode($data);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonData);
            $headers[] = 'Content-Type: application/json';
            $headers[] = 'Content-Length: ' . strlen($jsonData);
        }

        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

        if (curl_errno($ch)) {
            $error = curl_error($ch);
            curl_close($ch);
            throw new Exception('cURL Error: ' . $error);
        }

        curl_close($ch);
        return $response;
    }

    public function get($path, array $queryParams = []) {
        return $this->request('GET', $path, null, $queryParams);
    }

    public function post($path, $data = null, array $queryParams = []) {
        return $this->request('POST', $path, $data, $queryParams);
    }

    public function put($path, $data = null, array $queryParams = []) {
        return $this->request('PUT', $path, $data, $queryParams);
    }

    public function delete($path, array $queryParams = []) {
        return $this->request('DELETE', $path, null, $queryParams);
    }
}
