'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { FullScreenLoginScreen } from '@/components/auth/FullScreenLoginScreen';

export function AuthEnforcer({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoaded } = useAuth();
  const pathname = usePathname() || '';

  if (!isLoaded) {
    return (
      <div style={{
        minHeight: '100vh', width: '100%', display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: 'var(--bg-primary)', color: 'var(--text-muted)'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: '2rem' }}>☕</div>
          <span style={{ fontSize: '0.85rem', fontFamily: 'Inter, sans-serif' }}>Verifying security session...</span>
        </div>
      </div>
    );
  }

  // Allow dedicated /logout or /login pages to render directly without forcing FullScreenLoginScreen
  if (pathname.startsWith('/logout') || pathname.startsWith('/login')) {
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return <FullScreenLoginScreen />;
  }

  return <>{children}</>;
}
