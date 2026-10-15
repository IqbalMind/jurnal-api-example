import 'dart:io';
import '../lib/jurnal_api.dart';

void main() async {
  final clientId = Platform.environment['JURNAL_CLIENT_ID'] ?? 'your-client-id';
  final clientSecret = Platform.environment['JURNAL_CLIENT_SECRET'] ?? 'your-client-secret';
  final env = Platform.environment['JURNAL_ENV'] ?? 'sandbox';

  print('Initializing Dart Mekari Jurnal client [$env]...');
  final api = JurnalApi(username: clientId, secret: clientSecret, environment: env);

  final path = '/public/jurnal/api/v1/sales_invoices/2963983';
  print('Sending GET request to $path...');

  try {
    final response = await api.get(path);
    print('Status Code: ${response.statusCode}');
    print('Response Body:\n${response.body}');
  } catch (e) {
    print('Error: $e');
  }
}
