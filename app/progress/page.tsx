'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { useApp } from '@/components/providers/AppProviders';
import { getProgress } from '@/lib/storage/progress';

export default function ProgressPage() {
  const { sectionIndex } = useApp();
  const [readTerms, setReadTerms] = useState<string[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [streak, setStreak] = useState(0);
  const [totalMins, setTotalMins] = useState(0);

  useEffect(() => {
    const p = getProgress();
    setReadTerms(p.readTerms);
    setBookmarks(p.bookmarkedTerms);
    setStreak(p.studyStreak?.count || 0);
    setTotalMins(p.totalStudyMinutes || 0);
  }, []);

  const totalTerms = sectionIndex.reduce((s, i) => s + i.termCount, 0);
  const totalRead = readTerms.length;
  const overallPct = totalTerms ? Math.round((totalRead / totalTerms) * 100) : 0;

  const getSectionStats = (secId: string, termCount: number) => {
    const prefix = `${secId}.`;
    const done = readTerms.filter(id => id.startsWith(prefix)).length;
    return { done, pct: termCount > 0 ? Math.round((done / termCount) * 100) : 0 };
  };

  return (
    <AppShell>
      <div className="breadcrumb">
        <Link href="/">Home</Link>
        <span className="breadcrumb-sep">›</span>
        <span>Progress</span>
      </div>

      <div className="progress-container">
        <h1 className="page-title" style={{ paddingLeft: 0, paddingTop: 0 }}>📊 My Progress</h1>
        <p className="page-subtitle" style={{ paddingLeft: 0 }}>Track your Java mastery journey</p>

        {/* Streak */}
        {streak > 0 && (
          <div className="streak-card">
            <span className="streak-flame">🔥</span>
            <div>
              <div className="streak-count">{streak}</div>
              <div className="streak-label">Day Study Streak</div>
            </div>
            <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Total study time</div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: 'var(--amber)' }}>
                {Math.round(totalMins / 60)}h {totalMins % 60}m
              </div>
            </div>
          </div>
        )}

        {/* Overview stats */}
        <div className="progress-overview">
          {[
            { num: totalRead, label: 'Terms Read', color: 'var(--fix-green)' },
            { num: `${overallPct}%`, label: 'Completed', color: 'var(--accent)' },
            { num: bookmarks.length, label: 'Bookmarked', color: 'var(--star-gold)' },
            { num: sectionIndex.filter(s => {
                const { pct } = getSectionStats(s.id, s.termCount);
                return pct === 100;
              }).length, label: 'Sections Done', color: 'var(--what-blue)' },
          ].map((stat, i) => (
            <div key={i} className="progress-stat-card">
              <div className="progress-stat-num" style={{ color: stat.color }}>{stat.num}</div>
              <div className="progress-stat-label">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Overall progress bar */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '0.82rem' }}>
            <span style={{ fontWeight: 600 }}>Overall Progress</span>
            <span style={{ color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>{totalRead} / {totalTerms}</span>
          </div>
          <div style={{ height: 10, background: 'var(--border-subtle)', borderRadius: 5, overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 5,
              background: 'linear-gradient(90deg, var(--accent), var(--amber))',
              width: `${overallPct}%`, transition: 'width 0.8s ease',
            }} />
          </div>
        </div>

        {/* Per-section breakdown */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '4px 16px 8px', marginBottom: 24 }}>
          <div style={{ padding: '12px 0 6px', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
            Section Breakdown
          </div>
          {sectionIndex.map(sec => {
            const { done, pct } = getSectionStats(sec.id, sec.termCount);
            return (
              <div key={sec.id} className="section-progress-row">
                <span className="section-progress-icon">{sec.icon}</span>
                <Link href={`/${sec.slug}`} className="section-progress-name" style={{ color: 'var(--text-primary)', textDecoration: 'none' }}>
                  {sec.title}
                </Link>
                <div className="section-progress-bar-wrap">
                  <div className="section-progress-bar-fill" style={{ width: `${pct}%`, background: sec.accentColor }} />
                </div>
                <span className="section-progress-pct">{pct}%</span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace', width: 50, textAlign: 'right' }}>{done}/{sec.termCount}</span>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Link href="/flashcards" className="btn btn-primary">🃏 Practice Flashcards</Link>
          <Link href="/bookmarks" className="btn btn-secondary">⭐ Review Bookmarks</Link>
        </div>
      </div>
    </AppShell>
  );
}
