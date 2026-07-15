'use client';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { useApp } from '@/components/providers/AppProviders';
import { fetchSection } from '@/lib/data';
import { markTermRead } from '@/lib/storage/progress';
import type { Term, SectionIndex } from '@/lib/types';

interface FlashTerm extends Term {
  sectionSlug: string;
  sectionTitle: string;
  sectionIcon: string;
  subsectionSlug: string;
}

export default function FlashcardsPage() {
  const { sectionIndex } = useApp();
  const [allTerms, setAllTerms] = useState<FlashTerm[]>([]);
  const [deck, setDeck] = useState<FlashTerm[]>([]);
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [results, setResults] = useState<{ pass: number; fail: number; skip: number }>({ pass: 0, fail: 0, skip: 0 });
  const [loading, setLoading] = useState(true);
  const [done, setDone] = useState(false);
  const [filter, setFilter] = useState<'all' | 'bookmarked'>('all');

  useEffect(() => {
    if (!sectionIndex.length) return;
    const fetchAll = async () => {
      const terms: FlashTerm[] = [];
      for (const sec of sectionIndex) {
        const data = await fetchSection(sec.file);
        if (!data) continue;
        for (const sub of data.subsections) {
          for (const term of sub.terms) {
            if (term.what) {
              terms.push({ ...term, sectionSlug: sec.slug, sectionTitle: sec.title, sectionIcon: sec.icon, subsectionSlug: sub.slug });
            }
          }
        }
      }
      setAllTerms(terms);
      setDeck(shuffle(terms));
      setLoading(false);
    };
    fetchAll();
  }, [sectionIndex]);

  const shuffle = (arr: FlashTerm[]) => [...arr].sort(() => Math.random() - 0.5);

  const handleResult = (result: 'pass' | 'fail' | 'skip') => {
    if (result === 'pass') markTermRead(deck[current].id);
    setResults(r => ({ ...r, [result]: r[result] + 1 }));
    setFlipped(false);
    setTimeout(() => {
      if (current + 1 >= deck.length) setDone(true);
      else setCurrent(c => c + 1);
    }, 150);
  };

  const restart = () => {
    setDeck(shuffle(allTerms));
    setCurrent(0);
    setFlipped(false);
    setResults({ pass: 0, fail: 0, skip: 0 });
    setDone(false);
  };

  const term = deck[current];
  const progress = deck.length > 0 ? ((current) / deck.length) * 100 : 0;

  return (
    <AppShell>
      <div className="breadcrumb">
        <Link href="/">Home</Link><span className="breadcrumb-sep">›</span><span>Flashcards</span>
      </div>
      <h1 className="page-title">🃏 Flashcard Mode</h1>
      <p className="page-subtitle">Click card to reveal · Pass moves to next · Fail = review again</p>

      {loading ? (
        <div style={{ padding: '0 32px' }}>
          <div className="skeleton" style={{ height: 300, borderRadius: 20, maxWidth: 560 }} />
        </div>
      ) : done ? (
        <div className="flashcard-container">
          <div style={{ textAlign: 'center', padding: 40 }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>🎉</div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', marginBottom: 16 }}>Session Complete!</h2>
            <div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginBottom: 24 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--fix-green)' }}>{results.pass}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Got it ✓</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--issue-red)' }}>{results.fail}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Review</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>{results.skip}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Skipped</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button className="btn btn-primary" onClick={restart}>🔀 New Session</button>
              <Link href="/progress" className="btn btn-secondary">📊 See Progress</Link>
            </div>
          </div>
        </div>
      ) : term ? (
        <div className="flashcard-container">
          {/* Progress */}
          <div style={{ width: 'min(560px, 100%)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="flashcard-progress-bar" style={{ flex: 1 }}>
              <div className="flashcard-progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace', whiteSpace: 'nowrap' }}>
              {current + 1} / {deck.length}
            </span>
          </div>

          {/* Card */}
          <div className={`flashcard ${flipped ? 'flipped' : ''}`} onClick={() => setFlipped(f => !f)}>
            <div className="flashcard-inner">
              <div className="flashcard-front">
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 12, fontFamily: 'JetBrains Mono, monospace' }}>
                  {term.sectionIcon} {term.sectionTitle}
                </div>
                <div className="flashcard-question">{term.term}</div>
                <div className="flashcard-hint">Click to reveal the answer</div>
              </div>
              <div className="flashcard-back">
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.7, textAlign: 'left', width: '100%' }}>
                  <div style={{ fontWeight: 700, color: 'var(--accent)', marginBottom: 8, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>What</div>
                  <p>{term.what}</p>
                  {term.star?.s && (
                    <div style={{ marginTop: 12, padding: '8px 12px', background: 'var(--star-bg)', borderRadius: 8, border: '1px solid var(--amber-border)' }}>
                      <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--star-gold)' }}>⭐ STAR: </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>S: {term.star.s}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          {flipped ? (
            <div className="flashcard-controls">
              <button className="fc-btn fc-btn-fail" onClick={() => handleResult('fail')}>✗ Review</button>
              <button className="fc-btn fc-btn-skip" onClick={() => handleResult('skip')}>→ Skip</button>
              <button className="fc-btn fc-btn-pass" onClick={() => handleResult('pass')}>✓ Got it</button>
            </div>
          ) : (
            <div className="flashcard-controls">
              <button className="fc-btn fc-btn-skip" onClick={() => handleResult('skip')}>Skip →</button>
            </div>
          )}

          <div style={{ display: 'flex', gap: 20, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span>✓ {results.pass} got it</span>
            <span>✗ {results.fail} review</span>
            <span>→ {results.skip} skipped</span>
          </div>
        </div>
      ) : null}
    </AppShell>
  );
}
