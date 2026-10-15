# Jurnal API - Swift (iOS / macOS) Example

This directory contains a Swift package implementation for connecting to the Mekari Jurnal Open API using HMAC-SHA256 authentication.

## Features
- Built with Apple's official `CryptoKit` (`HMAC<SHA256>`) and `URLSession`.
- Formats RFC 7231 / HTTP-date GMT strings accurately.
- Fully compatible with iOS 15+, macOS 12+, watchOS, and tvOS.
- Async / Await native API.

## Prerequisites
- Swift 5.8+ (Xcode 14+)
- Mekari Jurnal HMAC credentials (`CLIENT_ID` and `CLIENT_SECRET`). See the [Credentials Guide Slide](https://docs.google.com/presentation/d/1Oc5Z_2BoQX6cm6wQ_l1nkScWfSORv_rpT-d-c4WE8xM/edit?usp=sharing).

## Quick Start

```bash
cd swift

# Set environment variables (optional)
export JURNAL_CLIENT_ID="your_client_id"
export JURNAL_CLIENT_SECRET="your_client_secret"
export JURNAL_ENV="sandbox"

# Build and run with Swift Package Manager
swift run
```

## Usage in iOS / Swift App

```swift
import JurnalApiExample // Or copy JurnalApi.swift directly into your Xcode project

let client = JurnalApi(
    username: "your-client-id",
    secret: "your-client-secret",
    environment: "sandbox" // or "production"
)

Task {
    do {
        let (data, response) = try await client.get(path: "/public/jurnal/api/v1/sales_invoices/2963983")
        print("Status: \(response.statusCode)")
        let json = try JSONSerialization.jsonObject(with: data)
        print(json)
    } catch {
        print("API Error: \(error)")
    }
}
```
