import Fuse from 'fuse.js';
import { SectionIndex, SearchResult } from '@/lib/types';

type SearchEntry = {
  termId: string;
  term: string;
  sectionId: string;
  sectionTitle: string;
  sectionIcon: string;
  sectionSlug: string;
  subsectionId: string;
  subsectionSlug: string;
  what: string;
  why: string;
};

let fuse: Fuse<SearchEntry> | null = null;
let searchData: SearchEntry[] = [];

export async function buildSearchIndex(sectionIndex: SectionIndex[]): Promise<void> {
  const entries: SearchEntry[] = [];
  
  for (const sec of sectionIndex) {
    try {
      const res = await fetch(`/data/${sec.file}`);
      if (!res.ok) continue;
      const data = await res.json();
      for (const sub of data.subsections || []) {
        for (const term of sub.terms || []) {
          entries.push({
            termId: term.id,
            term: term.term,
            sectionId: sec.id,
            sectionTitle: sec.title,
            sectionIcon: sec.icon,
            sectionSlug: sec.slug,
            subsectionId: sub.id,
            subsectionSlug: sub.slug,
            what: term.what || '',
            why: term.why || '',
          });
        }
      }
    } catch {}
  }
  
  searchData = entries;
  fuse = new Fuse(entries, {
    keys: [
      { name: 'term', weight: 0.5 },
      { name: 'what', weight: 0.3 },
      { name: 'why', weight: 0.2 },
    ],
    threshold: 0.35,
    includeScore: true,
    minMatchCharLength: 2,
  });
}

export function search(query: string): SearchResult[] {
  if (!fuse || !query.trim()) return [];
  return fuse.search(query, { limit: 20 }).map(r => ({
    termId: r.item.termId,
    term: r.item.term,
    sectionId: r.item.sectionId,
    sectionTitle: r.item.sectionTitle,
    sectionIcon: r.item.sectionIcon,
    sectionSlug: r.item.sectionSlug,
    subsectionId: r.item.subsectionId,
    subsectionSlug: r.item.subsectionSlug,
    preview: r.item.what?.slice(0, 100) + '...',
    score: r.score,
  }));
}

export function getSearchData(): SearchEntry[] { return searchData; }
