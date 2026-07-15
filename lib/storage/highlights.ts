import { Highlight } from '@/lib/types';

const KEY = 'java-notes-highlights';

function load(): Record<string, Highlight[]> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function save(data: Record<string, Highlight[]>): void {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(KEY, JSON.stringify(data)); } catch {}
}

export function getHighlightsForTerm(termId: string): Highlight[] {
  return load()[termId] || [];
}

export function getAllHighlights(): Highlight[] {
  const data = load();
  return Object.values(data).flat().sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getCleanTermTitle(hl: Highlight): string {
  if (hl.termName && hl.termName.trim()) return hl.termName.trim();
  // Strip leading numbers/dots e.g. 1.1.jdk-java-development-kit -> jdk-java-development-kit
  const parts = hl.termId.split('.');
  const slug = parts.length > 1 ? parts[parts.length - 1] : hl.termId;
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
}

export function addHighlight(h: Omit<Highlight, 'id' | 'createdAt' | 'updatedAt'>): Highlight {
  const data = load();
  const newH: Highlight = {
    ...h,
    id: `hl_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  data[h.termId] = [...(data[h.termId] || []), newH];
  save(data);
  return newH;
}

export function updateHighlight(id: string, termId: string, patch: Partial<Highlight>): void {
  const data = load();
  if (!data[termId]) return;
  data[termId] = data[termId].map(h =>
    h.id === id ? { ...h, ...patch, updatedAt: new Date().toISOString() } : h
  );
  save(data);
}

export function removeHighlight(id: string, termId: string): void {
  const data = load();
  if (!data[termId]) return;
  data[termId] = data[termId].filter(h => h.id !== id);
  if (data[termId].length === 0) delete data[termId];
  save(data);
}

export function exportAllHighlightsAsMarkdown(): string {
  const highlights = getAllHighlights();
  if (!highlights.length) return '# My Java Highlights\n\nNo highlights yet.';

  // Group by clean term title
  const grouped: Record<string, Highlight[]> = {};
  highlights.forEach(hl => {
    const title = getCleanTermTitle(hl);
    grouped[title] = [...(grouped[title] || []), hl];
  });

  let md = '# My Java Highlights\n\n';
  for (const [termTitle, hls] of Object.entries(grouped)) {
    md += `## ${termTitle}\n\n`;
    hls.forEach(hl => {
      md += `- **[${hl.field.toUpperCase()}]**: "${hl.text}"\n`;
      if (hl.note) md += `  - *Note*: ${hl.note}\n`;
    });
    md += `\n---\n\n`;
  }
  return md;
}
