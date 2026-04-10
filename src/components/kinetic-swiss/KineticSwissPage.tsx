'use client';

import { useRef, useMemo, useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  useScrollDriver,
  type ScrollTrigger,
} from './hooks/useScrollDriver';
import { useReducedMotion } from './hooks/useReducedMotion';
import { LenisProvider } from './LenisProvider';
import { BackgroundLayer } from './BackgroundLayer';
import { Terminal, type TerminalHandle } from './Terminal';
import { TerminalAside } from './TerminalAside';
import { Preloader } from './Preloader';
import { ScrollProgress } from './ScrollProgress';
import { ScrollHint } from './ScrollHint';
import { TIMING } from './timing';
import { HeroState } from './states/HeroState';
import { ServicesState } from './states/ServicesState';
import { CaseStudyState } from './states/CaseStudyState';
import type { CaseStudyData } from './states/CaseStudyState';
import { AboutState } from './states/AboutState';
import { ContactState } from './states/ContactState';
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
 *   4. Content "output" reveals line-by-line via CSS stagger transitions
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
          {/* Hero */}
          <HeroState
            active={activeScene === 'hero'}
            uptimeStart="2024-02-01T00:00:00Z"
          />

          {/* Services */}
          <ServicesState active={activeScene === 'services'} />

          {/* Case Studies — one per case, dynamically */}
          {caseStudiesState.cases.map((cs) => (
            <CaseStudyState
              key={cs.id}
              active={activeId === `case-${cs.id}`}
              study={cs}
            />
          ))}

          {/* About */}
          <AboutState active={activeScene === 'about'} />

          {/* Contact */}
          <ContactState active={activeScene === 'contact'} />
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

