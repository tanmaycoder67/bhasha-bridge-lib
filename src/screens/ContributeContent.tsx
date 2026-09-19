import { useState } from 'react';
import { Check, ChevronRight, Upload, BookOpen, Sparkles, PenLine, Shield, Heart, Eye, Send, AlertTriangle } from 'lucide-react';
import { TopBar } from '@/components/Navigation';
import { supabase, LANGUAGES, SUBJECTS, CONTENT_TYPES, type ContentType, generateCode } from '@/lib/supabase';
import { translateContent, type TranslationResult, type TermPair, type TranslationStatus, translationDirection } from '@/services/translationService';
import {
  SourceContent,
  LanguageSelector,
  TranslationEditor,
  type TranslationPhase,
  LanguageComparison,
  ImportantTerms,
  TranslationCheck,
  type CheckItem,
  TranslationPreview,
  TranslationProgress,
} from '@/components/TranslationWorkflow';

interface Props {
  onBack: () => void;
  onComplete: () => void;
}

type Step = 0 | 1 | 2 | 3 | 4 | 5;

const ROLES = [
  { value: 'TEACHER', label: 'Teacher', icon: BookOpen },
  { value: 'VOLUNTEER', label: 'Volunteer', icon: Heart },
  { value: 'PARENT', label: 'Parent', icon: Shield },
  { value: 'STUDENT', label: 'Student', icon: ChevronRight },
];

