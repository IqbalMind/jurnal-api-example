# Jurnal API - Go (Golang) Example

This directory contains a Go package and example implementation for interacting with the Mekari Jurnal Open API using HMAC-SHA256 authentication.

## Features
- Standard library only (`crypto/hmac`, `crypto/sha256`, `net/http`) — zero external dependencies.
- Handles RFC 7231 / HTTP-date formatting in UTC.
- Automatic signing of request line with query parameters.
- Reusable `jurnal.Client` supporting `Get`, `Post`, `Put`, `Delete`, and generic `Request`.
- Seamless switching between `jurnal.Sandbox` and `jurnal.Production`.

## Prerequisites
- Go 1.20 or later
- Mekari Jurnal HMAC credentials (`CLIENT_ID` and `CLIENT_SECRET`). See the [Credentials Guide Slide](https://docs.google.com/presentation/d/1Oc5Z_2BoQX6cm6wQ_l1nkScWfSORv_rpT-d-c4WE8xM/edit?usp=sharing).

## Quick Start

```bash
cd golang

# Set environment variables (or edit main.go directly)
export JURNAL_CLIENT_ID="your_client_id"
export JURNAL_CLIENT_SECRET="your_client_secret"
export JURNAL_ENV="sandbox"

# Run the example
go run main.go
```

## Usage

```go
package main

import (
	"fmt"
	"net/url"
	"github.com/IqbalMind/jurnal-api-example/golang/jurnal"
)

func main() {
	client := jurnal.NewClient("your-client-id", "your-client-secret", jurnal.Sandbox)

	// 1. GET single invoice
	resp, body, err := client.Get("/public/jurnal/api/v1/sales_invoices/2963983", nil)
	if err != nil {
		panic(err)
	}
	fmt.Printf("Status: %d, Body: %s\n", resp.StatusCode, string(body))

	// 2. GET with Query Parameters
	params := url.Values{}
	params.Set("page", "1")
	params.Set("page_size", "25")

	resp, body, err = client.Get("/public/jurnal/api/v1/sales_invoices", params)
	if err != nil {
		panic(err)
	}
	fmt.Printf("Status: %d\n", resp.StatusCode)

	// 3. POST JSON payload
	jsonPayload := []byte(`{"sales_invoice": {"transaction_date": "2026-10-15"}}`)
	resp, body, err = client.Post("/public/jurnal/api/v1/sales_invoices", jsonPayload)
	if err != nil {
		panic(err)
	}
	fmt.Printf("Status: %d\n", resp.StatusCode)
}
```

## HMAC Signature Specification
- **Request Line**: `[METHOD] [PATH] HTTP/1.1`
- **Date Header**: RFC 7231 GMT string (e.g., `Thu, 15 Oct 2026 04:09:20 GMT`)
- **String to Sign**: `date: <dateString>\n<requestLine>`
- **Authorization Header**:
  `hmac username="<username>", algorithm="hmac-sha256", headers="date request-line", signature="<base64-signature>"`
- **Important**: HMAC signature must be generated fresh on every single request. Never reuse signatures.
