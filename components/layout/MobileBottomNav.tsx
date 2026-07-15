'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/components/providers/AppProviders';

export function MobileBottomNav() {
  const pathname = usePathname();
  const { setSearchOpen, setSidebarOpen, sidebarOpen } = useApp();

  const items = [
    {
      label: 'Sections', icon: (
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      ), action: () => setSidebarOpen(!sidebarOpen), active: sidebarOpen,
    },
    {
      label: 'Home', href: '/', icon: (
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 12L12 3l9 9" /><path d="M9 21V12h6v9" />
        </svg>
      ),
    },
    {
      label: 'Search', icon: (
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="9" cy="9" r="6" /><line x1="14" y1="14" x2="19" y2="19" />
        </svg>
      ), action: () => setSearchOpen(true),
    },
    {
      label: 'Progress', href: '/progress', icon: (
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      ),
    },
    {
      label: 'Cards', href: '/flashcards', icon: (
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="1" y="4" width="18" height="13" rx="2" /><line x1="6" y1="9" x2="14" y2="9" />
        </svg>
      ),
    },
  ];

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
      {items.map((item, i) => (
        item.href
          ? <Link key={i} href={item.href} className={`mobile-nav-item ${pathname === item.href ? 'active' : ''}`}>
              {item.icon}<span>{item.label}</span>
            </Link>
          : <button key={i} className={`mobile-nav-item ${item.active ? 'active' : ''}`} onClick={item.action}>
              {item.icon}<span>{item.label}</span>
            </button>
      ))}
    </nav>
  );
}
