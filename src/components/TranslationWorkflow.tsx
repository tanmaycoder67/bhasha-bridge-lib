import { useState } from 'react';
import {
  Sparkles,
  Check,
  AlertTriangle,
  Edit3,
  Eye,
  Send,
  RefreshCw,
  Plus,
  Trash2,
  ArrowRight,
  X,
  BookOpen,
  Loader2,
} from 'lucide-react';
import { LANGUAGES, getLanguageInfo } from '@/lib/supabase';
import {
  type TranslationResult,
  type TermPair,
  type TranslationStatus,
  translationDirection,
} from '@/services/translationService';

/* ============ Source Content ============ */

export function SourceContent({
  sourceLang,
  title,
  body,
}: {
  sourceLang: string;
  title: string;
  body: string;
}) {
  const lang = getLanguageInfo(sourceLang);
  return (
    <div className="rounded-2xl border-l-4 border-ink bg-white p-4 shadow-soft">
      <div className="mb-3 flex items-center justify-between">
        <span className="rounded-md bg-ink/5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-ink">
          Original Content
        </span>
        <span className="text-xs font-bold text-ink">{lang.nativeName}</span>
      </div>
      <div className="mb-3">
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-ink-soft">Title</p>
        <p className="text-sm font-bold text-ink">{title || '(not entered yet)'}</p>
      </div>
      <div>
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-ink-soft">Content</p>
        <p className="whitespace-pre-line text-sm leading-relaxed text-ink-soft">{body || '(not entered yet)'}</p>
      </div>
      <div className="mt-3 flex items-center gap-1.5 border-t border-paper-darker pt-2">
        <BookOpen size={12} className="text-ink-soft" />
        <span className="text-[10px] font-medium text-ink-soft">Provided by teacher · Read-only</span>
      </div>
    </div>
  );
}

/* ============ Language Selector ============ */

export function LanguageSelector({
  sourceLang,
  targetLang,
  onSourceChange,
  onTargetChange,
  disabled,
}: {
  sourceLang: string;
  targetLang: string;
  onSourceChange: (lang: string) => void;
  onTargetChange: (lang: string) => void;
  disabled?: boolean;
}) {
  const sameLang = sourceLang === targetLang;
  const SUPPORTED = ['hi', 'en', 'bn', 'mr', 'ta', 'te', 'gu'];

  return (
    <div className="rounded-2xl bg-white p-4 shadow-soft">
      <div className="mb-3 flex items-center justify-center gap-3 rounded-xl bg-ink px-3 py-2.5">
        <span className="font-indic text-sm font-bold text-white">
          {getLanguageInfo(sourceLang).nativeName}
        </span>
        <ArrowRight size={16} className="text-saffron" />
        <span className="font-indic text-sm font-bold text-saffron-light">
          {getLanguageInfo(targetLang).nativeName}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wide text-ink-soft">
            Source Language
          </label>
          <select
            value={sourceLang}
            onChange={(e) => onSourceChange(e.target.value)}
            disabled={disabled}
            className="w-full rounded-xl border border-paper-darker bg-paper px-3 py-2.5 text-sm font-bold text-ink focus-ring disabled:opacity-50"
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>{l.name} ({l.nativeName})</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wide text-ink-soft">
            Target Language
          </label>
          <select
            value={targetLang}
            onChange={(e) => onTargetChange(e.target.value)}
            disabled={disabled}
            className={`w-full rounded-xl border bg-paper px-3 py-2.5 text-sm font-bold text-ink focus-ring disabled:opacity-50 ${
              sameLang ? 'border-rose' : 'border-paper-darker'
            }`}
          >
            {SUPPORTED.map((code) => {
              const l = getLanguageInfo(code);
              return (
                <option key={code} value={code}>{l.name} ({l.nativeName})</option>
              );
            })}
          </select>
        </div>
      </div>

      {sameLang && (
        <div className="mt-2 flex items-center gap-1.5 text-xs text-rose">
          <AlertTriangle size={12} />
          Source and target language must be different
        </div>
      )}
    </div>
  );
}

/* ============ Translation Editor ============ */

export type TranslationPhase = 'idle' | 'translating' | 'translated';

