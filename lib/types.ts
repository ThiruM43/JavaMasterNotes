export interface StarFormat {
  s: string;
  t: string;
  a: string;
  r: string;
}

export interface Term {
  id: string;
  term: string;
  what: string;
  why: string;
  how: string;
  where: string;
  when: string;
  issue: string;
  fix: string;
  star: StarFormat;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
}

export interface Subsection {
  id: string;
  slug: string;
  title: string;
  keyRule: string;
  terms: Term[];
}

export interface Section {
  id: string;
  slug: string;
  title: string;
  icon: string;
  accentColor: string;
  subsections: Subsection[];
}

export interface InterviewTerm {
  id: string;
  topic: string;
  coreAnswer: string;
  architectureDetails: string;
  tradeOffs: string;
  realWorldScenarios: string;
  star: StarFormat;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
}

export interface InterviewSubsection {
  id: string;
  slug: string;
  title: string;
  keyRule: string;
  terms: InterviewTerm[];
}

export interface InterviewSection {
  id: string;
  slug: string;
  title: string;
  icon: string;
  accentColor: string;
  subsections: InterviewSubsection[];
}

export interface SectionIndex {
  id: string;
  slug: string;
  title: string;
  icon: string;
  accentColor: string;
  file: string;
  subsectionCount: number;
  termCount: number;
}

export interface Highlight {
  id: string;
  termId: string;
  sectionId: string;
  termName?: string;
  sectionTitle?: string;
  field: string;
  text: string;
  color: 'yellow' | 'green' | 'blue' | 'pink';
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Note {
  id: string;
  termId: string;
  sectionId: string;
  subsectionId: string;
  termName: string;
  sectionTitle: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Progress {
  readTerms: string[];
  bookmarkedTerms: string[];
  lastVisited?: string;
  studyStreak: { count: number; lastDate: string };
  totalStudyMinutes: number;
  sessionStart?: string;
}

export interface SearchResult {
  termId: string;
  term: string;
  sectionId: string;
  sectionTitle: string;
  sectionIcon: string;
  sectionSlug: string;
  subsectionId: string;
  subsectionSlug: string;
  preview: string;
  score?: number;
}
