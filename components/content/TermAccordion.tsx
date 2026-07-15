'use client';
import { useState, useEffect, useRef } from 'react';
import type { Term } from '@/lib/types';
import { getHighlightsForTerm, addHighlight, removeHighlight } from '@/lib/storage/highlights';
import { getNotesForTerm, addNote, removeNote, updateNote } from '@/lib/storage/notes';
import { isBookmarked, toggleBookmark, isRead, markTermRead, unmarkTermRead } from '@/lib/storage/progress';
import { useApp } from '@/components/providers/AppProviders';
import { SelectionToolbar } from '@/components/highlighting/SelectionToolbar';

const TABS = ['What', 'Why', 'How', 'Where', 'When', 'Issue + Fix', 'STAR'] as const;
type Tab = typeof TABS[number];

interface TermAccordionProps {
  term: Term;
  sectionId: string;
  subsectionId: string;
  sectionTitle: string;
  defaultOpen?: boolean;
}

export function TermAccordion({ term, sectionId, subsectionId, sectionTitle, defaultOpen = false }: TermAccordionProps) {
  const { showToast, triggerProgressRefresh, setDrawerOpen, setDrawerTab } = useApp();
  const [open, setOpen] = useState(defaultOpen);
  const [activeTab, setActiveTab] = useState<Tab>('What');
  const [bookmarked, setBookmarked] = useState(false);
  const [read, setRead] = useState(false);
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [notesCount, setNotesCount] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

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

  const tabContent: Record<Tab, React.ReactNode> = {
    'What': <HighlightableField text={term.what} field="what" termId={term.id} sectionId={sectionId} termName={term.term} sectionTitle={sectionTitle} className="field-what" />,
    'Why': <HighlightableField text={term.why} field="why" termId={term.id} sectionId={sectionId} termName={term.term} sectionTitle={sectionTitle} />,
    'How': <HighlightableField text={term.how} field="how" termId={term.id} sectionId={sectionId} termName={term.term} sectionTitle={sectionTitle} />,
    'Where': <HighlightableField text={term.where} field="where" termId={term.id} sectionId={sectionId} termName={term.term} sectionTitle={sectionTitle} />,
    'When': <HighlightableField text={term.when} field="when" termId={term.id} sectionId={sectionId} termName={term.term} sectionTitle={sectionTitle} />,
    'Issue + Fix': (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {term.issue && (
          <div className="field-issue">
            <div style={{ fontWeight: 700, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>⚠</span> Issue
            </div>
            <HighlightableField text={term.issue} field="issue" termId={term.id} sectionId={sectionId} termName={term.term} sectionTitle={sectionTitle} />
          </div>
        )}
        {term.fix && (
          <div className="field-fix">
            <div style={{ fontWeight: 700, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>✔</span> Fix
            </div>
            <HighlightableField text={term.fix} field="fix" termId={term.id} sectionId={sectionId} termName={term.term} sectionTitle={sectionTitle} />
          </div>
        )}
      </div>
    ),
    'STAR': <StarCard star={term.star} />,
  };

  return (
    <div className={`term-accordion ${open ? 'expanded' : ''}`} id={term.id}>
      <div className="term-header" onClick={() => setOpen(o => !o)} role="button" tabIndex={0}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setOpen(o => !o); }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
          <span className="term-name">{term.term}</span>
          {term.what && !open && (
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {term.what.slice(0, 100)}…
            </span>
          )}
        </div>
        <div className="term-badges">
          {read && <span className="badge badge-green">✓ Read</span>}
          {bookmarked && <span style={{ fontSize: '1rem' }}>⭐</span>}
          {notesCount > 0 && (
            <button
              type="button"
              className="badge badge-amber"
              style={{ cursor: 'pointer', border: '1px solid var(--amber-border)', background: 'var(--amber-light)', color: 'var(--amber)', padding: '3px 9px', borderRadius: 14, display: 'inline-flex', alignItems: 'center', gap: 4, fontWeight: 700 }}
              onClick={(e) => {
                e.stopPropagation();
                if (setDrawerTab) setDrawerTab('notes');
                setDrawerOpen(true);
                setOpen(true);
                showToast(`📝 Showing ${notesCount} saved note${notesCount > 1 ? 's' : ''} in Notes Drawer`);
              }}
              title="Click to view saved notes in Notes Drawer"
            >
              📝 {notesCount}
            </button>
          )}
        </div>
        <svg className="term-chevron" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="4 6 8 10 12 6" />
        </svg>
      </div>

      {open && (
        <div className="term-body" ref={contentRef}>
          <div className="term-tabs">
            {TABS.map(tab => {
              const hasContent = tab === 'STAR'
                ? Object.values(term.star || {}).some(Boolean)
                : tab === 'Issue + Fix'
                  ? (term.issue || term.fix)
                  : term[tab.toLowerCase() as keyof Term];
              if (!hasContent) return null;
              return (
                <button
                  key={tab}
                  className={`term-tab-btn ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === 'Issue + Fix' ? '⚠ Issue+Fix' : tab === 'STAR' ? '⭐ STAR' : tab}
                </button>
              );
            })}
          </div>

          <div className="term-tab-content">
            {tabContent[activeTab]}
          </div>

          {showNoteInput && (
            <div className="note-editor">
              <textarea
                className="note-textarea"
                placeholder="Write your note about this term..."
                value={noteContent}
                onChange={e => setNoteContent(e.target.value)}
                rows={3}
                autoFocus
              />
              <div className="note-editor-actions">
                <button className="btn btn-secondary" onClick={() => setShowNoteInput(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleAddNote}>Save Note</button>
              </div>
            </div>
          )}

          <div className="term-actions">
            <button className={`term-action-btn ${bookmarked ? 'bookmarked' : ''}`} onClick={handleBookmark}>
              {bookmarked ? '⭐' : '☆'} {bookmarked ? 'Bookmarked' : 'Bookmark'}
            </button>
            <button className={`term-action-btn ${read ? 'read' : ''}`} onClick={handleRead}>
              {read ? '✓ Read' : '○ Mark Read'}
            </button>
            <button className="term-action-btn" onClick={() => setShowNoteInput(s => !s)}>
              ✏️ Note
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

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

  // Render text with inline highlights
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
  if (!star || !Object.values(star).some(Boolean)) {
    return <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No STAR example available.</p>;
  }
  const items = [
    { key: 'S', label: 'Situation', value: star.s },
    { key: 'T', label: 'Task', value: star.t },
    { key: 'A', label: 'Action', value: star.a },
    { key: 'R', label: 'Result', value: star.r },
  ];
  return (
    <div className="star-card">
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: '1.2rem' }}>⭐</span>
        <span style={{ fontWeight: 700, color: 'var(--star-gold)', fontSize: '0.85rem', fontFamily: 'Playfair Display, serif' }}>STAR Interview Story</span>
      </div>
      <div className="star-grid">
        {items.map(item => item.value && (
          <div key={item.key} className="star-item">
            <div className="star-label">{item.key} — {item.label}</div>
            <div className="star-text">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
