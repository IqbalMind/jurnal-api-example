/**
 * Mekari Jurnal Open API - Google Apps Script Integration
 * 
 * Synchronize Google Sheets directly with Mekari Jurnal using HMAC-SHA256 authentication.
 */

// Configure your credentials or store them in Project Settings -> Script Properties
var CLIENT_ID = PropertiesService.getScriptProperties().getProperty('JURNAL_CLIENT_ID') || 'YOUR_CLIENT_ID';
var CLIENT_SECRET = PropertiesService.getScriptProperties().getProperty('JURNAL_CLIENT_SECRET') || 'YOUR_CLIENT_SECRET';
var ENVIRONMENT = PropertiesService.getScriptProperties().getProperty('JURNAL_ENV') || 'sandbox'; // 'sandbox' or 'production'

var BASE_URL = ENVIRONMENT === 'production' 
  ? 'https://api.mekari.com' 
  : 'https://sandbox-api.mekari.com';

/**
 * Generate HMAC-SHA256 signature and Date header.
 */
function generateHmacSignature(method, path) {
  var dateString = new Date().toUTCString();
  var requestLine = method.toUpperCase() + ' ' + path + ' HTTP/1.1';
  var stringToSign = 'date: ' + dateString + '\n' + requestLine;

  var signatureBytes = Utilities.computeHmacSha256Signature(stringToSign, CLIENT_SECRET);
  var signature = Utilities.base64Encode(signatureBytes);

  var hmacHeader = 'hmac username="' + CLIENT_ID + '", algorithm="hmac-sha256", headers="date request-line", signature="' + signature + '"';

  return {
    date: dateString,
    requestLine: requestLine,
    signature: signature,
    hmacHeader: hmacHeader
  };
}

/**
 * Make an authenticated HTTP request to Mekari Jurnal API.
 */
function jurnalRequest(method, path, payload) {
  var sig = generateHmacSignature(method, path);

  var headers = {
    'Authorization': sig.hmacHeader,
    'Date': sig.date,
    'Accept': 'application/json'
  };

  var options = {
    method: method.toLowerCase(),
    headers: headers,
    muteHttpExceptions: true
  };

  if (payload && method.toUpperCase() !== 'GET' && method.toUpperCase() !== 'DELETE') {
    headers['Content-Type'] = 'application/json';
    options.payload = typeof payload === 'string' ? payload : JSON.stringify(payload);
  }

  var response = UrlFetchApp.fetch(BASE_URL + path, options);
  var responseCode = response.getResponseCode();
  var responseText = response.getContentText();

  var data = null;
  try {
    data = JSON.parse(responseText);
  } catch (e) {
    data = responseText;
  }

  return {
    status: responseCode,
    success: responseCode >= 200 && responseCode < 300,
    data: data
  };
}

/**
 * Example: Fetch Sales Invoice by ID.
 */
function getSalesInvoice(invoiceId) {
  var path = '/public/jurnal/api/v1/sales_invoices/' + (invoiceId || '2963983');
  var result = jurnalRequest('GET', path);
  Logger.log('Result status: ' + result.status);
  Logger.log(JSON.stringify(result.data, null, 2));
  return result;
}

/**
 * Adds a custom menu to Google Sheets when opened.
 */
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('📊 Mekari Jurnal')
    .addItem('Test Connection', 'testJurnalConnection')
    .addItem('Fetch Invoice into Active Cell', 'fetchInvoiceToSheet')
    .addToUi();
}

/**
 * Test connectivity from Google Sheets to Mekari Jurnal.
 */
function testJurnalConnection() {
  var ui = SpreadsheetApp.getUi();
  var result = getSalesInvoice('2963983');
  if (result.success) {
    ui.alert('✅ Connected successfully to Mekari Jurnal! Status: ' + result.status);
  } else {
    ui.alert('❌ Error: ' + result.status + '\n' + JSON.stringify(result.data));
  }
}

/**
 * Populates active cell with invoice data.
 */
function fetchInvoiceToSheet() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var cell = sheet.getActiveCell();
  var invoiceId = cell.getValue();

  if (!invoiceId) {
    SpreadsheetApp.getUi().alert('Please enter an Invoice ID in the active cell first.');
    return;
  }

  var result = getSalesInvoice(invoiceId);
  if (result.success && result.data && result.data.sales_invoice) {
    var inv = result.data.sales_invoice;
    cell.offset(0, 1).setValue(inv.transaction_no || '');
    cell.offset(0, 2).setValue(inv.person_name || '');
    cell.offset(0, 3).setValue(inv.original_amount || 0);
    cell.offset(0, 4).setValue(inv.status || '');
  } else {
    SpreadsheetApp.getUi().alert('Failed to retrieve invoice: ' + JSON.stringify(result.data));
  }
}
