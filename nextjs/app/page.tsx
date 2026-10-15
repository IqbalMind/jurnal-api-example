'use client';

import { useState } from 'react';

export default function Home() {
  const [invoiceId, setInvoiceId] = useState('2963983');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFetch() {
    if (!invoiceId) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`/api/jurnal/sales_invoices/${invoiceId}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || data.error || `HTTP error ${res.status}`);
      }
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 800, margin: '50px auto', fontFamily: 'system-ui, sans-serif', padding: 20 }}>
      <h1>Mekari Jurnal API - Next.js (App Router)</h1>
      <p style={{ color: '#666' }}>
        Next.js Route Handler proxies the API requests on the server, generating HMAC-SHA256 signatures securely.
      </p>

      <div style={{ display: 'flex', gap: 12, margin: '24px 0' }}>
        <input
          type="text"
          value={invoiceId}
          onChange={(e) => setInvoiceId(e.target.value)}
          placeholder="Sales Invoice ID"
          style={{ flex: 1, padding: '10px 14px', fontSize: 16, border: '1px solid #ccc', borderRadius: 6 }}
        />
        <button
          onClick={handleFetch}
          disabled={loading}
          style={{
            padding: '10px 24px',
            background: '#000',
            color: '#fff',
            borderRadius: 6,
            border: 'none',
            cursor: 'pointer',
            fontSize: 16,
          }}
        >
          {loading ? 'Fetching...' : 'Query Invoice'}
        </button>
      </div>

      {error && (
        <div style={{ padding: 16, background: '#fee', color: '#c00', borderRadius: 6, marginBottom: 20 }}>
          {error}
        </div>
      )}

      {result && (
        <div>
          <h3>Sales Invoice Response:</h3>
          <pre
            style={{
              background: '#f7f7f7',
              padding: 16,
              borderRadius: 8,
              overflowX: 'auto',
              maxHeight: 500,
            }}
          >
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </main>
  );
}