export function ContributeContent({ onBack, onComplete }: Props) {
  const [step, setStep] = useState<Step>(0);
  const [cls, setCls] = useState<number | null>(null);
  const [subject, setSubject] = useState<string | null>(null);
  const [chapter, setChapter] = useState<number | null>(null);
  const [page, setPage] = useState<number | null>(null);
  const [contentType, setContentType] = useState<ContentType | null>(null);
  const [schoolLang, setSchoolLang] = useState('en');
  const [homeLang, setHomeLang] = useState('hi');

  // Source content
  const [titleSchool, setTitleSchool] = useState('');
  const [bodySchool, setBodySchool] = useState('');

  // Translation state
  const [translationPhase, setTranslationPhase] = useState<TranslationPhase>('idle');
  const [translationResult, setTranslationResult] = useState<TranslationResult | null>(null);
  const [translatedTitle, setTranslatedTitle] = useState('');
  const [translatedBody, setTranslatedBody] = useState('');
  const [terms, setTerms] = useState<TermPair[]>([]);
  const [translationStatus, setTranslationStatus] = useState<TranslationStatus>('draft');
  const [showPreview, setShowPreview] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Attribution
  const [contributorName, setContributorName] = useState('');
  const [contributorRole, setContributorRole] = useState<string | null>(null);
  const [attest, setAttest] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const stepTitles = ['Textbook', 'Content Type', 'Languages', 'Translation', 'Attribution', 'Preview & Submit'];

  function next() {
    if (step < 5) setStep((step + 1) as Step);
  }
  function prev() {
    if (step === 0) onBack();
    else setStep((step - 1) as Step);
  }

  /* ===== Translation handlers ===== */

  async function handleTranslate() {
    if (schoolLang === homeLang) return;
    setTranslationPhase('translating');
    const result = await translateContent(schoolLang, homeLang, titleSchool, bodySchool);
    setTranslationResult(result);
    setTranslatedTitle(result.title);
    setTranslatedBody(result.body);
    setTerms(result.terms);
    setTranslationPhase('translated');
    setTranslationStatus('translated');
  }

  function handleRegenerate() {
    setTranslationPhase('idle');
    setTranslationResult(null);
    setTranslatedTitle('');
    setTranslatedBody('');
    setTerms([]);
    setTranslationStatus('draft');
  }

  function updateTerm(id: string, field: 'source' | 'target', value: string) {
    setTerms((prev) => prev.map((t) => (t.id === id ? { ...t, [field]: value } : t)));
  }

  function addTerm() {
    setTerms((prev) => [...prev, { id: `term-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, source: '', target: '' }]);
  }

  function removeTerm(id: string) {
    setTerms((prev) => prev.filter((t) => t.id !== id));
  }

  /* ===== Quality checks ===== */

  const qualityChecks: CheckItem[] = [
    { label: 'Source title is not empty', passed: !!titleSchool.trim() },
    { label: 'Source content is not empty', passed: !!bodySchool.trim() },
    { label: 'Translation generated', passed: translationPhase === 'translated' },
    { label: 'Translated title is not empty', passed: !!translatedTitle.trim() },
    { label: 'Translated content is not empty', passed: !!translatedBody.trim() },
    {
      label: 'Target language is different from source',
      passed: schoolLang !== homeLang,
      detail: schoolLang === homeLang ? 'Source and target are the same language' : undefined,
    },
    {
      label: 'Important terms checked',
      passed: terms.length === 0 || terms.every((t) => t.source.trim() && t.target.trim()),
      detail: terms.some((t) => !t.source.trim() || !t.target.trim()) ? 'Some terms have empty fields' : undefined,
    },
    { label: 'No empty sections', passed: !!titleSchool.trim() && !!bodySchool.trim() && !!translatedTitle.trim() && !!translatedBody.trim() },
  ];

  const allChecksPassed = qualityChecks.every((c) => c.passed);

  /* ===== Submit ===== */

  async function handleSubmitForReview() {
    if (!allChecksPassed) {
      setSubmitError('Please fix the items that need attention before submitting.');
      return;
    }
    if (!attest) {
      setSubmitError('Please confirm the attestation in the Attribution step.');
      return;
    }
    setSubmitting(true);
    setSubmitError('');
    const code = generateCode(cls!, subject!, chapter!, page!);
    const { error: insertError } = await supabase.from('textbook_content').insert({
      class_num: cls,
      subject,
      chapter,
      page,
      code,
      content_type: contentType,
      school_language: schoolLang,
      home_language: homeLang,
      title_school: titleSchool,
      body_school: bodySchool,
      title_home: translatedTitle,
      body_home: translatedBody,
      contributor_name: contributorName || null,
      contributor_role: contributorRole,
    });
    setSubmitting(false);
    if (insertError) {
      setSubmitError('Something went wrong. Please try again.');
      return;
    }
    setTranslationStatus('submitted');
    onComplete();
  }

  const direction = translationDirection(schoolLang, homeLang);
  const sameLang = schoolLang === homeLang;

  const canProceed =
    step === 0
      ? cls && subject && chapter && page
      : step === 1
      ? contentType
      : step === 2
      ? schoolLang && homeLang && !sameLang
      : step === 3
      ? translationPhase === 'translated' && !!translatedTitle.trim() && !!translatedBody.trim()
      : step === 4
      ? true
      : true;

  return (
    <div className="min-h-screen pb-20">
      <TopBar title="Contribute Content" onBack={prev} />

      {/* Progress */}
      <div className="px-5 pt-4">
        <div className="mb-2 flex items-center justify-between">
          {stepTitles.map((_, i) => (
            <div key={i} className="flex flex-1 items-center">
              <div
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold smooth ${
                  i < step ? 'bg-forest text-white' : i === step ? 'bg-ink text-saffron ring-4 ring-ink/10' : 'bg-paper-darker text-ink-soft/50'
                }`}
              >
                {i < step ? <Check size={12} /> : i + 1}
              </div>
              {i < stepTitles.length - 1 && <div className={`mx-1 h-0.5 flex-1 rounded-full ${i < step ? 'bg-forest' : 'bg-paper-darker'}`} />}
            </div>
          ))}
        </div>
        <p className="text-sm font-bold text-ink">{stepTitles[step]}</p>
      </div>

      <div className="px-5 pt-4">
        {/* Step 0: Textbook */}
        {step === 0 && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <label className="mb-2 block text-xs font-semibold text-ink-soft">Class</label>
              <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: 10 }, (_, i) => i + 1).map((c) => (
                  <button key={c} onClick={() => setCls(c)} className={`rounded-xl border-2 py-2.5 text-sm font-bold tap-scale smooth ${cls === c ? 'border-ink bg-ink text-white' : 'border-paper-darker bg-white text-ink'}`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold text-ink-soft">Subject</label>
              <div className="grid grid-cols-2 gap-2">
                {SUBJECTS.map((s) => (
                  <button key={s} onClick={() => setSubject(s)} className={`rounded-xl border-2 py-2.5 text-sm font-bold tap-scale smooth ${subject === s ? 'border-ink bg-ink text-white' : 'border-paper-darker bg-white text-ink'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-xs font-semibold text-ink-soft">Chapter</label>
                <input type="number" min={1} max={20} value={chapter ?? ''} onChange={(e) => setChapter(Number(e.target.value))} className="w-full rounded-xl border border-paper-darker bg-white px-3 py-2.5 text-sm font-bold text-ink focus-ring" placeholder="1" />
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold text-ink-soft">Page</label>
                <input type="number" min={1} max={50} value={page ?? ''} onChange={(e) => setPage(Number(e.target.value))} className="w-full rounded-xl border border-paper-darker bg-white px-3 py-2.5 text-sm font-bold text-ink focus-ring" placeholder="1" />
              </div>
            </div>
            {cls && subject && chapter && page && (
              <div className="rounded-xl bg-paper-dark p-3 text-center animate-fade-in">
                <p className="text-[10px] font-semibold uppercase text-ink-soft">Generated Code</p>
                <p className="font-mono text-lg font-extrabold text-ink">{generateCode(cls, subject, chapter, page)}</p>
              </div>
            )}
          </div>
        )}

        {/* Step 1: Content Type */}
        {step === 1 && (
          <div className="space-y-3 animate-fade-in">
            {CONTENT_TYPES.map((t, i) => {
              const Icon = t.icon === 'BookOpen' ? BookOpen : t.icon === 'Sparkles' ? Sparkles : PenLine;
              return (
                <button
                  key={t.value}
                  onClick={() => setContentType(t.value)}
                  className={`flex w-full items-center gap-3 rounded-2xl border-2 p-4 text-left tap-scale smooth animate-fade-in-up ${contentType === t.value ? 'border-ink bg-ink text-white' : 'border-paper-darker bg-white text-ink hover:border-ink/20'}`}
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${contentType === t.value ? 'bg-saffron/20' : 'bg-paper-dark'}`}>
                    <Icon size={20} className={contentType === t.value ? 'text-saffron' : 'text-ink'} />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{t.label}</p>
                    <p className={`text-xs ${contentType === t.value ? 'text-white/60' : 'text-ink-soft'}`}>
                      {t.value === 'EXPLANATION' && 'Clear concept explanation in both languages'}
                      {t.value === 'STORY' && 'A relatable story to make the concept memorable'}
                      {t.value === 'PRACTICE' && 'Practice questions with answers'}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Step 2: Languages */}
        {step === 2 && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <label className="mb-2 block text-xs font-semibold text-ink-soft">School Language</label>
              <div className="grid grid-cols-3 gap-2">
                {LANGUAGES.slice(0, 9).map((l) => (
                  <button key={l.code} onClick={() => setSchoolLang(l.code)} className={`rounded-xl border-2 p-2.5 text-center tap-scale smooth ${schoolLang === l.code ? 'border-ink bg-ink text-white' : 'border-paper-darker bg-white'}`}>
                    <span className="font-indic block text-sm font-bold">{l.nativeName}</span>
                    <span className={`text-[10px] ${schoolLang === l.code ? 'text-white/60' : 'text-ink-soft'}`}>{l.name}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold text-ink-soft">Home Language</label>
              <div className="grid grid-cols-3 gap-2">
                {LANGUAGES.map((l) => (
                  <button key={l.code} onClick={() => setHomeLang(l.code)} disabled={l.code === schoolLang} className={`rounded-xl border-2 p-2.5 text-center tap-scale smooth ${homeLang === l.code ? 'border-saffron bg-saffron/5' : l.code === schoolLang ? 'border-paper-darker bg-paper-dark opacity-40' : 'border-paper-darker bg-white'}`}>
                    <span className="font-indic block text-sm font-bold text-ink">{l.nativeName}</span>
                    <span className="text-[10px] text-ink-soft">{l.name}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 rounded-xl bg-ink px-3 py-2.5 text-white">
              <span className="font-indic text-sm font-bold">{getLangNative(schoolLang)}</span>
              <ChevronRight size={16} className="text-saffron" />
              <span className="font-indic text-sm font-bold text-saffron-light">{getLangNative(homeLang)}</span>
            </div>
          </div>
        )}

        {/* Step 3: Translation Workflow */}
        {step === 3 && (
          <div className="space-y-4 animate-fade-in">
            {/* Status indicator */}
            <TranslationProgress status={translationStatus} />

            {/* Original content input + display */}
            <div className="rounded-2xl border-l-4 border-ink bg-white p-4 shadow-soft">
              <div className="mb-3 flex items-center justify-between">
                <span className="rounded-md bg-ink/5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-ink">
                  Original Content
                </span>
                <span className="text-xs font-bold text-ink">{LANGUAGES.find((l) => l.code === schoolLang)?.nativeName}</span>
              </div>
              <div className="mb-3">
                <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wide text-ink-soft">Title</label>
                <input
                  value={titleSchool}
                  onChange={(e) => setTitleSchool(e.target.value)}
                  placeholder="Enter title in school language"
                  className="w-full rounded-lg border border-paper-darker bg-paper px-3 py-2 text-sm font-bold text-ink focus-ring"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wide text-ink-soft">Content</label>
                <textarea
                  value={bodySchool}
                  onChange={(e) => setBodySchool(e.target.value)}
                  placeholder="Enter content in school language..."
                  rows={4}
                  className="w-full resize-none rounded-lg border border-paper-darker bg-paper px-3 py-2 text-sm leading-relaxed text-ink focus-ring"
                />
              </div>
            </div>

            {/* Direction display */}
            <div className="flex items-center justify-center gap-3 rounded-xl bg-paper-dark px-3 py-2.5">
              <span className="font-indic text-sm font-bold text-ink">{LANGUAGES.find((l) => l.code === schoolLang)?.nativeName}</span>
              <ChevronRight size={16} className="text-saffron" />
              <span className="font-indic text-sm font-bold text-saffron-dark">{LANGUAGES.find((l) => l.code === homeLang)?.nativeName}</span>
            </div>

            {/* Translation editor */}
            <TranslationEditor
              targetLang={homeLang}
              result={translationResult ? { ...translationResult, title: translatedTitle, body: translatedBody } : null}
              phase={translationPhase}
              direction={direction}
              onTranslate={handleTranslate}
              onRegenerate={handleRegenerate}
              onTitleChange={setTranslatedTitle}
              onBodyChange={setTranslatedBody}
            />

            {/* Comparison */}
            {translationPhase === 'translated' && (
              <>
                <LanguageComparison
                  sourceLang={schoolLang}
                  targetLang={homeLang}
                  sourceTitle={titleSchool}
                  sourceBody={bodySchool}
                  targetTitle={translatedTitle}
                  targetBody={translatedBody}
                />

                {/* Important terms */}
                <ImportantTerms
                  terms={terms}
                  onUpdate={updateTerm}
                  onAdd={addTerm}
                  onRemove={removeTerm}
                />

                {/* Quality checks */}
                <TranslationCheck checks={qualityChecks} />

                {/* Mark as ready for review */}
                {allChecksPassed && translationStatus === 'translated' && (
                  <button
                    onClick={() => setTranslationStatus('ready_for_review')}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-saffron/10 py-2.5 text-xs font-bold text-saffron-dark tap-scale smooth"
                  >
                    <Check size={14} />
                    Mark as Ready for Review
                  </button>
                )}
              </>
            )}
          </div>
        )}

        {/* Step 4: Attribution */}
        {step === 4 && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <label className="mb-2 block text-xs font-semibold text-ink-soft">Your Name (optional)</label>
              <input value={contributorName} onChange={(e) => setContributorName(e.target.value)} placeholder="Enter your name" className="w-full rounded-xl border border-paper-darker bg-white px-3 py-2.5 text-sm text-ink focus-ring" />
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold text-ink-soft">Your Role</label>
              <div className="grid grid-cols-2 gap-2">
                {ROLES.map((r) => {
                  const Icon = r.icon;
                  return (
                    <button key={r.value} onClick={() => setContributorRole(r.value)} className={`flex items-center gap-2 rounded-xl border-2 p-3 text-sm font-bold tap-scale smooth ${contributorRole === r.value ? 'border-ink bg-ink text-white' : 'border-paper-darker bg-white text-ink'}`}>
                      <Icon size={16} />
                      {r.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="rounded-2xl bg-paper-dark p-4">
              <label className="flex items-start gap-3">
                <button
                  onClick={() => setAttest(!attest)}
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 tap-scale smooth ${attest ? 'border-forest bg-forest' : 'border-paper-darker bg-white'}`}
                >
                  {attest && <Check size={12} className="text-white" />}
                </button>
                <span className="text-xs leading-relaxed text-ink-soft">
                  I confirm this content is my original work or community-sourced, and I grant BhashaBridge permission to share it freely for educational use.
                </span>
              </label>
            </div>
            {error && <p className="text-xs font-medium text-rose">{error}</p>}
          </div>
        )}

        {/* Step 5: Preview & Submit */}
        {step === 5 && (
          <div className="space-y-4 animate-fade-in">
            <TranslationProgress status={translationStatus} />

            {/* Summary card */}
            <div className="rounded-2xl bg-white p-4 shadow-soft">
              <div className="mb-3 flex items-center gap-2">
                <Sparkles size={16} className="text-saffron" />
                <h3 className="text-sm font-bold text-ink">Translation Summary</h3>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-ink-soft">Textbook Code</span>
                  <span className="font-mono font-bold text-ink">{cls && subject && chapter && page ? generateCode(cls, subject, chapter, page) : '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-soft">Content Type</span>
                  <span className="font-bold text-ink">{contentType}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-ink-soft">Languages</span>
                  <span className="font-indic font-bold text-ink">
                    {LANGUAGES.find((l) => l.code === schoolLang)?.nativeName} → {LANGUAGES.find((l) => l.code === homeLang)?.nativeName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-soft">Terms</span>
                  <span className="font-bold text-ink">{terms.filter((t) => t.source && t.target).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-soft">Status</span>
                  <span className={`font-bold ${translationStatus === 'submitted' ? 'text-forest' : 'text-saffron-dark'}`}>
                    {translationStatus.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>
            </div>

            {/* Quality check summary */}
            <TranslationCheck checks={qualityChecks} />

            {/* Preview button */}
            <button
              onClick={() => setShowPreview(true)}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-ink bg-white py-3.5 text-sm font-bold text-ink tap-scale smooth hover:bg-paper-dark"
            >
              <Eye size={16} />
              Preview Translation
            </button>

            {submitError && (
              <div className="flex items-start gap-2 rounded-xl bg-rose/5 p-3 text-xs text-rose">
                <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                {submitError}
              </div>
            )}

            {/* Submit button */}
            <button
              onClick={handleSubmitForReview}
              disabled={submitting || !allChecksPassed || !attest}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-forest py-3.5 text-sm font-bold text-white tap-scale smooth hover:bg-forest-light disabled:opacity-40"
            >
              {submitting ? 'Submitting...' : 'Submit for Review'}
              <Send size={16} />
            </button>

            {!attest && (
              <p className="text-center text-[10px] text-ink-soft">
                Please complete the attestation in the Attribution step first.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Next button (steps 0-4) */}
      {step < 5 && (
        <div className="fixed bottom-16 left-0 right-0 z-30 px-5">
          <div className="mx-auto max-w-md">
            <button
              onClick={next}
              disabled={!canProceed}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-ink py-3.5 text-sm font-bold text-white tap-scale smooth hover:bg-ink-light disabled:opacity-40"
            >
              Continue
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Preview modal */}
      <TranslationPreview
        open={showPreview}
        onClose={() => setShowPreview(false)}
        sourceLang={schoolLang}
        targetLang={homeLang}
        title={translatedTitle}
        sourceTitle={titleSchool}
        sourceBody={bodySchool}
        targetTitle={translatedTitle}
        targetBody={translatedBody}
        terms={terms}
        onEdit={() => {
          setShowPreview(false);
          setStep(3);
        }}
        onSubmit={() => {
          setShowPreview(false);
          handleSubmitForReview();
        }}
        status={translationStatus}
      />
    </div>
  );
}

function getLangNative(code: string): string {
  return LANGUAGES.find((l) => l.code === code)?.nativeName || code;
}
