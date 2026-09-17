import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
  },
});

export type ContentType = 'EXPLANATION' | 'STORY' | 'PRACTICE';

export interface TextbookContent {
  id: string;
  class_num: number;
  subject: string;
  chapter: number;
  page: number;
  code: string;
  content_type: ContentType;
  school_language: string;
  home_language: string;
  title_school: string;
  body_school: string;
  title_home: string;
  body_home: string;
  contributor_name: string | null;
  contributor_role: string | null;
  views_count: number;
  average_rating: number;
  ratings_count: number;
  created_at: string;
}

export interface Feedback {
  id: string;
  content_id: string;
  rating: number;
  comment: string | null;
  helpful: boolean | null;
  session_id: string | null;
  created_at: string;
}

export const LANGUAGES: { code: string; name: string; nativeName: string; script: string }[] = [
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', script: 'Devanagari' },
  { code: 'en', name: 'English', nativeName: 'English', script: 'Latin' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', script: 'Devanagari' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', script: 'Bengali' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', script: 'Telugu' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', script: 'Tamil' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', script: 'Kannada' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', script: 'Oriya' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', script: 'Gujarati' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', script: 'Malayalam' },
  { code: 'mai', name: 'Maithili', nativeName: 'मैथिली', script: 'Devanagari' },
  { code: 'gon', name: 'Gondi', nativeName: 'गोंडी', script: 'Devanagari' },
  { code: 'cg', name: 'Chhattisgarhi', nativeName: 'छत्तीसगढ़ी', script: 'Devanagari' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', script: 'Gurmukhi' },
  { code: 'ur', name: 'Urdu', nativeName: 'اُردُو', script: 'Arabic' },
];

export const SUBJECTS = ['Math', 'EVS', 'English', 'Hindi', 'Science', 'Social Studies'];

export const CONTENT_TYPES: { value: ContentType; label: string; icon: string }[] = [
  { value: 'EXPLANATION', label: 'Explanation', icon: 'BookOpen' },
  { value: 'STORY', label: 'Story', icon: 'Sparkles' },
  { value: 'PRACTICE', label: 'Practice Questions', icon: 'PenLine' },
];

export function getLanguageInfo(code: string) {
  return LANGUAGES.find((l) => l.code === code) || { code, name: code, nativeName: code, script: '' };
}

export function generateCode(cls: number, subject: string, chapter: number, page: number): string {
  const clsStr = String(cls).padStart(2, '0');
  const subStr = subject.toUpperCase().replace(/\s+/g, '').slice(0, 4);
  const chStr = String(chapter).padStart(2, '0');
  const pgStr = String(page).padStart(3, '0');
  return `${clsStr}-${subStr}-${chStr}-${pgStr}`;
}

export function getSessionId(): string {
  let id = localStorage.getItem('bb_session_id');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('bb_session_id', id);
  }
  return id;
}
