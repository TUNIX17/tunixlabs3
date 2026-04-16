'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useRive, useStateMachineInput, Layout, Fit, Alignment } from '@rive-app/react-canvas';
import { useLocale } from 'next-intl';
import { blurMap } from '@/generated/blurMap';
import { CustomCursor } from './CustomCursor';
import '@/app/[locale]/v3/v3.css';

/* ══════════════════════════════════════════════════════════════
   TunixLabs v3 — Terminal as Frame with Real Content Inside
   ══════════════════════════════════════════════════════════════ */

// ── CONTENT DATA ─────────────────────────────────────────────

interface CaseData {
  id: string; cmd: string; badge: string; title: string;
  desc: string; metric: string; image: string; color: string;
  path: string; meta: string;
}

const HERO_ES = {
  cmd: './production --status',
  path: 'production', meta: 'UPTIME 15Y 03M',
  lines: ['Construyo los sistemas', 'que hacen funcionar'],
  accent: 'empresas reales.',
  sub: 'Minería, energía, educación — cuando Excel ya no alcanza, yo llego. 15 años operando antes de codear. MSc Finanzas + MIT AI/ML.',
  cta1: 'Hablemos por WhatsApp', cta2: 'Ver lo que construí',
};
const HERO_EN = {
  cmd: './production --status',
  path: 'production', meta: 'UPTIME 15Y 03M',
  lines: ['One operator.', 'MIT-trained.'],
  accent: 'Production AI from Santiago.',
  sub: '15 years running real operations before writing code. MSc Finance + MIT AI/ML. Nearshore at 3-5x below SF/NYC rates.',
  cta1: 'Book a discovery call', cta2: 'See what I shipped',
};

const CASES_ES: CaseData[] = [
  { id: 'apoderapp', cmd: './cases --show apoderapp', badge: 'SAAS · EDUCACIÓN', title: 'Tesoreros cobran cuotas por WhatsApp.', desc: 'Padres envían foto del comprobante. IA lo lee y registra. Sin Excel, sin caos.', metric: 'Verificación automática', image: '/cases/apoderapp/01.webp', color: '#5b21b6', path: 'cases/apoderapp', meta: 'PRODUCTO PROPIO' },
  { id: 'fernandez', cmd: './cases --show fernandez', badge: 'ERP · MANUFACTURA', title: 'Transformación digital de una maestranza.', desc: 'OCR lee facturas, QR identifica herramientas, IA extrae datos. Un sistema, toda la empresa.', metric: 'Transformación completa', image: '/cases/fernandez/01.webp', color: '#92400e', path: 'cases/fernandez', meta: '50 AÑOS MIGRADOS' },
  { id: 'schwager', cmd: './cases --show schwager', badge: 'VOICE AI · MINERÍA', title: 'Operarios llenan formularios hablando.', desc: 'Con guantes, bajo la lluvia, sin señal. Voice AI sobre Google Gemini para faenas mineras.', metric: '195+ operarios · <100ms', image: '/cases/schwager/01.webp', color: '#b85c38', path: 'cases/schwager', meta: '195+ OPERARIOS' },
  { id: 'sime', cmd: './cases --show sime', badge: 'MANTENIMIENTO · MINERÍA', title: '4,000 hojas de ruta digitales al día.', desc: 'Reemplazo completo del sistema legacy. QR en terreno, aprobación móvil, auditoría automática.', metric: 'Cero papel en faena', image: '/cases/sime/01.webp', color: '#2d5a27', path: 'cases/sime', meta: '4K RUTAS/DÍA' },
  { id: 'gasco', cmd: './cases --show gasco', badge: 'AUTOMATIZACIÓN · ENERGÍA', title: 'De 5 min por código a 30 segundos.', desc: 'Repartidores envían foto por WhatsApp. Bot lee el código y lo quema automáticamente.', metric: '14 repartidores en ruta', image: '/case-studies/bot-gas-distribution.png', color: '#0369a1', path: 'cases/gasco', meta: '14 RUTAS' },
  { id: 'soma', cmd: './cases --show soma', badge: 'BI · MINERIA', title: 'Dashboards KPI que reemplazan 50 Excel', desc: 'Data de SAP sincronizada, KPIs operacionales y ejecutivos, alertas en tiempo real. Los directores de operaciones lo miran antes del café.', metric: 'SAP → decisiones en tiempo real', image: '/cases/soma/01.webp', color: '#0369a1', path: 'cases/soma', meta: 'BI OPERACIONAL' },
  { id: 'speakly', cmd: './cases --show speakly', badge: 'SAAS · EDUCACION', title: 'Profesor + avatar AI con copiloto', desc: 'Plataforma de inglés con copiloto AI que asiste al profesor en tiempo real. Avatares conversacionales, progresión adaptativa, sin fricción.', metric: 'Profesor × AI en la misma clase', image: '/cases/speakly/01.webp', color: '#7c3aed', path: 'cases/speakly', meta: 'SAAS EDUTECH' },
];

const CASES_EN: CaseData[] = [
  { id: 'apoderapp', cmd: './cases --show apoderapp', badge: 'SAAS · EDUCATION', title: 'School fee collection via WhatsApp.', desc: 'Parents send receipt photo. AI reads and verifies it. No spreadsheets, no chaos.', metric: 'Automated verification', image: '/cases/apoderapp/01.webp', color: '#5b21b6', path: 'cases/apoderapp', meta: 'OWN PRODUCT' },
  { id: 'fernandez', cmd: './cases --show fernandez', badge: 'ERP · MANUFACTURING', title: 'Digital transformation of an industrial workshop.', desc: 'OCR reads invoices, QR tracks tools, AI extracts data. One system, entire company.', metric: 'Complete transformation', image: '/cases/fernandez/01.webp', color: '#92400e', path: 'cases/fernandez', meta: '50 YRS MIGRATED' },
  { id: 'schwager', cmd: './cases --show schwager', badge: 'VOICE AI · MINING', title: 'Workers fill safety forms by talking.', desc: 'In gloves, rain, no signal. Voice AI on Google Gemini for mining field ops.', metric: '195+ workers · <100ms', image: '/cases/schwager/01.webp', color: '#b85c38', path: 'cases/schwager', meta: '195+ WORKERS' },
  { id: 'sime', cmd: './cases --show sime', badge: 'MAINTENANCE · MINING', title: '4,000 digital route sheets per day.', desc: 'Full legacy replacement. QR signing on-site, mobile approvals, automated audit.', metric: 'Zero paper in the field', image: '/cases/sime/01.webp', color: '#2d5a27', path: 'cases/sime', meta: '4K ROUTES/DAY' },
  { id: 'gasco', cmd: './cases --show gasco', badge: 'AUTOMATION · ENERGY', title: 'From 5 min per code to 30 seconds.', desc: 'Drivers send photo via WhatsApp. Bot reads the code and burns it automatically.', metric: '14 drivers on route', image: '/case-studies/bot-gas-distribution.png', color: '#0369a1', path: 'cases/gasco', meta: '14 ROUTES' },
  { id: 'soma', cmd: './cases --show soma', badge: 'BI · MINING', title: 'BI dashboards replacing 50 spreadsheets', desc: 'SAP-synced data, operational and executive KPIs, real-time alerts. Ops directors check it before coffee.', metric: 'SAP → real-time decisions', image: '/cases/soma/01.webp', color: '#0369a1', path: 'cases/soma', meta: 'OPERATIONAL BI' },
  { id: 'speakly', cmd: './cases --show speakly', badge: 'SAAS · EDUCATION', title: 'Teacher + AI avatar with copilot', desc: 'English learning platform with an AI copilot assisting the teacher in real time. Conversational avatars, adaptive progression, zero friction.', metric: 'Teacher × AI in the same class', image: '/cases/speakly/01.webp', color: '#7c3aed', path: 'cases/speakly', meta: 'SAAS EDTECH' },
];

