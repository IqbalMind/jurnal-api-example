import 'dart:convert';
import 'package:crypto/crypto.dart';
import 'package:http/http.dart' as http;
import 'package:intl/intl.dart';

class SignatureResult {
  final String date;
  final String requestLine;
  final String signature;
  final String authorizationHeader;

  SignatureResult({
    required this.date,
    required this.requestLine,
    required this.signature,
    required this.authorizationHeader,
  });
}

class JurnalApi {
  final String username;
  final String secret;
  final String apiUrl;
  final http.Client client;

  final DateFormat _httpDateFormatter = DateFormat("EEE, dd MMM yyyy HH:mm:ss 'GMT'", 'en_US');

  JurnalApi({
    required this.username,
    required this.secret,
    String environment = 'sandbox',
    http.Client? client,
  })  : apiUrl = environment.toLowerCase() == 'production'
            ? 'https://api.mekari.com'
            : 'https://sandbox-api.mekari.com',
        client = client ?? http.Client();

  SignatureResult generateSignature(String method, String path) {
    // RFC 7231 / HTTP-date GMT format
    final dateString = _httpDateFormatter.format(DateTime.now().toUtc());
    final upperMethod = method.toUpperCase();
    final requestLine = '$upperMethod $path HTTP/1.1';
    final stringToSign = 'date: $dateString\n$requestLine';

    final hmac = Hmac(sha256, utf8.encode(secret));
    final digest = hmac.convert(utf8.encode(stringToSign));
    final signature = base64Encode(digest.bytes);

    final authHeader =
        'hmac username="$username", algorithm="hmac-sha256", headers="date request-line", signature="$signature"';

    return SignatureResult(
      date: dateString,
      requestLine: requestLine,
      signature: signature,
      authorizationHeader: authHeader,
    );
  }

  Future<http.Response> request(
    String method,
    String path, {
    Object? body,
    Map<String, String>? queryParams,
  }) async {
    final upperMethod = method.toUpperCase();

    String fullPath = path;
    if (queryParams != null && queryParams.isNotEmpty) {
      final queryStr = Uri(queryParameters: queryParams).query;
      fullPath += (fullPath.contains('?') ? '&' : '?') + queryStr;
    }

    final sig = generateSignature(upperMethod, fullPath);
    final uri = Uri.parse('$apiUrl$fullPath');

    final headers = {
      'Authorization': sig.authorizationHeader,
      'Date': sig.date,
      'Accept': 'application/json',
    };

    String? bodyStr;
    if (body != null && upperMethod != 'GET' && upperMethod != 'DELETE') {
      headers['Content-Type'] = 'application/json';
      bodyStr = body is String ? body : jsonEncode(body);
    }

    switch (upperMethod) {
      case 'GET':
        return await client.get(uri, headers: headers);
      case 'POST':
        return await client.post(uri, headers: headers, body: bodyStr);
      case 'PUT':
        return await client.put(uri, headers: headers, body: bodyStr);
      case 'DELETE':
        return await client.delete(uri, headers: headers);
      default:
        throw UnsupportedError('HTTP method $upperMethod not supported');
    }
  }

  Future<http.Response> get(String path, {Map<String, String>? queryParams}) =>
      request('GET', path, queryParams: queryParams);

  Future<http.Response> post(String path, Object body) =>
      request('POST', path, body: body);

  Future<http.Response> put(String path, Object body) =>
      request('PUT', path, body: body);

  Future<http.Response> delete(String path) => request('DELETE', path);
}
