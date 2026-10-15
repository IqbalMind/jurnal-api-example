package com.mekari.jurnal

import java.net.URI
import java.net.http.HttpClient
import java.net.http.HttpRequest
import java.net.http.HttpResponse
import java.nio.charset.StandardCharsets
import java.time.Instant
import java.time.ZoneOffset
import java.time.format.DateTimeFormatter
import java.util.Base64
import java.util.Locale
import javax.crypto.Mac
import javax.crypto.spec.SecretKeySpec

data class SignatureResult(
    val date: String,
    val requestLine: String,
    val signature: String,
    val authorizationHeader: String
)

class JurnalApi(
    private val username: String,
    private val secret: String,
    environment: String = "sandbox",
    private val httpClient: HttpClient = HttpClient.newHttpClient()
) {
    private val apiUrl: String = if (environment.equals("production", ignoreCase = true)) {
        "https://api.mekari.com"
    } else {
        "https://sandbox-api.mekari.com"
    }

    private val dateFormatter = DateTimeFormatter
        .ofPattern("EEE, dd MMM yyyy HH:mm:ss 'GMT'", Locale.US)
        .withZone(ZoneOffset.UTC)

    fun generateSignature(method: String, path: String): SignatureResult {
        val dateString = dateFormatter.format(Instant.now())
        val upperMethod = method.uppercase()
        val requestLine = "$upperMethod $path HTTP/1.1"
        val stringToSign = "date: $dateString\n$requestLine"

        val mac = Mac.getInstance("HmacSHA256")
        val secretKeySpec = SecretKeySpec(secret.toByteArray(StandardCharsets.UTF_8), "HmacSHA256")
        mac.init(secretKeySpec)

        val rawHmac = mac.doFinal(stringToSign.toByteArray(StandardCharsets.UTF_8))
        val signature = Base64.getEncoder().encodeToString(rawHmac)

        val authHeader = "hmac username=\"$username\", algorithm=\"hmac-sha256\", headers=\"date request-line\", signature=\"$signature\""

        return SignatureResult(dateString, requestLine, signature, authHeader)
    }

    fun request(method: String, path: String, body: String? = null): HttpResponse<String> {
        val upperMethod = method.uppercase()
        val sig = generateSignature(upperMethod, path)

        val requestBuilder = HttpRequest.newBuilder()
            .uri(URI.create("$apiUrl$path"))
            .header("Authorization", sig.authorizationHeader)
            .header("Date", sig.date)
            .header("Accept", "application/json")

        if (!body.isNullOrEmpty() && upperMethod !in listOf("GET", "DELETE")) {
            requestBuilder.header("Content-Type", "application/json")
            requestBuilder.method(upperMethod, HttpRequest.BodyPublishers.ofString(body, StandardCharsets.UTF_8))
        } else if (upperMethod == "DELETE") {
            requestBuilder.DELETE()
        } else if (upperMethod == "GET") {
            requestBuilder.GET()
        } else {
            requestBuilder.method(upperMethod, HttpRequest.BodyPublishers.noBody())
        }

        return httpClient.send(requestBuilder.build(), HttpResponse.BodyHandlers.ofString())
    }

    fun get(path: String): HttpResponse<String> = request("GET", path)
    fun post(path: String, body: String): HttpResponse<String> = request("POST", path, body)
    fun put(path: String, body: String): HttpResponse<String> = request("PUT", path, body)
    fun delete(path: String): HttpResponse<String> = request("DELETE", path)
}
