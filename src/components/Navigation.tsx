import { useState } from 'react';
import { BookText, Search, Languages, FileText, Plus, Home, type LucideIcon } from 'lucide-react';

export type Screen = 'landing' | 'textbook' | 'language' | 'results' | 'reader' | 'contribute';

interface NavItem {
  id: Screen;
  label: string;
  icon: LucideIcon;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'landing', label: 'Home', icon: Home },
  { id: 'textbook', label: 'Textbook', icon: BookText },
  { id: 'language', label: 'Languages', icon: Languages },
  { id: 'contribute', label: 'Contribute', icon: Plus },
];

export function BottomNav({ current, onNavigate }: { current: Screen; onNavigate: (s: Screen) => void }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-paper-darker glass">
      <div className="mx-auto flex max-w-md items-stretch justify-around px-2 py-1.5">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = current === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-1 flex-col items-center gap-0.5 rounded-xl py-2 tap-scale smooth ${
                active ? 'text-saffron-dark' : 'text-ink-soft'
              }`}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 2} className={active ? 'fill-saffron/10' : ''} />
              <span className={`text-[10px] font-semibold ${active ? 'text-saffron-dark' : ''}`}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export function TopBar({ title, onBack, right }: { title: string; onBack?: () => void; right?: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-40 border-b border-paper-darker glass">
      <div className="mx-auto flex max-w-md items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          {onBack && (
            <button onClick={onBack} className="tap-scale rounded-lg p-1.5 text-ink hover:bg-paper-dark smooth">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          )}
          <h1 className="text-base font-bold text-ink">{title}</h1>
        </div>
        {right}
      </div>
    </header>
  );
}
