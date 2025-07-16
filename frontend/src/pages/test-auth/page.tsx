'use client';

import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';

interface StorageData {
  token: string | null;
  user: string | null;
  allKeys: string[];
}

interface StorageInfo {
  localStorage: StorageData;
  sessionStorage: StorageData;
}

export default function TestAuthPage() {
  const { user, token, isAuthenticated, loading } = useAuth();
  const [storageInfo, setStorageInfo] = useState<StorageInfo>({
    localStorage: { token: null, user: null, allKeys: [] },
    sessionStorage: { token: null, user: null, allKeys: [] }
  });

  useEffect(() => {
    // Check localStorage
    const localStorageData = {
      token: localStorage.getItem('token'),
      user: localStorage.getItem('user'),
      allKeys: Object.keys(localStorage)
    };

    // Check sessionStorage
    const sessionStorageData = {
      token: sessionStorage.getItem('auth_token'),
      user: sessionStorage.getItem('auth_user'),
      allKeys: Object.keys(sessionStorage)
    };

    setStorageInfo({
      localStorage: localStorageData,
      sessionStorage: sessionStorageData
    });
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
      <h1>🔍 Authentication Debug</h1>
      
      <h2>AuthContext State:</h2>
      <pre>{JSON.stringify({
        loading,
        isAuthenticated,
        hasUser: !!user,
        hasToken: !!token,
        user: user ? { id: user.id, username: user.username } : null
      }, null, 2)}</pre>

      <h2>localStorage:</h2>
      <pre>{JSON.stringify(storageInfo.localStorage, null, 2)}</pre>

      <h2>sessionStorage:</h2>
      <pre>{JSON.stringify(storageInfo.sessionStorage, null, 2)}</pre>

      <h2>Actions:</h2>
      <button 
        onClick={() => {
          localStorage.clear();
          sessionStorage.clear();
          window.location.reload();
        }}
        style={{ padding: '0.5rem 1rem', margin: '0.5rem' }}
      >
        Clear All Storage & Reload
      </button>
    </div>
  );
} 