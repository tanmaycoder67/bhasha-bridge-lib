import { ArrowRight, BookOpen, Heart, Users, Sparkles, GraduationCap, Languages, Search, FileText, Plus } from 'lucide-react';
import { BridgeVisual } from '@/components/BridgeVisual';
import type { Screen } from '@/components/Navigation';

export function LandingPage({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  return (
    <div className="min-h-screen pb-20">
      {/* Hero */}
      <section className="relative overflow-hidden px-5 pt-12 pb-8">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -right-20 -top-10 h-48 w-48 rounded-full bg-saffron-light/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 top-40 h-40 w-40 rounded-full bg-forest-light/15 blur-3xl" />

        <div className="relative">
          {/* Logo */}
          <div className="mb-8 flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink shadow-ink">
              <span className="text-lg font-extrabold text-saffron">B</span>
            </div>
            <div>
              <p className="text-sm font-extrabold text-ink leading-none">BhashaBridge</p>
              <p className="text-[10px] font-medium text-ink-soft">Library</p>
            </div>
          </div>

          {/* Headline */}
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-saffron/10 px-3 py-1.5 text-xs font-semibold text-saffron-dark animate-fade-in">
            <Sparkles size={12} />
            Bridging languages, unlocking learning
          </div>
          <h1 className="mb-3 text-3xl font-extrabold leading-tight text-ink animate-fade-in-up">
            Every child learns best
            <br />
            in their <span className="text-saffron">mother tongue</span>
          </h1>
          <p className="mb-6 text-sm leading-relaxed text-ink-soft animate-fade-in-up stagger-1">
            BhashaBridge translates school textbook lessons into home languages — so children from tribal and linguistic minority communities can learn with understanding, not just memorisation.
          </p>

          {/* Bridge visual */}
          <div className="mb-6 animate-scale-in stagger-2">
            <BridgeVisual className="w-full" animate />
          </div>

          {/* CTA */}
          <button
            onClick={() => onNavigate('textbook')}
            className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-ink px-6 py-4 text-base font-bold text-white shadow-ink tap-scale smooth hover:bg-ink-light animate-fade-in-up stagger-3"
          >
            <Search className="h-5 w-5" />
            Find Learning Content
            <ArrowRight size={18} className="smooth group-hover:translate-x-1" />
          </button>
          <button
            onClick={() => onNavigate('contribute')}
            className="mt-3 w-full rounded-2xl border-2 border-paper-darker bg-white px-6 py-3.5 text-sm font-bold text-ink tap-scale smooth hover:border-saffron hover:text-saffron-dark animate-fade-in-up stagger-4"
          >
            Contribute Content
          </button>
        </div>
      </section>

      {/* Stats strip */}
      <section className="px-5 py-4">
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: '15+', label: 'Languages', icon: Languages, color: 'text-saffron' },
            { value: '10', label: 'Classes', icon: GraduationCap, color: 'text-ink' },
            { value: '500+', label: 'Lessons', icon: BookOpen, color: 'text-forest' },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className={`rounded-2xl bg-white p-3 text-center shadow-soft animate-fade-in-up stagger-${i + 1}`}>
                <Icon size={18} className={`mx-auto mb-1 ${stat.color}`} />
                <p className="text-xl font-extrabold text-ink">{stat.value}</p>
                <p className="text-[10px] font-medium text-ink-soft">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Problem/Solution */}
      <section className="px-5 py-6">
        <h2 className="mb-4 text-lg font-extrabold text-ink">The Challenge</h2>
        <div className="mb-3 rounded-2xl border border-rose/20 bg-rose/5 p-4">
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose/10">
              <BookOpen size={16} className="text-rose" />
            </div>
            <p className="text-sm font-bold text-ink">Language barrier in classrooms</p>
          </div>
          <p className="text-xs leading-relaxed text-ink-soft">
            Children from Gondi, Maithili, and other linguistic minority communities study in Hindi or English — languages they barely speak at home. Concepts pass over their heads.
          </p>
        </div>
        <div className="rounded-2xl border border-forest/20 bg-forest/5 p-4">
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-forest/10">
              <Heart size={16} className="text-forest" />
            </div>
            <p className="text-sm font-bold text-ink">BhashaBridge solution</p>
          </div>
          <p className="text-xs leading-relaxed text-ink-soft">
            We map each textbook lesson to a unique code, then crowdsource translations and explanations in the child's home language — verified by teachers and community volunteers.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="px-5 py-6">
        <h2 className="mb-4 text-lg font-extrabold text-ink">How it works</h2>
        <div className="space-y-3">
          {[
            { num: '01', title: 'Find your textbook', desc: 'Select Class → Subject → Chapter → Page to generate a unique code', icon: BookOpen },
            { num: '02', title: 'Pick your languages', desc: 'Choose the school language and the home language you need', icon: Languages },
            { num: '03', title: 'Read bilingually', desc: 'View lessons side-by-side in both languages with stories and practice', icon: FileText },
          ].map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={i} className="flex gap-3 rounded-2xl bg-white p-4 shadow-soft card-lift animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ink text-saffron">
                  <Icon size={18} />
                </div>
                <div className="flex-1">
                  <div className="mb-0.5 flex items-center gap-2">
                    <span className="text-[10px] font-bold text-saffron">{step.num}</span>
                    <p className="text-sm font-bold text-ink">{step.title}</p>
                  </div>
                  <p className="text-xs leading-relaxed text-ink-soft">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Community */}
      <section className="px-5 py-6">
        <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-ink to-ink-light p-5 text-white">
          <Users size={24} className="mb-3 text-saffron" />
          <h3 className="mb-1 text-base font-bold">Built by the community</h3>
          <p className="mb-4 text-xs leading-relaxed text-white/70">
            Teachers, parents, and volunteers contribute translations. Every contribution helps a child understand better.
          </p>
          <button
            onClick={() => onNavigate('contribute')}
            className="inline-flex items-center gap-2 rounded-xl bg-saffron px-4 py-2.5 text-sm font-bold text-white tap-scale smooth hover:bg-saffron-dark"
          >
            <Plus size={16} />
            Add your contribution
          </button>
        </div>
      </section>
    </div>
  );
}
