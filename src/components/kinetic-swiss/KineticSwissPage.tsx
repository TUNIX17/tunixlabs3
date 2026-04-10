'use client';

import { useRef, useMemo, useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  useScrollDriver,
  type ScrollTrigger,
} from './hooks/useScrollDriver';
import { useContentStream } from './hooks/useContentStream';
import { useReducedMotion } from './hooks/useReducedMotion';
import { LenisProvider } from './LenisProvider';
import { BackgroundLayer } from './BackgroundLayer';
import { Terminal, type TerminalHandle } from './Terminal';
import type { TypingEngineHandle } from './TypingEngine';
import { TerminalAside } from './TerminalAside';
import { Preloader } from './Preloader';
import { ScrollProgress } from './ScrollProgress';
import { ScrollHint } from './ScrollHint';
import { TIMING } from './timing';
import { HeroState, getHeroLines } from './states/HeroState';
import { ServicesState, getServicesLines } from './states/ServicesState';
import { CaseStudyState, getCaseStudyLines } from './states/CaseStudyState';
import { AboutState, getAboutLines } from './states/AboutState';
import { ContactState, getContactLines } from './states/ContactState';
import type { CaseStudyData } from './states/CaseStudyState';
import { BrandMarkDot } from './rive/BrandMarkDot';
import styles from './kineticSwiss.module.css';

type SceneId = 'hero' | 'services' | 'case' | 'about' | 'contact';

// ─── Helpers ────────────────────────────────────────────────────────

/** Pick a random element from an array using a pre-computed seed. */
function pickRandom<T>(arr: T[], seed: number): T {
  return arr[Math.floor(seed * arr.length) % arr.length];
}

/** Map a trigger ID (e.g. 'case-schwager') to a background scene ID. */
function toSceneId(triggerId: string): SceneId {
  if (triggerId.startsWith('case-')) return 'case';
  return triggerId as SceneId;
}

/**
 * Detect CSS scroll-timeline support.
 * Used to decide between CSS-driven and JS-driven prompt typing fallback.
 */
function supportsScrollTimeline(): boolean {
  if (typeof CSS === 'undefined' || typeof CSS.supports !== 'function') return false;
  return CSS.supports('animation-timeline', 'scroll()');
}

// ─── Component ──────────────────────────────────────────────────────

interface KineticSwissPageProps {
  locale?: string;
}

/**
 * Top-level orchestrator for the Kinetic Swiss v2 experience.
 * Wraps everything in LenisProvider for smooth scrolling.
 *
 * The scroll-driven typewriter sequence:
 *   1. Current prompt backspaces character-by-character
 *   2. New prompt types character-by-character (from picked variant)
 *   3. Brief cursor flash (simulating Enter key)
 *   4. Content "output" streams line-by-line via useContentStream
 *
 * All text comes from the KineticSwiss i18n namespace.
 * Prompts are randomized per session via useMemo + Math.random().
 *
 * CSS scroll-timeline detection: when supported, the prompt scroll-scrub
 * animation is driven by CSS (@keyframes + animation-timeline: scroll()),
 * otherwise the JS TypingEngine handles it.
 */
