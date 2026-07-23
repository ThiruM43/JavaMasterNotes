'use client';
import { useState, useEffect, useRef } from 'react';
import type { Term } from '@/lib/types';
import { getHighlightsForTerm, addHighlight } from '@/lib/storage/highlights';
import { getNotesForTerm, addNote } from '@/lib/storage/notes';
import { isBookmarked, toggleBookmark, isRead, markTermRead, unmarkTermRead } from '@/lib/storage/progress';
import { useApp } from '@/components/providers/AppProviders';
import { SelectionToolbar } from '@/components/highlighting/SelectionToolbar';

interface InterviewCardProps {
  term: Term;
  sectionId: string;
  subsectionId: string;
  sectionTitle: string;
}

export function InterviewCard({ term, sectionId, subsectionId, sectionTitle }: InterviewCardProps) {
  const { showToast, triggerProgressRefresh, setDrawerOpen, setDrawerTab } = useApp();
  const [bookmarked, setBookmarked] = useState(false);
  const [read, setRead] = useState(false);
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [notesCount, setNotesCount] = useState(0);

  useEffect(() => {
    setBookmarked(isBookmarked(term.id));
    setRead(isRead(term.id));
    setNotesCount(getNotesForTerm(term.id).length);
  }, [term.id]);

  const handleBookmark = () => {
    const next = toggleBookmark(term.id);
    setBookmarked(next);
    showToast(next ? '⭐ Bookmarked!' : 'Bookmark removed');
    triggerProgressRefresh();
  };

  const handleRead = () => {
    if (read) {
      unmarkTermRead(term.id);
      setRead(false);
    } else {
      markTermRead(term.id);
      setRead(true);
      showToast('✓ Marked as read');
    }
    triggerProgressRefresh();
  };

  const handleAddNote = () => {
    if (!noteContent.trim()) return;
    addNote({
      termId: term.id,
      sectionId,
      subsectionId,
      termName: term.term,
      sectionTitle,
      content: noteContent,
      tags: [],
    });
    setNoteContent('');
    setShowNoteInput(false);
    setNotesCount(n => n + 1);
    if (setDrawerTab) setDrawerTab('notes');
    setDrawerOpen(true);
    triggerProgressRefresh();
    showToast('Note saved!');
  };

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 16,
      overflow: 'hidden',
      boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
      display: 'flex',
      flexDirection: 'column'
    }} id={term.id}>
      
      {/* Header Area */}
      <div style={{
        padding: '20px 24px',
        borderBottom: '1px solid var(--border)',
        background: 'linear-gradient(to right, rgba(124, 58, 237, 0.05), transparent)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
          <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.3 }}>
            {term.term}
          </h2>
          <div style={{ display: 'flex', gap: 8 }}>
            {read && <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '4px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700 }}>✓ Read</span>}
            {bookmarked && <span style={{ fontSize: '1.2rem' }}>⭐</span>}
            {notesCount > 0 && (
              <button
                type="button"
                style={{ cursor: 'pointer', border: '1px solid var(--amber-border)', background: 'var(--amber-light)', color: 'var(--amber)', padding: '4px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}
                onClick={() => {
                  if (setDrawerTab) setDrawerTab('notes');
                  setDrawerOpen(true);
                }}
              >
                📝 {notesCount}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content Area - Flowing Narrative */}
      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 32 }}>
        
        {term.what && (
          <section>
            <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#7c3aed', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700 }}>
              <span>🎯</span> The Core Concept (What)
            </h3>
            <div style={{ fontSize: '1.05rem', color: 'var(--text-primary)' }}>
              <HighlightableField text={term.what} field="what" termId={term.id} sectionId={sectionId} termName={term.term} sectionTitle={sectionTitle} />
            </div>
          </section>
        )}

        {(term.why || term.how) && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, background: 'var(--bg-secondary)', padding: '20px', borderRadius: 12, border: '1px solid var(--border-subtle)' }}>
            {term.why && (
              <section>
                <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#3b82f6', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700 }}>
                  <span>💡</span> Why it Matters
                </h3>
                <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                  <HighlightableField text={term.why} field="why" termId={term.id} sectionId={sectionId} termName={term.term} sectionTitle={sectionTitle} />
                </div>
              </section>
            )}
            {term.how && (
              <section>
                <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#10b981', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700 }}>
                  <span>⚙️</span> How it Works
                </h3>
                <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                  <HighlightableField text={term.how} field="how" termId={term.id} sectionId={sectionId} termName={term.term} sectionTitle={sectionTitle} />
                </div>
              </section>
            )}
          </div>
        )}

        {(term.where || term.when) && (
          <div style={{ borderLeft: '3px solid var(--border)', paddingLeft: '16px' }}>
            {term.where && (
              <section style={{ marginBottom: term.when ? 16 : 0 }}>
                <h3 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 6, fontWeight: 600 }}>Use Cases & Architecture (Where)</h3>
                <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                  <HighlightableField text={term.where} field="where" termId={term.id} sectionId={sectionId} termName={term.term} sectionTitle={sectionTitle} />
                </div>
              </section>
            )}
            {term.when && (
              <section>
                <h3 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 6, fontWeight: 600 }}>Timing & Triggers (When)</h3>
                <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                  <HighlightableField text={term.when} field="when" termId={term.id} sectionId={sectionId} termName={term.term} sectionTitle={sectionTitle} />
                </div>
              </section>
            )}
          </div>
        )}

        {(term.issue || term.fix) && (
          <div style={{ background: 'rgba(239, 68, 68, 0.04)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '20px', borderRadius: 12 }}>
            <h3 style={{ fontSize: '0.9rem', color: '#ef4444', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700 }}>
              <span>⚠️</span> Troubleshooting & Scenarios
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {term.issue && (
                <div>
                  <strong style={{ fontSize: '0.8rem', color: '#b91c1c', textTransform: 'uppercase' }}>The Problem:</strong>
                  <div style={{ fontSize: '0.95rem', color: 'var(--text-primary)', marginTop: 4 }}>
                    <HighlightableField text={term.issue} field="issue" termId={term.id} sectionId={sectionId} termName={term.term} sectionTitle={sectionTitle} />
                  </div>
                </div>
              )}
              {term.fix && (
                <div>
                  <strong style={{ fontSize: '0.8rem', color: '#15803d', textTransform: 'uppercase' }}>The Solution:</strong>
                  <div style={{ fontSize: '0.95rem', color: 'var(--text-primary)', marginTop: 4 }}>
                    <HighlightableField text={term.fix} field="fix" termId={term.id} sectionId={sectionId} termName={term.term} sectionTitle={sectionTitle} />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {term.star && Object.values(term.star).some(Boolean) && (
          <section>
            <StarCard star={term.star} />
          </section>
        )}
      </div>

      {/* Note Editor Area */}
      {showNoteInput && (
        <div style={{ padding: '0 24px 24px 24px' }}>
          <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: 12, border: '1px solid var(--border)' }}>
            <textarea
              style={{
                width: '100%',
                background: 'var(--surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 8,
                padding: '12px',
                color: 'var(--text-primary)',
                fontFamily: 'inherit',
                fontSize: '0.95rem',
                minHeight: '80px',
                resize: 'vertical',
                marginBottom: '12px'
              }}
              placeholder="Write your study notes or insights here..."
              value={noteContent}
              onChange={e => setNoteContent(e.target.value)}
              autoFocus
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button onClick={() => setShowNoteInput(false)} style={{ padding: '8px 16px', borderRadius: 6, border: 'none', background: 'transparent', color: 'var(--text-secondary)', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleAddNote} style={{ padding: '8px 16px', borderRadius: 6, border: 'none', background: '#7c3aed', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>Save Note</button>
            </div>
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div style={{
        padding: '16px 24px',
        borderTop: '1px solid var(--border)',
        background: 'var(--bg-secondary)',
        display: 'flex',
        gap: 12,
        flexWrap: 'wrap'
      }}>
        <button
          onClick={handleBookmark}
          style={{
            padding: '8px 16px',
            borderRadius: 8,
            border: '1px solid var(--border)',
            background: bookmarked ? 'rgba(245, 158, 11, 0.1)' : 'var(--surface)',
            color: bookmarked ? '#d97706' : 'var(--text-secondary)',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}
        >
          {bookmarked ? '⭐ Bookmarked' : '☆ Bookmark'}
        </button>
        <button
          onClick={() => setShowNoteInput(s => !s)}
          style={{
            padding: '8px 16px',
            borderRadius: 8,
            border: '1px solid var(--border)',
            background: 'var(--surface)',
            color: 'var(--text-secondary)',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}
        >
          ✏️ Add Note
        </button>
      </div>

    </div>
  );
}

// Re-using the same HighlightableField logic
function HighlightableField({ text, field, termId, sectionId, termName, sectionTitle, className }: {
  text: string; field: string; termId: string; sectionId: string; termName?: string; sectionTitle?: string; className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [toolbar, setToolbar] = useState<{ x: number; y: number; text: string } | null>(null);
  const [highlights, setHighlights] = useState(() => getHighlightsForTerm(termId).filter(h => h.field === field));

  const handleMouseUp = () => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) { setToolbar(null); return; }
    const selectedText = sel.toString().trim();
    if (!selectedText || selectedText.length < 3) { setToolbar(null); return; }
    const range = sel.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    setToolbar({
      x: rect.left + rect.width / 2,
      y: rect.top - 8,
      text: selectedText,
    });
  };

  const applyHighlight = (color: 'yellow' | 'green' | 'blue' | 'pink') => {
    if (!toolbar) return;
    addHighlight({ termId, sectionId, termName, sectionTitle, field, text: toolbar.text, color });
    setHighlights(getHighlightsForTerm(termId).filter(h => h.field === field));
    setToolbar(null);
    window.getSelection()?.removeAllRanges();
  };

  if (!text) return <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>—</p>;

  const renderWithHighlights = () => {
    if (!highlights.length) return <span>{text}</span>;
    const sorted = [...highlights].sort((a, b) => text.indexOf(a.text) - text.indexOf(b.text));
    let lastIdx = 0;
    const parts: React.ReactNode[] = [];
    sorted.forEach((hl, i) => {
      const idx = text.indexOf(hl.text, lastIdx);
      if (idx === -1) return;
      if (idx > lastIdx) parts.push(<span key={`t${i}`}>{text.slice(lastIdx, idx)}</span>);
      parts.push(<mark key={hl.id} className={`highlight-${hl.color}`}>{hl.text}</mark>);
      lastIdx = idx + hl.text.length;
    });
    if (lastIdx < text.length) parts.push(<span key="last">{text.slice(lastIdx)}</span>);
    return <>{parts}</>;
  };

  return (
    <>
      <div
        ref={containerRef}
        className={`highlightable ${className || ''}`}
        onMouseUp={handleMouseUp}
        onTouchEnd={handleMouseUp}
        style={{ lineHeight: 1.75 }}
      >
        {renderWithHighlights()}
      </div>
      {toolbar && (
        <SelectionToolbar
          x={toolbar.x} y={toolbar.y}
          onHighlight={applyHighlight}
          onClose={() => setToolbar(null)}
        />
      )}
    </>
  );
}

function StarCard({ star }: { star: { s: string; t: string; a: string; r: string } }) {
  if (!star || !Object.values(star).some(Boolean)) return null;
  const items = [
    { key: 'S', label: 'Situation', value: star.s, color: '#f59e0b' },
    { key: 'T', label: 'Task', value: star.t, color: '#3b82f6' },
    { key: 'A', label: 'Action', value: star.a, color: '#8b5cf6' },
    { key: 'R', label: 'Result', value: star.r, color: '#10b981' },
  ];
  return (
    <div style={{ background: 'var(--surface-raised)', border: '1px solid var(--border)', borderRadius: 12, padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <span style={{ fontSize: '1.4rem' }}>⭐</span>
        <h3 style={{ margin: 0, fontWeight: 800, color: 'var(--star-gold)', fontSize: '1.1rem', fontFamily: 'Playfair Display, serif', letterSpacing: '0.5px' }}>
          Real-World Interview STAR Story
        </h3>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
        {items.map(item => item.value && (
          <div key={item.key} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%', background: `${item.color}15`,
              color: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: '1.2rem', flexShrink: 0
            }}>
              {item.key}
            </div>
            <div style={{ paddingTop: 4 }}>
              <strong style={{ display: 'block', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4 }}>
                {item.label}
              </strong>
              <div style={{ fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>
                {item.value}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
