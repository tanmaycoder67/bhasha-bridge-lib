import { useState } from 'react';
import { Check, ArrowRight, ArrowLeftRight, Globe } from 'lucide-react';
import { TopBar } from '@/components/Navigation';
import type { Screen } from '@/components/Navigation';
import { LANGUAGES } from '@/lib/supabase';

interface Props {
  schoolLanguage: string;
  homeLanguage: string;
  onSelect: (school: string, home: string) => void;
  onBack: () => void;
}

type Mode = 'school' | 'home';

export function LanguageSelection({ schoolLanguage, homeLanguage, onSelect, onBack }: Props) {
  const [mode, setMode] = useState<Mode>('school');
  const [school, setSchool] = useState(schoolLanguage);
  const [home, setHome] = useState(homeLanguage);

  function handleSelect(code: string) {
    if (mode === 'school') {
      setSchool(code);
      setMode('home');
    } else {
      setHome(code);
    }
  }

  const current = mode === 'school' ? school : home;
  const otherLang = mode === 'school' ? home : school;

  return (
    <div className="min-h-screen pb-20">
      <TopBar title="Language Selection" onBack={onBack} />

      {/* Current selections */}
      <div className="px-5 pt-4">
        <div className="rounded-2xl bg-gradient-to-br from-ink to-ink-light p-4 text-white">
          <div className="mb-3 flex items-center justify-center gap-3">
            <div className="flex-1 text-center">
              <p className="text-[10px] font-medium uppercase tracking-wide text-white/50">School</p>
              <p className="font-indic text-lg font-bold text-saffron">
                {LANGUAGES.find((l) => l.code === school)?.nativeName || '—'}
              </p>
            </div>
            <ArrowLeftRight size={18} className="text-white/40" />
            <div className="flex-1 text-center">
              <p className="text-[10px] font-medium uppercase tracking-wide text-white/50">Home</p>
              <p className="font-indic text-lg font-bold text-forest-light">
                {LANGUAGES.find((l) => l.code === home)?.nativeName || '—'}
              </p>
            </div>
          </div>
          {school && home && (
            <button
              onClick={() => onSelect(school, home)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-saffron py-2.5 text-sm font-bold text-white tap-scale smooth hover:bg-saffron-dark"
            >
              Confirm & Search
              <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Mode toggle */}
      <div className="px-5 pt-4">
        <div className="flex rounded-xl bg-paper-darker p-1">
          <button
            onClick={() => setMode('school')}
            className={`flex-1 rounded-lg py-2 text-xs font-bold tap-scale smooth ${
              mode === 'school' ? 'bg-white text-ink shadow-soft' : 'text-ink-soft'
            }`}
          >
            School Language
          </button>
          <button
            onClick={() => setMode('home')}
            className={`flex-1 rounded-lg py-2 text-xs font-bold tap-scale smooth ${
              mode === 'home' ? 'bg-white text-ink shadow-soft' : 'text-ink-soft'
            }`}
          >
            Home Language
          </button>
        </div>
      </div>

      {/* Language chips */}
      <div className="px-5 pt-4">
        <p className="mb-3 text-xs font-semibold text-ink-soft">
          {mode === 'school' ? 'Choose the language used in school textbooks' : 'Choose the language spoken at home'}
        </p>
        <div className="grid grid-cols-2 gap-2.5">
          {LANGUAGES.map((lang, i) => {
            const selected = current === lang.code;
            const isOther = otherLang === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                disabled={isOther && mode !== 'school' ? false : isOther}
                className={`relative flex flex-col items-start gap-0.5 rounded-2xl border-2 p-3.5 text-left tap-scale smooth animate-fade-in-up ${
                  selected
                    ? 'border-saffron bg-saffron/5 shadow-warm'
                    : isOther
                    ? 'border-paper-darker bg-paper-dark opacity-50'
                    : 'border-paper-darker bg-white hover:border-ink/20'
                }`}
                style={{ animationDelay: `${i * 0.03}s` }}
              >
                {selected && (
                  <div className="absolute right-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-saffron">
                    <Check size={12} className="text-white" />
                  </div>
                )}
                <span className="font-indic text-lg font-bold text-ink">{lang.nativeName}</span>
                <span className="text-xs font-medium text-ink-soft">{lang.name}</span>
                <span className="text-[10px] text-ink-soft/60">{lang.script}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Hint */}
      {mode === 'home' && !home && (
        <div className="px-5 pt-4">
          <div className="flex items-center gap-2 rounded-xl bg-forest/5 p-3 text-xs text-forest">
            <Globe size={14} />
            <span>Don't see your language? You can contribute content in any language.</span>
          </div>
        </div>
      )}
    </div>
  );
}
