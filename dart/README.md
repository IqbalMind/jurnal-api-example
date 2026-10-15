# Jurnal API - Dart & Flutter Example

This package provides a clean, cross-platform Dart & Flutter implementation for communicating with the Mekari Jurnal Open API using HMAC-SHA256 authentication.

## Features
- Fully compatible with **Dart CLI** and **Flutter** (Android, iOS, Web, macOS, Windows, Linux).
- Automatic RFC 7231 / HTTP-date formatting in UTC.
- Seamless query parameter integration into HMAC signature and request URL.
- Support for `GET`, `POST`, `PUT`, `DELETE`.

## Prerequisites
- Dart SDK 3.0+ or Flutter 3.10+
- Mekari Jurnal HMAC credentials (`CLIENT_ID` and `CLIENT_SECRET`). See the [Credentials Guide Slide](https://docs.google.com/presentation/d/1Oc5Z_2BoQX6cm6wQ_l1nkScWfSORv_rpT-d-c4WE8xM/edit?usp=sharing).

## Quick Start (Dart CLI)

```bash
cd dart
dart pub get

# Set environment variables (optional)
export JURNAL_CLIENT_ID="your_client_id"
export JURNAL_CLIENT_SECRET="your_client_secret"
export JURNAL_ENV="sandbox"

# Run example
dart run bin/example.dart
```

## Flutter Usage Note
In Flutter applications, always avoid placing the `CLIENT_SECRET` directly in app binaries distributed to customers (as reverse engineering can extract secrets). Best practice is to use a backend server/proxy (like Node.js, Python, or Go) to sign requests, or use secure backend-for-frontend (BFF) patterns.
