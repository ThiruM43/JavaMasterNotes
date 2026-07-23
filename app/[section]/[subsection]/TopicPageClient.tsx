'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { useApp } from '@/components/providers/AppProviders';
import { TermAccordion } from '@/components/content/TermAccordion';
import { fetchSectionBySlug } from '@/lib/data';
import { setLastVisited } from '@/lib/storage/progress';
import { useSearchParams } from 'next/navigation';
import type { Section, Subsection } from '@/lib/types';

export default function TopicPageClient({ sectionSlug, subsectionSlug }: { sectionSlug: string; subsectionSlug: string }) {
  const { sectionIndex } = useApp();
  const [section, setSection] = useState<Section | null>(null);
  const [subsection, setSubsection] = useState<Subsection | null>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl');

  useEffect(() => {
    let active = true;
    const getAndSetTopic = async () => {
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
        if (!sec) {
          setLoading(false);
          return;
        }
        setSection(sec);
        const sub = sec.subsections.find(s => s.slug === subsectionSlug);
        setSubsection(sub || null);
        setLoading(false);
        if (sub) setLastVisited(`/${sectionSlug}/${subsectionSlug}`);
      }
    };
    getAndSetTopic();
    return () => { active = false; };
  }, [sectionSlug, subsectionSlug, sectionIndex]);

  if (loading) return (
    <AppShell>
      <div style={{ padding: '20px 32px' }}>
        {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 70, marginBottom: 12, borderRadius: 10 }} />)}
      </div>
    </AppShell>
  );

  if (!section || !subsection) return (
    <AppShell>
      <div className="empty-state" style={{ marginTop: 80 }}>
        <div className="empty-state-icon">🔍</div><h3>Topic not found</h3>
      </div>
    </AppShell>
  );

  const secIdx = sectionIndex.find(s => s.slug === sectionSlug);
  const subIdx = section.subsections.findIndex(s => s.slug === subsectionSlug);
  const prevSub = section.subsections[subIdx - 1];
  const nextSub = section.subsections[subIdx + 1];

  return (
    <AppShell>
      <div className="breadcrumb">
        <Link href="/">Home</Link>
        <span className="breadcrumb-sep">›</span>
        <Link href={`/${sectionSlug}`}>{section.title}</Link>
        <span className="breadcrumb-sep">›</span>
        <span style={{ color: 'var(--text-primary)' }}>{subsection.title}</span>
      </div>

      <div className="topic-content">
        <div style={{ paddingTop: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{subsection.id}</span>
            {secIdx && (
              <span className="badge" style={{ background: secIdx.accentColor + '20', color: secIdx.accentColor, border: `1px solid ${secIdx.accentColor}40` }}>
                {secIdx.icon} {section.title}
              </span>
            )}
          </div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)', marginBottom: 4 }}>
            {subsection.title}
          </h1>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{subsection.terms.length} terms</p>
        </div>

        {subsection.keyRule && (
          <div className="key-rule-banner">
            <div className="key-rule-label"><span>⚡</span> Key Rule</div>
            {subsection.keyRule}
          </div>
        )}

        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {subsection.terms.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📄</div>
              <h3>No terms found for this subsection</h3>
            </div>
          ) : (
            subsection.terms.map((term, i) => (
              <TermAccordion
                key={term.id}
                term={term}
                sectionId={section.id}
                subsectionId={subsection.id}
                sectionTitle={section.title}
                defaultOpen={i === 0}
              />
            ))
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginTop: 32, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
          {prevSub ? (
            <Link href={`/${sectionSlug}/${prevSub.slug}`} className="btn btn-secondary" style={{ flex: 1, justifyContent: 'flex-start' }}>
              ← {prevSub.title}
            </Link>
          ) : <div />}
          {nextSub ? (
            <Link href={`/${sectionSlug}/${nextSub.slug}`} className="btn btn-primary" style={{ flex: 1, justifyContent: 'flex-end' }}>
              {nextSub.title} →
            </Link>
          ) : (
            <Link href={`/${sectionSlug}`} className="btn btn-secondary">Back to Section ↑</Link>
          )}
        </div>
      </div>

      {returnUrl && (
        <Link href={returnUrl} className="fab-podcast">
          <span style={{ fontSize: '1.2rem' }}>🎧</span>
          Back to Podcast
        </Link>
      )}
    </AppShell>
  );
}
