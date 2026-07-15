'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useApp } from '@/components/providers/AppProviders';
import { buildSearchIndex, search } from '@/lib/search';
import type { SearchResult } from '@/lib/types';

export function SearchModal() {
  const { searchOpen, setSearchOpen, sectionIndex } = useApp();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [focused, setFocused] = useState(0);
  const [indexed, setIndexed] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const base = process.env.NEXT_PUBLIC_BASE_PATH || '';

  useEffect(() => {
    if (searchOpen && !indexed && sectionIndex.length > 0) {
      buildSearchIndex(sectionIndex).then(() => setIndexed(true));
    }
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setResults([]);
    }
  }, [searchOpen, sectionIndex, indexed]);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    setResults(search(query));
    setFocused(0);
  }, [query]);

  const handleKey = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setFocused(f => Math.min(f + 1, results.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setFocused(f => Math.max(f - 1, 0)); }
    if (e.key === 'Enter' && results[focused]) {
      const r = results[focused];
      window.location.href = `${base}/${r.sectionSlug}/${r.subsectionSlug}#${r.termId}`;
      setSearchOpen(false);
    }
    if (e.key === 'Escape') setSearchOpen(false);
  }, [results, focused, setSearchOpen, base]);

  // Group by section
  const grouped = results.reduce<Record<string, SearchResult[]>>((acc, r) => {
    const key = `${r.sectionIcon} ${r.sectionTitle}`;
    acc[key] = [...(acc[key] || []), r];
    return acc;
  }, {});

  if (!searchOpen) return null;

  return (
    <div className="search-overlay" onClick={e => { if (e.target === e.currentTarget) setSearchOpen(false); }} role="dialog" aria-modal aria-label="Search">
      <div className="search-modal" onKeyDown={handleKey}>
        <div className="search-input-wrap">
          <svg width="18" height="18" fill="none" stroke="var(--text-muted)" strokeWidth="2">
            <circle cx="8" cy="8" r="6" /><line x1="13" y1="13" x2="18" y2="18" />
          </svg>
          <input
            ref={inputRef}
            className="search-input"
            placeholder="Search Java topics, terms, concepts..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoComplete="off"
            spellCheck={false}
          />
          {query && (
            <button onClick={() => setQuery('')} style={{ color: 'var(--text-muted)', fontSize: '1.2rem', lineHeight: 1 }}>×</button>
          )}
        </div>

        <div className="search-results">
          {!query && (
            <div className="search-empty">
              <div style={{ fontSize: '2rem', marginBottom: 8 }}>🔍</div>
              <p>Search across all 339 Java topics</p>
              <p style={{ fontSize: '0.78rem', marginTop: 4, color: 'var(--text-muted)' }}>Try: "HashMap", "deadlock", "Spring Boot", "GC"</p>
            </div>
          )}

          {query && results.length === 0 && (
            <div className="search-empty">
              <div style={{ fontSize: '2rem', marginBottom: 8 }}>😕</div>
              <p>No results for "<strong>{query}</strong>"</p>
              <p style={{ fontSize: '0.78rem', marginTop: 4 }}>Try different keywords</p>
            </div>
          )}

          {Object.entries(grouped).map(([sectionLabel, sResults]) => (
            <div key={sectionLabel}>
              <div className="search-section-label">{sectionLabel}</div>
              {sResults.map((r, i) => {
                const globalIdx = results.indexOf(r);
                return (
                  <Link
                    key={r.termId}
                    href={`/${r.sectionSlug}/${r.subsectionSlug}#${r.termId}`}
                    className={`search-result-item ${globalIdx === focused ? 'focused' : ''}`}
                    onClick={() => setSearchOpen(false)}
                  >
                    <span className="search-result-icon">{r.sectionIcon}</span>
                    <div>
                      <div className="search-result-term">{r.term}</div>
                      <div className="search-result-section">{r.sectionTitle}</div>
                      {r.preview && <div className="search-result-preview">{r.preview}</div>}
                    </div>
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        <div className="search-footer">
          <span><span className="kbd">↑↓</span> navigate</span>
          <span><span className="kbd">↵</span> open</span>
          <span><span className="kbd">Esc</span> close</span>
          {results.length > 0 && <span style={{ marginLeft: 'auto' }}>{results.length} results</span>}
        </div>
      </div>
    </div>
  );
}
