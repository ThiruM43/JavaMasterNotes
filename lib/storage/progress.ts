import { Progress } from '@/lib/types';

const KEY = 'java-notes-progress';

const defaultProgress = (): Progress => ({
  readTerms: [],
  bookmarkedTerms: [],
  studyStreak: { count: 0, lastDate: '' },
  totalStudyMinutes: 0,
});

export function getProgress(): Progress {
  if (typeof window === 'undefined') return defaultProgress();
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...defaultProgress(), ...JSON.parse(raw) } : defaultProgress();
  } catch { return defaultProgress(); }
}

export function saveProgress(p: Progress): void {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(KEY, JSON.stringify(p)); } catch {}
}

export function markTermRead(termId: string): void {
  const p = getProgress();
  if (!p.readTerms.includes(termId)) {
    p.readTerms = [...p.readTerms, termId];
    updateStreak(p);
    saveProgress(p);
  }
}

export function unmarkTermRead(termId: string): void {
  const p = getProgress();
  p.readTerms = p.readTerms.filter(id => id !== termId);
  saveProgress(p);
}

export function toggleBookmark(termId: string): boolean {
  const p = getProgress();
  const isBookmarked = p.bookmarkedTerms.includes(termId);
  p.bookmarkedTerms = isBookmarked
    ? p.bookmarkedTerms.filter(id => id !== termId)
    : [...p.bookmarkedTerms, termId];
  saveProgress(p);
  return !isBookmarked;
}

export function isBookmarked(termId: string): boolean {
  return getProgress().bookmarkedTerms.includes(termId);
}

export function isRead(termId: string): boolean {
  return getProgress().readTerms.includes(termId);
}

export function setLastVisited(path: string): void {
  const p = getProgress();
  p.lastVisited = path;
  saveProgress(p);
}

export function addStudyTime(minutes: number): void {
  const p = getProgress();
  p.totalStudyMinutes = (p.totalStudyMinutes || 0) + minutes;
  saveProgress(p);
}

function updateStreak(p: Progress): void {
  const today = new Date().toISOString().slice(0, 10);
  if (p.studyStreak.lastDate === today) return;
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  if (p.studyStreak.lastDate === yesterday) {
    p.studyStreak = { count: p.studyStreak.count + 1, lastDate: today };
  } else {
    p.studyStreak = { count: 1, lastDate: today };
  }
}
