'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { useApp } from '@/components/providers/AppProviders';
import { getProgress } from '@/lib/storage/progress';
import { fetchSection } from '@/lib/data';
import type { Term, SectionIndex } from '@/lib/types';

interface BookmarkedTerm extends Term {
  sectionTitle: string;
  sectionIcon: string;
  sectionSlug: string;
  subsectionTitle: string;
  subsectionSlug: string;
  sectionId: string;
}

export default function BookmarksPage() {
  const { sectionIndex } = useApp();
  const [terms, setTerms] = useState<BookmarkedTerm[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sectionIndex.length) return;
    const { bookmarkedTerms } = getProgress();
    if (!bookmarkedTerms.length) { setLoading(false); return; }

    const fetchAll = async () => {
      const found: BookmarkedTerm[] = [];
      for (const sec of sectionIndex) {
        const data = await fetchSection(sec.file);
        if (!data) continue;
        for (const sub of data.subsections) {
          for (const term of sub.terms) {
            if (bookmarkedTerms.includes(term.id)) {
              found.push({ ...term, sectionTitle: sec.title, sectionIcon: sec.icon, sectionSlug: sec.slug, subsectionTitle: sub.title, subsectionSlug: sub.slug, sectionId: sec.id });
            }
          }
        }
      }
      setTerms(found);
      setLoading(false);
    };
    fetchAll();
  }, [sectionIndex]);

  return (
    <AppShell>
      <div className="breadcrumb">
        <Link href="/">Home</Link><span className="breadcrumb-sep">›</span><span>Bookmarks</span>
      </div>
      <h1 className="page-title">⭐ My Bookmarks</h1>
      <p className="page-subtitle">{terms.length} bookmarked terms</p>

      {loading ? (
        <div style={{ padding: '0 32px' }}>{[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 70, marginBottom: 12, borderRadius: 10 }} />)}</div>
      ) : terms.length === 0 ? (
        <div className="empty-state" style={{ marginTop: 60 }}>
          <div className="empty-state-icon">⭐</div>
          <h3>No bookmarks yet</h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 4 }}>Open any term and click ☆ Bookmark</p>
          <Link href="/" className="btn btn-primary" style={{ marginTop: 16 }}>Browse Sections</Link>
        </div>
      ) : (
        <div style={{ padding: '0 32px 40px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {terms.map(term => (
            <Link
              key={term.id}
              href={`/${term.sectionSlug}/${term.subsectionSlug}#${term.id}`}
              style={{ textDecoration: 'none' }}
            >
              <div className="term-accordion" style={{ cursor: 'pointer' }}>
                <div className="term-header">
                  <div style={{ flex: 1 }}>
                    <div className="term-name">⭐ {term.term}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 3 }}>
                      {term.sectionIcon} {term.sectionTitle} › {term.subsectionTitle}
                    </div>
                    {term.what && (
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {term.what}
                      </div>
                    )}
                  </div>
                  <svg style={{ color: 'var(--text-muted)', flexShrink: 0 }} width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 3 14 8 6 13" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </AppShell>
  );
}
