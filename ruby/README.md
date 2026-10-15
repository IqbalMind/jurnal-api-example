# Jurnal API - Ruby Example

This directory contains a clean, zero-dependency Ruby client for the Mekari Jurnal Open API using HMAC-SHA256 authentication.

## Features
- Standard library only (`net/http`, `openssl`, `base64`, `time`) — no gems needed.
- Automatic RFC 7231 / HTTP-date formatting in GMT.
- Thread-safe and ready for Ruby on Rails, Sinatra, Sidekiq, or plain scripts.
- Supports `GET`, `POST`, `PUT`, `DELETE`.

## Prerequisites
- Ruby 2.7+ (Tested up to Ruby 3.3).
- Mekari Jurnal HMAC credentials (`CLIENT_ID` and `CLIENT_SECRET`). See the [Credentials Guide Slide](https://docs.google.com/presentation/d/1Oc5Z_2BoQX6cm6wQ_l1nkScWfSORv_rpT-d-c4WE8xM/edit?usp=sharing).

## Quick Start

```bash
cd ruby

# Set environment variables (optional)
export JURNAL_CLIENT_ID="your_client_id"
export JURNAL_CLIENT_SECRET="your_client_secret"
export JURNAL_ENV="sandbox"

# Run example
ruby example.rb
```

## Usage Example

```ruby
require_relative 'jurnal_api'

client = JurnalApi.new('YOUR_CLIENT_ID', 'YOUR_CLIENT_SECRET', 'sandbox')

# 1. GET Request
response = client.get('/public/jurnal/api/v1/sales_invoices/2963983')
puts response.body

# 2. GET with Query Parameters
response = client.get('/public/jurnal/api/v1/sales_invoices', { page: 1, page_size: 15 })
puts response.body

# 3. POST Request
payload = {
  sales_invoice: {
    transaction_date: '2026-10-15'
  }
}
response = client.post('/public/jurnal/api/v1/sales_invoices', payload)
puts response.code
```
