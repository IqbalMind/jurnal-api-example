# Jurnal API - Rust Example

This directory contains a fast, memory-safe, asynchronous Rust client for the Mekari Jurnal Open API using HMAC-SHA256 authentication.

## Features
- Built on modern async `tokio` and `reqwest`.
- Correct RFC 7231 / HTTP-date GMT formatting using `chrono`.
- Automatic HMAC-SHA256 signature computation with `hmac` and `sha2`.
- Supports `GET`, `POST`, `PUT`, `DELETE`, and JSON serialization with `serde`.

## Prerequisites
- Rust 1.70+ (`cargo`).
- Mekari Jurnal HMAC credentials (`CLIENT_ID` and `CLIENT_SECRET`). See the [Credentials Guide Slide](https://docs.google.com/presentation/d/1Oc5Z_2BoQX6cm6wQ_l1nkScWfSORv_rpT-d-c4WE8xM/edit?usp=sharing).

## Quick Start

```bash
cd rust

# Set environment variables (optional)
export JURNAL_CLIENT_ID="your_client_id"
export JURNAL_CLIENT_SECRET="your_client_secret"
export JURNAL_ENV="sandbox" # or "production"

# Run example
cargo run
```

## Usage Example

```rust
use jurnal_api_rust::JurnalClient;
use serde_json::json;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let client = JurnalClient::new("YOUR_CLIENT_ID", "YOUR_CLIENT_SECRET", "sandbox");

    // 1. GET Invoice
    let resp = client.get("/public/jurnal/api/v1/sales_invoices/2963983").await?;
    println!("Status: {}", resp.status());
    println!("Body: {}", resp.text().await?);

    // 2. POST Invoice
    let payload = json!({
        "sales_invoice": {
            "transaction_date": "2026-10-15"
        }
    });
    let post_resp = client.post("/public/jurnal/api/v1/sales_invoices", payload).await?;
    println!("POST Status: {}", post_resp.status());

    Ok(())
}
```
