# Jurnal API - Kotlin Example

This directory contains a clean Kotlin integration for the Mekari Jurnal Open API using HMAC-SHA256 authentication.

## Features
- Standard JDK libraries (`java.net.http.HttpClient`, `javax.crypto.Mac`) — zero extra dependencies.
- Perfect RFC 7231 / HTTP-date formatting in GMT/UTC.
- Fully compatible with Android (OkHttp/Retrofit compatible), Ktor, and Spring Boot with Kotlin.
- Clean idiom with Kotlin data classes and extension functions.

## Prerequisites
- JDK 17+ and Kotlin 1.9+ (or Gradle).
- Mekari Jurnal HMAC credentials (`CLIENT_ID` and `CLIENT_SECRET`). See the [Credentials Guide Slide](https://docs.google.com/presentation/d/1Oc5Z_2BoQX6cm6wQ_l1nkScWfSORv_rpT-d-c4WE8xM/edit?usp=sharing).

## Quick Start with Gradle

```bash
cd kotlin

# Set environment variables (optional)
export JURNAL_CLIENT_ID="your_client_id"
export JURNAL_CLIENT_SECRET="your_client_secret"
export JURNAL_ENV="sandbox"

# Run with gradle wrapper
gradle run
```

## Usage Example

```kotlin
import com.mekari.jurnal.JurnalApi

fun main() {
    val client = JurnalApi("YOUR_CLIENT_ID", "YOUR_CLIENT_SECRET", "sandbox")

    // 1. GET Request
    val response = client.get("/public/jurnal/api/v1/sales_invoices/2963983")
    println("Status: ${response.statusCode()}")
    println("Body: ${response.body()}")

    // 2. POST Request
    val json = """{"sales_invoice": {"transaction_date": "2026-10-15"}}"""
    val createResponse = client.post("/public/jurnal/api/v1/sales_invoices", json)
    println("Status: ${createResponse.statusCode()}")
}
```