export function KineticSwissPage({ locale: _locale }: KineticSwissPageProps) {
  const t = useTranslations('KineticSwiss');
  const containerRef = useRef<HTMLElement>(null);
  const terminalRef = useRef<TerminalHandle>(null);
  const streamEngineRef = useRef<TypingEngineHandle>(null);
  const reducedMotion = useReducedMotion();
  const [promptTyping, setPromptTyping] = useState(false);
  const [hasScrollTimeline, setHasScrollTimeline] = useState(false);

  // Detect CSS scroll-timeline support on mount
  useEffect(() => {
    setHasScrollTimeline(supportsScrollTimeline());
  }, []);

  // ── Read i18n data ──────────────────────────────────────────────
  const heroState = {
    prompts: t.raw('states.hero.prompts') as string[],
    path: t('states.hero.path'),
    meta: t('states.hero.meta'),
  };

  const servicesState = {
    prompts: t.raw('states.services.prompts') as string[],
    path: t('states.services.path'),
    meta: t('states.services.meta'),
  };

  const caseStudiesState = {
    prompts: t.raw('states.caseStudies.prompts') as string[],
    path: t('states.caseStudies.path'),
    meta: t('states.caseStudies.meta'),
    cases: t.raw('states.caseStudies.cases') as CaseStudyData[],
  };

  const aboutState = {
    prompts: t.raw('states.about.prompts') as string[],
    path: t('states.about.path'),
    meta: t('states.about.meta'),
  };

  const contactState = {
    prompts: t.raw('states.contact.prompts') as string[],
    path: t('states.contact.path'),
    meta: t('states.contact.meta'),
  };

  const brand = t('terminal.brand');
  const navHint = t('terminal.navHint');

  // About state i18n data for getAboutLines
  const aboutHeader = t('states.about.header');
  const aboutTitle = t('states.about.title.text');
  const aboutBio1 = (t.raw('states.about.bioParagraph1') as string).replace(/<\/?mit>/g, '');
  const aboutBio2 = t('states.about.bioParagraph2');
  const aboutQuote = t('states.about.italicQuote');

  // Contact state i18n data for getContactLines
  const contactTitle = t('states.contact.title.text');
  const contactSubtitle = t('states.contact.subtitle');
  const contactCta1 = t('states.contact.ctaPrimary');
  const contactCta2 = t('states.contact.ctaSecondary');

  // Hero state i18n data for getHeroLines
  const heroHeadline = t.raw('states.hero.headline') as { lines: string[]; accentLine: number; outlineLine: number };
  const heroMetaGrid = t.raw('states.hero.metaGrid') as { label: string; value: string }[];

  // Services state i18n data for getServicesLines
  const servicesItems = t.raw('states.services.items') as { num: string; title: string; anchor: string }[];
  const servicesTitleText = t('states.services.title.text');
  const servicesCount = t('states.services.count');
  const servicesTotalNumber = t('states.services.totalNumber');

  // ── Random prompt selection (per-session generativity) ──────────
  const randomSeed = useMemo(() => Math.random(), []);

  const selectedPrompts = useMemo(() => ({
    hero: pickRandom(heroState.prompts, randomSeed),
    services: pickRandom(servicesState.prompts, randomSeed),
    caseStudies: pickRandom(caseStudiesState.prompts, randomSeed),
    about: pickRandom(aboutState.prompts, randomSeed),
    contact: pickRandom(contactState.prompts, randomSeed),
  }), [
    heroState.prompts,
    servicesState.prompts,
    caseStudiesState.prompts,
    aboutState.prompts,
    contactState.prompts,
    randomSeed,
  ]);

  // ── Build triggers dynamically: hero + services + N cases + about + contact ──
  const triggers: ScrollTrigger[] = useMemo(() => {
    const result: ScrollTrigger[] = [
      {
        id: 'hero',
        path: heroState.path,
        prompts: heroState.prompts,
        meta: heroState.meta,
      },
      {
        id: 'services',
        path: servicesState.path,
        prompts: servicesState.prompts,
        meta: servicesState.meta,
      },
    ];

    // One trigger per case study
    for (const cs of caseStudiesState.cases) {
      result.push({
        id: `case-${cs.id}`,
        path: caseStudiesState.path,
        prompts: caseStudiesState.prompts,
        meta: caseStudiesState.meta,
      });
    }

    result.push({
      id: 'about',
      path: aboutState.path,
      prompts: aboutState.prompts,
      meta: aboutState.meta,
    });

    result.push({
      id: 'contact',
      path: contactState.path,
      prompts: contactState.prompts,
      meta: contactState.meta,
    });

    return result;
  }, [heroState, servicesState, caseStudiesState, aboutState, contactState]);

  // ── Scroll driver ───────────────────────────────────────────────
  const { activeId, scrollProgress } = useScrollDriver(triggers, containerRef);

  const activeScene = toSceneId(activeId);
  const isAbout = activeScene === 'about';
  const isHero = activeScene === 'hero';

  // Top bar config for the terminal
  const activeTrigger = triggers.find((tr) => tr.id === activeId) ?? triggers[0];
  const topBar = {
    path: activeTrigger.path,
    meta: activeTrigger.meta,
    prodActive: activeScene === 'hero' || activeScene === 'case' || activeScene === 'contact',
  };

  // Prompt for the terminal: use the selected random prompt for the active scene
  const promptKey = activeId.startsWith('case-') ? 'caseStudies' : (activeId as keyof typeof selectedPrompts);
  const prompt = selectedPrompts[promptKey] ?? '';

  // ── Content lines for the active state ─────────────────────────
  const activeContentLines = useMemo((): string[] => {
    if (activeId === 'hero') {
      return getHeroLines(heroHeadline, heroMetaGrid);
    }
    if (activeId === 'services') {
      return getServicesLines(servicesItems, servicesTitleText, servicesCount, servicesTotalNumber);
    }
    if (activeId.startsWith('case-')) {
      const caseId = activeId.replace('case-', '');
      const cs = caseStudiesState.cases.find((c) => c.id === caseId);
      return cs ? getCaseStudyLines(cs) : [];
    }
    if (activeId === 'about') {
      return getAboutLines(aboutHeader, aboutTitle, aboutBio1, aboutBio2 || undefined, aboutQuote);
    }
    if (activeId === 'contact') {
      return getContactLines(contactTitle, contactSubtitle, contactCta1, contactCta2);
    }
    return [];
  }, [
    activeId, heroHeadline, heroMetaGrid,
    servicesItems, servicesTitleText, servicesCount, servicesTotalNumber,
    caseStudiesState.cases,
    aboutHeader, aboutTitle, aboutBio1, aboutBio2, aboutQuote,
    contactTitle, contactSubtitle, contactCta1, contactCta2,
  ]);

  // ── Content stream engine ──────────────────────────────────────
  const { streamedLines } = useContentStream({
    lines: activeContentLines,
    activeStateId: activeId,
    engineRef: streamEngineRef,
    active: true,
  });

  // ── Prompt transition orchestration ────────────────────────────
  // When activeId changes, trigger the backspace → type-in → content stream sequence.
  // The Terminal's TypingEngine handles the prompt text change automatically via its
  // text prop. We just need to signal promptTyping for the cursor style.
  const prevActiveIdRef = useRef(activeId);

  const orchestrateTransition = useCallback(async () => {
    const engine = terminalRef.current?.promptEngine;
    if (!engine || reducedMotion) return;

    setPromptTyping(true);

    // 1. Backspace the old prompt
    await engine.backspace();

    // 2. Brief cursor flash (Enter key simulation)
    await new Promise<void>((resolve) => {
      setTimeout(resolve, TIMING.ENTER_PAUSE_MS);
    });

    // 3. The new prompt types in automatically via the TypingEngine text prop change
    //    (handled by the useEffect in TypingEngine when `text` changes)

    // 4. After a delay matching the prompt typing duration, stop the typing cursor
    const typingDuration = prompt.length * TIMING.CHAR_DELAY_MS;
    await new Promise<void>((resolve) => {
      setTimeout(resolve, typingDuration + TIMING.ENTER_PAUSE_MS);
    });

    setPromptTyping(false);
  }, [prompt, reducedMotion]);

  useEffect(() => {
    if (prevActiveIdRef.current !== activeId) {
      prevActiveIdRef.current = activeId;
      orchestrateTransition();
    }
  }, [activeId, orchestrateTransition]);

  return (
    <LenisProvider>
      <div
        className={styles.root}
        data-scroll-timeline={hasScrollTimeline ? 'true' : 'false'}
      >
        {/* Preloader */}
        <Preloader />

        {/* Background crossfade layer */}
        <BackgroundLayer activeScene={activeScene} />

        {/* Nav bar */}
        <nav className={styles.nav}>
          <div className={styles.mark}>
            {brand}
            {!reducedMotion ? (
              <BrandMarkDot
                scrollProgress={scrollProgress}
                className={styles.markDotRive}
                fallbackClassName={styles.markDotFallback}
              />
            ) : (
              <span className={styles.markDotFallback} />
            )}
          </div>
          <div className={styles.navHint}>{navHint}</div>
        </nav>

        {/* Scroll progress bar */}
        <ScrollProgress progress={scrollProgress} />

        {/* Scroll hint (visible only on hero) */}
        <ScrollHint visible={isHero} />

        {/* Aside terminal (About section only) */}
        <TerminalAside visible={isAbout} />

        {/* The main terminal */}
        <Terminal
          ref={terminalRef}
          isShifted={isAbout}
          topBar={topBar}
          prompt={prompt}
          promptTyping={promptTyping}
        >
          {/* Hidden TypingEngine for content streaming (not rendered visually) */}
          <div style={{ display: 'none' }}>
            <StreamEngineMount ref={streamEngineRef} />
          </div>

          {/* Hero */}
          <HeroState
            active={activeScene === 'hero'}
            uptimeStart="2024-02-01T00:00:00Z"
            streamedLines={activeScene === 'hero' ? streamedLines : undefined}
          />

          {/* Services */}
          <ServicesState
            active={activeScene === 'services'}
            streamedLines={activeScene === 'services' ? streamedLines : undefined}
          />

          {/* Case Studies — one per case, dynamically */}
          {caseStudiesState.cases.map((cs) => (
            <CaseStudyState
              key={cs.id}
              active={activeId === `case-${cs.id}`}
              study={cs}
              streamedLines={activeId === `case-${cs.id}` ? streamedLines : undefined}
            />
          ))}

          {/* About */}
          <AboutState
            active={activeScene === 'about'}
            streamedLines={activeScene === 'about' ? streamedLines : undefined}
          />

          {/* Contact */}
          <ContactState
            active={activeScene === 'contact'}
            streamedLines={activeScene === 'contact' ? streamedLines : undefined}
          />
        </Terminal>

        {/* Scroll driver: invisible trigger divs that the scroll hook detects */}
        <main className={styles.scrollDriver} ref={containerRef}>
          {triggers.map((trigger, i) => (
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

// ─── Stream Engine Mount ───────────────────────────────────────────
// Invisible TypingEngine instance used solely for its streamLines imperative method.
// Content streaming is driven through this ref, separate from the prompt engine.

import { forwardRef, type ForwardedRef } from 'react';
import { TypingEngine } from './TypingEngine';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface StreamEngineMountProps {}

const StreamEngineMount = forwardRef(function StreamEngineMount(
  _props: StreamEngineMountProps,
  ref: ForwardedRef<TypingEngineHandle>
) {
  return <TypingEngine ref={ref} text="" />;
});