export function TranslationEditor({
  targetLang,
  result,
  phase,
  direction,
  onTranslate,
  onRegenerate,
  onTitleChange,
  onBodyChange,
}: {
  targetLang: string;
  result: TranslationResult | null;
  phase: TranslationPhase;
  direction: string;
  onTranslate: () => void;
  onRegenerate: () => void;
  onTitleChange: (v: string) => void;
  onBodyChange: (v: string) => void;
}) {
  const lang = getLanguageInfo(targetLang);

  return (
    <div className="rounded-2xl border-l-4 border-saffron bg-white p-4 shadow-soft">
      <div className="mb-3 flex items-center justify-between">
        <span className="rounded-md bg-saffron/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-saffron-dark">
          AI Generated Translation
        </span>
        <span className="font-indic text-xs font-bold text-saffron-dark">{lang.nativeName}</span>
      </div>

      {phase === 'idle' && (
        <div className="text-center">
          <button
            onClick={onTranslate}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-ink py-3 text-sm font-bold text-white tap-scale smooth hover:bg-ink-light"
          >
            <Sparkles size={16} className="text-saffron" />
            Translate
          </button>
          <p className="mt-2 text-[10px] text-ink-soft">
            Direction: {direction}
          </p>
        </div>
      )}

      {phase === 'translating' && (
        <div className="flex flex-col items-center py-6">
          <Loader2 size={28} className="animate-spin text-saffron" />
          <p className="mt-3 text-sm font-bold text-ink">Translating...</p>
          <p className="mt-1 text-xs text-ink-soft">{direction}</p>
        </div>
      )}

      {phase === 'translated' && result && (
        <div className="animate-fade-in">
          {/* Success banner */}
          <div className="mb-3 flex items-center gap-1.5 rounded-lg bg-forest/5 px-3 py-2">
            <Check size={14} className="text-forest" />
            <span className="text-xs font-semibold text-forest">Translation generated</span>
          </div>

          {/* Warning */}
          <div className="mb-3 flex items-start gap-1.5 rounded-lg bg-saffron/5 px-3 py-2">
            <AlertTriangle size={14} className="mt-0.5 shrink-0 text-saffron-dark" />
            <span className="text-[11px] leading-relaxed text-saffron-dark">
              AI Generated Translation — Please review the translation before submitting.
            </span>
          </div>

          {/* Editable title */}
          <div className="mb-3">
            <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wide text-ink-soft">
              Translated Title
            </label>
            <input
              value={result.title}
              onChange={(e) => onTitleChange(e.target.value)}
              className="font-indic w-full rounded-lg border border-paper-darker bg-paper px-3 py-2 text-sm font-bold text-ink focus-ring"
            />
          </div>

          {/* Editable body */}
          <div className="mb-3">
            <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wide text-ink-soft">
              Translated Content
            </label>
            <textarea
              value={result.body}
              onChange={(e) => onBodyChange(e.target.value)}
              rows={5}
              className="font-indic w-full resize-none rounded-lg border border-paper-darker bg-paper px-3 py-2 text-sm leading-relaxed text-ink focus-ring"
            />
          </div>

          {/* Actions */}
          <button
            onClick={onRegenerate}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-paper-darker bg-paper py-2.5 text-xs font-bold text-ink-soft tap-scale smooth hover:bg-paper-darker"
          >
            <RefreshCw size={14} />
            Regenerate
          </button>
        </div>
      )}
    </div>
  );
}

/* ============ Language Comparison ============ */

export function LanguageComparison({
  sourceLang,
  targetLang,
  sourceTitle,
  sourceBody,
  targetTitle,
  targetBody,
}: {
  sourceLang: string;
  targetLang: string;
  sourceTitle: string;
  sourceBody: string;
  targetTitle: string;
  targetBody: string;
}) {
  const [showCompare, setShowCompare] = useState(false);
  const s = getLanguageInfo(sourceLang);
  const t = getLanguageInfo(targetLang);

  return (
    <div className="rounded-2xl bg-white p-4 shadow-soft">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-bold text-ink">Side-by-Side Comparison</h3>
        <button
          onClick={() => setShowCompare(!showCompare)}
          className="rounded-lg bg-paper-dark px-3 py-1.5 text-xs font-bold text-ink tap-scale smooth"
        >
          {showCompare ? 'Hide' : 'Compare Languages'}
        </button>
      </div>

      {showCompare && (
        <div className="animate-fade-in">
          {/* Desktop: side by side; Mobile: stacked */}
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {/* Source */}
            <div className="rounded-xl border-l-4 border-ink bg-paper p-3">
              <div className="mb-2 flex items-center gap-1.5">
                <span className="text-base">🇬🇧</span>
                <span className="text-xs font-bold text-ink">{s.name}</span>
              </div>
              <p className="mb-2 text-sm font-bold text-ink">{sourceTitle}</p>
              <p className="whitespace-pre-line text-xs leading-relaxed text-ink-soft">{sourceBody}</p>
            </div>

            {/* Target */}
            <div className="rounded-xl border-l-4 border-saffron bg-paper p-3">
              <div className="mb-2 flex items-center gap-1.5">
                <span className="text-base">🇮🇳</span>
                <span className="font-indic text-xs font-bold text-saffron-dark">{t.name}</span>
              </div>
              <p className="font-indic mb-2 text-sm font-bold text-ink">{targetTitle}</p>
              <p className="font-indic whitespace-pre-line text-xs leading-relaxed text-ink-soft">{targetBody}</p>
            </div>
          </div>

          {/* Mobile stacked separator hint */}
          <div className="mt-2 text-center text-[10px] text-ink-soft/60 sm:hidden">
            Scroll up to compare · Both languages shown above
          </div>
        </div>
      )}

      {!showCompare && (
        <p className="text-xs text-ink-soft">Click "Compare Languages" to see source and translation together.</p>
      )}
    </div>
  );
}

