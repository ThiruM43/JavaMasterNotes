'use client';
import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { Theme, getTheme, setTheme } from '@/lib/theme';
import { SectionIndex } from '@/lib/types';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { LoginModal } from '@/components/auth/LoginModal';
import { AuthEnforcer } from '@/components/auth/AuthEnforcer';

interface AppContextType {
  theme: Theme;
  toggleTheme: () => void;
  sectionIndex: SectionIndex[];
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
  drawerOpen: boolean;
  setDrawerOpen: (v: boolean) => void;
  drawerTab: 'notes' | 'highlights';
  setDrawerTab: (t: 'notes' | 'highlights') => void;
  activeTermId: string | null;
  setActiveTermId: (id: string | null) => void;
  searchOpen: boolean;
  setSearchOpen: (v: boolean) => void;
  toast: string | null;
  showToast: (msg: string) => void;
  refreshProgress: number;
  triggerProgressRefresh: () => void;
}

const AppContext = createContext<AppContextType>({} as AppContextType);

export function AppProviders({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');
  const [sectionIndex, setSectionIndex] = useState<SectionIndex[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState<'notes' | 'highlights'>('notes');
  const [activeTermId, setActiveTermId] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [refreshProgress, setRefreshProgress] = useState(0);

  useEffect(() => {
    const t = getTheme();
    setThemeState(t);
    setTheme(t);
  }, []);

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_BASE_PATH || '';
    fetch(`${base}/data/index.json`)
      .then(r => r.ok ? r.json() : [])
      .then(setSectionIndex)
      .catch(() => {});
  }, []);

  const toggleTheme = useCallback(() => {
    const next: Theme = theme === 'light' ? 'dark' : 'light';
    setThemeState(next);
    setTheme(next);
  }, [theme]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }, []);

  const triggerProgressRefresh = useCallback(() => {
    setRefreshProgress(n => n + 1);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(v => !v);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <AppContext.Provider value={{
      theme, toggleTheme,
      sectionIndex,
      sidebarOpen, setSidebarOpen,
      drawerOpen, setDrawerOpen,
      drawerTab, setDrawerTab,
      activeTermId, setActiveTermId,
      searchOpen, setSearchOpen,
      toast, showToast,
      refreshProgress, triggerProgressRefresh,
    }}>
      <AuthProvider>
        <AuthEnforcer>
          {children}
        </AuthEnforcer>
        <LoginModal />
      </AuthProvider>
      {toast && (
        <div className="toast" role="alert">
          <span>✓</span> {toast}
        </div>
      )}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
