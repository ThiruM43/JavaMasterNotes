'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { getAllNotes, removeNote, updateNote, exportAllNotesAsMarkdown } from '@/lib/storage/notes';
import { useApp } from '@/components/providers/AppProviders';
import type { Note } from '@/lib/types';

export default function NotesPage() {
  const { showToast } = useApp();
  const [notes, setNotes] = useState<Note[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [filterSection, setFilterSection] = useState('all');

  const refresh = () => setNotes(getAllNotes());
  useEffect(() => { refresh(); }, []);

  const sections = Array.from(new Set(notes.map(n => n.sectionTitle))).sort();
  const filtered = filterSection === 'all' ? notes : notes.filter(n => n.sectionTitle === filterSection);

  const handleExport = () => {
    const md = exportAllNotesAsMarkdown();
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'java-study-notes.md'; a.click();
    URL.revokeObjectURL(url);
    showToast('Notes exported as Markdown!');
  };

  return (
    <AppShell>
      <div className="breadcrumb">
        <Link href="/">Home</Link><span className="breadcrumb-sep">›</span><span>Notes</span>
      </div>

      <div style={{ padding: '20px 32px 0', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', flex: 1 }}>📝 My Notes</h1>
        <button className="export-btn" onClick={handleExport}>⬇ Export Markdown</button>
      </div>
      <p className="page-subtitle">{notes.length} notes across {sections.length} sections</p>

      {/* Filter */}
      {sections.length > 1 && (
        <div style={{ padding: '0 32px 16px', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button
            className={`badge ${filterSection === 'all' ? 'badge-amber' : 'badge-gray'}`}
            style={{ cursor: 'pointer', padding: '5px 12px', fontSize: '0.78rem' }}
            onClick={() => setFilterSection('all')}>All</button>
          {sections.map(s => (
            <button
              key={s}
              className={`badge ${filterSection === s ? 'badge-amber' : 'badge-gray'}`}
              style={{ cursor: 'pointer', padding: '5px 12px', fontSize: '0.78rem' }}
              onClick={() => setFilterSection(s)}>{s}</button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="empty-state" style={{ marginTop: 60 }}>
          <div className="empty-state-icon">📝</div>
          <h3>No notes yet</h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 4 }}>Open any term and click ✏️ Note</p>
          <Link href="/" className="btn btn-primary" style={{ marginTop: 16 }}>Browse Sections</Link>
        </div>
      ) : (
        <div style={{ padding: '0 32px 40px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(note => (
            <div key={note.id} className="note-card" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 18 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>{note.termName}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{note.sectionTitle} · {new Date(note.updatedAt).toLocaleDateString()}</div>
                </div>
                <Link href={`/${note.sectionId}`} className="badge badge-gray" style={{ fontSize: '0.65rem', textDecoration: 'none' }}>View Term →</Link>
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
                  <div className="note-editor-actions">
                    <button className="btn btn-secondary" onClick={() => setEditingId(null)}>Cancel</button>
                    <button className="btn btn-primary" onClick={() => {
                      updateNote(note.id, note.termId, editContent);
                      refresh(); setEditingId(null); showToast('Note saved!');
                    }}>Save</button>
                  </div>
                </>
              ) : (
                <>
                  <p style={{ fontSize: '0.875rem', lineHeight: 1.65, color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}>{note.content}</p>
                  {note.tags?.length > 0 && (
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 8 }}>
                      {note.tags.map(t => <span key={t} className="tag">{t}</span>)}
                    </div>
                  )}
                  <div className="note-card-actions">
                    <button className="note-card-btn" onClick={() => { setEditingId(note.id); setEditContent(note.content); }}>✏️ Edit</button>
                    <button className="note-card-btn danger" onClick={() => { removeNote(note.id, note.termId); refresh(); showToast('Note deleted'); }}>🗑 Delete</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </AppShell>
  );
}
