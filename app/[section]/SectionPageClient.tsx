'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { useApp } from '@/components/providers/AppProviders';
import { fetchSectionBySlug } from '@/lib/data';
import { getProgress, setLastVisited } from '@/lib/storage/progress';
import type { Section } from '@/lib/types';

export default function SectionPageClient({ sectionSlug }: { sectionSlug: string }) {
  const { sectionIndex } = useApp();
  const [section, setSection] = useState<Section | null>(null);
  const [loading, setLoading] = useState(true);
  const [readTerms, setReadTerms] = useState<string[]>([]);

  useEffect(() => {
    let active = true;
    const getAndSetSection = async () => {
      let idx = sectionIndex;
      if (!idx.length) {
        try {
          const base = process.env.NEXT_PUBLIC_BASE_PATH || '';
          const res = await fetch(`${base}/data/index.json`);
          if (res.ok) idx = await res.json();
        } catch {}
      }
      if (!active || !idx.length) {
        if (active) setLoading(false);
        return;
      }

      const sec = await fetchSectionBySlug(sectionSlug, idx);
      if (active) {
        setSection(sec);
        setLoading(false);
        if (sec) setLastVisited(`/${sectionSlug}`);
      }
    };
    getAndSetSection();
    setReadTerms(getProgress().readTerms);
    return () => { active = false; };
  }, [sectionSlug, sectionIndex]);

  if (loading) return (
    <AppShell>
      <div style={{ padding: 32 }}>
        {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 80, marginBottom: 12, borderRadius: 10 }} />)}
      </div>
    </AppShell>
  );

  if (!section) return (
    <AppShell>
      <div className="empty-state" style={{ marginTop: 80 }}>
        <div className="empty-state-icon">🔍</div><h3>Section not found</h3>
      </div>
    </AppShell>
  );

  const totalTerms = section.subsections.reduce((s, sub) => s + sub.terms.length, 0);
  const readCount = readTerms.filter(id => id.startsWith(`${section.id}.`)).length;
  const pct = totalTerms > 0 ? Math.round((readCount / totalTerms) * 100) : 0;

  return (
    <AppShell>
      <div className="breadcrumb">
        <Link href="/">Home</Link>
        <span className="breadcrumb-sep">›</span>
        <span style={{ color: 'var(--text-primary)' }}>{section.title}</span>
      </div>

      <div className="section-hero" style={{ borderTop: `4px solid ${section.accentColor}`, background: `linear-gradient(135deg, var(--surface) 0%, var(--bg-secondary) 100%)` }}>
        <div className="section-hero-bg">{section.icon}</div>
        <h1 style={{ color: section.accentColor }}>{section.icon} {section.title}</h1>
        <div style={{ display: 'flex', gap: 16, marginTop: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {section.subsections.length} subsections · {totalTerms} terms
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 200 }}>
            <div style={{ flex: 1, height: 6, background: 'var(--border-subtle)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ height: '100%', borderRadius: 3, background: section.accentColor, width: `${pct}%`, transition: 'width 0.6s ease' }} />
            </div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>
              {pct}% ({readCount}/{totalTerms})
            </span>
          </div>
        </div>
      </div>

      <div className="subsection-cards">
        {section.subsections.map(sub => {
          const subRead = readTerms.filter(id => id.startsWith(`${sub.id}.`)).length;
          const subPct = sub.terms.length > 0 ? Math.round((subRead / sub.terms.length) * 100) : 0;
          return (
            <Link key={sub.id} href={`/${sectionSlug}/${sub.slug}`} className="subsection-card">
              <div className="subsection-card-id">{sub.id}</div>
              <div className="subsection-card-title">{sub.title}</div>
              {sub.keyRule && (
                <div className="key-rule-preview">
                  <span style={{ color: 'var(--amber)', fontWeight: 700 }}>▸ </span>{sub.keyRule}
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
                <div style={{ flex: 1, height: 4, background: 'var(--border-subtle)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: section.accentColor, width: `${subPct}%`, borderRadius: 2 }} />
                </div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace', flexShrink: 0 }}>
                  {sub.terms.length} terms
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </AppShell>
  );
}
