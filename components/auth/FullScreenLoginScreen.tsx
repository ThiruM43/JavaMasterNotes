'use client';
import React, { useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useApp } from '@/components/providers/AppProviders';

export function FullScreenLoginScreen() {
  const { login, quickLogin, hasRememberedCache, logout } = useAuth();
  const { showToast } = useApp();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(username, password, secretKey, remember);
      if (success) {
        showToast('🔓 Successfully logged in! Session valid for 30 mins.');
      } else {
        setError('Invalid username, password, or secret key. Please verify your credentials.');
      }
    } catch {
      setError('An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = () => {
    if (quickLogin()) {
      showToast('⚡ Quick login successful using remembered credentials!');
    } else {
      setError('Cached session invalid. Please log in manually.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%)',
      padding: '24px',
      fontFamily: 'Inter, sans-serif'
    }}>
      <div style={{
        maxWidth: 480,
        width: '100%',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.12)',
        padding: '36px 32px',
        display: 'flex',
        flexDirection: 'column',
        gap: 20
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%', background: 'var(--bg-secondary)',
            border: '2px solid var(--border)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '1.8rem', margin: '0 auto 14px'
          }}>
            ☕
          </div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.6rem', margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
            Java Master Notes
          </h1>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
            Encrypted Study Portal. Please log in with your credentials to access the 339 topics, study notes, highlights, and interactive flashcards.
          </p>
        </div>

        {error && (
          <div style={{ background: 'var(--issue-red)', color: '#7a1b1b', padding: '12px 14px', borderRadius: 8, fontSize: '0.82rem', borderLeft: '4px solid #b91c1c' }}>
            ⚠ {error}
          </div>
        )}

        {/* Remembered Cache Quick Login */}
        {hasRememberedCache && (
          <div style={{ background: 'var(--bg-secondary)', border: '1px dashed var(--amber)', padding: 16, borderRadius: 10, textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: 6 }}>
              <span>⚡ Remembered Device Session</span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '0 0 12px 0' }}>
              An encrypted session cache is saved on your system.
            </p>
            <button
              type="button"
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', background: 'var(--amber)', color: '#1a1205', fontWeight: 700, height: 42 }}
              onClick={handleQuickLogin}
            >
              ⚡ Auto-Login with Remembered Cache
            </button>
            <button
              type="button"
              onClick={() => { logout(true); showToast('Device cache cleared'); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 10, textDecoration: 'underline' }}
            >
              Clear remembered device cache
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '14px 0 0' }}>
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>or manual login</span>
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            </div>
          </div>
        )}

        {/* Manual Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 5 }}>
              Username / Email
            </label>
            <input
              type="text"
              required
              placeholder="Enter your username or email"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="note-textarea"
              style={{ width: '100%', height: 44, padding: '0 14px', resize: 'none' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 5 }}>
              Password
            </label>
            <input
              type="password"
              required
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="note-textarea"
              style={{ width: '100%', height: 44, padding: '0 14px', resize: 'none' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 5 }}>
              Secret Key
            </label>
            <input
              type="password"
              required
              placeholder="Enter your secret key"
              value={secretKey}
              onChange={e => setSecretKey(e.target.value)}
              className="note-textarea"
              style={{ width: '100%', height: 44, padding: '0 14px', resize: 'none' }}
            />
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: 4 }}>
            <input
              type="checkbox"
              checked={remember}
              onChange={e => setRemember(e.target.checked)}
              style={{ width: 16, height: 16 }}
            />
            <span>Remember me (cache session locally to auto-login later)</span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: 8, height: 46, fontSize: '0.95rem', fontWeight: 700 }}
          >
            {loading ? 'Verifying Credentials...' : '🔓 Login & Access Study Portal'}
          </button>
        </form>
      </div>
    </div>
  );
}
