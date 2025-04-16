<?php
class JurnalApi {
    private $hmacUsername;
    private $hmacSecret;
    private $apiUrl;

    public function __construct($username, $secret, $environment = 'sandbox') {
        $this->hmacUsername = $username;
        $this->hmacSecret = $secret;

        // Set API URL based on environment
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

    public function request($method, $path, $data = null) {
        $method = strtoupper($method);
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
        
        // Handle data for POST, PUT, PATCH methods
        if ($method !== 'GET' && $method !== 'DELETE' && $data !== null) {
            if (is_string($data)) {
                $jsonData = $data; // Already encoded
            } else {
                $jsonData = json_encode($data);
            }
            
            curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonData);
            $headers[] = 'Content-Type: application/json';
            $headers[] = 'Content-Length: ' . strlen($jsonData);
        }
        
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        
        // For debugging
        curl_setopt($ch, CURLOPT_VERBOSE, true);
        $verbose = fopen('php://temp', 'w+');
        curl_setopt($ch, CURLOPT_STDERR, $verbose);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        
        $result = [
            'status' => $httpCode,
            'success' => false,
            'data' => null,
            'error' => null,
            'error_details' => null,
            'debug' => null,
            'raw_response' => $response
        ];
        
        // Get verbose debug information
        rewind($verbose);
        $verboseLog = stream_get_contents($verbose);
        $result['debug'] = $verboseLog;
        
        if (curl_errno($ch)) {
            $result['error'] = 'cURL Error: ' . curl_error($ch);
        } else {
            $result['success'] = $httpCode >= 200 && $httpCode < 300;
            
            // Try to decode as JSON
            $decodedResponse = json_decode($response, true);
            if (json_last_error() === JSON_ERROR_NONE) {
                $result['data'] = $decodedResponse;
                
                // Extract error details for common error codes
                if (!$result['success']) {
                    if ($httpCode === 422) {
                        // Handle validation errors (422 Unprocessable Entity)
                        if (isset($decodedResponse['errors'])) {
                            $result['error'] = 'Validation Error';
                            $result['error_details'] = $decodedResponse['errors'];
                        } elseif (isset($decodedResponse['message'])) {
                            $result['error'] = 'Validation Error: ' . $decodedResponse['message'];
                            $result['error_details'] = $decodedResponse;
                        } elseif (isset($decodedResponse['error'])) {
                            $result['error'] = 'API Error: ' . $decodedResponse['error'];
                            $result['error_details'] = $decodedResponse;
                        }
                    } elseif ($httpCode === 401) {
                        $result['error'] = 'Authentication Error';
                        $result['error_details'] = $decodedResponse;
                    } elseif ($httpCode === 403) {
                        $result['error'] = 'Permission Error';
                        $result['error_details'] = $decodedResponse;
                    } elseif ($httpCode === 404) {
                        $result['error'] = 'Resource Not Found';
                        $result['error_details'] = $decodedResponse;
                    } elseif ($httpCode >= 500) {
                        $result['error'] = 'Server Error';
                        $result['error_details'] = $decodedResponse;
                    }
                }
            } else {
                // Not JSON - store as string
                $result['data'] = $response;
            }
            
            // If not successful and no error message set yet
            if (!$result['success'] && !$result['error']) {
                $result['error'] = 'HTTP Error: ' . $httpCode;
            }
        }
        
        curl_close($ch);
        return $result;
    }
    
    // Helper methods for common HTTP verbs
    public function get($path) {
        return $this->request('GET', $path);
    }
    
    public function post($path, $data) {
        return $this->request('POST', $path, $data);
    }
    
    public function put($path, $data) {
        return $this->request('PUT', $path, $data);
    }
    
    public function delete($path) {
        return $this->request('DELETE', $path);
    }
}
