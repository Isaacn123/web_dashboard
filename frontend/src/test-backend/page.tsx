'use client';

import { useState } from 'react';

export default function TestBackendPage() {
  const [testResult, setTestResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testBackend = async () => {
    setLoading(true);
    setTestResult('Testing...');

    try {
      // Test 1: Basic connectivity
      const response = await fetch('http://127.0.0.1:8000/api/articles/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTestResult(`✅ Backend is accessible!\nStatus: ${response.status}\nArticles count: ${data.results?.length || data.length || 0}`);
      } else {
        setTestResult(`❌ Backend responded with error:\nStatus: ${response.status}\nStatus Text: ${response.statusText}`);
      }
    } catch (error) {
      setTestResult(`🚨 Network error: ${error}\n\nMake sure:\n1. Django server is running on port 8000\n2. Run: cd ../webadmin && python3 manage.py runserver`);
    } finally {
      setLoading(false);
    }
  };

  const testLogin = async () => {
    setLoading(true);
    setTestResult('Testing login...');

    try {
      const response = await fetch('http://127.0.0.1:8000/api/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'admin',
          password: 'admin123'
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setTestResult(`✅ Login endpoint works!\nStatus: ${response.status}\nToken received: ${data.token ? 'Yes' : 'No'}`);
      } else {
        const errorData = await response.json();
        setTestResult(`❌ Login failed:\nStatus: ${response.status}\nError: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      setTestResult(`🚨 Login network error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem' }}>Backend Connection Test</h1>
      
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button 
          onClick={testBackend}
          disabled={loading}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          Test Backend Connection
        </button>
        
        <button 
          onClick={testLogin}
          disabled={loading}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#059669',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          Test Login Endpoint
        </button>
      </div>

      <div style={{
        padding: '1rem',
        backgroundColor: '#f3f4f6',
        borderRadius: '0.375rem',
        whiteSpace: 'pre-line',
        fontFamily: 'monospace',
        fontSize: '0.875rem'
      }}>
        {testResult || 'Click a button above to test the backend connection.'}
      </div>

      <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#fef3c7', borderRadius: '0.375rem' }}>
        <h3>If tests fail:</h3>
        <ol>
          <li>Make sure Django server is running: <code>cd ../webadmin && python3 manage.py runserver</code></li>
          <li>Check if port 8000 is available</li>
          <li>Verify the backend is accessible at <code>http://127.0.0.1:8000</code></li>
          <li>Check browser console for CORS errors</li>
        </ol>
      </div>
    </div>
  );
} 