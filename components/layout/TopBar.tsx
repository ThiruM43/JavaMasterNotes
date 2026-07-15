'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/components/providers/AppProviders';
import { useAuth } from '@/components/providers/AuthProvider';
import { getProgress } from '@/lib/storage/progress';
import { useEffect, useState } from 'react';

export function TopBar() {
  const { theme, toggleTheme, setSidebarOpen, sidebarOpen, setDrawerOpen, drawerOpen, setSearchOpen, sectionIndex, showToast } = useApp();
  const { isAuthenticated, session, timeLeftMinutes, setShowLoginModal, logout } = useAuth();
  const [totalRead, setTotalRead] = useState(0);
  const totalTerms = sectionIndex.reduce((s, i) => s + i.termCount, 0);

  useEffect(() => {
    const p = getProgress();
    setTotalRead(p.readTerms.length);
  }, []);

  const pct = totalTerms ? Math.round((totalRead / totalTerms) * 100) : 0;

  return (
    <header className="topbar">
      {/* Hamburger — mobile only */}
      <button
        className="icon-btn"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle sidebar"
        style={{ display: 'flex' }}
      >
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="2" y1="5" x2="16" y2="5" />
          <line x1="2" y1="9" x2="16" y2="9" />
          <line x1="2" y1="13" x2="16" y2="13" />
        </svg>
      </button>

      {/* Logo */}
      <Link href="/" className="topbar-logo">
        <span className="logo-icon">☕</span>
        <span style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <span>Java Notes</span>
          <span className="logo-subtitle" style={{ fontSize: '0.6rem', fontFamily: 'Inter', fontWeight: 400, color: 'var(--text-muted)', marginTop: -2 }}>
            {pct}% complete
          </span>
        </span>
      </Link>

      {/* Search */}
      <button
        className="topbar-search-btn"
        onClick={() => setSearchOpen(true)}
        aria-label="Search"
      >
        <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="6" cy="6" r="5" />
          <line x1="10" y1="10" x2="14" y2="14" />
        </svg>
        <span className="search-text-desktop">Search topics…</span>
        <span className="kbd search-text-desktop">⌘K</span>
      </button>

      <div className="topbar-right" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* Auth / Login status */}
        {isAuthenticated && session ? (
          <div className="topbar-user-pill" style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--bg-secondary)', padding: '4px 10px', borderRadius: 20, border: '1px solid var(--border)' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ color: 'var(--fix-green)' }}>●</span>
              <span className="topbar-username" title={session.username}>{session.username.split('@')[0]}</span>
              <span className="topbar-timer" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>({timeLeftMinutes}m)</span>
            </span>
            <button
              onClick={() => { logout(false); showToast('🚪 Logged out successfully'); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem', color: 'var(--issue-red)', fontWeight: 600, padding: '0 4px' }}
              title="Logout"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowLoginModal(true)}
            className="btn btn-secondary"
            style={{ padding: '5px 12px', fontSize: '0.8rem', gap: 6, height: 32, borderRadius: 16 }}
          >
            🔒 Login
          </button>
        )}

        {/* Notes drawer */}
        <button
          className={`icon-btn hide-on-mobile ${drawerOpen ? 'active' : ''}`}
          onClick={() => setDrawerOpen(!drawerOpen)}
          aria-label="Toggle notes panel"
          data-tooltip="Notes & Highlights"
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16l4-2 4 2 4-2V4a2 2 0 0 0-2-2z" />
            <line x1="6" y1="9" x2="12" y2="9" />
            <line x1="6" y1="13" x2="10" y2="13" />
          </svg>
        </button>

        {/* Progress link */}
        <Link href="/progress" className="icon-btn hide-on-mobile" data-tooltip="Progress">
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
        </Link>

        {/* Theme toggle */}
        <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
    </header>
  );
}