interface ServiceData {
  key: string; es: string; en: string;
  descEs: string; descEn: string;
  stack: string[];
  anchorEs: string; anchorEn: string;
}

const SERVICES: ServiceData[] = [
  { key: 'asistentes-ia', es: 'Voice AI y asistentes', en: 'Voice AI & Assistants',
    descEs: 'Agentes de voz para operaciones reales. Los operarios completan formularios hablando — sin sacarse los guantes.',
    descEn: 'Voice agents for real operations. Field workers complete safety forms by talking — no gloves off.',
    stack: ['Claude', 'Google Gemini', 'Pipelines de Voice AI'],
    anchorEs: 'En producción: Voice AI en faena minera, 195+ operarios', anchorEn: 'In production: Mining field Voice AI, 195+ workers' },
  { key: 'business-intelligence', es: 'BI operacional y dashboards', en: 'Operational BI & Dashboards',
    descEs: 'Dashboards que los directores de operaciones miran antes del café. Data real, cero placeholders.',
    descEn: 'Dashboards that ops directors check before coffee. Real data, zero placeholders.',
    stack: ['React', 'Prisma', 'PostgreSQL', 'ETL', 'Gantt'],
    anchorEs: 'En producción: 4,000+ rutas diarias visualizadas', anchorEn: 'In production: 4,000+ daily routes visualized' },
  { key: 'desarrollos-web', es: 'SaaS verticales', en: 'Vertical SaaS',
    descEs: 'Plataformas completas: auth, pagos, admin, integraciones legacy. Código para pasar auditoría.',
    descEn: 'Full platforms: auth, payments, admin, legacy integrations. Code built for audit.',
    stack: ['Next.js', 'Fastify', 'Prisma', 'Railway', 'Turborepo'],
    anchorEs: 'En producción: Apoderapp, Speakly, ERP Fernández', anchorEn: 'In production: Apoderapp, Speakly, ERP Fernandez' },
  { key: 'consultoria-ia', es: 'Consultoría de IA', en: 'AI Consulting',
    descEs: 'Auditorías adversariales de IA desplegada. Encuentro la deuda escondida y propongo el approach más barato que funciona.',
    descEn: 'Adversarial audits of deployed AI. I find hidden debt and propose the cheapest approach that works.',
    stack: ['Claude Code', 'Multi-agent systems', 'RAG'],
    anchorEs: '15 años operando antes de codear', anchorEn: '15 years ops before code' },
  { key: 'rpa', es: 'Automatización (RPA)', en: 'Automation (RPA)',
    descEs: 'Bots que reemplazan trabajo manual repetitivo. WhatsApp, OCR, validación automática.',
    descEn: 'Bots that replace repetitive manual work. WhatsApp, OCR, automated validation.',
    stack: ['Express', 'Prisma', 'OCR', 'WhatsApp API'],
    anchorEs: 'En producción: Bot de códigos, 30seg por operación', anchorEn: 'In production: Code burning bot, 30sec per operation' },
  { key: 'machine-learning', es: 'Machine Learning aplicado', en: 'Applied Machine Learning',
    descEs: 'Modelos aplicados a data real de operaciones. No demos — predicción y clasificación en producción.',
    descEn: 'Models applied to real operations data. No demos — prediction and classification in production.',
    stack: ['Python', 'Dataiku', 'LLM Vision', 'Claude'],
    anchorEs: 'MIT Professional Education AI/ML', anchorEn: 'MIT Professional Education AI/ML' },
  { key: 'vision-artificial', es: 'Visión artificial', en: 'Computer Vision',
    descEs: 'OCR, QR, LLM Vision para digitalizar documentos en planta. Lectura automática de facturas y comprobantes.',
    descEn: 'OCR, QR, LLM Vision for on-floor document digitization. Automated invoice and receipt reading.',
    stack: ['LLM Vision', 'OCR', 'QR', 'Claude'],
    anchorEs: 'En producción: ERP Fernández, Apoderapp', anchorEn: 'In production: ERP Fernandez, Apoderapp' },
];

// ── RIVE ──────────────────────────────────────────────────────

function TrafficLights({ state = 1 }: { state?: number }) {
  const [ok, setOk] = useState(true);
  const { rive, RiveComponent } = useRive({
    src: '/design-explorations/rive/traffic-lights.riv',
    artboard: 'Main', stateMachines: ['lights'], autoplay: true,
    layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
    onLoadError: () => setOk(false),
  });
  const input = useStateMachineInput(rive, 'lights', 'stateInput');
  useEffect(() => { if (input) input.value = state; }, [input, state]);
  if (!ok) return (
    <div style={{ display: 'flex', gap: 7 }}>
      <i style={{ width: 11, height: 11, borderRadius: '50%', background: '#555' }} />
      <i style={{ width: 11, height: 11, borderRadius: '50%', background: '#ccff00' }} />
      <i style={{ width: 11, height: 11, borderRadius: '50%', background: '#b85c38', opacity: 0.6 }} />
    </div>
  );
  return <div style={{ width: 90, height: 24 }}><RiveComponent /></div>;
}

function RiveScene({ src }: { src: string }) {
  const [ok, setOk] = useState(true);
  const { RiveComponent } = useRive({
    src,
    autoplay: true,
    layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
    onLoadError: () => setOk(false),
  });
  if (!ok) return null;
  return <div style={{ width: '100%', height: '100%' }}><RiveComponent /></div>;
}

function BurstTransition({ fire }: { fire: boolean }) {
  const { rive, RiveComponent } = useRive({
    src: '/design-explorations/rive/burst-transition.riv',
    artboard: 'Burst',
    stateMachines: ['transition'],
    autoplay: true,
    layout: new Layout({ fit: Fit.Cover, alignment: Alignment.Center }),
  });
  const trigger = useStateMachineInput(rive, 'transition', 'fire');
  const prevFire = useRef(false);

  useEffect(() => {
    if (fire && !prevFire.current && trigger) {
      trigger.fire();
    }
    prevFire.current = fire;
  }, [fire, trigger]);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 150, pointerEvents: 'none' }}>
      <RiveComponent />
    </div>
  );
}

function Waveform() {
  const [ok, setOk] = useState(true);
  const { RiveComponent } = useRive({
    src: '/design-explorations/rive/voice-waveform.riv',
    autoplay: true,
    layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
    onLoadError: () => setOk(false),
  });
  if (!ok) return null;
  return <div style={{ width: 200, height: 40, margin: '20px auto' }}><RiveComponent /></div>;
}

// ── SCROLL HOOK ──────────────────────────────────────────────

type Section = 'hero' | 'case0' | 'case1' | 'case2' | 'case3' | 'case4' | 'case5' | 'case6' | 'services' | 'about' | 'contact';
const SECTIONS: Section[] = ['hero', 'case0', 'case1', 'case2', 'case3', 'case4', 'case5', 'case6', 'services', 'about', 'contact'];

