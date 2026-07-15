import path from 'path';
import fs from 'fs';
import type { Section, SectionIndex } from '@/lib/types';
import TopicPageClient from './TopicPageClient';

export async function generateStaticParams() {
  try {
    const indexPath = path.join(process.cwd(), 'public', 'data', 'index.json');
    const raw = fs.readFileSync(indexPath, 'utf-8');
    const index: SectionIndex[] = JSON.parse(raw);
    const params: { section: string; subsection: string }[] = [];
    for (const sec of index) {
      try {
        const secPath = path.join(process.cwd(), 'public', 'data', sec.file);
        const secRaw = fs.readFileSync(secPath, 'utf-8');
        const secData: Section = JSON.parse(secRaw);
        for (const sub of secData.subsections) {
          params.push({ section: sec.slug, subsection: sub.slug });
        }
      } catch {}
    }
    return params;
  } catch {
    return [];
  }
}

export default async function TopicPage({ params }: { params: Promise<{ section: string; subsection: string }> }) {
  const resolved = await params;
  return <TopicPageClient sectionSlug={resolved.section} subsectionSlug={resolved.subsection} />;
}
