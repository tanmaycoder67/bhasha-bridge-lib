import { useState, useEffect } from 'react';
import { ChevronRight, Check, BookText, Hash, FileText, Copy, Sparkles } from 'lucide-react';
import { TopBar } from '@/components/Navigation';
import type { Screen } from '@/components/Navigation';
import { SUBJECTS, generateCode } from '@/lib/supabase';

interface Props {
  initialClass?: number;
  initialSubject?: string;
  initialChapter?: number;
  initialPage?: number;
  onSearch: (cls: number, subject: string, chapter: number, page: number, code: string) => void;
  onBack: () => void;
}

type Step = 0 | 1 | 2 | 3;

export function TextbookSearch({ initialClass, initialSubject, initialChapter, initialPage, onSearch, onBack }: Props) {
  const [step, setStep] = useState<Step>(initialClass ? 1 : 0);
  const [cls, setCls] = useState<number | null>(initialClass ?? null);
  const [subject, setSubject] = useState<string | null>(initialSubject ?? null);
  const [chapter, setChapter] = useState<number | null>(initialChapter ?? null);
  const [page, setPage] = useState<number | null>(initialPage ?? null);
  const [copied, setCopied] = useState(false);

  const code = cls && subject && chapter && page ? generateCode(cls, subject, chapter, page) : '';

  const classes = Array.from({ length: 10 }, (_, i) => i + 1);
  const chapters = Array.from({ length: 15 }, (_, i) => i + 1);
  const pages = Array.from({ length: 30 }, (_, i) => i + 1);

  function handleNext() {
    if (step < 3) setStep((step + 1) as Step);
  }

  function handleBack() {
    if (step === 0) {
      onBack();
    } else {
      setStep((step - 1) as Step);
    }
  }

  function copyCode() {
    if (code) {
      navigator.clipboard?.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  const stepTitles = ['Select Class', 'Select Subject', 'Select Chapter', 'Select Page'];

  return (
    <div className="min-h-screen pb-20">
      <TopBar
        title="Textbook Search"
        onBack={handleBack}
      />

      {/* Progress steps */}
      <div className="px-5 pt-4">
        <div className="mb-2 flex items-center justify-between">
          {stepTitles.map((title, i) => (
            <div key={i} className="flex flex-1 items-center">
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold smooth ${
                  i < step
                    ? 'bg-forest text-white'
                    : i === step
                    ? 'bg-ink text-saffron ring-4 ring-ink/10'
                    : 'bg-paper-darker text-ink-soft/50'
                }`}
              >
                {i < step ? <Check size={14} /> : i + 1}
              </div>
              {i < stepTitles.length - 1 && (
                <div className={`mx-1 h-0.5 flex-1 rounded-full smooth ${i < step ? 'bg-forest' : 'bg-paper-darker'}`} />
              )}
            </div>
          ))}
        </div>
        <p className="text-sm font-bold text-ink">{stepTitles[step]}</p>
      </div>

      {/* Step content */}
      <div className="px-5 pt-4">
        {step === 0 && (
          <div className="grid grid-cols-3 gap-3 animate-fade-in">
            {classes.map((c) => (
              <button
                key={c}
                onClick={() => {
                  setCls(c);
                  setTimeout(() => setStep(1), 200);
                }}
                className={`flex flex-col items-center justify-center gap-1 rounded-2xl border-2 p-4 tap-scale smooth animate-fade-in-up ${
                  cls === c
                    ? 'border-ink bg-ink text-white shadow-ink'
                    : 'border-paper-darker bg-white text-ink hover:border-ink/30'
                }`}
                style={{ animationDelay: `${c * 0.03}s` }}
              >
                <span className="text-2xl font-extrabold">{c}</span>
                <span className="text-[10px] font-medium opacity-70">Class</span>
              </button>
            ))}
          </div>
        )}

        {step === 1 && (
          <div className="grid grid-cols-2 gap-3 animate-fade-in">
            {SUBJECTS.map((s, i) => (
              <button
                key={s}
                onClick={() => {
                  setSubject(s);
                  setTimeout(() => setStep(2), 200);
                }}
                className={`flex items-center gap-2.5 rounded-2xl border-2 p-4 tap-scale smooth animate-fade-in-up ${
                  subject === s
                    ? 'border-ink bg-ink text-white shadow-ink'
                    : 'border-paper-darker bg-white text-ink hover:border-ink/30'
                }`}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <BookText size={20} className={subject === s ? 'text-saffron' : 'text-ink-soft'} />
                <span className="text-sm font-bold">{s}</span>
              </button>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="grid grid-cols-5 gap-2.5 animate-fade-in">
            {chapters.map((c, i) => (
              <button
                key={c}
                onClick={() => {
                  setChapter(c);
                  setTimeout(() => setStep(3), 200);
                }}
                className={`flex flex-col items-center justify-center gap-0.5 rounded-xl border-2 p-3 tap-scale smooth animate-fade-in-up ${
                  chapter === c
                    ? 'border-ink bg-ink text-white shadow-ink'
                    : 'border-paper-darker bg-white text-ink hover:border-ink/30'
                }`}
                style={{ animationDelay: `${i * 0.03}s` }}
              >
                <Hash size={14} className={chapter === c ? 'text-saffron' : 'text-ink-soft'} />
                <span className="text-base font-extrabold">{c}</span>
              </button>
            ))}
          </div>
        )}

        {step === 3 && (
          <div className="animate-fade-in">
            <div className="grid grid-cols-5 gap-2.5">
              {pages.map((p, i) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`flex flex-col items-center justify-center gap-0.5 rounded-xl border-2 p-3 tap-scale smooth animate-fade-in-up ${
                    page === p
                      ? 'border-ink bg-ink text-white shadow-ink'
                      : 'border-paper-darker bg-white text-ink hover:border-ink/30'
                  }`}
                  style={{ animationDelay: `${i * 0.02}s` }}
                >
                  <FileText size={14} className={page === p ? 'text-saffron' : 'text-ink-soft'} />
                  <span className="text-sm font-bold">{p}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Generated code + CTA */}
      {code && (
        <div className="fixed bottom-16 left-0 right-0 z-30 px-5 animate-fade-in-up">
          <div className="mx-auto max-w-md rounded-2xl bg-white p-4 shadow-ink ring-1 ring-paper-darker">
            <div className="mb-2 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-soft">Textbook Code</p>
                <p className="font-mono text-lg font-extrabold text-ink">{code}</p>
              </div>
              <button onClick={copyCode} className="rounded-lg bg-paper-dark p-2.5 tap-scale smooth hover:bg-paper-darker">
                {copied ? <Check size={16} className="text-forest" /> : <Copy size={16} className="text-ink-soft" />}
              </button>
            </div>
            <button
              onClick={() => onSearch(cls!, subject!, chapter!, page!, code)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-ink py-3 text-sm font-bold text-white tap-scale smooth hover:bg-ink-light"
            >
              <Sparkles size={16} className="text-saffron" />
              Find Learning Content
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
