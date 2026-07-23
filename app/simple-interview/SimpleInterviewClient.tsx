'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { InterviewPrepCard } from '@/components/content/InterviewPrepCard';
import { getProgress, markTermRead, unmarkTermRead } from '@/lib/storage/progress';
import type { InterviewSection, InterviewTerm } from '@/lib/types';

export default function SimpleInterviewClient() {
  const [sectionData, setSectionData] = useState<InterviewSection | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTierIdx, setActiveTierIdx] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'list' | 'focus'>('focus');
  const [focusIdx, setFocusIdx] = useState<number>(0);
  const [readTerms, setReadTerms] = useState<string[]>([]);
  const [streak, setStreak] = useState<{ count: number; lastDate: string }>({ count: 0, lastDate: '' });

  useEffect(() => {
    let active = true;
    const fetchData = async () => {
      try {
        const base = process.env.NEXT_PUBLIC_BASE_PATH || '';
        const res = await fetch(`${base}/data/section-25-simple-interview.json`);
        if (res.ok) {
          const data: InterviewSection = await res.json();
          if (active) {
            setSectionData(data);
            setLoading(false);
          }
        }
      } catch (err) {
        if (active) setLoading(false);
      }
    };
    fetchData();
    const p = getProgress();
    setReadTerms(p.readTerms);
    setStreak(p.studyStreak);
    return () => { active = false; };
  }, []);

  if (loading) {
    return (
      <AppShell>
        <div style={{ padding: '40px 24px', maxWidth: 1000, margin: '0 auto' }}>
          <div className="skeleton" style={{ height: 120, borderRadius: 16, marginBottom: 24 }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
            {[1, 2, 3, 4].map(i => <div key={i} className="skeleton" style={{ height: 60, borderRadius: 12 }} />)}
          </div>
          <div className="skeleton" style={{ height: 350, borderRadius: 16 }} />
        </div>
      </AppShell>
    );
  }

  if (!sectionData || !sectionData.subsections.length) {
    return (
      <AppShell>
        <div className="empty-state" style={{ marginTop: 80 }}>
          <div className="empty-state-icon">⚠️</div>
          <h3>Could not load Simple Interview data</h3>
        </div>
      </AppShell>
    );
  }

  const currentTier = sectionData.subsections[activeTierIdx] || sectionData.subsections[0];
  const terms: InterviewTerm[] = currentTier.terms || [];
  const currentTerm = terms[focusIdx] || terms[0];

  const isTermRead = (termId: string) => readTerms.includes(termId);

  const handleToggleRead = (termId: string) => {
    if (isTermRead(termId)) {
      unmarkTermRead(termId);
      setReadTerms(prev => prev.filter(id => id !== termId));
    } else {
      markTermRead(termId);
      setReadTerms(prev => [...prev, termId]);
      const p = getProgress();
      setStreak(p.studyStreak);
    }
  };

  const handleMarkAndNext = (termId: string) => {
    if (!isTermRead(termId)) {
      markTermRead(termId);
      setReadTerms(prev => [...prev, termId]);
      const p = getProgress();
      setStreak(p.studyStreak);
    }
    if (focusIdx < terms.length - 1) {
      setFocusIdx(prev => prev + 1);
      window.scrollTo({ top: 160, behavior: 'smooth' });
    } else if (activeTierIdx < sectionData.subsections.length - 1) {
      setActiveTierIdx(prev => prev + 1);
      setFocusIdx(0);
      window.scrollTo({ top: 160, behavior: 'smooth' });
    }
  };

  const totalAllTerms = sectionData.subsections.reduce((acc, sub) => acc + sub.terms.length, 0);
  const totalAllRead = sectionData.subsections.reduce((acc, sub) => acc + sub.terms.filter(t => isTermRead(t.id)).length, 0);
  const totalAllPct = totalAllTerms > 0 ? Math.round((totalAllRead / totalAllTerms) * 100) : 0;

  return (
    <AppShell>
      <div style={{ padding: '24px 16px', maxWidth: 1040, margin: '0 auto' }}>
        <div className="breadcrumb" style={{ marginBottom: 16 }}>
          <Link href="/">Home</Link>
          <span className="breadcrumb-sep">›</span>
          <span style={{ color: 'var(--text-primary)' }}>🗣️ Simple Interview Mode</span>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, var(--surface) 0%, rgba(14, 165, 233, 0.12) 100%)',
          border: '1px solid var(--border)',
          borderTop: '4px solid #0ea5e9',
          borderRadius: 16,
          padding: '24px 28px',
          marginBottom: 24,
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(14, 165, 233, 0.15)', color: '#0ea5e9', padding: '4px 12px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700, marginBottom: 12 }}>
                🗣️ SIMPLE ENGLISH & HIGH IMPACT
              </div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 8px 0', color: 'var(--text-primary)' }}>
                Speak Naturally. Sound Senior.
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', maxWidth: 680, margin: 0, lineHeight: 1.5 }}>
                Do not memorize textbook answers. This studio trains you to explain complex topics using short, simple sentences that prove you have real experience fixing bugs and building systems.
              </p>
            </div>

            <div style={{
              background: 'var(--surface-raised)',
              border: '1px solid var(--border)',
              borderRadius: 12,
              padding: '14px 20px',
              minWidth: 220,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600, marginBottom: 4 }}>
                Mastery Progress
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0ea5e9' }}>{totalAllPct}%</span>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>({totalAllRead} / {totalAllTerms} mastered)</span>
              </div>
              <div style={{ height: 6, background: 'var(--border-subtle)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', background: '#0ea5e9', width: `${totalAllPct}%`, transition: 'width 0.4s ease' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Tier Selector Tabs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          gap: 12,
          marginBottom: 24
        }}>
          {sectionData.subsections.map((sub, idx) => {
            const isSelected = activeTierIdx === idx;
            const subRead = sub.terms.filter(t => isTermRead(t.id)).length;
            const subPct = sub.terms.length > 0 ? Math.round((subRead / sub.terms.length) * 100) : 0;
            const badgeColor = '#0ea5e9';

            return (
              <button
                key={sub.id}
                onClick={() => {
                  setActiveTierIdx(idx);
                  setFocusIdx(0);
                }}
                style={{
                  background: isSelected ? 'var(--surface-raised)' : 'var(--surface)',
                  border: isSelected ? `2px solid ${badgeColor}` : '1px solid var(--border)',
                  borderRadius: 14,
                  padding: '14px 16px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? `0 4px 16px ${badgeColor}25` : 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: badgeColor, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Part {idx + 1}
                    </span>
                    <span style={{ fontSize: '0.72rem', fontFamily: 'JetBrains Mono, monospace', background: 'var(--bg-secondary)', padding: '2px 6px', borderRadius: 4, color: 'var(--text-secondary)' }}>
                      {subRead}/{sub.terms.length}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)', lineHeight: 1.3, marginBottom: 12 }}>
                    {sub.title}
                  </div>
                </div>

                <div style={{ width: '100%', height: 4, background: 'var(--border-subtle)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: badgeColor, width: `${subPct}%`, transition: 'width 0.4s ease' }} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Tier Header + View Mode Switcher */}
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 14,
          padding: '18px 22px',
          marginBottom: 20,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16
        }}>
          <div style={{ flex: 1, minWidth: 280 }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
              {currentTier.title}
            </h2>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
              {currentTier.keyRule}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ display: 'flex', background: 'var(--bg-secondary)', borderRadius: 10, padding: 4, border: '1px solid var(--border-subtle)' }}>
              <button
                onClick={() => setViewMode('focus')}
                style={{
                  background: viewMode === 'focus' ? '#0ea5e9' : 'transparent',
                  color: viewMode === 'focus' ? '#ffffff' : 'var(--text-secondary)',
                  border: 'none',
                  borderRadius: 8,
                  padding: '6px 14px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                🎴 Step-by-Step Focus
              </button>
              <button
                onClick={() => setViewMode('list')}
                style={{
                  background: viewMode === 'list' ? '#0ea5e9' : 'transparent',
                  color: viewMode === 'list' ? '#ffffff' : 'var(--text-secondary)',
                  border: 'none',
                  borderRadius: 8,
                  padding: '6px 14px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                📜 Full List ({terms.length})
              </button>
            </div>
          </div>
        </div>

        {/* View Mode 1: Focus Mode */}
        {viewMode === 'focus' && terms.length > 0 && (
          <div>
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 12, marginBottom: 16, scrollbarWidth: 'thin' }}>
              {terms.map((t, idx) => {
                const isRead = isTermRead(t.id);
                const isCurrent = idx === focusIdx;
                return (
                  <button
                    key={t.id}
                    onClick={() => setFocusIdx(idx)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: 10,
                      border: isCurrent ? '2px solid #0ea5e9' : '1px solid var(--border)',
                      background: isCurrent ? 'rgba(14, 165, 233, 0.12)' : isRead ? 'rgba(16, 185, 129, 0.08)' : 'var(--surface)',
                      color: isCurrent ? '#0ea5e9' : isRead ? '#10b981' : 'var(--text-secondary)',
                      fontSize: '0.8rem',
                      fontWeight: isCurrent ? 700 : 500,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6
                    }}
                  >
                    <span>{isRead ? '✅' : `${idx + 1}.`}</span>
                    <span style={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {t.topic}
                    </span>
                  </button>
                );
              })}
            </div>

            {currentTerm && (
              <div style={{ marginBottom: 24 }}>
                <InterviewPrepCard term={currentTerm} sectionId={sectionData.id} subsectionId={currentTier.id} sectionTitle={sectionData.title} />

                <div style={{ background: 'var(--surface-raised)', border: '1px solid var(--border)', borderRadius: 14, padding: '16px 20px', marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <button onClick={() => setFocusIdx(prev => Math.max(0, prev - 1))} disabled={focusIdx === 0} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid var(--border)', background: focusIdx === 0 ? 'var(--bg-secondary)' : 'var(--surface)', color: focusIdx === 0 ? 'var(--text-muted)' : 'var(--text-primary)', fontSize: '0.85rem', fontWeight: 600, cursor: focusIdx === 0 ? 'not-allowed' : 'pointer' }}>
                      ← Previous Topic
                    </button>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono, monospace' }}>
                      Topic {focusIdx + 1} of {terms.length}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <button onClick={() => handleToggleRead(currentTerm.id)} style={{ padding: '9px 18px', borderRadius: 8, border: isTermRead(currentTerm.id) ? '1px solid #10b981' : '1px solid var(--border)', background: isTermRead(currentTerm.id) ? 'rgba(16, 185, 129, 0.12)' : 'var(--surface)', color: isTermRead(currentTerm.id) ? '#10b981' : 'var(--text-primary)', fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                      {isTermRead(currentTerm.id) ? '✅ Mastered' : '☐ Mark Mastered'}
                    </button>

                    <button onClick={() => handleMarkAndNext(currentTerm.id)} style={{ padding: '9px 20px', borderRadius: 8, border: 'none', background: '#0ea5e9', color: '#ffffff', fontSize: '0.88rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)', display: 'flex', alignItems: 'center', gap: 6 }}>
                      {focusIdx === terms.length - 1 ? (activeTierIdx < sectionData.subsections.length - 1 ? 'Next Module →' : '🎉 Finish Simulator') : 'Next Topic →'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* View Mode 2: List View */}
        {viewMode === 'list' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {terms.map((term) => (
              <div key={term.id} style={{ position: 'relative' }}>
                <InterviewPrepCard term={term} sectionId={sectionData.id} subsectionId={currentTier.id} sectionTitle={sectionData.title} />
                <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '12px' }}>
                  <button onClick={() => handleToggleRead(term.id)} style={{ padding: '4px 12px', borderRadius: 6, border: isTermRead(term.id) ? '1px solid #10b981' : '1px solid var(--border)', background: isTermRead(term.id) ? 'rgba(16, 185, 129, 0.12)' : 'var(--surface)', color: isTermRead(term.id) ? '#10b981' : 'var(--text-secondary)', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}>
                    {isTermRead(term.id) ? '✅ Mastered' : 'Mark Mastered'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
