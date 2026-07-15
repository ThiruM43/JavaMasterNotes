'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/providers/AuthProvider';
import { FullScreenLoginScreen } from '@/components/auth/FullScreenLoginScreen';

export default function LoginPage() {
  const { isAuthenticated, session, timeLeftMinutes, logout } = useAuth();

  if (!isAuthenticated) {
    return <FullScreenLoginScreen />;
  }

  return (
    <div style={{
      minHeight: '100vh', width: '100%', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: 'linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%)',
      padding: 24, fontFamily: 'Inter, sans-serif'
    }}>
      <div style={{
        maxWidth: 440, width: '100%', background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', padding: 36, textAlign: 'center'
      }}>
        <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🔓</div>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', margin: '0 0 8px 0' }}>
          Already Authenticated
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 20 }}>
          You are currently logged in as <b>{session?.username}</b>.<br />
          Your access token expires in <b>{timeLeftMinutes} minutes</b>.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Link href="/" className="btn btn-primary" style={{ justifyContent: 'center', height: 44 }}>
            ☕ Go to Main Study Portal →
          </Link>
          <button
            type="button"
            onClick={() => logout(false)}
            className="btn btn-secondary"
            style={{ justifyContent: 'center', height: 42, color: 'var(--issue-red)' }}
          >
            🚪 Logout & Switch Account
          </button>
        </div>
      </div>
    </div>
  );
}
