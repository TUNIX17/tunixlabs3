'use client';

import { useRef } from 'react';
import {
  useScrollDriver,
  type ScrollTrigger,
} from './hooks/useScrollDriver';
import { LenisProvider } from './LenisProvider';
import { BackgroundLayer } from './BackgroundLayer';
import { Terminal } from './Terminal';
import { TerminalAside } from './TerminalAside';
import { Preloader } from './Preloader';
import { ScrollProgress } from './ScrollProgress';
import { ScrollHint } from './ScrollHint';
import { HeroState } from './states/HeroState';
import { ServicesState } from './states/ServicesState';
import { CaseStudyState } from './states/CaseStudyState';
import { AboutState } from './states/AboutState';
import { ContactState } from './states/ContactState';
import styles from './kineticSwiss.module.css';

type SceneId = 'hero' | 'services' | 'case' | 'about' | 'contact';

// ─── Scroll trigger definitions ─────────────────────────────────────
// Each trigger maps to a terminal state with path, prompt, and meta text.
// These are the placeholder values — Sprint 4 (i18n) replaces them.
const TRIGGERS: ScrollTrigger[] = [
  { id: 'hero', path: 'production', prompts: ['cat hero.md'], meta: 'uptime 15y' },
  { id: 'services', path: 'services', prompts: ['ls -la services/'], meta: '6 items' },
  { id: 'case', path: 'case-studies', prompts: ['cat schwager.md'], meta: 'in production' },
  { id: 'about', path: 'about', prompts: ['whoami'], meta: 'founder' },
  { id: 'contact', path: 'contact', prompts: ['./reach-out.sh'], meta: '<24h reply' },
];

// ─── Top bar config per scene ───────────────────────────────────────
const TOP_BAR_CONFIG: Record<SceneId, { path: string; meta: string; prodActive: boolean }> = {
  hero: { path: 'production', meta: 'uptime 15y', prodActive: true },
  services: { path: 'services', meta: '6 items', prodActive: false },
  case: { path: 'case-studies', meta: 'in production', prodActive: true },
  about: { path: 'about', meta: 'founder', prodActive: false },
  contact: { path: 'contact', meta: '<24h reply', prodActive: true },
};

// ─── Prompt text per scene ──────────────────────────────────────────
const PROMPTS: Record<SceneId, string> = {
  hero: 'cat hero.md',
  services: 'ls -la services/',
  case: 'cat schwager.md',
  about: 'whoami',
  contact: './reach-out.sh',
};

// ─── Placeholder content (Sprint 4 i18n will replace) ───────────────
const HERO_LINES = ['NOT A', 'STUDIO.', 'ONE', 'OPERATOR.'];
const HERO_META = [
  { label: 'Based', value: 'Santiago, CL' },
  { label: 'Years of ops', value: '__UPTIME__' },
  { label: 'Credentials', value: 'MSc Finance' },
  { label: 'Engagement', value: 'USD 15-60k' },
];

const SERVICE_ITEMS = [
  { title: 'Voice AI &\nconversational', description: '195+ workers in prod' },
  { title: 'Operational\nBI & dashboards', description: '19,778 work orders' },
  { title: 'Vertical\nSaaS', description: 'Apoderapp, Speakly' },
  { title: 'AI\nconsulting', description: 'Agente_Tunix' },
  { title: 'Process\nautomation (RPA)', description: '4,040 codes' },
  { title: 'Applied\nML', description: 'MIT Prof Ed' },
];

const CASE_STUDY = {
  badge: 'In production \u00B7 Mining services contractor',
  title: 'Voice AI for field ops at 100ms.',
  metrics: [
    { value: '195+', label: 'Field workers' },
    { value: '4,000+', label: 'Daily routes' },
    { value: '90%', label: 'Memory reduction' },
  ],
};

