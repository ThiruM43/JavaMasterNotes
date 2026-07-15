import { Section, SectionIndex } from '@/lib/types';

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || '';

export async function fetchSectionIndex(): Promise<SectionIndex[]> {
  try {
    const res = await fetch(`${BASE}/data/index.json`);
    return res.ok ? res.json() : [];
  } catch { return []; }
}

export async function fetchSection(file: string): Promise<Section | null> {
  try {
    const res = await fetch(`${BASE}/data/${file}`);
    return res.ok ? res.json() : null;
  } catch { return null; }
}

export async function fetchSectionBySlug(slug: string, index: SectionIndex[]): Promise<Section | null> {
  const entry = index.find(s => s.slug === slug);
  if (!entry) return null;
  return fetchSection(entry.file);
}

export function getSectionProgress(sectionId: string, readTerms: string[]): number {
  // Returns 0-100 percentage
  const prefix = `${sectionId}.`;
  // This is approximate; full calculation needs the section data
  return 0; // Will be calculated with full data
}