function useActiveSection(): Section {
  const [active, setActive] = useState<Section>('hero');
  useEffect(() => {
    const onScroll = () => {
      const triggers = document.querySelectorAll<HTMLElement>('[data-section]');
      const mid = window.scrollY + window.innerHeight * 0.5;
      let found: Section = 'hero';
      triggers.forEach(el => {
        const top = el.offsetTop;
        const bot = top + el.offsetHeight;
        if (mid >= top && mid < bot) found = el.dataset.section as Section;
      });
      setActive(found);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return active;
}

// ── PAGE ─────────────────────────────────────────────────────

export default function V3Client() {
  const locale = useLocale();
  const isES = locale === 'es';
  const hero = isES ? HERO_ES : HERO_EN;
  const cases = isES ? CASES_ES : CASES_EN;
  const active = useActiveSection();
  const [booted, setBooted] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [typedCmd, setTypedCmd] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [scrollVelocity, setScrollVelocity] = useState(0);
  const [selectedService, setSelectedService] = useState<ServiceData | null>(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showWhatsAppChat, setShowWhatsAppChat] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [chatMsg, setChatMsg] = useState('');
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  // Mouse tracking for parallax effects
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  // #4: Per-visit generative seed — every session is unique
  const [seed] = useState(() => Math.random());
  const genRotation = seed * 360; // unique background rotation
  const genHue = Math.floor(seed * 20) - 10; // subtle hue shift on accent

  useEffect(() => { setTimeout(() => setBooted(true), 2200); }, []);

  // #3: Scroll velocity — drives motion intensity
  useEffect(() => {
    let lastY = window.scrollY;
    let raf = 0;
    const track = () => {
      const v = Math.abs(window.scrollY - lastY);
      setScrollVelocity(Math.min(v / 10, 1)); // normalized 0-1
      lastY = window.scrollY;
      raf = requestAnimationFrame(track);
    };
    raf = requestAnimationFrame(track);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Compute current command from active section
  const cmdForSection = (s: Section): string => {
    if (s.startsWith('case')) {
      const idx = parseInt(s.replace('case', ''));
      return cases[idx]?.cmd || '';
    }
    if (s === 'services') return 'ls ./services/';
    if (s === 'about') return 'whoami';
    if (s === 'contact') return './contact --open';
    return hero.cmd;
  };

  // Initialize with hero command
  useEffect(() => { setTypedCmd(hero.cmd); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // #2: Typing engine — backspace old cmd, type new one character by character
  const prevSectionRef = useRef<Section>('hero');
  useEffect(() => {
    if (active === prevSectionRef.current) return;
    const newCmd = cmdForSection(active);
    const oldCmd = typedCmd || hero.cmd;
    prevSectionRef.current = active;

    setTransitioning(true);
    setIsTyping(true);
    let cancelled = false;

    const animate = async () => {
      // Backspace old command
      for (let i = oldCmd.length; i >= 0; i--) {
        if (cancelled) return;
        setTypedCmd(oldCmd.substring(0, i));
        await new Promise(r => setTimeout(r, 16));
      }
      // Brief pause (enter key feel)
      await new Promise(r => setTimeout(r, 100));
      // Type new command
      for (let i = 0; i <= newCmd.length; i++) {
        if (cancelled) return;
        setTypedCmd(newCmd.substring(0, i));
        await new Promise(r => setTimeout(r, 24));
      }
      setIsTyping(false);
      setTransitioning(false);
    };

    animate();
    return () => { cancelled = true; };
  }, [active]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    document.body.style.cssText = 'background:#0a0a0a!important;color:#f5f5f2!important;overflow-x:hidden';
    const m = document.querySelector('main') as HTMLElement;
    if (m) m.style.background = 'transparent';
    return () => {
      document.body.style.cssText = '';
      if (m) m.style.background = '';
    };
  }, []);

  // Determine terminal content based on active section
  const caseIdx = active.startsWith('case') ? parseInt(active.replace('case', '')) : -1;
  const currentCase = caseIdx >= 0 ? cases[caseIdx] : null;
  const isContact = active === 'contact';
  const isHero = active === 'hero';
  const isAbout = active === 'about';
  const isServices = active === 'services';

  // Terminal topbar — changes per section
  const tPath = currentCase ? currentCase.path : isServices ? 'services' : isAbout ? 'about' : isContact ? 'contact' : hero.path;
  const tMeta = currentCase ? currentCase.meta : isServices ? (isES ? '7 ÁREAS' : '7 AREAS') : isAbout ? 'MSc + MIT AI/ML' : isContact ? 'REPLY < 24H' : hero.meta;
  const tCmd = currentCase ? currentCase.cmd : isServices ? 'ls ./services/' : isAbout ? 'whoami' : isContact ? './contact --open' : hero.cmd;
  const tState = currentCase ? 3 : isServices ? 1 : isAbout ? 0 : 1;

  // Stagger helper
  const stg = (i: number) => ({ transitionDelay: `${i * 80 + 100}ms` });

  return (
    <>
      {/* ── BOOT SCREEN — logo pulse + "tunix start" ── */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 9999, background: '#0a0a0a',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24,
        opacity: booted ? 0 : 1, pointerEvents: booted ? 'none' : 'auto',
        transition: 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        <Image
          src="/logo_turquesa.webp" alt="TunixLabs"
          width={280} height={140} priority
          style={{
            height: 120, width: 'auto',
            animation: 'v3logoPulse 1.5s ease-in-out',
            filter: 'drop-shadow(0 0 40px rgba(0, 229, 204, 0.5)) drop-shadow(0 0 80px rgba(0, 229, 204, 0.2))',
          }}
        />
        {/* Boot terminal output */}
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'rgba(245,245,242,0.3)', textAlign: 'left', maxWidth: 300 }}>
          <div style={{ animation: 'v3fadeIn 0.3s ease 0.3s both' }}>
            <span style={{ color: '#00e5cc' }}>$</span> tunix start
          </div>
          <div style={{ animation: 'v3fadeIn 0.3s ease 0.6s both', color: 'rgba(245,245,242,0.2)' }}>
            ✓ loading modules...
          </div>
          <div style={{ animation: 'v3fadeIn 0.3s ease 0.9s both', color: 'rgba(245,245,242,0.2)' }}>
            ✓ connecting services...
          </div>
          <div style={{ animation: 'v3fadeIn 0.3s ease 1.2s both', color: '#00e5cc' }}>
            ✓ production ready
          </div>
          {/* Progress bar */}
          <div style={{ marginTop: 8, height: 2, background: 'rgba(255,255,255,0.06)', borderRadius: 1, overflow: 'hidden' }}>
            <div style={{ height: '100%', background: '#00e5cc', animation: 'v3bootProgress 1.8s ease-out forwards', transformOrigin: 'left' }} />
          </div>
        </div>
        {/* Boot scanlines */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.04, backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,229,204,0.3) 2px, rgba(0,229,204,0.3) 4px)', backgroundSize: '100% 4px' }} />
      </div>

      <CustomCursor />

      {/* ── HERO BACKGROUND — floating particle field ── */}
      {booted && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 50, pointerEvents: 'none',
          opacity: 0.6,
          transition: 'opacity 1.5s ease',
        }}>
          <RiveScene src="/rive/hero-particles.riv" />
        </div>
      )}

      {/* ════════════════════════════════════════════════════════
          THE TERMINAL — fixed center, persistent, content swaps
          ════════════════════════════════════════════════════════ */}
      <div style={{
        position: 'fixed', top: '50%', left: '50%',
        transform: `translate(-50%, calc(-50% + ${scrollVelocity * -6}px)) scale(${1 - scrollVelocity * 0.025})`,
        width: isAbout ? '56vw' : '86vw', maxWidth: isAbout ? 900 : 1400,
        height: '76vh', maxHeight: 860,
        background: 'rgba(20,20,20,0.85)',
        backdropFilter: 'blur(24px) saturate(1.4)',
        WebkitBackdropFilter: 'blur(24px) saturate(1.4)',
        borderRadius: 16,
        boxShadow: `0 0 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08), 0 0 ${currentCase ? '60px' : '30px'} ${currentCase ? currentCase.color + '25' : 'rgba(204,255,0,0.08)'}, inset 0 1px 0 rgba(255,255,255,0.06)`,
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden', zIndex: 100,
        opacity: booted ? 1 : 0,
        transition: 'all 0.9s cubic-bezier(0.2, 0.9, 0.25, 1)',
      }}>
        {/* ── TOPBAR ── */}
        <div style={{
          height: 44, padding: '0 20px',
          display: 'grid', gridTemplateColumns: 'auto 1fr auto', alignItems: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(255,255,255,0.02)',
          flexShrink: 0,
          transition: 'all 0.4s ease',
        }}>
          <TrafficLights state={tState} />
          <div style={{ textAlign: 'center', fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'rgba(245,245,242,0.4)' }}>
            tunixlabs · ~/<strong style={{ color: 'rgba(245,245,242,0.7)' }}>{tPath}</strong>
          </div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'rgba(245,245,242,0.3)', textAlign: 'right' }}>
            {tMeta}
          </div>
        </div>

        {/* ── ACCENT BAR — colored line under topbar that changes per section ── */}
        <div style={{
          height: 2, flexShrink: 0,
          background: currentCase
            ? `linear-gradient(90deg, transparent, ${currentCase.color}, transparent)`
            : isServices ? 'linear-gradient(90deg, transparent, #ccff00, transparent)'
            : isAbout ? 'linear-gradient(90deg, transparent, #00e5cc, transparent)'
            : isContact ? 'linear-gradient(90deg, transparent, #25d366, transparent)'
            : 'linear-gradient(90deg, transparent, #ccff00, transparent)',
          opacity: 0.6,
          transition: 'all 0.8s ease',
        }} />

        {/* ── NOISE GRAIN — cinematic film texture ── */}
        <div style={{
          position: 'absolute', inset: '-50%', zIndex: 198, pointerEvents: 'none',
          opacity: 0.015,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '128px 128px',
          animation: 'v3grain 0.5s steps(4) infinite',
        }} />

        {/* ── GLITCH FLASH — fires on section transition ── */}
        {transitioning && (
          <div style={{
            position: 'absolute', inset: 0, zIndex: 200, pointerEvents: 'none',
            background: 'linear-gradient(0deg, transparent 40%, rgba(204,255,0,0.03) 50%, transparent 60%)',
            animation: 'v3glitch 0.4s ease-out forwards',
          }} />
        )}

        {/* ── SCANLINE — subtle CRT sweep ── */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 199, pointerEvents: 'none',
          overflow: 'hidden', opacity: 0.03,
        }}>
          <div style={{
            width: '100%', height: 2,
            background: 'rgba(204,255,0,0.8)',
            animation: 'v3scanlineSweep 4s linear infinite',
          }} />
        </div>

        {/* ── PROMPT LINE (live typing engine) ── */}
        <div style={{
          padding: '16px 32px 0',
          fontFamily: 'JetBrains Mono, monospace', fontSize: 13,
          color: 'rgba(245,245,242,0.5)', flexShrink: 0,
        }}>
          <span style={{ color: '#ccff00' }}>$</span>{' '}
          <span style={{ color: isTyping ? 'rgba(245,245,242,0.7)' : 'rgba(245,245,242,0.5)' }}>{typedCmd}</span>
          <span style={{
            display: 'inline-block', width: 7, height: 14, marginLeft: 2,
            background: isTyping ? '#ccff00' : '#ccff00',
            animation: isTyping ? 'none' : 'v3blink .8s steps(2) infinite',
            opacity: isTyping ? 1 : undefined,
          }} />
        </div>

        {/* ── CONTENT AREA ── */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>

          {/* HERO CONTENT */}
          <div style={{
            position: 'absolute', inset: 0, padding: '24px 32px 32px',
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
            opacity: isHero ? 1 : 0,
            transition: 'opacity 0.5s ease',
            pointerEvents: isHero ? 'auto' : 'none',
          }}>
            <h1 style={{ fontSize: 'clamp(32px, 5.5vw, 80px)', fontWeight: 800, lineHeight: 1.08, letterSpacing: '-0.03em', margin: 0 }}>
              {hero.lines.map((l, i) => (
                <span key={i} style={{ display: 'block', opacity: isHero && booted ? 1 : 0, transform: isHero && booted ? 'none' : 'translateY(40px) rotateX(15deg)', transition: 'all 0.8s cubic-bezier(0.2,0.9,0.25,1)', transformOrigin: 'left bottom', ...stg(i) }}>{l}</span>
              ))}
              {/* Accent line — character-by-character stagger reveal */}
              <span style={{ display: 'block', color: '#ccff00' }}>
                {hero.accent.split('').map((char, ci) => (
                  <span key={ci} style={{
                    display: 'inline-block',
                    opacity: isHero && booted ? 1 : 0,
                    transform: isHero && booted ? 'none' : 'translateY(50px) rotateX(20deg)',
                    transition: 'all 0.6s cubic-bezier(0.2,0.9,0.25,1)',
                    transitionDelay: `${hero.lines.length * 80 + 200 + ci * 25}ms`,
                    transformOrigin: 'left bottom',
                    ...(char === ' ' ? { width: '0.3em' } : {}),
                  }}>{char}</span>
                ))}
              </span>
            </h1>
            <p style={{ fontSize: 'clamp(14px, 1.4vw, 18px)', color: 'rgba(245,245,242,0.5)', maxWidth: 560, marginTop: 20, lineHeight: 1.6, opacity: isHero && booted ? 1 : 0, transform: isHero && booted ? 'none' : 'translateY(15px)', transition: 'all 0.7s ease 0.8s' }}>{hero.sub}</p>
            <div style={{ display: 'flex', gap: 14, marginTop: 28, opacity: isHero && booted ? 1 : 0, transition: 'opacity 0.6s ease 1s' }}>
              <a href={isES ? 'https://wa.me/56930367979' : 'https://calendly.com/amoyano17/30min'} target="_blank" rel="noopener noreferrer" data-cursor="grow" style={{ background: '#ccff00', color: '#0a0a0a', padding: '14px 32px', borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: 'none', transition: 'transform 0.3s cubic-bezier(0.2,0.9,0.25,1), box-shadow 0.3s ease', boxShadow: '0 0 0 rgba(204,255,0,0)', }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(204,255,0,0.3)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 0 0 rgba(204,255,0,0)'; }}
              >{hero.cta1}</a>
              <a href="#sec-case0" data-cursor="grow" style={{ border: '1px solid rgba(255,255,255,0.15)', color: '#f5f5f2', padding: '14px 32px', borderRadius: 10, fontSize: 14, textDecoration: 'none', transition: 'all 0.3s cubic-bezier(0.2,0.9,0.25,1)', }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#ccff00'; e.currentTarget.style.color = '#ccff00'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = '#f5f5f2'; e.currentTarget.style.transform = ''; }}
              >{hero.cta2}</a>
            </div>
          </div>

          {/* CASE STUDY CONTENT (one per case, crossfade) */}
          {cases.map((cs, i) => {
            const isActive = active === `case${i}`;
            return (
              <div key={cs.id} className="v3-grid-2col" style={{
                position: 'absolute', inset: 0, padding: '24px 32px 32px',
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'center',
                opacity: isActive ? 1 : 0,
                transition: 'opacity 0.5s ease',
                pointerEvents: isActive ? 'auto' : 'none',
              }}>
                {/* Left: text — varied entrance animations */}
                <div>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: cs.color, letterSpacing: '.12em', opacity: isActive ? 1 : 0, transform: isActive ? 'none' : 'translateX(-20px)', transition: 'all 0.5s cubic-bezier(0.2,0.9,0.25,1)', ...stg(0) }}>{cs.badge}</span>
                  <h2 style={{ fontSize: 'clamp(22px, 3vw, 36px)', fontWeight: 700, margin: '14px 0 10px', lineHeight: 1.15, opacity: isActive ? 1 : 0, transform: isActive ? 'none' : 'translateY(30px) rotateX(10deg)', transition: 'all 0.6s cubic-bezier(0.2,0.9,0.25,1)', transformOrigin: 'left bottom', ...stg(1) }}>{cs.title}</h2>
                  <p style={{ color: 'rgba(245,245,242,0.5)', lineHeight: 1.6, fontSize: 'clamp(13px, 1.2vw, 16px)', opacity: isActive ? 1 : 0, transform: isActive ? 'none' : 'translateY(15px)', transition: 'all 0.5s ease', ...stg(2) }}>{cs.desc}</p>
                  <div style={{ marginTop: 16, fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#ccff00', opacity: isActive ? 1 : 0, transform: isActive ? 'none' : 'translateX(-10px)', transition: 'all 0.4s ease', ...stg(3) }}>
                    <span style={{ display: 'inline-block', width: 16, height: 1, background: '#ccff00', marginRight: 8, verticalAlign: 'middle' }} />
                    {cs.metric}
                  </div>
                </div>
                {/* Right: screenshot — clip-path reveal + parallax */}
                <div style={{
                  borderRadius: 12, overflow: 'hidden', height: '100%',
                  background: `linear-gradient(160deg, ${cs.color}15, ${cs.color}30)`,
                  opacity: isActive ? 1 : 0,
                  clipPath: isActive ? 'inset(0 0 0 0)' : 'inset(0 100% 0 0)',
                  transform: isActive ? 'none' : 'scale(1.05)',
                  transition: 'all 0.7s cubic-bezier(0.2,0.9,0.25,1)',
                  transitionDelay: '150ms',
                  position: 'relative',
                }}>
                  <Image
                    src={cs.image}
                    alt={cs.title}
                    width={800}
                    height={450}
                    placeholder={blurMap[cs.cmd] ? 'blur' : 'empty'}
                    blurDataURL={blurMap[cs.cmd]}
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    style={{
                      width: '100%', height: '100%', objectFit: 'cover',
                      filter: 'brightness(0.92) contrast(1.05)', transition: 'filter 0.6s ease, transform 0.15s ease-out',
                      transform: isActive ? `translate(${(mousePos.x - 0.5) * -8}px, ${(mousePos.y - 0.5) * -6}px) scale(1.06)` : 'scale(1)',
                    }}
                  />
                  {/* Rive screen frame — brackets + scanline + border draw */}
                  {isActive && (
                    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                      <RiveScene src="/design-explorations/rive/screen-frame.riv" />
                    </div>
                  )}
                  {/* Voice scene for schwager */}
                  {cs.id === 'schwager' && isActive && (
                    <div style={{ position: 'absolute', bottom: 12, left: 12, right: 12, height: 60, opacity: 0.85 }}>
                      <RiveScene src="/design-explorations/rive/voice-scene.riv" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* SERVICES CONTENT — 2-col grid filling the terminal, click opens detail terminal */}
          <div style={{
            position: 'absolute', inset: 0, padding: '16px 28px 24px',
            display: 'flex', flexDirection: 'column',
            opacity: isServices ? 1 : 0,
            transition: 'opacity 0.5s ease',
            pointerEvents: isServices ? 'auto' : 'none',
            overflow: 'auto',
          }}>
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr',
              gap: 10, flex: 1,
            }} className="v3-grid-2col">
              {SERVICES.map((svc, i) => (
                <button key={svc.key} onClick={() => setSelectedService(svc)} style={{
                  padding: '18px 16px',
                  background: 'rgba(245,245,242,0.02)',
                  borderRadius: 10,
                  border: '1px solid rgba(245,245,242,0.06)',
                  color: 'inherit', cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', gap: 6,
                  textAlign: 'left', font: 'inherit',
                  opacity: isServices ? 1 : 0,
                  transform: isServices ? 'none' : 'translateY(8px)',
                  transition: 'all 0.4s ease',
                  transitionDelay: `${(i + 1) * 50 + 80}ms`,
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#ccff00'; e.currentTarget.style.background = 'rgba(204,255,0,0.04)'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(204,255,0,0.08), inset 3px 0 0 #ccff00'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(245,245,242,0.06)'; e.currentTarget.style.background = 'rgba(245,245,242,0.02)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <span style={{ fontSize: 14, fontWeight: 700 }}>{isES ? svc.es : svc.en}</span>
                    <span style={{ fontSize: 10, color: '#ccff00', fontFamily: 'JetBrains Mono, monospace' }}>open →</span>
                  </div>
                  <span style={{ fontSize: 12, color: 'rgba(245,245,242,0.4)', lineHeight: 1.4 }}>
                    {isES ? svc.descEs.substring(0, 80) + '...' : svc.descEn.substring(0, 80) + '...'}
                  </span>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 2 }}>
                    {svc.stack.slice(0, 3).map(s => (
                      <span key={s} style={{ fontSize: 9, padding: '2px 8px', borderRadius: 4, background: 'rgba(204,255,0,0.06)', color: 'rgba(245,245,242,0.5)', fontFamily: 'JetBrains Mono, monospace' }}>{s}</span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* ABOUT CONTENT */}
          <div style={{
            position: 'absolute', inset: 0, padding: '24px 32px 32px',
            display: 'grid', gridTemplateColumns: '160px 1fr', gap: 32, alignItems: 'center',
            opacity: isAbout ? 1 : 0,
            transition: 'opacity 0.5s ease',
            pointerEvents: isAbout ? 'auto' : 'none',
          }}>
            <div style={{
              width: 160, height: 160, borderRadius: '50%', overflow: 'hidden',
              border: '2px solid rgba(204,255,0,0.3)',
              opacity: isAbout ? 1 : 0,
              transform: isAbout ? 'none' : 'scale(0.8)',
              transition: 'all 0.6s cubic-bezier(0.2,0.9,0.25,1)',
              transitionDelay: '100ms',
            }}>
              <Image src="/team/alejandro-moyano.webp" alt="Alejandro Moyano" width={160} height={160} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: '#ccff00', letterSpacing: '.12em', opacity: isAbout ? 1 : 0, transition: 'opacity 0.4s ease', transitionDelay: '150ms' }}>
                {isES ? 'SOBRE MÍ' : 'ABOUT'}
              </span>
              <h2 style={{ fontSize: 'clamp(20px, 2.5vw, 32px)', fontWeight: 700, margin: '10px 0', lineHeight: 1.2, opacity: isAbout ? 1 : 0, transform: isAbout ? 'none' : 'translateY(12px)', transition: 'all 0.5s ease', transitionDelay: '200ms' }}>
                {isES ? 'Una persona. Siete sistemas en producción.' : 'One person. Seven production systems.'}
              </h2>
              <p style={{ color: 'rgba(245,245,242,0.5)', lineHeight: 1.6, fontSize: 'clamp(12px, 1.1vw, 15px)', marginBottom: 10, opacity: isAbout ? 1 : 0, transition: 'opacity 0.4s ease', transitionDelay: '300ms' }}>
                {isES
                  ? 'No soy un studio ni una agencia. Soy una persona que entiende el negocio porque lo opero hace 15 años — maestranzas, minas de cobre, distribuidoras de gas. MSc Finanzas, MIT Professional Education en AI/ML.'
                  : "Not a studio. Not an agency. One person who understands business — 15 years running copper mines, gas distributors, industrial workshops. MSc Finance, MIT Professional Education AI/ML."
                }
              </p>
              <p style={{ color: 'rgba(245,245,242,0.5)', lineHeight: 1.6, fontSize: 'clamp(12px, 1.1vw, 15px)', opacity: isAbout ? 1 : 0, transition: 'opacity 0.4s ease', transitionDelay: '400ms' }}>
                {isES
                  ? 'Cada sistema que entrego resuelve un problema que vi con mis propios ojos: operarios que no pueden escribir con guantes, tesoreros ahogados en comprobantes, talleres de 50 años sin visibilidad.'
                  : "Every system I ship solves a problem I've seen firsthand: workers who can't type with gloves, treasurers drowning in receipts, 50-year-old shops with zero visibility."
                }
              </p>
              <a href="https://linkedin.com/in/alejandro-moyano/" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: 12, fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#ccff00', textDecoration: 'none', opacity: isAbout ? 1 : 0, transition: 'opacity 0.4s ease', transitionDelay: '500ms' }}>
                → LinkedIn
              </a>
            </div>
          </div>

          {/* CONTACT CONTENT */}
          <div style={{
            position: 'absolute', inset: 0, padding: '24px 32px 32px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            opacity: isContact ? 1 : 0,
            transition: 'opacity 0.5s ease',
            pointerEvents: isContact ? 'auto' : 'none',
            textAlign: 'center',
          }}>
            <Waveform />
            {/* Split text heading for contact */}
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 800, margin: '16px 0' }}>
              {(isES ? '¿Tienes un proyecto?' : 'Have a project?').split(' ').map((word, wi) => (
                <span key={wi} style={{
                  display: 'inline-block', marginRight: '0.3em',
                  opacity: isContact ? 1 : 0,
                  transform: isContact ? 'none' : 'translateY(30px) rotateX(15deg)',
                  transition: 'all 0.6s cubic-bezier(0.2,0.9,0.25,1)',
                  transitionDelay: `${wi * 80 + 100}ms`,
                  transformOrigin: 'left bottom',
                }}>{word}</span>
              ))}
            </h2>
            <p style={{ color: 'rgba(245,245,242,0.4)', fontSize: 16, marginBottom: 32, opacity: isContact ? 1 : 0, transition: 'all 0.5s ease 0.5s' }}>
              {isES ? 'Respondo en menos de 24 horas.' : 'I reply within 24 hours.'}
            </p>
            <div style={{ display: 'flex', gap: 14, opacity: isContact ? 1 : 0, transition: 'opacity 0.6s ease 0.7s' }}>
              <button onClick={() => setShowContactForm(true)} data-cursor="grow" style={{
                background: '#ccff00', color: '#0a0a0a', padding: '16px 40px', borderRadius: 10, fontSize: 15, fontWeight: 700, border: 'none', cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.2,0.9,0.25,1)', boxShadow: '0 0 0 rgba(204,255,0,0)',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(204,255,0,0.3)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 0 0 rgba(204,255,0,0)'; }}
              >
                {isES ? 'Enviar mensaje' : 'Send message'}
              </button>
              <button onClick={() => setShowWhatsAppChat(true)} data-cursor="grow" style={{
                border: '1px solid rgba(255,255,255,0.15)', color: '#f5f5f2', padding: '16px 40px', borderRadius: 10, fontSize: 15, background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                transition: 'all 0.3s cubic-bezier(0.2,0.9,0.25,1)',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#25d366'; e.currentTarget.style.color = '#25d366'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = '#f5f5f2'; e.currentTarget.style.transform = ''; }}
              >
                <span style={{ fontSize: 18 }}>💬</span> {isES ? 'WhatsApp' : 'Book a call'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── SERVICE DETAIL TERMINAL (opens on click, slides in) ── */}
      {selectedService && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setSelectedService(null)}
            style={{
              position: 'fixed', inset: 0, zIndex: 300,
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(8px)',
              animation: 'v3fadeIn 0.3s ease',
              cursor: 'pointer',
            }}
          />
          {/* Service Terminal Window */}
          <div style={{
            position: 'fixed',
            top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)',
            width: '60vw', maxWidth: 800,
            maxHeight: '70vh',
            background: 'rgba(15,15,15,0.95)',
            backdropFilter: 'blur(24px)',
            borderRadius: 14,
            boxShadow: '0 0 100px rgba(204,255,0,0.08), 0 0 0 1px rgba(204,255,0,0.15)',
            zIndex: 301,
            display: 'flex', flexDirection: 'column',
            overflow: 'hidden',
            animation: 'v3slideUp 0.4s cubic-bezier(0.2, 0.9, 0.25, 1)',
          }}>
            {/* Terminal topbar */}
            <div style={{
              height: 40, padding: '0 16px',
              display: 'flex', alignItems: 'center', gap: 10,
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              background: 'rgba(255,255,255,0.02)',
              flexShrink: 0,
            }}>
              <button onClick={() => setSelectedService(null)} style={{
                width: 12, height: 12, borderRadius: '50%', background: '#ff5f57',
                border: 'none', cursor: 'pointer', padding: 0,
              }} />
              <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#ffbd2e' }} />
              <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#28c840' }} />
              <span style={{ flex: 1, textAlign: 'center', fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'rgba(245,245,242,0.4)' }}>
                tunixlabs · ~/services/<strong style={{ color: 'rgba(245,245,242,0.7)' }}>{selectedService.key}</strong>
              </span>
            </div>
            {/* Prompt */}
            <div style={{ padding: '14px 24px 0', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'rgba(245,245,242,0.5)' }}>
              <span style={{ color: '#ccff00' }}>$</span> cat ./services/{selectedService.key}/README.md
            </div>
            {/* Content */}
            <div style={{ padding: '20px 24px 28px', overflow: 'auto', flex: 1 }}>
              <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>
                {isES ? selectedService.es : selectedService.en}
              </h3>
              <p style={{ color: 'rgba(245,245,242,0.6)', lineHeight: 1.7, marginBottom: 20, fontSize: 15 }}>
                {isES ? selectedService.descEs : selectedService.descEn}
              </p>
              {/* Stack */}
              <div style={{ marginBottom: 20 }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: '#ccff00', letterSpacing: '.1em' }}>STACK</span>
                <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                  {selectedService.stack.map(s => (
                    <span key={s} style={{
                      padding: '4px 12px', borderRadius: 6, fontSize: 12,
                      background: 'rgba(204,255,0,0.08)', border: '1px solid rgba(204,255,0,0.15)',
                      fontFamily: 'JetBrains Mono, monospace', color: 'rgba(245,245,242,0.7)',
                    }}>{s}</span>
                  ))}
                </div>
              </div>
              {/* Anchor project */}
              <div style={{
                padding: '14px 18px', borderRadius: 10,
                background: 'rgba(204,255,0,0.04)', border: '1px solid rgba(204,255,0,0.1)',
              }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: '#ccff00', letterSpacing: '.1em' }}>
                  {isES ? 'PROYECTO ANCLA' : 'ANCHOR PROJECT'}
                </span>
                <p style={{ color: 'rgba(245,245,242,0.6)', fontSize: 13, marginTop: 6, lineHeight: 1.5 }}>
                  {isES ? selectedService.anchorEs : selectedService.anchorEn}
                </p>
              </div>
              {/* CTA */}
              <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
                <a href={isES ? 'https://wa.me/56930367979' : 'https://calendly.com/amoyano17/30min'}
                  target="_blank" rel="noopener noreferrer"
                  style={{ background: '#ccff00', color: '#0a0a0a', padding: '10px 24px', borderRadius: 8, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
                  {isES ? 'Hablemos de este servicio' : 'Discuss this service'}
                </a>
                <button onClick={() => setSelectedService(null)} style={{
                  border: '1px solid rgba(255,255,255,0.15)', color: '#f5f5f2', background: 'transparent',
                  padding: '10px 24px', borderRadius: 8, fontSize: 13, cursor: 'pointer',
                }}>
                  {isES ? 'Cerrar' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}



      {/* ── WHATSAPP CHAT TERMINAL (inline, no external redirect) ── */}
      {showWhatsAppChat && (
        <>
          <div onClick={() => setShowWhatsAppChat(false)} style={{
            position: 'fixed', inset: 0, zIndex: 300,
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
            animation: 'v3fadeIn 0.3s ease', cursor: 'pointer',
          }} />
          <div style={{
            position: 'fixed', top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)',
            width: '45vw', maxWidth: 520, height: '60vh', maxHeight: 500,
            background: 'rgba(15,15,15,0.95)', backdropFilter: 'blur(24px)',
            borderRadius: 14,
            boxShadow: '0 0 100px rgba(37,211,102,0.1), 0 0 0 1px rgba(37,211,102,0.2)',
            zIndex: 301, display: 'flex', flexDirection: 'column',
            overflow: 'hidden', animation: 'v3slideUp 0.4s cubic-bezier(0.2, 0.9, 0.25, 1)',
          }}>
            <div style={{
              height: 40, padding: '0 16px',
              display: 'flex', alignItems: 'center', gap: 10,
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              background: 'rgba(37,211,102,0.05)', flexShrink: 0,
            }}>
              <button onClick={() => setShowWhatsAppChat(false)} style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f57', border: 'none', cursor: 'pointer', padding: 0 }} />
              <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#ffbd2e' }} />
              <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#28c840' }} />
              <span style={{ flex: 1, textAlign: 'center', fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'rgba(37,211,102,0.6)' }}>
                whatsapp · <strong style={{ color: 'rgba(37,211,102,0.9)' }}>+56 9 3036 7979</strong>
              </span>
            </div>
            {/* Chat area */}
            <div style={{ flex: 1, padding: '16px 20px', overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* Bot greeting */}
              <div style={{ background: 'rgba(37,211,102,0.08)', borderRadius: '12px 12px 12px 2px', padding: '10px 14px', maxWidth: '80%', fontSize: 13, color: 'rgba(245,245,242,0.8)', lineHeight: 1.5 }}>
                {isES
                  ? '¡Hola! Soy Alejandro. Cuéntame sobre tu proyecto y te respondo en menos de 24 horas.'
                  : "Hi! I'm Alejandro. Tell me about your project and I'll get back to you within 24 hours."}
                <div style={{ fontSize: 10, color: 'rgba(245,245,242,0.3)', marginTop: 4, textAlign: 'right' }}>
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
            {/* Input */}
            <form onSubmit={(e) => {
              e.preventDefault();
              if (!chatMsg.trim()) return;
              const encoded = encodeURIComponent(chatMsg);
              window.open(`https://wa.me/56930367979?text=${encoded}`, '_blank');
              setShowWhatsAppChat(false);
            }} style={{
              padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.06)',
              display: 'flex', gap: 10, flexShrink: 0,
            }}>
              <input
                type="text" value={chatMsg} onChange={e => setChatMsg(e.target.value)}
                placeholder={isES ? 'Escribe tu mensaje...' : 'Type your message...'}
                autoFocus
                style={{
                  flex: 1, padding: '10px 14px', borderRadius: 8,
                  background: 'rgba(245,245,242,0.04)', border: '1px solid rgba(245,245,242,0.08)',
                  color: '#f5f5f2', fontSize: 14, outline: 'none', fontFamily: 'inherit',
                }}
              />
              <button type="submit" style={{
                background: '#25D366', color: '#fff', border: 'none',
                padding: '10px 20px', borderRadius: 8, fontSize: 13,
                fontWeight: 700, cursor: 'pointer',
              }}>
                {isES ? 'Enviar' : 'Send'}
              </button>
            </form>
          </div>
        </>
      )}

      {/* ── CONTACT FORM TERMINAL (opens as popup) ── */}
      {showContactForm && (
        <>
          <div onClick={() => setShowContactForm(false)} style={{
            position: 'fixed', inset: 0, zIndex: 300,
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
            animation: 'v3fadeIn 0.3s ease', cursor: 'pointer',
          }} />
          <div style={{
            position: 'fixed', top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)',
            width: '50vw', maxWidth: 600, maxHeight: '75vh',
            background: 'rgba(15,15,15,0.95)', backdropFilter: 'blur(24px)',
            borderRadius: 14,
            boxShadow: '0 0 100px rgba(204,255,0,0.08), 0 0 0 1px rgba(204,255,0,0.15)',
            zIndex: 301, display: 'flex', flexDirection: 'column',
            overflow: 'hidden', animation: 'v3slideUp 0.4s cubic-bezier(0.2, 0.9, 0.25, 1)',
          }}>
            {/* Topbar */}
            <div style={{
              height: 40, padding: '0 16px',
              display: 'flex', alignItems: 'center', gap: 10,
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              background: 'rgba(255,255,255,0.02)', flexShrink: 0,
            }}>
              <button onClick={() => setShowContactForm(false)} style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f57', border: 'none', cursor: 'pointer', padding: 0 }} />
              <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#ffbd2e' }} />
              <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#28c840' }} />
              <span style={{ flex: 1, textAlign: 'center', fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'rgba(245,245,242,0.4)' }}>
                tunixlabs · ~/<strong style={{ color: 'rgba(245,245,242,0.7)' }}>contact</strong>
              </span>
            </div>
            {/* Prompt */}
            <div style={{ padding: '14px 24px 0', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'rgba(245,245,242,0.5)' }}>
              <span style={{ color: '#ccff00' }}>$</span> ./send-message --to=alejandro
            </div>
            {/* Form */}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setFormStatus('sending');
                const fd = new FormData(e.currentTarget);
                try {
                  const res = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      nombre: fd.get('nombre'),
                      email: fd.get('email'),
                      asunto: fd.get('asunto') || 'Contacto desde tunixlabs.com',
                      mensaje: fd.get('mensaje'),
                    }),
                  });
                  if (res.ok) {
                    setFormStatus('sent');
                    setTimeout(() => { setShowContactForm(false); setFormStatus('idle'); }, 2000);
                  } else {
                    setFormStatus('error');
                  }
                } catch { setFormStatus('error'); }
              }}
              style={{ padding: '20px 24px 28px', display: 'flex', flexDirection: 'column', gap: 14, flex: 1, overflow: 'auto' }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'rgba(245,245,242,0.4)', display: 'block', marginBottom: 6 }}>
                    {isES ? 'NOMBRE' : 'NAME'}
                  </label>
                  <input type="text" name="nombre" required placeholder={isES ? 'Tu nombre' : 'Your name'} style={{
                    width: '100%', padding: '10px 14px', borderRadius: 8,
                    background: 'rgba(245,245,242,0.04)', border: '1px solid rgba(245,245,242,0.08)',
                    color: '#f5f5f2', fontSize: 14, outline: 'none',
                    fontFamily: 'inherit',
                  }} />
                </div>
                <div>
                  <label style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'rgba(245,245,242,0.4)', display: 'block', marginBottom: 6 }}>EMAIL</label>
                  <input type="email" name="email" required placeholder="your@email.com" style={{
                    width: '100%', padding: '10px 14px', borderRadius: 8,
                    background: 'rgba(245,245,242,0.04)', border: '1px solid rgba(245,245,242,0.08)',
                    color: '#f5f5f2', fontSize: 14, outline: 'none',
                    fontFamily: 'inherit',
                  }} />
                </div>
              </div>
              <div>
                <label style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'rgba(245,245,242,0.4)', display: 'block', marginBottom: 6 }}>
                  {isES ? 'ASUNTO' : 'SUBJECT'}
                </label>
                <input type="text" name="asunto" placeholder={isES ? '¿De qué quieres hablar?' : 'What would you like to discuss?'} style={{
                  width: '100%', padding: '10px 14px', borderRadius: 8,
                  background: 'rgba(245,245,242,0.04)', border: '1px solid rgba(245,245,242,0.08)',
                  color: '#f5f5f2', fontSize: 14, outline: 'none',
                  fontFamily: 'inherit',
                }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'rgba(245,245,242,0.4)', display: 'block', marginBottom: 6 }}>
                  {isES ? 'MENSAJE' : 'MESSAGE'}
                </label>
                <textarea name="mensaje" required rows={4} placeholder={isES ? 'Cuéntame tu idea o proyecto...' : 'Tell me about your idea or project...'} style={{
                  width: '100%', padding: '10px 14px', borderRadius: 8,
                  background: 'rgba(245,245,242,0.04)', border: '1px solid rgba(245,245,242,0.08)',
                  color: '#f5f5f2', fontSize: 14, outline: 'none', resize: 'vertical',
                  fontFamily: 'inherit', minHeight: 80,
                }} />
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button type="submit" disabled={formStatus === 'sending' || formStatus === 'sent'} style={{
                  background: formStatus === 'sent' ? '#22c55e' : formStatus === 'error' ? '#ef4444' : '#ccff00',
                  color: formStatus === 'sent' || formStatus === 'error' ? '#fff' : '#0a0a0a',
                  padding: '12px 28px', borderRadius: 8,
                  fontSize: 14, fontWeight: 700, border: 'none',
                  cursor: formStatus === 'sending' ? 'wait' : 'pointer',
                  opacity: formStatus === 'sending' ? 0.7 : 1,
                }}>
                  {formStatus === 'sending' ? (isES ? 'Enviando...' : 'Sending...') :
                   formStatus === 'sent' ? (isES ? 'Enviado ✓' : 'Sent ✓') :
                   formStatus === 'error' ? (isES ? 'Error — reintentar' : 'Error — retry') :
                   (isES ? 'Enviar mensaje' : 'Send message')}
                </button>
                <button type="button" onClick={() => setShowContactForm(false)} style={{
                  border: '1px solid rgba(255,255,255,0.15)', color: '#f5f5f2',
                  background: 'transparent', padding: '12px 28px', borderRadius: 8,
                  fontSize: 14, cursor: 'pointer',
                }}>
                  {isES ? 'Cerrar' : 'Close'}
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* ── RIVE BURST TRANSITION (anime-style speed lines) ── */}
      <BurstTransition fire={transitioning} />

      {/* ── ASIDE TERMINAL (appears during About) ── */}
      <div style={{
        position: 'fixed',
        top: '50%', right: '4vw',
        transform: isAbout ? 'translateY(-50%) scale(1)' : 'translateY(-50%) scale(0.9) translateX(40px)',
        width: '22vw', maxWidth: 340,
        height: '50vh', maxHeight: 500,
        background: 'rgba(10,10,10,0.95)',
        backdropFilter: 'blur(16px)',
        borderRadius: 12,
        boxShadow: '0 0 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)',
        zIndex: 99,
        opacity: isAbout ? 1 : 0,
        pointerEvents: isAbout ? 'auto' : 'none',
        transition: 'all 0.9s cubic-bezier(0.2, 0.9, 0.25, 1)',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* Aside topbar */}
        <div style={{
          height: 36, padding: '0 14px',
          display: 'flex', alignItems: 'center', gap: 8,
          borderBottom: '1px solid rgba(255,255,255,0.04)',
          background: 'rgba(255,255,255,0.02)',
          flexShrink: 0,
        }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#555' }} />
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#555' }} />
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#555' }} />
          <span style={{ flex: 1, textAlign: 'center', fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: 'rgba(245,245,242,0.3)' }}>credentials</span>
        </div>
        {/* Aside content */}
        <div style={{ padding: '16px 18px', fontFamily: 'JetBrains Mono, monospace', fontSize: 11, lineHeight: 2, color: 'rgba(245,245,242,0.5)', flex: 1 }}>
          <div style={{ opacity: isAbout ? 1 : 0, transition: 'opacity 0.4s ease 0.3s' }}>
            <span style={{ color: '#ccff00' }}>$</span> cat credentials.txt<br />
            <br />
            <span style={{ color: '#f5f5f2' }}>MSc Finanzas</span> — UAI<br />
            <span style={{ color: '#f5f5f2' }}>MIT Professional Ed</span> — AI/ML<br />
            <span style={{ color: '#f5f5f2' }}>15 {isES ? 'años' : 'years'} ops</span> — {isES ? 'antes de codear' : 'before code'}<br />
            <span style={{ color: '#f5f5f2' }}>7 {isES ? 'sistemas' : 'systems'}</span> — {isES ? 'en producción' : 'in production'}<br />
            <span style={{ color: '#f5f5f2' }}>Claude Code</span> — {isES ? 'workflows agénticos' : 'agentic workflows'}<br />
            <br />
            <span style={{ color: '#ccff00' }}>$</span> <span style={{ display: 'inline-block', width: 6, height: 12, background: '#ccff00', animation: 'v3blink .8s steps(2) infinite' }} />
          </div>
        </div>
      </div>

      {/* ── SCROLL HINT ── */}
      {isHero && (
        <div style={{
          position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
          zIndex: 150, fontFamily: 'JetBrains Mono, monospace', fontSize: 9,
          color: 'rgba(245,245,242,0.25)', textAlign: 'center',
          animation: 'v3float 2s ease-in-out infinite',
        }}>
          SCROLL<div style={{ marginTop: 4 }}>↓</div>
        </div>
      )}

      {/* ── SCROLL NAV DOTS ── */}
      <div style={{
        position: 'fixed', right: 24, top: '50%', transform: 'translateY(-50%)',
        zIndex: 150, display: 'flex', flexDirection: 'column', gap: 6,
      }}>
        {SECTIONS.map(s => {
          const isActive = active === s;
          return (
            <a key={s} href={`#sec-${s}`} aria-label={s} style={{
              width: isActive ? 10 : 6, height: isActive ? 10 : 6,
              borderRadius: '50%',
              background: isActive ? '#ccff00' : 'rgba(245,245,242,0.2)',
              boxShadow: isActive ? '0 0 8px rgba(204,255,0,0.5)' : 'none',
              transition: 'all 0.4s cubic-bezier(0.2, 0.9, 0.25, 1)',
              display: 'block',
            }} />
          );
        })}
      </div>

      {/* ══════════════════════════════════════════════════════
          SCROLL DRIVER — invisible sections that drive content
          ══════════════════════════════════════════════════════ */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div data-section="hero" id="sec-hero" style={{ height: '120vh' }} />
        {cases.map((_, i) => (
          <div key={i} data-section={`case${i}`} id={`sec-case${i}`} style={{ height: '110vh' }} />
        ))}
        <div data-section="services" id="sec-services" style={{ height: '110vh' }} />
        <div data-section="about" id="sec-about" style={{ height: '110vh' }} />
        <div data-section="contact" id="sec-contact" style={{ height: '110vh' }} />
      </div>

      {/* ── FOOTER ── */}
      <footer style={{
        position: 'relative', zIndex: 1,
        padding: '24px 32px',
        display: 'flex', justifyContent: 'space-between',
        fontSize: 11, color: 'rgba(245,245,242,0.2)',
        borderTop: '1px solid rgba(255,255,255,0.04)',
      }}>
        <span>© 2026 TunixLabs</span>
        <a href="https://linkedin.com/in/alejandro-moyano/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>LinkedIn</a>
      </footer>

    </>
  );
}
