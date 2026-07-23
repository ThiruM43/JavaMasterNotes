'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/components/providers/AppProviders';
import { getProgress } from '@/lib/storage/progress';
import { useState, useEffect } from 'react';
import type { Section, Subsection } from '@/lib/types';

export function ChapterTree() {
  const { sectionIndex, sidebarOpen, setSidebarOpen } = useApp();
  const pathname = usePathname();
  const [readTerms, setReadTerms] = useState<string[]>([]);
  const [expandedSec, setExpandedSec] = useState<string | null>(null);
  const [subsectionsCache, setSubsectionsCache] = useState<Record<string, { id: string; slug: string; title: string }[]>>({});

  useEffect(() => {
    setReadTerms(getProgress().readTerms);
    const parts = pathname.split('/').filter(Boolean);
    if (parts[0]) {
      setExpandedSec(parts[0]);
    }
  }, [pathname]);

  // Load subsections when a section is expanded
  useEffect(() => {
    if (!expandedSec) return;
    const secIdx = sectionIndex.find(s => s.slug === expandedSec);
    if (!secIdx) return;

    setSubsectionsCache(prev => {
      if (prev[expandedSec]) return prev;
      const base = process.env.NEXT_PUBLIC_BASE_PATH || '';
      fetch(`${base}/data/${secIdx.file}`)
        .then(res => res.json())
        .then((data: Section) => {
          setSubsectionsCache(current => ({
            ...current,
            [expandedSec]: data.subsections.map(sub => ({ id: sub.id, slug: sub.slug, title: sub.title }))
          }));
        })
        .catch(() => {});
      return prev;
    });
  }, [expandedSec, sectionIndex]);

  const getSecProgress = (secId: string, termCount: number) => {
    const prefix = `${secId}.`;
    const done = readTerms.filter(id => id.startsWith(prefix)).length;
    return termCount > 0 ? Math.round((done / termCount) * 100) : 0;
  };

  return (
    <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
      <div style={{ padding: '12px 12px 6px 12px' }}>
        <Link
          href="/podcast"
          onClick={() => setSidebarOpen(false)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: pathname === '/podcast' ? '#8b5cf6' : 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(139, 92, 246, 0.05) 100%)',
            border: '1px solid #8b5cf6',
            borderRadius: 10,
            padding: '10px 14px',
            color: pathname === '/podcast' ? '#ffffff' : 'var(--text-primary)',
            fontWeight: 700,
            fontSize: '0.85rem',
            textDecoration: 'none',
            boxShadow: pathname === '/podcast' ? '0 4px 12px rgba(139, 92, 246, 0.35)' : 'none',
            transition: 'all 0.2s'
          }}
        >
          <span style={{ fontSize: '1.2rem' }}>🎧</span>
          <div>
            <div>Podcast Studio</div>
            <div style={{ fontSize: '0.68rem', opacity: 0.8, fontWeight: 500 }}>Tanglish Conversations</div>
          </div>
        </Link>
      </div>

      <div className="sidebar-header" style={{ marginTop: 6 }}>Sections & Subsections</div>
      {sectionIndex.map(sec => {
        const isActive = pathname.startsWith(`/${sec.slug}`);
        const isExpanded = expandedSec === sec.slug || isActive;
        const pct = getSecProgress(sec.id, sec.termCount);
        const subs = subsectionsCache[sec.slug] || [];

        return (
          <div key={sec.id} className="chapter-item">
            <button
              className={`chapter-item-btn ${isActive ? 'active' : ''}`}
              onClick={() => setExpandedSec(isExpanded && expandedSec === sec.slug ? null : sec.slug)}
            >
              <span className="chapter-icon">{sec.icon}</span>
              <span className="chapter-label">
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono,monospace' }}>§{sec.id}</span>
                <br />{sec.title}
              </span>
              <span className="chapter-count">{sec.termCount}</span>
              <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5"
                style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}>
                <polyline points="1 3 6 8 11 3" />
              </svg>
            </button>

            <div className="chapter-progress-bar">
              <div className="chapter-progress-fill" style={{ width: `${pct}%`, background: sec.accentColor }} />
            </div>

            {isExpanded && (
              <div className="subsection-list" style={{ paddingLeft: 16, marginTop: 4 }}>
                <Link
                  href={`/${sec.slug}`}
                  className={`subsection-link ${pathname === `/${sec.slug}` ? 'active' : ''}`}
                  onClick={() => setSidebarOpen(false)}
                  style={{ fontWeight: 600 }}
                >
                  <span className="subsection-dot" />📌 Overview
                </Link>

                {subs.map(sub => {
                  const subPath = `/${sec.slug}/${sub.slug}`;
                  const isSubActive = pathname === subPath;
                  return (
                    <Link
                      key={sub.slug}
                      href={subPath}
                      className={`subsection-link ${isSubActive ? 'active' : ''}`}
                      onClick={() => setSidebarOpen(false)}
                      style={{ fontSize: '0.78rem', padding: '5px 8px', lineHeight: 1.35 }}
                    >
                      <span className="subsection-dot" style={{ background: isSubActive ? sec.accentColor : 'var(--text-muted)' }} />
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.68rem', opacity: 0.7, marginRight: 5 }}>
                        {sub.id}
                      </span>
                      {sub.title}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </aside>
  );
}
