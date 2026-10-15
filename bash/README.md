# Jurnal API - Bash / cURL CLI Example

This directory provides a ready-to-run shell script (`jurnal.sh`) for interacting with the Mekari Jurnal Open API using HMAC-SHA256 authentication directly from your terminal.

## Features
- Standard Unix utilities only (`curl`, `openssl`, `date`) — works on macOS, Linux, and WSL.
- Formats RFC 7231 / HTTP-date GMT string dynamically.
- Perfect for CLI testing, cron automations, CI/CD pipeline webhooks, or rapid troubleshooting without installing runtimes.
- Supports `GET`, `POST`, `PUT`, `DELETE`, query strings, and custom JSON bodies.

## Prerequisites
- `curl` and `openssl` (installed by default on macOS and most Linux distros).
- Mekari Jurnal HMAC credentials (`CLIENT_ID` and `CLIENT_SECRET`). See the [Credentials Guide Slide](https://docs.google.com/presentation/d/1Oc5Z_2BoQX6cm6wQ_l1nkScWfSORv_rpT-d-c4WE8xM/edit?usp=sharing).

## Quick Start

```bash
cd bash

# Set your credentials
export JURNAL_CLIENT_ID="your_client_id"
export JURNAL_CLIENT_SECRET="your_client_secret"
export JURNAL_ENV="sandbox" # or "production"

# 1. GET a Sales Invoice
./jurnal.sh -p /public/jurnal/api/v1/sales_invoices/2963983

# 2. GET with Query Parameters
./jurnal.sh -p "/public/jurnal/api/v1/sales_invoices?page=1&page_size=10"

# 3. POST JSON payload
./jurnal.sh -m POST -p /public/jurnal/api/v1/sales_invoices -d '{"sales_invoice": {"transaction_date": "2026-10-15"}}'
```

## Options
| Flag | Description |
|---|---|
| `-p`, `--path` | Endpoint path (Required, e.g. `/public/jurnal/api/v1/sales_invoices/1`) |
| `-m`, `--method`| HTTP method (`GET`, `POST`, `PUT`, `DELETE`). Default: `GET` |
| `-d`, `--data` | JSON request payload string |
| `-u`, `--user` | Mekari Client ID (or set `JURNAL_CLIENT_ID`) |
| `-s`, `--secret`| Mekari Client Secret (or set `JURNAL_CLIENT_SECRET`) |
| `-e`, `--env` | `sandbox` (default) or `production` |
| `-h`, `--help` | Show usage options |
