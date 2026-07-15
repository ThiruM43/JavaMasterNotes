'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { useApp } from '@/components/providers/AppProviders';
import { getProgress } from '@/lib/storage/progress';
import type { SectionIndex } from '@/lib/types';

export default function HomePage() {
  const { sectionIndex } = useApp();
  const [readTerms, setReadTerms] = useState<string[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [lastVisited, setLastVisited] = useState<string | null>(null);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const p = getProgress();
    setReadTerms(p.readTerms);
    setBookmarks(p.bookmarkedTerms);
    setLastVisited(p.lastVisited || null);
    setStreak(p.studyStreak?.count || 0);
  }, []);

  const totalTerms = sectionIndex.reduce((s, i) => s + i.termCount, 0);
  const totalRead = readTerms.length;
  const overallPct = totalTerms ? Math.round((totalRead / totalTerms) * 100) : 0;

  const getSectionPct = (sec: SectionIndex) => {
    const prefix = `${sec.id}.`;
    const done = readTerms.filter(id => id.startsWith(prefix)).length;
    return sec.termCount > 0 ? Math.round((done / sec.termCount) * 100) : 0;
  };

  return (
    <AppShell>
      {/* Hero */}
      <div className="home-hero">
        <h1>☕ Java Master Notes</h1>
        <p>20 sections · {totalTerms} terms · Interactive study app with highlights, notes & flashcards</p>
        <div className="home-stats">
          <div className="stat-pill">
            <span className="stat-num">{totalRead}</span>
            <span>of {totalTerms} terms read</span>
          </div>
          <div className="stat-pill">
            <span className="stat-num">{overallPct}%</span>
            <span>complete</span>
          </div>
          <div className="stat-pill">
            <span className="stat-num">{bookmarks.length}</span>
            <span>bookmarks</span>
          </div>
          {streak > 0 && (
            <div className="stat-pill">
              <span style={{ fontSize: '1rem' }}>🔥</span>
              <span className="stat-num">{streak}</span>
              <span>day streak</span>
            </div>
          )}
        </div>

        {/* Overall progress bar */}
        <div style={{ marginTop: 16 }}>
          <div style={{ height: 8, background: 'var(--border-subtle)', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 4,
              background: 'linear-gradient(90deg, var(--accent), var(--amber))',
              width: `${overallPct}%`,
              transition: 'width 0.8s ease',
            }} />
          </div>
        </div>
      </div>

      {/* Continue reading */}
      {lastVisited && (
        <div className="continue-reading">
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>
            Continue Where You Left Off
          </div>
          <Link href={lastVisited} className="continue-card">
            <span style={{ fontSize: '1.4rem' }}>📖</span>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Resume studying</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{lastVisited}</div>
            </div>
            <svg style={{ marginLeft: 'auto', color: 'var(--text-muted)' }} width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 3 14 8 6 13" />
            </svg>
          </Link>
        </div>
      )}

      {/* Quick links */}
      <div style={{ display: 'flex', gap: 10, padding: '16px 32px 0', flexWrap: 'wrap' }}>
        {[
          { href: '/flashcards', icon: '🃏', label: 'Flashcard Mode' },
          { href: '/bookmarks', icon: '⭐', label: 'My Bookmarks' },
          { href: '/notes', icon: '📝', label: 'My Notes' },
          { href: '/highlights', icon: '🖊', label: 'My Highlights' },
          { href: '/progress', icon: '📊', label: 'Progress' },
        ].map(item => (
          <Link key={item.href} href={item.href} className="btn btn-secondary" style={{ fontSize: '0.8rem' }}>
            {item.icon} {item.label}
          </Link>
        ))}
      </div>

      {/* Section grid */}
      <div style={{ padding: '16px 32px 8px' }}>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', color: 'var(--text-primary)' }}>
          All Sections
        </h2>
      </div>

      <div className="categories-grid">
        {sectionIndex.map(sec => {
          const pct = getSectionPct(sec);
          return (
            <Link key={sec.id} href={`/${sec.slug}`} className="category-card" style={{ '--card-accent': sec.accentColor } as React.CSSProperties}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: sec.accentColor, borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0' }} />
              <div className="card-header">
                <span className="card-icon">{sec.icon}</span>
                <div>
                  <div style={{ fontSize: '0.65rem', fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-muted)', marginBottom: 2 }}>Section {sec.id}</div>
                  <div className="card-title">{sec.title}</div>
                </div>
              </div>
              <div className="card-meta">
                <span>{sec.subsectionCount} subsections</span>
                <span>·</span>
                <span>{sec.termCount} terms</span>
                {pct === 100 && <span className="badge badge-green" style={{ marginLeft: 'auto' }}>✓ Done</span>}
              </div>
              <div className="card-progress">
                <div className="card-progress-fill" style={{ width: `${pct}%`, background: sec.accentColor }} />
              </div>
              <div className="card-progress-label">
                <span>{pct}% read</span>
                <span>{readTerms.filter(id => id.startsWith(`${sec.id}.`)).length}/{sec.termCount}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </AppShell>
  );
}
