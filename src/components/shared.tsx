import { BookOpen, Sparkles, PenLine, Star, Eye, ArrowRight, type LucideIcon } from 'lucide-react';
import type { ContentType, TextbookContent } from '@/lib/supabase';
import { getLanguageInfo } from '@/lib/supabase';

export const CONTENT_TYPE_META: Record<ContentType, { label: string; icon: LucideIcon; color: string; bg: string; ring: string }> = {
  EXPLANATION: { label: 'Explanation', icon: BookOpen, color: 'text-ink', bg: 'bg-paper-dark', ring: 'ring-ink/10' },
  STORY: { label: 'Story', icon: Sparkles, color: 'text-saffron-dark', bg: 'bg-saffron-light/20', ring: 'ring-saffron/20' },
  PRACTICE: { label: 'Practice', icon: PenLine, color: 'text-forest', bg: 'bg-forest-light/15', ring: 'ring-forest/20' },
};

export function RatingStars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          className={i <= Math.round(rating) ? 'fill-saffron text-saffron' : 'fill-paper-darker text-paper-darker'}
        />
      ))}
    </div>
  );
}

export function ContentTypeBadge({ type }: { type: ContentType }) {
  const meta = CONTENT_TYPE_META[type];
  const Icon = meta.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${meta.bg} ${meta.color} ring-1 ${meta.ring}`}>
      <Icon size={12} />
      {meta.label}
    </span>
  );
}

export function LanguagePair({ school, home }: { school: string; home: string }) {
  const s = getLanguageInfo(school);
  const h = getLanguageInfo(home);
  return (
    <div className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-soft">
      <span className="font-indic rounded-md bg-ink/5 px-2 py-0.5 text-ink">{s.nativeName}</span>
      <ArrowRight size={10} className="text-saffron" />
      <span className="font-indic rounded-md bg-saffron/10 px-2 py-0.5 text-saffron-dark">{h.nativeName}</span>
    </div>
  );
}

export function MetaInfo({ content }: { content: TextbookContent }) {
  return (
    <div className="flex flex-wrap items-center gap-3 text-xs text-ink-soft">
      <span className="inline-flex items-center gap-1">
        <Eye size={12} />
        {content.views_count} views
      </span>
      {content.ratings_count > 0 && (
        <span className="inline-flex items-center gap-1">
          <Star size={12} className="fill-saffron text-saffron" />
          {content.average_rating.toFixed(1)} ({content.ratings_count})
        </span>
      )}
      {content.contributor_name && (
        <span className="text-ink-soft/70">by {content.contributor_name}</span>
      )}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-soft">
      <div className="mb-3 flex items-center justify-between">
        <div className="skeleton h-5 w-20 rounded-full" />
        <div className="skeleton h-5 w-16 rounded-full" />
      </div>
      <div className="skeleton mb-2 h-4 w-3/4 rounded" />
      <div className="skeleton mb-4 h-3 w-full rounded" />
      <div className="skeleton mb-4 h-3 w-5/6 rounded" />
      <div className="flex gap-3">
        <div className="skeleton h-3 w-16 rounded" />
        <div className="skeleton h-3 w-12 rounded" />
      </div>
    </div>
  );
}
