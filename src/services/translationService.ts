import { getLanguageInfo } from '@/lib/supabase';

export interface TermPair {
  id: string;
  source: string;
  target: string;
}

export interface TranslationResult {
  title: string;
  body: string;
  terms: TermPair[];
}

export type TranslationStatus = 'draft' | 'translated' | 'ready_for_review' | 'submitted';

/**
 * Mock translation service.
 * Swap the `mockTranslate` function body with a real API call when a backend is connected.
 * The function signature should remain the same so the UI doesn't change.
 */

const MOCK_TRANSLATIONS: Record<string, Record<string, TranslationResult>> = {
  'en→hi': {
    'Photosynthesis': {
      title: 'प्रकाश संश्लेषण',
      body: 'प्रकाश संश्लेषण वह प्रक्रिया है जिसके द्वारा हरे पौधे सूर्य के प्रकाश की सहायता से अपना भोजन तैयार करते हैं।',
      terms: [
        { id: 't1', source: 'Photosynthesis', target: 'प्रकाश संश्लेषण' },
        { id: 't2', source: 'Chlorophyll', target: 'क्लोरोफिल' },
        { id: 't3', source: 'Cell', target: 'कोशिका' },
        { id: 't4', source: 'Nucleus', target: 'केंद्रक' },
      ],
    },
    'Fractions — Part of a Whole': {
      title: 'भिन्न — पूरे का एक हिस्सा',
      body: 'भिन्न पूरे के एक हिस्से को दर्शाता है। जब हम किसी चीज़ को बराबर हिस्सों में बाँटते हैं, तो हर हिस्सा भिन्न कहलाता है।',
      terms: [
        { id: 't1', source: 'Fraction', target: 'भिन्न' },
        { id: 't2', source: 'Numerator', target: 'अंश' },
        { id: 't3', source: 'Denominator', target: 'हर' },
      ],
    },
  },
  'en→mr': {
    'Fractions — Part of a Whole': {
      title: 'अपूर्णांक — संपूर्णाचा एक भाग',
      body: 'अपूर्णांक हा संपूर्णाचा एक भाग दर्शवतो. जेव्हा आपण काहीतरी समान भागांमध्ये विभागतो, तेव्हा प्रत्येक भागाला अपूर्णांक म्हणतात.',
      terms: [
        { id: 't1', source: 'Fraction', target: 'अपूर्णांक' },
        { id: 't2', source: 'Numerator', target: 'अंश' },
        { id: 't3', source: 'Denominator', target: 'हर' },
      ],
    },
  },
};

const DEFAULT_TERMS: Record<string, Record<string, string>> = {
  en: {
    'Photosynthesis': 'प्रकाश संश्लेषण',
    'Chlorophyll': 'क्लोरोफिल',
    'Cell': 'कोशिका',
    'Nucleus': 'केंद्रक',
    'Fraction': 'भिन्न',
    'Numerator': 'अंश',
    'Denominator': 'हर',
  },
};

function makeId(): string {
  return `term-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

/**
 * Translate text from sourceLang to targetLang.
 * Currently a mock — returns a canned translation or a bracketed placeholder.
 * Replace the body with `await fetch(...)` to a real API when available.
 */
export async function translateContent(
  sourceLang: string,
  targetLang: string,
  title: string,
  body: string,
): Promise<TranslationResult> {
  await new Promise((resolve) => setTimeout(resolve, 1400));

  const key = `${sourceLang}→${targetLang}`;
  const exact = MOCK_TRANSLATIONS[key]?.[title];

  if (exact) {
    return {
      title: exact.title,
      body: exact.body,
      terms: exact.terms.map((t) => ({ ...t, id: makeId() })),
    };
  }

  // Generic mock: wrap in brackets with target language name as a visual placeholder
  const targetInfo = getLanguageInfo(targetLang);
  const sourceTerms = DEFAULT_TERMS[sourceLang] || {};
  const terms: TermPair[] = [];

  // Try to detect terms from the body (capitalized words)
  const wordMatches = body.match(/\b[A-Z][a-z]{2,}\b/g) || [];
  const uniqueWords = [...new Set(wordMatches)].slice(0, 5);

  for (const word of uniqueWords) {
    const translated = sourceTerms[word];
    if (translated) {
      terms.push({ id: makeId(), source: word, target: translated });
    }
  }

  // If no terms found, add an empty one for the user to fill
  if (terms.length === 0) {
    terms.push({ id: makeId(), source: '', target: '' });
  }

  return {
    title: `[${targetInfo.nativeName}] ${title}`,
    body: `[${targetInfo.name} translation]\n${body}`,
    terms,
  };
}

export function translationDirection(sourceLang: string, targetLang: string): string {
  const s = getLanguageInfo(sourceLang);
  const t = getLanguageInfo(targetLang);
  return `${s.nativeName} → ${t.nativeName}`;
}
