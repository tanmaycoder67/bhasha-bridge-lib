import { useState, useEffect } from 'react';
import { Star, Eye, Share2, ChevronDown, ChevronUp, ThumbsUp, MessageCircle, Send, BookOpen, Sparkles, PenLine } from 'lucide-react';
import { TopBar } from '@/components/Navigation';
import { supabase, type TextbookContent, type Feedback, getSessionId, getLanguageInfo } from '@/lib/supabase';

interface Props {
  content: TextbookContent;
  onBack: () => void;
}

export function BilingualReader({ content, onBack }: Props) {
  const [stacked, setStacked] = useState(true);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [viewIncremented, setViewIncremented] = useState(false);
  const [copied, setCopied] = useState(false);

  const schoolLang = getLanguageInfo(content.school_language);
  const homeLang = getLanguageInfo(content.home_language);

  useEffect(() => {
    async function loadFeedback() {
      const { data } = await supabase
        .from('feedback')
        .select('*')
        .eq('content_id', content.id)
        .order('created_at', { ascending: false });
      if (data) setFeedbacks(data as Feedback[]);
    }
    loadFeedback();

    if (!viewIncremented) {
      supabase
        .from('textbook_content')
        .update({ views_count: content.views_count + 1 })
        .eq('id', content.id)
        .then(() => setViewIncremented(true));
    }
  }, [content.id, content.views_count, viewIncremented]);

  async function submitFeedback() {
    if (userRating === 0) return;
    setSubmitting(true);
    const sessionId = getSessionId();
    const { data } = await supabase
      .from('feedback')
      .insert({
        content_id: content.id,
        rating: userRating,
        comment: comment.trim() || null,
        helpful: true,
        session_id: sessionId,
      })
      .select('*')
      .single();

    if (data) {
      setFeedbacks([data as Feedback, ...feedbacks]);
      const newCount = content.ratings_count + 1;
      const newAvg = (content.average_rating * content.ratings_count + userRating) / newCount;
      supabase
        .from('textbook_content')
        .update({ average_rating: Math.round(newAvg * 100) / 100, ratings_count: newCount })
        .eq('id', content.id)
        .then();
      setUserRating(0);
      setComment('');
    }
    setSubmitting(false);
  }

  function share() {
    if (navigator.share) {
      navigator.share({ title: content.title_school, text: `BhashaBridge: ${content.title_home}` }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(`${content.title_school} — ${content.title_home}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  const TypeIcon = content.content_type === 'EXPLANATION' ? BookOpen : content.content_type === 'STORY' ? Sparkles : PenLine;

  return (
    <div className="min-h-screen pb-20">
      <TopBar
        title="Bilingual Reader"
        onBack={onBack}
        right={
          <button onClick={share} className="tap-scale rounded-lg p-1.5 text-ink-soft hover:bg-paper-dark smooth">
            {copied ? <span className="text-xs font-bold text-forest">Copied!</span> : <Share2 size={18} />}
          </button>
        }
      />

      {/* Header card */}
      <div className="px-5 pt-4">
        <div className="rounded-2xl bg-white p-4 shadow-soft">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink/5">
              <TypeIcon size={16} className="text-ink" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-soft">{content.content_type.toLowerCase()}</p>
              <p className="font-mono text-xs font-bold text-ink">{content.code}</p>
            </div>
          </div>
          <h2 className="font-indic mb-2 text-lg font-extrabold text-ink">{content.title_home}</h2>
          <div className="flex flex-wrap items-center gap-3 text-xs text-ink-soft">
            <span className="inline-flex items-center gap-1">
              <Eye size={12} />
              {content.views_count + (viewIncremented ? 1 : 0)}
            </span>
            <span className="inline-flex items-center gap-1">
              <Star size={12} className="fill-saffron text-saffron" />
              {content.average_rating.toFixed(1)} ({content.ratings_count})
            </span>
            {content.contributor_name && (
              <span>by {content.contributor_name}</span>
            )}
          </div>
        </div>
      </div>

      {/* View toggle */}
      <div className="px-5 pt-3">
        <div className="flex rounded-xl bg-paper-darker p-1">
          <button
            onClick={() => setStacked(true)}
            className={`flex-1 rounded-lg py-2 text-xs font-bold tap-scale smooth ${
              stacked ? 'bg-white text-ink shadow-soft' : 'text-ink-soft'
            }`}
          >
            Stacked
          </button>
          <button
            onClick={() => setStacked(false)}
            className={`flex-1 rounded-lg py-2 text-xs font-bold tap-scale smooth ${
              !stacked ? 'bg-white text-ink shadow-soft' : 'text-ink-soft'
            }`}
          >
            Side by Side
          </button>
        </div>
      </div>

      {/* Bilingual content */}
      <div className="px-5 pt-3">
        {stacked ? (
          <div className="space-y-3">
            {/* School language card */}
            <div className="rounded-2xl border-l-4 border-ink bg-white p-4 shadow-soft animate-fade-in-up">
              <div className="mb-2 flex items-center justify-between">
                <span className="rounded-md bg-ink/5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-ink">
                  School
                </span>
                <span className="font-indic text-sm font-bold text-ink">{schoolLang.nativeName}</span>
              </div>
              <h3 className="mb-2 text-base font-bold text-ink">{content.title_school}</h3>
              <p className="text-sm leading-relaxed text-ink-soft whitespace-pre-line">{content.body_school}</p>
            </div>

            {/* Bridge connector */}
            <div className="flex items-center justify-center gap-2 py-1">
              <div className="h-0.5 w-12 bg-gradient-to-r from-transparent to-saffron" />
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-saffron/10">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#E89B2F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12l7-7 7 7" />
                </svg>
              </div>
              <div className="h-0.5 w-12 bg-gradient-to-l from-transparent to-saffron" />
            </div>

            {/* Home language card */}
            <div className="rounded-2xl border-l-4 border-saffron bg-white p-4 shadow-soft animate-fade-in-up stagger-1">
              <div className="mb-2 flex items-center justify-between">
                <span className="rounded-md bg-saffron/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-saffron-dark">
                  Home
                </span>
                <span className="font-indic text-sm font-bold text-saffron-dark">{homeLang.nativeName}</span>
              </div>
              <h3 className="font-indic mb-2 text-base font-bold text-ink">{content.title_home}</h3>
              <p className="font-indic text-sm leading-relaxed text-ink-soft whitespace-pre-line">{content.body_home}</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2.5 animate-fade-in">
            <div className="rounded-2xl border-l-4 border-ink bg-white p-3 shadow-soft">
              <div className="mb-2 flex items-center justify-between">
                <span className="rounded-md bg-ink/5 px-1.5 py-0.5 text-[9px] font-bold uppercase text-ink">School</span>
                <span className="font-indic text-[10px] font-bold text-ink">{schoolLang.nativeName}</span>
              </div>
              <h3 className="mb-2 text-sm font-bold text-ink">{content.title_school}</h3>
              <p className="text-xs leading-relaxed text-ink-soft whitespace-pre-line">{content.body_school}</p>
            </div>
            <div className="rounded-2xl border-l-4 border-saffron bg-white p-3 shadow-soft">
              <div className="mb-2 flex items-center justify-between">
                <span className="rounded-md bg-saffron/10 px-1.5 py-0.5 text-[9px] font-bold uppercase text-saffron-dark">Home</span>
                <span className="font-indic text-[10px] font-bold text-saffron-dark">{homeLang.nativeName}</span>
              </div>
              <h3 className="font-indic mb-2 text-sm font-bold text-ink">{content.title_home}</h3>
              <p className="font-indic text-xs leading-relaxed text-ink-soft whitespace-pre-line">{content.body_home}</p>
            </div>
          </div>
        )}
      </div>

      {/* Feedback section */}
      <div className="px-5 pt-5">
        <button
          onClick={() => setShowFeedback(!showFeedback)}
          className="flex w-full items-center justify-between rounded-2xl bg-white p-4 shadow-soft tap-scale smooth"
        >
          <div className="flex items-center gap-2">
            <MessageCircle size={18} className="text-ink-soft" />
            <span className="text-sm font-bold text-ink">Rate & Comment</span>
            {feedbacks.length > 0 && (
              <span className="rounded-full bg-paper-darker px-2 py-0.5 text-[10px] font-bold text-ink-soft">
                {feedbacks.length}
              </span>
            )}
          </div>
          {showFeedback ? <ChevronUp size={18} className="text-ink-soft" /> : <ChevronDown size={18} className="text-ink-soft" />}
        </button>

        {showFeedback && (
          <div className="mt-3 rounded-2xl bg-white p-4 shadow-soft animate-fade-in-up">
            {/* Star rating */}
            <p className="mb-2 text-xs font-semibold text-ink-soft">Your rating</p>
            <div className="mb-3 flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <button
                  key={i}
                  onClick={() => setUserRating(i)}
                  onMouseEnter={() => setHoverRating(i)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="tap-scale"
                >
                  <Star
                    size={28}
                    className={(hoverRating || userRating) >= i ? 'fill-saffron text-saffron smooth' : 'fill-paper-darker text-paper-darker smooth'}
                  />
                </button>
              ))}
            </div>

            {/* Comment */}
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts..."
              className="mb-3 w-full resize-none rounded-xl border border-paper-darker bg-paper px-3 py-2.5 text-sm text-ink placeholder:text-ink-soft/40 focus-ring smooth"
              rows={3}
            />

            <button
              onClick={submitFeedback}
              disabled={userRating === 0 || submitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-ink py-2.5 text-sm font-bold text-white tap-scale smooth hover:bg-ink-light disabled:opacity-40"
            >
              <Send size={14} />
              {submitting ? 'Submitting...' : 'Submit Feedback'}
            </button>

            {/* Existing feedback */}
            {feedbacks.length > 0 && (
              <div className="mt-4 space-y-2 border-t border-paper-darker pt-3">
                {feedbacks.map((f) => (
                  <div key={f.id} className="rounded-xl bg-paper-dark p-3">
                    <div className="mb-1 flex items-center justify-between">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star key={i} size={12} className={i <= f.rating ? 'fill-saffron text-saffron' : 'fill-paper-darker text-paper-darker'} />
                        ))}
                      </div>
                      <span className="text-[10px] text-ink-soft/60">
                        {new Date(f.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {f.comment && <p className="text-xs text-ink-soft">{f.comment}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
