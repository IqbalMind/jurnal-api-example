package com.mekari.jurnal;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.Base64;
import java.util.Locale;
import java.util.Map;

public class JurnalApi {
    private final String username;
    private final String secret;
    private final String apiUrl;
    private final HttpClient httpClient;

    private static final DateTimeFormatter HTTP_DATE_FORMATTER = DateTimeFormatter
            .ofPattern("EEE, dd MMM yyyy HH:mm:ss 'GMT'", Locale.US)
            .withZone(ZoneOffset.UTC);

    public static class SignatureResult {
        public final String date;
        public final String requestLine;
        public final String signature;
        public final String authorizationHeader;

        public SignatureResult(String date, String requestLine, String signature, String authorizationHeader) {
            this.date = date;
            this.requestLine = requestLine;
            this.signature = signature;
            this.authorizationHeader = authorizationHeader;
        }
    }

    public JurnalApi(String username, String secret, String environment) {
        if (username == null || secret == null) {
            throw new IllegalArgumentException("Username and secret cannot be null");
        }
        this.username = username;
        this.secret = secret;
        this.apiUrl = "production".equalsIgnoreCase(environment)
                ? "https://api.mekari.com"
                : "https://sandbox-api.mekari.com";
        this.httpClient = HttpClient.newHttpClient();
    }

    public JurnalApi(String username, String secret) {
        this(username, secret, "sandbox");
    }

    public SignatureResult generateSignature(String method, String path) {
        try {
            String dateString = HTTP_DATE_FORMATTER.format(Instant.now());
            String requestLine = method.toUpperCase() + " " + path + " HTTP/1.1";
            String dataToSign = "date: " + dateString + "\n" + requestLine;

            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKeySpec = new SecretKeySpec(
                    secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(secretKeySpec);

            byte[] rawHmac = mac.doFinal(dataToSign.getBytes(StandardCharsets.UTF_8));
            String signature = Base64.getEncoder().encodeToString(rawHmac);

            String authHeader = String.format(
                    "hmac username=\"%s\", algorithm=\"hmac-sha256\", headers=\"date request-line\", signature=\"%s\"",
                    username, signature
            );

            return new SignatureResult(dateString, requestLine, signature, authHeader);
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate HMAC signature: " + e.getMessage(), e);
        }
    }

    public HttpResponse<String> request(String method, String path, String body) throws IOException, InterruptedException {
        String upperMethod = method.toUpperCase();
        SignatureResult sig = generateSignature(upperMethod, path);

        HttpRequest.Builder reqBuilder = HttpRequest.newBuilder()
                .uri(URI.create(apiUrl + path))
                .header("Authorization", sig.authorizationHeader)
                .header("Date", sig.date)
                .header("Accept", "application/json");

        if (body != null && !body.isEmpty() && !"GET".equals(upperMethod) && !"DELETE".equals(upperMethod)) {
            reqBuilder.header("Content-Type", "application/json");
            reqBuilder.method(upperMethod, HttpRequest.BodyPublishers.ofString(body, StandardCharsets.UTF_8));
        } else if ("DELETE".equals(upperMethod)) {
            reqBuilder.DELETE();
        } else if ("GET".equals(upperMethod)) {
            reqBuilder.GET();
        } else {
            reqBuilder.method(upperMethod, HttpRequest.BodyPublishers.noBody());
        }

        return httpClient.send(reqBuilder.build(), HttpResponse.BodyHandlers.ofString());
    }

    public HttpResponse<String> get(String path) throws IOException, InterruptedException {
        return request("GET", path, null);
    }

    public HttpResponse<String> post(String path, String body) throws IOException, InterruptedException {
        return request("POST", path, body);
    }

    public HttpResponse<String> put(String path, String body) throws IOException, InterruptedException {
        return request("PUT", path, body);
    }

    public HttpResponse<String> delete(String path) throws IOException, InterruptedException {
        return request("DELETE", path, null);
    }
}
