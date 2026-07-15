import { SectionIndex } from '@/lib/types';
import SectionPageClient from './SectionPageClient';
import path from 'path';
import fs from 'fs';

export async function generateStaticParams() {
  try {
    const indexPath = path.join(process.cwd(), 'public', 'data', 'index.json');
    const raw = fs.readFileSync(indexPath, 'utf-8');
    const index: SectionIndex[] = JSON.parse(raw);
    return index.map(s => ({ section: s.slug }));
  } catch {
    return [];
  }
}

export default async function SectionPage({ params }: { params: Promise<{ section: string }> }) {
  const resolved = await params;
  return <SectionPageClient sectionSlug={resolved.section} />;
}
