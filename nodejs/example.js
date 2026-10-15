const JurnalApi = require('./JurnalApi');

// Replace with your actual Mekari Client ID and Secret
// Or pass via environment variables JURNAL_CLIENT_ID and JURNAL_CLIENT_SECRET
const HMAC_USERNAME = process.env.JURNAL_CLIENT_ID || 'your-client-id';
const HMAC_SECRET = process.env.JURNAL_CLIENT_SECRET || 'your-client-secret';
const ENVIRONMENT = process.env.JURNAL_ENV || 'sandbox'; // 'sandbox' or 'production'

async function run() {
  const jurnal = new JurnalApi(HMAC_USERNAME, HMAC_SECRET, ENVIRONMENT);

  console.log(`Initialized Mekari Jurnal API client [Environment: ${ENVIRONMENT}]`);

  // Example 1: GET a single sales invoice
  const invoiceId = '2963983';
  console.log(`\n1. Fetching Sales Invoice #${invoiceId}...`);
  const invoiceResult = await jurnal.get(`/public/jurnal/api/v1/sales_invoices/${invoiceId}`);
  console.log('Result Status:', invoiceResult.status);
  console.log('Result Data:', JSON.stringify(invoiceResult.data || invoiceResult.error, null, 2));

  // Example 2: GET with query parameters
  console.log('\n2. Fetching Sales Invoices list with pagination...');
  const listResult = await jurnal.get('/public/jurnal/api/v1/sales_invoices', {
    page: 1,
    page_size: 5,
  });
  console.log('List Status:', listResult.status);
}

run().catch(console.error);