/* ============ Important Terms ============ */

export function ImportantTerms({
  terms,
  onUpdate,
  onAdd,
  onRemove,
}: {
  terms: TermPair[];
  onUpdate: (id: string, field: 'source' | 'target', value: string) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-soft">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-bold text-ink">Important Terms</h3>
        <button
          onClick={onAdd}
          className="flex items-center gap-1 rounded-lg bg-paper-dark px-2.5 py-1.5 text-[10px] font-bold text-ink tap-scale smooth hover:bg-paper-darker"
        >
          <Plus size={12} />
          Add Term
        </button>
      </div>

      {terms.length === 0 ? (
        <p className="text-xs text-ink-soft">No terms added yet. Add key vocabulary to keep translations consistent.</p>
      ) : (
        <div className="space-y-2">
          {/* Header row for desktop */}
          <div className="hidden gap-2 px-1 text-[10px] font-semibold uppercase tracking-wide text-ink-soft sm:grid sm:grid-cols-2">
            <span>Source Term</span>
            <span>Translated Term</span>
          </div>

          {terms.map((term) => (
            <div key={term.id} className="flex items-center gap-2">
              <input
                value={term.source}
                onChange={(e) => onUpdate(term.id, 'source', e.target.value)}
                placeholder="Source term"
                className="flex-1 rounded-lg border border-paper-darker bg-paper px-2.5 py-2 text-xs font-medium text-ink focus-ring"
              />
              <ArrowRight size={14} className="shrink-0 text-saffron" />
              <input
                value={term.target}
                onChange={(e) => onUpdate(term.id, 'target', e.target.value)}
                placeholder="Translated term"
                className="font-indic flex-1 rounded-lg border border-paper-darker bg-paper px-2.5 py-2 text-xs font-medium text-ink focus-ring"
              />
              <button
                onClick={() => onRemove(term.id)}
                className="shrink-0 rounded-lg p-1.5 text-rose/60 tap-scale smooth hover:bg-rose/5 hover:text-rose"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============ Translation Check ============ */

export interface CheckItem {
  label: string;
  passed: boolean;
  detail?: string;
}

export function TranslationCheck({
  checks,
}: {
  checks: CheckItem[];
}) {
  const allPassed = checks.every((c) => c.passed);
  const warningCount = checks.filter((c) => !c.passed).length;

  return (
    <div className={`rounded-2xl border-l-4 bg-white p-4 shadow-soft ${allPassed ? 'border-forest' : 'border-saffron'}`}>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-bold text-ink">Translation Check</h3>
        <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${allPassed ? 'bg-forest/10 text-forest' : 'bg-saffron/10 text-saffron-dark'}`}>
          {allPassed ? 'All checks passed' : `${warningCount} ${warningCount === 1 ? 'item' : 'items'} need attention`}
        </span>
      </div>

      <div className="space-y-2">
        {checks.map((check, i) => (
          <div key={i} className="flex items-start gap-2">
            {check.passed ? (
              <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-forest/10">
                <Check size={10} className="text-forest" />
              </div>
            ) : (
              <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-saffron/10">
                <AlertTriangle size={10} className="text-saffron-dark" />
              </div>
            )}
            <div className="flex-1">
              <span className={`text-xs font-medium ${check.passed ? 'text-ink-soft' : 'text-saffron-dark'}`}>
                {check.label}
              </span>
              {check.detail && !check.passed && (
                <span className="block text-[10px] text-ink-soft/70">{check.detail}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============ Translation Preview Modal ============ */

export function TranslationPreview({
  open,
  onClose,
  sourceLang,
  targetLang,
  title,
  sourceTitle,
  sourceBody,
  targetTitle,
  targetBody,
  terms,
  onEdit,
  onSubmit,
  status,
}: {
  open: boolean;
  onClose: () => void;
  sourceLang: string;
  targetLang: string;
  title: string;
  sourceTitle: string;
  sourceBody: string;
  targetTitle: string;
  targetBody: string;
  terms: TermPair[];
  onEdit: () => void;
  onSubmit: () => void;
  status: TranslationStatus;
}) {
  if (!open) return null;

  const s = getLanguageInfo(sourceLang);
  const t = getLanguageInfo(targetLang);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 backdrop-blur-sm sm:items-center" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-paper p-5 shadow-ink animate-fade-in-up sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-extrabold text-ink">Translation Preview</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-ink-soft tap-scale smooth hover:bg-paper-dark">
            <X size={18} />
          </button>
        </div>

        {/* Title */}
        <h3 className="font-indic mb-4 text-lg font-bold text-ink">{title}</h3>

        {/* Source section */}
        <div className="mb-3 rounded-xl border-l-4 border-ink bg-white p-3">
          <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wide text-ink-soft">{s.name}</p>
          <p className="mb-2 text-sm font-bold text-ink">{sourceTitle}</p>
          <p className="whitespace-pre-line text-xs leading-relaxed text-ink-soft">{sourceBody}</p>
        </div>

        {/* Target section */}
        <div className="mb-4 rounded-xl border-l-4 border-saffron bg-white p-3">
          <p className="font-indic mb-1.5 text-[10px] font-bold uppercase tracking-wide text-saffron-dark">{t.name}</p>
          <p className="font-indic mb-2 text-sm font-bold text-ink">{targetTitle}</p>
          <p className="font-indic whitespace-pre-line text-xs leading-relaxed text-ink-soft">{targetBody}</p>
        </div>

        {/* Language Bridge */}
        {terms.filter((t) => t.source && t.target).length > 0 && (
          <div className="mb-4 rounded-xl bg-white p-3 shadow-soft">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-ink-soft">Language Bridge</p>
            <div className="space-y-2">
              {terms.filter((term) => term.source && term.target).map((term) => (
                <div key={term.id} className="flex items-center gap-2 text-xs">
                  <span className="flex-1 font-medium text-ink">{term.source}</span>
                  <ArrowRight size={12} className="shrink-0 text-saffron" />
                  <span className="font-indic flex-1 font-medium text-saffron-dark">{term.target}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Status badge */}
        <div className="mb-4 flex items-center justify-center">
          <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide ${
            status === 'submitted' ? 'bg-forest/10 text-forest' :
            status === 'ready_for_review' ? 'bg-saffron/10 text-saffron-dark' :
            status === 'translated' ? 'bg-sky/10 text-sky' :
            'bg-paper-darker text-ink-soft'
          }`}>
            {status.replace(/_/g, ' ')}
          </span>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <button
            onClick={onSubmit}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-forest py-3 text-sm font-bold text-white tap-scale smooth hover:bg-forest-light"
          >
            <Send size={16} />
            Submit for Review
          </button>
          <button
            onClick={onEdit}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-paper-darker bg-white py-3 text-sm font-bold text-ink tap-scale smooth hover:border-ink/20"
          >
            <Edit3 size={16} />
            Edit Translation
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============ Translation Progress (status indicator) ============ */

export function TranslationProgress({ status }: { status: TranslationStatus }) {
  const steps: { key: TranslationStatus; label: string }[] = [
    { key: 'draft', label: 'Draft' },
    { key: 'translated', label: 'Translated' },
    { key: 'ready_for_review', label: 'Ready for Review' },
    { key: 'submitted', label: 'Submitted' },
  ];
  const currentIdx = steps.findIndex((s) => s.key === status);

  return (
    <div className="rounded-2xl bg-white p-3 shadow-soft">
      <div className="flex items-center justify-between">
        {steps.map((step, i) => (
          <div key={step.key} className="flex flex-1 items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold smooth ${
                  i <= currentIdx
                    ? i === currentIdx
                      ? 'bg-saffron text-white ring-2 ring-saffron/20'
                      : 'bg-forest text-white'
                    : 'bg-paper-darker text-ink-soft/50'
                }`}
              >
                {i < currentIdx ? <Check size={10} /> : i + 1}
              </div>
              <span className={`text-[8px] font-semibold ${i <= currentIdx ? 'text-ink' : 'text-ink-soft/50'}`}>
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`mx-1 h-0.5 flex-1 rounded-full ${i < currentIdx ? 'bg-forest' : 'bg-paper-darker'}`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
