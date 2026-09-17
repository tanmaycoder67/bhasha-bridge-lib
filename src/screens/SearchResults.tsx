import { useState, useEffect } from 'react';
import { ChevronRight, Search, Filter, X, Inbox } from 'lucide-react';
import { TopBar } from '@/components/Navigation';
import { ContentTypeBadge, LanguagePair, MetaInfo, RatingStars, SkeletonCard } from '@/components/shared';
import { supabase, type TextbookContent, type ContentType, CONTENT_TYPES } from '@/lib/supabase';

interface Props {
  code: string;
  schoolLanguage: string;
  homeLanguage: string;
  onOpen: (content: TextbookContent) => void;
  onBack: () => void;
}

export function SearchResults({ code, schoolLanguage, homeLanguage, onOpen, onBack }: Props) {
  const [results, setResults] = useState<TextbookContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<ContentType | 'ALL'>('ALL');

  useEffect(() => {
    async function fetchResults() {
      setLoading(true);
      const { data, error } = await supabase
        .from('textbook_content')
        .select('*')
        .eq('code', code)
        .eq('school_language', schoolLanguage)
        .eq('home_language', homeLanguage)
        .order('content_type', { ascending: true });

      if (!error && data) {
        setResults(data as TextbookContent[]);
      }
      setLoading(false);
    }
    fetchResults();
  }, [code, schoolLanguage, homeLanguage]);

  const filtered = filter === 'ALL' ? results : results.filter((r) => r.content_type === filter);
  const availableTypes = Array.from(new Set(results.map((r) => r.content_type)));

  return (
    <div className="min-h-screen pb-20">
      <TopBar
        title="Search Results"
        onBack={onBack}
        right={
          <div className="rounded-lg bg-paper-dark px-2.5 py-1">
            <span className="font-mono text-xs font-bold text-ink">{code}</span>
          </div>
        }
      />

      {/* Language pair summary */}
      <div className="px-5 pt-4">
        <div className="flex items-center justify-between rounded-2xl bg-white p-3 shadow-soft">
          <LanguagePair school={schoolLanguage} home={homeLanguage} />
          <span className="text-xs font-bold text-ink-soft">
            {loading ? '...' : `${results.length} ${results.length === 1 ? 'result' : 'results'}`}
          </span>
        </div>
      </div>

      {/* Filters */}
      {!loading && results.length > 0 && (
        <div className="px-5 pt-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <Filter size={14} className="shrink-0 text-ink-soft" />
            <button
              onClick={() => setFilter('ALL')}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold tap-scale smooth ${
                filter === 'ALL' ? 'bg-ink text-white' : 'bg-white text-ink-soft ring-1 ring-paper-darker'
              }`}
            >
              All
            </button>
            {CONTENT_TYPES.filter((t) => availableTypes.includes(t.value)).map((t) => (
              <button
                key={t.value}
                onClick={() => setFilter(t.value)}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold tap-scale smooth ${
                  filter === t.value ? 'bg-ink text-white' : 'bg-white text-ink-soft ring-1 ring-paper-darker'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      <div className="px-5 pt-3 space-y-3">
        {loading && (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        )}

        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-paper-darker">
              <Inbox size={28} className="text-ink-soft" />
            </div>
            <p className="mb-1 text-sm font-bold text-ink">No content found yet</p>
            <p className="mb-4 text-xs text-ink-soft">Be the first to contribute for this textbook page</p>
          </div>
        )}

        {!loading &&
          filtered.map((content, i) => (
            <button
              key={content.id}
              onClick={() => onOpen(content)}
              className="block w-full rounded-2xl bg-white p-4 text-left shadow-soft card-lift animate-fade-in-up"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <ContentTypeBadge type={content.content_type} />
                <RatingStars rating={content.average_rating} />
              </div>
              <h3 className="font-indic mb-1 text-base font-bold text-ink">{content.title_home}</h3>
              <p className="font-indic mb-3 line-clamp-2 text-sm leading-relaxed text-ink-soft">{content.body_home}</p>
              <div className="flex items-center justify-between">
                <MetaInfo content={content} />
                <ChevronRight size={16} className="text-ink-soft" />
              </div>
            </button>
          ))}
      </div>
    </div>
  );
}
