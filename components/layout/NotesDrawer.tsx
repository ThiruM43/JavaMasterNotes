'use client';
import { useState, useEffect } from 'react';
import { useApp } from '@/components/providers/AppProviders';
import { getAllNotes, removeNote, updateNote, exportAllNotesAsMarkdown } from '@/lib/storage/notes';
import { getAllHighlights, removeHighlight, exportAllHighlightsAsMarkdown, getCleanTermTitle } from '@/lib/storage/highlights';
import type { Note, Highlight } from '@/lib/types';

export function NotesDrawer() {
  const { setDrawerOpen, showToast, refreshProgress, drawerTab: tab, setDrawerTab: setTab } = useApp();
  const [notes, setNotes] = useState<Note[]>([]);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [collapsedTerms, setCollapsedTerms] = useState<Record<string, boolean>>({});

  const refresh = () => {
    setNotes(getAllNotes());
    setHighlights(getAllHighlights());
  };

  useEffect(() => { refresh(); }, [refreshProgress]);

  const hlColors: Record<string, string> = {
    yellow: '#fef9c3', green: '#dcfce7', blue: '#dbeafe', pink: '#fce7f3',
  };

  const handleExportNotes = () => {
    const md = exportAllNotesAsMarkdown();
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'java-study-notes.md'; a.click();
    URL.revokeObjectURL(url);
    showToast('Notes exported as Markdown!');
  };

  const handleExportHighlights = () => {
    const md = exportAllHighlightsAsMarkdown();
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'java-study-highlights.md'; a.click();
    URL.revokeObjectURL(url);
    showToast('Highlights exported as Markdown!');
  };

  // Group highlights by clean term title
  const groupedHighlights: Record<string, Highlight[]> = {};
  highlights.forEach(hl => {
    const title = getCleanTermTitle(hl);
    groupedHighlights[title] = [...(groupedHighlights[title] || []), hl];
  });

  const toggleTermCollapse = (termTitle: string) => {
    setCollapsedTerms(prev => ({ ...prev, [termTitle]: !prev[termTitle] }));
  };

  return (
    <aside className="notes-drawer">
      <div className="drawer-header">
        <span>📝 My Study Hub</span>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {tab === 'notes' ? (
            <button className="note-card-btn" onClick={handleExportNotes} title="Export Notes as Markdown">⬇ MD</button>
          ) : (
            <button className="note-card-btn" onClick={handleExportHighlights} title="Export Highlights as Markdown">⬇ MD</button>
          )}
          <button className="icon-btn" onClick={() => setDrawerOpen(false)} aria-label="Close">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="1" y1="1" x2="13" y2="13" /><line x1="13" y1="1" x2="1" y2="13" />
            </svg>
          </button>
        </div>
      </div>

      <div className="drawer-tabs">
        <button className={`drawer-tab ${tab === 'notes' ? 'active' : ''}`} onClick={() => setTab('notes')}>
          📝 Notes ({notes.length})
        </button>
        <button className={`drawer-tab ${tab === 'highlights' ? 'active' : ''}`} onClick={() => setTab('highlights')}>
          🖊 Highlights ({highlights.length})
        </button>
      </div>

      <div className="drawer-body">
        {tab === 'notes' && (
          notes.length === 0
            ? <EmptyState icon="📝" title="No notes yet" sub="Open any term and click ✏️ Add Note" />
            : notes.map(note => (
              <div key={note.id} className="note-card">
                <div className="note-card-meta">
                  <span style={{ fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.78rem' }}>{note.termName}</span>
                  <span style={{ marginLeft: 'auto' }}>{new Date(note.updatedAt).toLocaleDateString()}</span>
                </div>
                {editingId === note.id ? (
                  <>
                    <textarea
                      className="note-textarea"
                      value={editContent}
                      onChange={e => setEditContent(e.target.value)}
                      rows={4}
                      autoFocus
                    />
                    <div className="note-card-actions">
                      <button className="note-card-btn" onClick={() => setEditingId(null)}>Cancel</button>
                      <button className="note-card-btn" style={{ color: 'var(--fix-green)' }}
                        onClick={() => {
                          updateNote(note.id, note.termId, editContent);
                          refresh(); setEditingId(null); showToast('Note saved ✓');
                        }}>Save</button>
                    </div>
                  </>
                ) : (
                  <>
                    <p style={{ fontSize: '0.82rem', lineHeight: 1.55, color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}>{note.content}</p>
                    {note.tags?.length > 0 && (
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 6 }}>
                        {note.tags.map(t => <span key={t} className="tag">{t}</span>)}
                      </div>
                    )}
                    <div className="note-card-actions">
                      <button className="note-card-btn" onClick={() => { setEditingId(note.id); setEditContent(note.content); }}>✏️ Edit</button>
                      <button className="note-card-btn danger" onClick={() => { removeNote(note.id, note.termId); refresh(); showToast('Note deleted'); }}>🗑</button>
                    </div>
                  </>
                )}
              </div>
            ))
        )}

        {tab === 'highlights' && (
          highlights.length === 0
            ? <EmptyState icon="🖊" title="No highlights yet" sub="Select any text to highlight it across multiple selections" />
            : Object.entries(groupedHighlights).map(([termTitle, hls]) => {
              const isCollapsed = collapsedTerms[termTitle];
              return (
                <div key={termTitle} style={{ border: '1px solid var(--border)', borderRadius: 8, marginBottom: 12, overflow: 'hidden', background: 'var(--surface)' }}>
                  <div
                    onClick={() => toggleTermCollapse(termTitle)}
                    style={{
                      padding: '10px 14px',
                      background: 'var(--bg-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      color: 'var(--text-primary)'
                    }}
                  >
                    <span>🖊 {termTitle} <span style={{ fontWeight: 400, fontSize: '0.75rem', color: 'var(--text-muted)' }}>({hls.length})</span></span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{isCollapsed ? '▸ Expand' : '▾ Collapse'}</span>
                  </div>

                  {!isCollapsed && (
                    <div style={{ padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {hls.map(hl => (
                        <div key={hl.id} className="highlight-card" style={{ background: hlColors[hl.color] || hlColors.yellow, margin: 0, padding: '10px 12px' }}>
                          <div style={{ fontSize: '0.68rem', color: '#1a1205', opacity: 0.7, fontWeight: 700, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            {hl.field} field
                          </div>
                          <p style={{ fontSize: '0.82rem', color: '#1a1205', lineHeight: 1.5, margin: 0 }}>"{hl.text}"</p>
                          {hl.note && <p style={{ fontSize: '0.75rem', color: '#3d1a00', marginTop: 4, fontStyle: 'italic', margin: '4px 0 0' }}>{hl.note}</p>}
                          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 6 }}>
                            <button className="note-card-btn danger" style={{ background: 'rgba(255,255,255,0.6)', padding: '2px 8px', borderRadius: 4 }}
                              onClick={() => { removeHighlight(hl.id, hl.termId); refresh(); showToast('Highlight removed'); }}>Remove</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
        )}
      </div>
    </aside>
  );
}

function EmptyState({ icon, title, sub }: { icon: string; title: string; sub: string }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <h3>{title}</h3>
      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{sub}</p>
    </div>
  );
}
