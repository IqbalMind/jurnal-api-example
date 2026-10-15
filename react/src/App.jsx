import React, { useState } from 'react';

export default function App() {
  const [invoiceId, setInvoiceId] = useState('2963983');
  const [invoiceData, setInvoiceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchInvoice = async () => {
    if (!invoiceId) return;
    setLoading(true);
    setError(null);
    setInvoiceData(null);

    try {
      const response = await fetch(`http://localhost:3001/api/sales-invoices/${invoiceId}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || data.error || `HTTP error ${response.status}`);
      }
      setInvoiceData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', fontFamily: 'sans-serif', padding: 20 }}>
      <h2>Mekari Jurnal API - React Integration</h2>
      <p style={{ color: '#555' }}>
        Calls Mekari Jurnal Open API via a local Node.js proxy that signs requests using HMAC-SHA256.
      </p>

      <div style={{ display: 'flex', gap: 10, margin: '20px 0' }}>
        <input
          type="text"
          value={invoiceId}
          onChange={(e) => setInvoiceId(e.target.value)}
          placeholder="Enter Invoice ID"
          style={{ flex: 1, padding: '10px 14px', fontSize: 16 }}
        />
        <button
          onClick={fetchInvoice}
          disabled={loading}
          style={{
            padding: '10px 20px',
            background: '#0070f3',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
            fontSize: 16,
          }}
        >
          {loading ? 'Fetching...' : 'Get Sales Invoice'}
        </button>
      </div>

      {error && (
        <div style={{ padding: 14, background: '#fee', color: '#c00', borderRadius: 4, marginBottom: 20 }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {invoiceData && (
        <div style={{ marginTop: 20 }}>
          <h3>Sales Invoice Result:</h3>
          <pre
            style={{
              background: '#f4f4f4',
              padding: 16,
              borderRadius: 6,
              overflowX: 'auto',
              maxHeight: 500,
            }}
          >
            {JSON.stringify(invoiceData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
