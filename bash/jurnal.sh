#!/usr/bin/env bash
# Mekari Jurnal Open API CLI - HMAC-SHA256 authenticated cURL wrapper
set -euo pipefail

CLIENT_ID="${JURNAL_CLIENT_ID:-}"
CLIENT_SECRET="${JURNAL_CLIENT_SECRET:-}"
ENV="${JURNAL_ENV:-sandbox}"
METHOD="GET"
PATH_ENDPOINT=""
DATA=""

usage() {
  cat <<EOF
Usage: $0 [options] -p <path>

Options:
  -p, --path PATH       Endpoint path (e.g., /public/jurnal/api/v1/sales_invoices/2963983) [Required]
  -m, --method METHOD   HTTP method (GET, POST, PUT, DELETE). Default: GET
  -d, --data DATA       JSON payload for POST/PUT requests
  -u, --user ID         Mekari Client ID (or export JURNAL_CLIENT_ID)
  -s, --secret SECRET   Mekari Client Secret (or export JURNAL_CLIENT_SECRET)
  -e, --env ENV         Environment: 'sandbox' or 'production'. Default: sandbox
  -h, --help            Show this help message

Examples:
  $0 -p /public/jurnal/api/v1/sales_invoices/2963983
  $0 -p "/public/jurnal/api/v1/sales_invoices?page=1&page_size=10"
  $0 -m POST -p /public/jurnal/api/v1/sales_invoices -d '{"sales_invoice": {"transaction_date": "2026-10-15"}}'
EOF
  exit 1
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    -p|--path)
      PATH_ENDPOINT="$2"
      shift 2
      ;;
    -m|--method)
      METHOD="$(echo "$2" | tr '[:lower:]' '[:upper:]')"
      shift 2
      ;;
    -d|--data)
      DATA="$2"
      shift 2
      ;;
    -u|--user)
      CLIENT_ID="$2"
      shift 2
      ;;
    -s|--secret)
      CLIENT_SECRET="$2"
      shift 2
      ;;
    -e|--env)
      ENV="$(echo "$2" | tr '[:upper:]' '[:lower:]')"
      shift 2
      ;;
    -h|--help)
      usage
      ;;
    *)
      echo "Unknown option: $1"
      usage
      ;;
  esac
done

if [[ -z "$PATH_ENDPOINT" ]]; then
  echo "Error: Path is required (-p <path>)" >&2
  usage
fi

if [[ -z "$CLIENT_ID" || -z "$CLIENT_SECRET" ]]; then
  echo "Error: JURNAL_CLIENT_ID and JURNAL_CLIENT_SECRET must be set via flags (-u / -s) or environment variables." >&2
  exit 1
fi

BASE_URL="https://sandbox-api.mekari.com"
if [[ "$ENV" == "production" ]]; then
  BASE_URL="https://api.mekari.com"
fi

# 1. Format RFC 7231 / HTTP-date GMT string
DATE_STRING="$(LC_ALL=C date -u '+%a, %d %b %Y %H:%M:%S GMT')"

# 2. Build Request Line
REQUEST_LINE="${METHOD} ${PATH_ENDPOINT} HTTP/1.1"

# 3. Build string to sign
STRING_TO_SIGN="date: ${DATE_STRING}
${REQUEST_LINE}"

# 4. Compute HMAC-SHA256 signature using openssl
SIGNATURE="$(printf "%s" "$STRING_TO_SIGN" | openssl dgst -sha256 -hmac "$CLIENT_SECRET" -binary | base64)"

# 5. Build Authorization Header
HMAC_HEADER="hmac username=\"${CLIENT_ID}\", algorithm=\"hmac-sha256\", headers=\"date request-line\", signature=\"${SIGNATURE}\""

FULL_URL="${BASE_URL}${PATH_ENDPOINT}"

# 6. Execute curl
CURL_ARGS=(
  -sS
  -X "$METHOD"
  "$FULL_URL"
  -H "Authorization: ${HMAC_HEADER}"
  -H "Date: ${DATE_STRING}"
  -H "Accept: application/json"
)

if [[ -n "$DATA" && "$METHOD" != "GET" && "$METHOD" != "DELETE" ]]; then
  CURL_ARGS+=(
    -H "Content-Type: application/json"
    -d "$DATA"
  )
fi

curl "${CURL_ARGS[@]}"
