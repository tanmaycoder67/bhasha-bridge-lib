import { CheckCircle, Home, Search } from 'lucide-react';
import type { Screen } from '@/components/Navigation';

export function SuccessScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-5 pb-20 text-center">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-forest/10 animate-scale-in">
        <CheckCircle size={48} className="text-forest" />
      </div>
      <h2 className="mb-2 text-xl font-extrabold text-ink animate-fade-in-up">Thank you!</h2>
      <p className="mb-8 max-w-xs text-sm leading-relaxed text-ink-soft animate-fade-in-up stagger-1">
        Your contribution has been added. A child somewhere will learn better because of you.
      </p>
      <div className="w-full max-w-xs space-y-3 animate-fade-in-up stagger-2">
        <button
          onClick={() => onNavigate('textbook')}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-ink py-3.5 text-sm font-bold text-white tap-scale smooth hover:bg-ink-light"
        >
          <Search size={16} />
          Find More Content
        </button>
        <button
          onClick={() => onNavigate('landing')}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-paper-darker bg-white py-3.5 text-sm font-bold text-ink tap-scale smooth hover:border-ink/20"
        >
          <Home size={16} />
          Back to Home
        </button>
      </div>
    </div>
  );
}
