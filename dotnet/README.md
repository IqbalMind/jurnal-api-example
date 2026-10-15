# Jurnal API - .NET / C# Example

This directory contains a .NET 8 / C# integration for the Mekari Jurnal Open API using HMAC-SHA256 authentication.

## Features
- Standard library only (`System.Net.Http`, `System.Security.Cryptography.HMACSHA256`).
- Automatic RFC 1123 / HTTP-date formatting in UTC.
- Thread-safe, dependency-injection friendly `JurnalApi` class.
- Supports `GET`, `POST`, `PUT`, `DELETE` operations.

## Prerequisites
- .NET 8.0 SDK or later.
- Mekari Jurnal HMAC credentials (`CLIENT_ID` and `CLIENT_SECRET`). See the [Credentials Guide Slide](https://docs.google.com/presentation/d/1Oc5Z_2BoQX6cm6wQ_l1nkScWfSORv_rpT-d-c4WE8xM/edit?usp=sharing).

## Quick Start

```bash
cd dotnet

# Set credentials (optional)
export JURNAL_CLIENT_ID="your_client_id"
export JURNAL_CLIENT_SECRET="your_client_secret"
export JURNAL_ENV="sandbox"

# Run the console project
dotnet run
```

## Usage Example

```csharp
using Mekari.Jurnal;

var client = new JurnalApi("your-client-id", "your-client-secret", "sandbox");

// 1. GET Request
var response = await client.GetAsync("/public/jurnal/api/v1/sales_invoices/2963983");
string content = await response.Content.ReadAsStringAsync();
Console.WriteLine(content);

// 2. POST Request
string json = "{\"sales_invoice\": {\"transaction_date\": \"2026-10-15\"}}";
var postResponse = await client.PostAsync("/public/jurnal/api/v1/sales_invoices", json);
Console.WriteLine(postResponse.StatusCode);
```