const ABOUT = {
  header: 'whoami \u00B7 Alejandro Moyano Foncea \u00B7 MSc Finance + MIT Prof Ed \u00B7 15 yrs running real ops',
  title: 'The person you\'ll actually work with.',
  bioParagraph1:
    'I fix operational inefficiencies by building custom software. Unlike a traditional developer, I use modern AI workflows to architect and ship production systems in a fraction of the usual time.',
  italicQuote:
    '"That\'s how I understand the why behind the software, not just the how."',
};

const CONTACT = {
  title: 'Have a project that ships?',
  subtitle: 'I reply in under 24h \u00B7 no endless forms',
  ctas: [
    { label: 'Book a call', href: '#' },
    { label: 'Send a message', href: '#' },
  ],
};

interface KineticSwissPageProps {
  locale?: string;
}

/**
 * Top-level orchestrator for the Kinetic Swiss v2 experience.
 * Wraps everything in LenisProvider for smooth scrolling.
 * Manages the active state via useScrollDriver and delegates
 * content rendering to the 5 state components.
 *
 * Sprint 4 will wire i18n via locale prop.
 */
export function KineticSwissPage({ locale: _locale }: KineticSwissPageProps) {
  const containerRef = useRef<HTMLElement>(null);
  const { activeId, scrollProgress } = useScrollDriver(TRIGGERS, containerRef);

  const activeScene = activeId as SceneId;
  const isAbout = activeScene === 'about';
  const isHero = activeScene === 'hero';
  const topBar = TOP_BAR_CONFIG[activeScene] ?? TOP_BAR_CONFIG.hero;
  const prompt = PROMPTS[activeScene] ?? '';

  return (
    <LenisProvider>
      <div className={styles.root}>
        {/* Preloader */}
        <Preloader />

        {/* Background crossfade layer */}
        <BackgroundLayer activeScene={activeScene} />

        {/* Nav bar */}
        <nav className={styles.nav}>
          <div className={styles.mark}>TUNIXLABS</div>
          <div className={styles.navHint}>scroll to execute</div>
        </nav>

        {/* Scroll progress bar */}
        <ScrollProgress progress={scrollProgress} />

        {/* Scroll hint (visible only on hero) */}
        <ScrollHint visible={isHero} />

        {/* Aside terminal (About section only) */}
        <TerminalAside visible={isAbout} />

        {/* The main terminal */}
        <Terminal
          isShifted={isAbout}
          topBar={topBar}
          prompt={prompt}
          promptTyping={false}
        >
          {/* Hero */}
          <HeroState
            active={activeScene === 'hero'}
            lines={HERO_LINES}
            metaGrid={HERO_META}
            accentLines={[3]}
            outlineLines={[1]}
          />

          {/* Services */}
          <ServicesState
            active={activeScene === 'services'}
            items={SERVICE_ITEMS}
          />

          {/* Case Study */}
          <CaseStudyState
            active={activeScene === 'case'}
            study={CASE_STUDY}
          />

          {/* About */}
          <AboutState
            active={activeScene === 'about'}
            header={ABOUT.header}
            title={ABOUT.title}
            bioParagraph1={ABOUT.bioParagraph1}
            italicQuote={ABOUT.italicQuote}
          />

          {/* Contact */}
          <ContactState
            active={activeScene === 'contact'}
            title={CONTACT.title}
            subtitle={CONTACT.subtitle}
            ctas={CONTACT.ctas}
          />
        </Terminal>

        {/* Scroll driver: invisible trigger divs that the scroll hook detects */}
        <main className={styles.scrollDriver} ref={containerRef}>
          {TRIGGERS.map((trigger, i) => (
            <div
              key={trigger.id}
              className={`${styles.trigger}${i === 0 ? ` ${styles.triggerFirst}` : ''}`}
              data-trigger-id={trigger.id}
            />
          ))}
          {/* Extra spacer at the bottom */}
          <div className={styles.triggerSpacer} />
        </main>
      </div>
    </LenisProvider>
  );
}
