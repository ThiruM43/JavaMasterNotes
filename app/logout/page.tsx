'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/providers/AuthProvider';

export default function LogoutPage() {
  const { logout, isLoaded } = useAuth();

  useEffect(() => {
    if (isLoaded) {
      logout(false);
    }
  }, [isLoaded, logout]);

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
        <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🚪</div>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', margin: '0 0 8px 0' }}>
          Logged Out Successfully
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 24 }}>
          Your 30-minute access token has been cleared and your session closed safely.
        </p>

        <Link href="/" className="btn btn-primary" style={{ justifyContent: 'center', height: 44 }}>
          🔒 Return to Login Screen
        </Link>
      </div>
    </div>
  );
}
