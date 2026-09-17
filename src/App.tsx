import { useState } from 'react';
import { BottomNav, type Screen } from '@/components/Navigation';
import { LandingPage } from '@/screens/LandingPage';
import { TextbookSearch } from '@/screens/TextbookSearch';
import { LanguageSelection } from '@/screens/LanguageSelection';
import { SearchResults } from '@/screens/SearchResults';
import { BilingualReader } from '@/screens/BilingualReader';
import { ContributeContent } from '@/screens/ContributeContent';
import { SuccessScreen } from '@/screens/SuccessScreen';
import type { TextbookContent } from '@/lib/supabase';

type View =
  | { name: 'landing' }
  | { name: 'textbook' }
  | { name: 'language' }
  | { name: 'results'; code: string }
  | { name: 'reader'; content: TextbookContent }
  | { name: 'contribute' }
  | { name: 'success' };

function App() {
  const [view, setView] = useState<View>({ name: 'landing' });
  const [searchParams, setSearchParams] = useState({
    cls: 5,
    subject: 'Math',
    chapter: 3,
    page: 12,
    code: '05-MATH-03-012',
  });
  const [schoolLang, setSchoolLang] = useState('en');
  const [homeLang, setHomeLang] = useState('hi');

  const currentScreen: Screen = (() => {
    switch (view.name) {
      case 'landing':
        return 'landing';
      case 'textbook':
        return 'textbook';
      case 'language':
        return 'language';
      case 'results':
      case 'reader':
        return 'results';
      case 'contribute':
      case 'success':
        return 'contribute';
    }
  })();

  function navigate(screen: Screen) {
    switch (screen) {
      case 'landing':
        setView({ name: 'landing' });
        break;
      case 'textbook':
        setView({ name: 'textbook' });
        break;
      case 'language':
        setView({ name: 'language' });
        break;
      case 'results':
        setView({ name: 'results', code: searchParams.code });
        break;
      case 'contribute':
        setView({ name: 'contribute' });
        break;
      case 'reader':
        break;
    }
  }

  return (
    <div className="mx-auto min-h-screen max-w-md bg-paper">
      {view.name === 'landing' && <LandingPage onNavigate={navigate} />}

      {view.name === 'textbook' && (
        <TextbookSearch
          initialClass={searchParams.cls}
          initialSubject={searchParams.subject}
          initialChapter={searchParams.chapter}
          initialPage={searchParams.page}
          onSearch={(cls, subject, chapter, page, code) => {
            setSearchParams({ cls, subject, chapter, page, code });
            setView({ name: 'language' });
          }}
          onBack={() => setView({ name: 'landing' })}
        />
      )}

      {view.name === 'language' && (
        <LanguageSelection
          schoolLanguage={schoolLang}
          homeLanguage={homeLang}
          onSelect={(school, home) => {
            setSchoolLang(school);
            setHomeLang(home);
            setView({ name: 'results', code: searchParams.code });
          }}
          onBack={() => setView({ name: 'textbook' })}
        />
      )}

      {view.name === 'results' && (
        <SearchResults
          code={view.code}
          schoolLanguage={schoolLang}
          homeLanguage={homeLang}
          onOpen={(content) => setView({ name: 'reader', content })}
          onBack={() => setView({ name: 'language' })}
        />
      )}

      {view.name === 'reader' && (
        <BilingualReader content={view.content} onBack={() => setView({ name: 'results', code: searchParams.code })} />
      )}

      {view.name === 'contribute' && (
        <ContributeContent onBack={() => setView({ name: 'landing' })} onComplete={() => setView({ name: 'success' })} />
      )}

      {view.name === 'success' && <SuccessScreen onNavigate={navigate} />}

      <BottomNav current={currentScreen} onNavigate={navigate} />
    </div>
  );
}

export default App;
