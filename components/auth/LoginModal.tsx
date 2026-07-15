'use client';
import React, { useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useApp } from '@/components/providers/AppProviders';

export function LoginModal() {
  const { showLoginModal, setShowLoginModal, login, quickLogin, hasRememberedCache, isAuthenticated } = useAuth();
  const { showToast } = useApp();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!showLoginModal) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(username, password, secretKey, remember);
      if (success) {
        showToast('🔓 Successfully logged in! Session valid for 30 mins.');
      } else {
        setError('Invalid username, password, or secret key. Please check your credentials.');
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
    <div className="modal-backdrop" onClick={() => { if (isAuthenticated) setShowLoginModal(false); }}>
      <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 460, padding: 32, borderRadius: 'var(--radius-lg)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: '1.8rem' }}>🔒</span>
            <div>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', margin: 0 }}>Study Account Login</h2>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Access encrypted notes & highlights</span>
            </div>
          </div>
          {isAuthenticated && (
            <button className="icon-btn" onClick={() => setShowLoginModal(false)} aria-label="Close">✕</button>
          )}
        </div>

        {error && (
          <div style={{ background: 'var(--issue-red)', color: '#7a1b1b', padding: '10px 14px', borderRadius: 8, fontSize: '0.82rem', marginBottom: 16, borderLeft: '4px solid #b91c1c' }}>
            ⚠ {error}
          </div>
        )}

        {hasRememberedCache && (
          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', padding: 14, borderRadius: 8, marginBottom: 20, textAlign: 'center' }}>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0 0 10px 0' }}>
              ✨ Remembered session found on this device
            </p>
            <button
              type="button"
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', background: 'var(--amber)', color: '#1a1205', fontWeight: 700 }}
              onClick={handleQuickLogin}
            >
              ⚡ Auto-Login with Remembered Cache
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '14px 0 6px' }}>
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>or enter credentials below</span>
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>
              Username / Email
            </label>
            <input
              type="text"
              required
              placeholder="Enter your username or email"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="note-textarea"
              style={{ width: '100%', height: 42, padding: '0 12px', resize: 'none' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>
              Password
            </label>
            <input
              type="password"
              required
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="note-textarea"
              style={{ width: '100%', height: 42, padding: '0 12px', resize: 'none' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>
              Secret Key
            </label>
            <input
              type="password"
              required
              placeholder="Enter your secret key"
              value={secretKey}
              onChange={e => setSecretKey(e.target.value)}
              className="note-textarea"
              style={{ width: '100%', height: 42, padding: '0 12px', resize: 'none' }}
            />
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: 4 }}>
            <input
              type="checkbox"
              checked={remember}
              onChange={e => setRemember(e.target.checked)}
              style={{ width: 16, height: 16 }}
            />
            <span>Remember me (store encrypted cache locally to quick-login again)</span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: 8, height: 44, fontSize: '0.95rem' }}
          >
            {loading ? 'Verifying...' : '🔓 Login & Access Study App'}
          </button>
        </form>
      </div>
    </div>
  );
}
