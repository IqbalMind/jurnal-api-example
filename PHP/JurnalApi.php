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

    public function request($method, $path) {
        $signatureData = $this->generateSignature($method, $path);

        $hmacHeader = 'hmac username="' . $this->hmacUsername . '", algorithm="hmac-sha256", headers="date request-line", signature="' . $signatureData['signature'] . '"';

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $this->apiUrl . $path);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Authorization: ' . $hmacHeader,
            'Date: ' . $signatureData['date'],
            'Accept: application/json'
        ]);

        $response = curl_exec($ch);
        if (curl_errno($ch)) {
            echo 'cURL Error: ' . curl_error($ch);
        } else {
            echo "Response: \n" . $response;
        }
        curl_close($ch);
    }
}
