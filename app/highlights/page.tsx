'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { getAllHighlights, removeHighlight, exportAllHighlightsAsMarkdown, getCleanTermTitle } from '@/lib/storage/highlights';
import { useApp } from '@/components/providers/AppProviders';
import type { Highlight } from '@/lib/types';

const HL_COLORS: Record<string, { bg: string; label: string }> = {
  yellow: { bg: '#fef9c3', label: '🟡 Yellow' },
  green:  { bg: '#dcfce7', label: '🟢 Green' },
  blue:   { bg: '#dbeafe', label: '🔵 Blue' },
  pink:   { bg: '#fce7f3', label: '🩷 Pink' },
};

export default function HighlightsPage() {
  const { showToast } = useApp();
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [filterColor, setFilterColor] = useState<'all' | string>('all');
  const [collapsedTerms, setCollapsedTerms] = useState<Record<string, boolean>>({});

  const refresh = () => setHighlights(getAllHighlights());
  useEffect(() => { refresh(); }, []);

  const filtered = filterColor === 'all' ? highlights : highlights.filter(h => h.color === filterColor);

  const handleExport = () => {
    const md = exportAllHighlightsAsMarkdown();
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'java-study-highlights.md'; a.click();
    URL.revokeObjectURL(url);
    showToast('Highlights exported as Markdown!');
  };

  // Group filtered highlights by clean term title
  const grouped: Record<string, Highlight[]> = {};
  filtered.forEach(hl => {
    const title = getCleanTermTitle(hl);
    grouped[title] = [...(grouped[title] || []), hl];
  });

  const toggleTermCollapse = (termTitle: string) => {
    setCollapsedTerms(prev => ({ ...prev, [termTitle]: !prev[termTitle] }));
  };

  return (
    <AppShell>
      <div className="breadcrumb">
        <Link href="/">Home</Link><span className="breadcrumb-sep">›</span><span>Highlights</span>
      </div>

      <div style={{ padding: '20px 32px 0', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', flex: 1 }}>🖊 My Highlights</h1>
        <button className="export-btn" onClick={handleExport}>⬇ Export Markdown</button>
      </div>
      <p className="page-subtitle">{highlights.length} highlighted passages across {Object.keys(grouped).length} terms</p>

      {/* Color filter */}
      <div style={{ padding: '0 32px 16px', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button
          className={`badge ${filterColor === 'all' ? 'badge-amber' : 'badge-gray'}`}
          style={{ cursor: 'pointer', padding: '5px 12px', fontSize: '0.78rem' }}
          onClick={() => setFilterColor('all')}>All</button>
        {Object.entries(HL_COLORS).map(([color, meta]) => (
          <button
            key={color}
            className={`badge ${filterColor === color ? 'badge-amber' : 'badge-gray'}`}
            style={{ cursor: 'pointer', padding: '5px 12px', fontSize: '0.78rem' }}
            onClick={() => setFilterColor(color)}>{meta.label}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state" style={{ marginTop: 60 }}>
          <div className="empty-state-icon">🖊</div>
          <h3>No highlights yet</h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 4 }}>Select any text in any term to highlight multiple selections</p>
          <Link href="/" className="btn btn-primary" style={{ marginTop: 16 }}>Browse Sections</Link>
        </div>
      ) : (
        <div style={{ padding: '0 32px 40px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {Object.entries(grouped).map(([termTitle, hls]) => {
            const isCollapsed = collapsedTerms[termTitle];
            return (
              <div key={termTitle} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: 'var(--surface)' }}>
                <div
                  onClick={() => toggleTermCollapse(termTitle)}
                  style={{
                    padding: '14px 18px',
                    background: 'var(--bg-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    color: 'var(--text-primary)'
                  }}
                >
                  <span>🖊 {termTitle} <span style={{ fontWeight: 400, fontSize: '0.8rem', color: 'var(--text-muted)' }}>({hls.length} selections)</span></span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{isCollapsed ? '▸ Expand' : '▾ Collapse'}</span>
                </div>

                {!isCollapsed && (
                  <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {hls.map(hl => (
                      <div
                        key={hl.id}
                        style={{
                          background: HL_COLORS[hl.color]?.bg || '#fef9c3',
                          border: '1px solid rgba(0,0,0,0.08)',
                          borderRadius: 'var(--radius-md)',
                          padding: 14,
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#1a1205', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                            {hl.field} field
                          </span>
                          <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: '#1a1205', opacity: 0.6 }}>
                            {new Date(hl.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <blockquote style={{ margin: '0 0 8px 0', fontSize: '0.875rem', lineHeight: 1.65, color: '#1a1205', fontStyle: 'italic', borderLeft: '3px solid rgba(0,0,0,0.2)', paddingLeft: 12 }}>
                          "{hl.text}"
                        </blockquote>
                        {hl.note && (
                          <p style={{ fontSize: '0.78rem', color: '#3d2500', marginBottom: 8 }}>📌 {hl.note}</p>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <button
                            className="note-card-btn danger"
                            style={{ background: 'rgba(255,255,255,0.7)', padding: '4px 10px', borderRadius: 6 }}
                            onClick={() => { removeHighlight(hl.id, hl.termId); refresh(); showToast('Highlight removed'); }}
                          >🗑 Remove</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}
