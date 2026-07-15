'use client';
import { useApp } from '@/components/providers/AppProviders';
import { TopBar } from '@/components/layout/TopBar';
import { ChapterTree } from '@/components/layout/ChapterTree';
import { NotesDrawer } from '@/components/layout/NotesDrawer';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { SearchModal } from '@/components/search/SearchModal';

export function AppShell({ children }: { children: React.ReactNode }) {
  const { sidebarOpen, setSidebarOpen, drawerOpen } = useApp();

  return (
    <>
      <div className={`app-shell ${drawerOpen ? 'drawer-open' : ''}`}>
        <TopBar />
        <ChapterTree />
        <main className="main-content" id="main-content">
          {children}
        </main>
        {drawerOpen && <NotesDrawer />}
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <MobileBottomNav />
      <SearchModal />
    </>
  );
}
