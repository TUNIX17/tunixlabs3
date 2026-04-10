'use client';

import { useRef, useMemo, useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useScrollDriver, type ScrollTrigger } from './hooks/useScrollDriver';
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

function pickRandom<T>(arr: T[], seed: number): T {
  return arr[Math.floor(seed * arr.length) % arr.length];
}

function toSceneId(triggerId: string): SceneId {
  if (triggerId.startsWith('case-')) return 'case';
  return triggerId as SceneId;
}

/**
 * Kinetic Swiss v3 — Terminal as Interpreter with real content.
 * Content reveals via CSS stagger transitions (no JS streaming).
 * Prompt typing via TypingEngine. Rive for signature moments.
 */
export function KineticSwissPage({ locale: _locale }: { locale?: string }) {
  const t = useTranslations('KineticSwiss');
  const containerRef = useRef<HTMLElement>(null);
  const terminalRef = useRef<TerminalHandle>(null);
  const reducedMotion = useReducedMotion();
  const [promptTyping, setPromptTyping] = useState(false);

  // Hide layout's default header — KineticSwiss has its own nav
  useEffect(() => {
    const header = document.querySelector('header');
    if (header) header.style.display = 'none';
    return () => { if (header) header.style.display = ''; };
  }, []);

  // Read i18n state configs
  const heroState = { prompts: t.raw('states.hero.prompts') as string[], path: t('states.hero.path'), meta: t('states.hero.meta') };
  const servicesState = { prompts: t.raw('states.services.prompts') as string[], path: t('states.services.path'), meta: t('states.services.meta') };
  const caseStudiesState = { prompts: t.raw('states.caseStudies.prompts') as string[], path: t('states.caseStudies.path'), meta: t('states.caseStudies.meta'), cases: t.raw('states.caseStudies.cases') as CaseStudyData[] };
  const aboutState = { prompts: t.raw('states.about.prompts') as string[], path: t('states.about.path'), meta: t('states.about.meta') };
  const contactState = { prompts: t.raw('states.contact.prompts') as string[], path: t('states.contact.path'), meta: t('states.contact.meta') };

  const brand = t('terminal.brand');
  const navHint = t('terminal.navHint');

  // Random prompt selection per session
  const randomSeed = useMemo(() => Math.random(), []);
  const selectedPrompts = useMemo(() => ({
    hero: pickRandom(heroState.prompts, randomSeed),
    services: pickRandom(servicesState.prompts, randomSeed),
    caseStudies: pickRandom(caseStudiesState.prompts, randomSeed),
    about: pickRandom(aboutState.prompts, randomSeed),
    contact: pickRandom(contactState.prompts, randomSeed),
  }), [heroState.prompts, servicesState.prompts, caseStudiesState.prompts, aboutState.prompts, contactState.prompts, randomSeed]);

  // Build scroll triggers
  const triggers: ScrollTrigger[] = useMemo(() => {
    const result: ScrollTrigger[] = [
      { id: 'hero', ...heroState },
      { id: 'services', ...servicesState },
    ];
    for (const cs of caseStudiesState.cases) {
      result.push({ id: `case-${cs.id}`, path: caseStudiesState.path, prompts: caseStudiesState.prompts, meta: caseStudiesState.meta });
    }
    result.push({ id: 'about', ...aboutState });
    result.push({ id: 'contact', ...contactState });
    return result;
  }, [heroState, servicesState, caseStudiesState, aboutState, contactState]);

  // Scroll driver
  const { activeId, scrollProgress } = useScrollDriver(triggers, containerRef);
  const activeScene = toSceneId(activeId);

  // Terminal config
  const activeTrigger = triggers.find((tr) => tr.id === activeId) ?? triggers[0];
  const topBar = { path: activeTrigger.path, meta: activeTrigger.meta, prodActive: activeScene === 'hero' || activeScene === 'case' || activeScene === 'contact' };
  const promptKey = activeId.startsWith('case-') ? 'caseStudies' : (activeId as keyof typeof selectedPrompts);
  const prompt = selectedPrompts[promptKey] ?? '';

  // Prompt transition orchestration
  const prevActiveIdRef = useRef(activeId);
  const orchestrateTransition = useCallback(async () => {
    const engine = terminalRef.current?.promptEngine;
    if (!engine || reducedMotion) return;
    setPromptTyping(true);
    await engine.backspace();
    await new Promise<void>((r) => setTimeout(r, TIMING.ENTER_PAUSE_MS));
    const typingDuration = prompt.length * TIMING.CHAR_DELAY_MS;
    await new Promise<void>((r) => setTimeout(r, typingDuration + TIMING.ENTER_PAUSE_MS));
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
      <div className={styles.root}>
        <Preloader />
        <BackgroundLayer activeScene={activeScene} />

        <nav className={styles.nav}>
          <div className={styles.mark}>
            {brand}
            {!reducedMotion ? (
              <BrandMarkDot scrollProgress={scrollProgress} className={styles.markDotRive} fallbackClassName={styles.markDotFallback} />
            ) : (
              <span className={styles.markDotFallback} />
            )}
          </div>
          <div className={styles.navHint}>{navHint}</div>
        </nav>

        <ScrollProgress progress={scrollProgress} />
        <ScrollHint visible={activeScene === 'hero'} />
        <TerminalAside visible={activeScene === 'about'} />

        <Terminal
          ref={terminalRef}
          isShifted={activeScene === 'about'}
          topBar={topBar}
          prompt={prompt}
          promptTyping={promptTyping}
          trafficState={activeScene === 'case' ? 3 : 1}
          cursorState={promptTyping ? 1 : 0}
        >
          <HeroState active={activeScene === 'hero'} uptimeStart="2024-02-01T00:00:00Z" />
          <ServicesState active={activeScene === 'services'} />
          {caseStudiesState.cases.map((cs) => (
            <CaseStudyState key={cs.id} active={activeId === `case-${cs.id}`} study={cs} />
          ))}
          <AboutState active={activeScene === 'about'} />
          <ContactState active={activeScene === 'contact'} />
        </Terminal>

        <main className={styles.scrollDriver} ref={containerRef}>
          {triggers.map((trigger, i) => (
            <div key={trigger.id} className={`${styles.trigger}${i === 0 ? ` ${styles.triggerFirst}` : ''}`} data-trigger-id={trigger.id} />
          ))}
          <div className={styles.triggerSpacer} />
        </main>
      </div>
    </LenisProvider>
  );
}
