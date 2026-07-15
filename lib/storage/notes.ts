import { Note } from '@/lib/types';

const KEY = 'java-notes-user-notes';

function load(): Record<string, Note[]> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function save(data: Record<string, Note[]>): void {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(KEY, JSON.stringify(data)); } catch {}
}

export function getNotesForTerm(termId: string): Note[] {
  return load()[termId] || [];
}

export function getAllNotes(): Note[] {
  const data = load();
  return Object.values(data).flat().sort((a, b) =>
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

export function addNote(n: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Note {
  const data = load();
  const newNote: Note = {
    ...n,
    id: `note_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  data[n.termId] = [...(data[n.termId] || []), newNote];
  save(data);
  return newNote;
}

export function updateNote(id: string, termId: string, content: string): void {
  const data = load();
  if (!data[termId]) return;
  data[termId] = data[termId].map(n =>
    n.id === id ? { ...n, content, updatedAt: new Date().toISOString() } : n
  );
  save(data);
}

export function removeNote(id: string, termId: string): void {
  const data = load();
  if (!data[termId]) return;
  data[termId] = data[termId].filter(n => n.id !== id);
  if (data[termId].length === 0) delete data[termId];
  save(data);
}

export function exportAllNotesAsMarkdown(): string {
  const notes = getAllNotes();
  if (!notes.length) return '# My Java Notes\n\nNo notes yet.';
  const grouped: Record<string, Note[]> = {};
  notes.forEach(n => {
    const key = n.sectionTitle || 'General';
    grouped[key] = [...(grouped[key] || []), n];
  });
  let md = '# My Java Study Notes\n\n';
  for (const [section, sNotes] of Object.entries(grouped)) {
    md += `## ${section}\n\n`;
    sNotes.forEach(n => {
      md += `### ${n.termName}\n\n${n.content}\n\n`;
      if (n.tags?.length) md += `Tags: ${n.tags.join(', ')}\n\n`;
      md += `---\n\n`;
    });
  }
  return md;
}
