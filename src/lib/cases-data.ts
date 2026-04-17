// Tunix Labs — 7 production cases.
// Source of truth: src/messages/{es,en}.json (cards + productShowcase) + verified
// project code (CLAUDE.md + package.json + schema.prisma) for the two cases not
// listed in i18n: soma and speakly.
// Stacks, metrics and client descriptions are intentionally kept consistent
// across this file and messages/*.json — any divergence is a bug.
// Image paths reflect real assets under /public/cases/<slug>/ (gasco preserves
// legacy /case-studies/ path).

export interface Case {
  slug: string;
  titleEs: string;
  titleEn: string;
  role: string;
  stack: string[];
  dateEs: string;
  dateEn: string;
  problemEs: string;
  problemEn: string;
  solutionEs: string;
  solutionEn: string;
  metrics: { label: string; value: string }[];
  images: string[];
  serviceSlug: string;
}

export const CASES: Case[] = [
  {
    slug: 'apoderapp',
    titleEs: 'Centros de padres sin Excel ni WhatsApp groups.',
    titleEn: 'Parent associations out of spreadsheets and WhatsApp.',
    role: 'Producto propio',
    stack: ['Next.js', 'React', 'Prisma', 'SII XML/CAF', 'Claude Code'],
    dateEs: 'En producción',
    dateEn: 'In production',
    problemEs: 'Los centros de padres de colegios chilenos no tenían canal digital para cuotas, pagos y votaciones: todo corría en Excel y grupos de WhatsApp, y cerrar el mes era perseguir comprobantes mano a mano.',
    problemEn: 'Chilean parent-teacher associations had no digital channel for fees, payments or voting — everything ran on spreadsheets and WhatsApp, and closing the month meant chasing receipts by hand.',
    solutionEs: 'PWA construida con pipelines de agentic coding sobre Claude Code y una arquitectura de 5 agentes especializados. Como feature de compliance, incluye una librería sii-factura reusable (facturación electrónica chilena con 88+ tests), pero el core es la gestión del centro de padres. Diseñada para escalar a LATAM.',
    solutionEn: 'PWA built end-to-end with agentic coding pipelines on Claude Code and a 5-agent multi-agent architecture. Ships with a reusable sii-factura library (Chilean electronic invoicing, 88+ tests) as a compliance feature; the core value is association management. Designed for LATAM-wide expansion.',
    metrics: [
      { label: 'Agentes Claude Code', value: '5' },
      { label: 'Tests sii-factura', value: '88+' },
      { label: 'Estado', value: 'PWA en producción' },
    ],
    images: ['/cases/apoderapp/01.webp'],
    serviceSlug: 'desarrollos-web',
  },
  {
    slug: 'fernandez',
    titleEs: 'ERP que reemplazó Excel área por área.',
    titleEn: 'ERP that replaced Excel area by area.',
    role: 'ERP full-stack',
    stack: ['Next.js', 'Prisma', 'PostgreSQL', 'Claude Code', 'SII XML'],
    dateEs: 'En producción',
    dateEn: 'In production',
    problemEs: 'Una empresa metalúrgica de 50 años operaba toda la compañía en Excel —RRHH, asistencia, finanzas, control de proyectos, CRM— durante la ausencia de los dueños, sin un ERP que reflejara el estado real del negocio.',
    problemEn: 'A 50-year-old metallurgic company ran its entire operation on Excel — HR, attendance, finance, document management, project control, CRM — during a period when the owners were absent and operational continuity was at risk.',
    solutionEs: 'ERP custom con IA que reemplazó el Excel en cada área crítica. Pipelines de OCR, QR y LLM Vision para digitalizar documentos en planta, integración completa con el SII para facturación electrónica y módulo de control de proyectos pensado para metalurgia, no para SaaS. Lideré la transformación digital end-to-end durante el desarrollo.',
    solutionEn: 'Custom AI-powered ERP that replaced Excel across every critical area. OCR, QR and LLM Vision pipelines for on-floor document digitization, full Chilean SII integration for invoicing and tax compliance, and a project control module built for metallurgy, not for SaaS. Led the end-to-end digital transformation while the owners were away.',
    metrics: [
      { label: 'Tipo', value: 'ERP full-stack' },
      { label: 'Digitalización', value: 'OCR + QR + LLM Vision' },
      { label: 'SII', value: 'Integrado' },
    ],
    images: ['/cases/fernandez/01.webp', '/cases/fernandez/02.webp'],
    serviceSlug: 'desarrollos-web',
  },
  {
    slug: 'schwager',
    titleEs: 'Operarios llenan formularios de seguridad hablando.',
    titleEn: 'Workers fill safety forms by talking.',
    role: 'Voice AI mobile + RPA',
    stack: ['React', 'TypeScript', 'PostgreSQL', 'Google Gemini', 'Capacitor'],
    dateEs: 'En producción',
    dateEn: 'In production',
    problemEs: 'Operarios mineros con guantes, bajo lluvia y con conectividad intermitente debían completar firmas legales de mantención en papel. Los formularios se extraviaban antes de llegar a auditoría, los supervisores gastaban horas persiguiendo aprobaciones y los exports SAP con órdenes canceladas se colaban sin detectar.',
    problemEn: 'Legal maintenance sign-offs collected on paper at remote mining field sites with intermittent connectivity. Forms were lost before reaching audit, supervisors spent hours chasing approvals, and SAP exports of cancelled work orders slipped through.',
    solutionEs: 'App móvil offline-first (iOS + Android) con Voice AI sobre Google Gemini: los operarios completan formularios de seguridad solo hablando, sin sacarse los guantes. Firma multicanal (email, WhatsApp, web, mobile) con audit trail completo y un parser inteligente de exports SAP que detecta órdenes canceladas automáticamente.',
    solutionEn: 'Offline-first mobile app (iOS + Android) with Voice AI powered by Google Gemini — field workers complete safety forms hands-free in gloves, rain, and vibration. Multi-channel digital signatures (email, WhatsApp, web, mobile) with full audit trail, and a smart Excel parser that reads SAP exports and detects cancelled work orders automatically.',
    metrics: [
      { label: 'Operarios en faena', value: '195+' },
      { label: 'Rutas diarias', value: '4,000+' },
      { label: 'Tiempo de respuesta', value: '<100 ms' },
    ],
    images: [
      '/cases/schwager/01.webp',
      '/cases/schwager/02.webp',
      '/cases/schwager/03.webp',
      '/cases/schwager/04.webp',
    ],
    serviceSlug: 'rpa',
  },
  {
    slug: 'sime',
    titleEs: '19,778 órdenes de trabajo digitalizadas.',
    titleEn: '19,778 work orders, fully digital.',
    role: 'Plataforma minera',
    stack: ['Turborepo', 'Fastify', 'React', 'PostgreSQL', 'AWS S3'],
    dateEs: 'En producción',
    dateEn: 'In production',
    problemEs: 'Pautas de seguridad, mantenciones preventivas y órdenes de trabajo corrían en papel y planillas a través de operaciones mineras críticas en Chile, sin trazabilidad digital entre la faena y la oficina central.',
    problemEn: 'Safety inspections, preventive maintenance plans and work orders were tracked on paper and spreadsheets across remote mining sites, with no end-to-end digital audit trail between the field and the head office.',
    solutionEs: 'Reemplazo completo del sistema legacy: 1,056 pautas de seguridad, checklists por actividad, PDFs firmados con QR archivados en AWS S3, aprobaciones móviles vía links compartibles, navegación histórica de KPIs y auditoría completa por turno minero.',
    solutionEn: 'Full rebuild of an aging legacy system into a modern TypeScript platform. Every legacy feature preserved, plus QR-signed PDFs archived on AWS S3, mobile-friendly batch approvals via shareable links, KPI dashboards with historical navigation, and period comparisons built around mining shift cycles.',
    metrics: [
      { label: 'Órdenes de trabajo', value: '19,778' },
      { label: 'Actividades', value: '115K+' },
      { label: 'Pautas de seguridad', value: '1,056' },
    ],
    images: ['/cases/sime/01.webp', '/cases/sime/02.webp'],
    serviceSlug: 'business-intelligence',
  },
  {
    slug: 'gasco',
    titleEs: '4,040 códigos procesados al 88.7% de éxito.',
    titleEn: '4,040 codes processed at 88.7% success.',
    role: 'Bot de procesamiento',
    stack: ['Express', 'Prisma', 'React', 'PostgreSQL'],
    dateEs: 'En producción',
    dateEn: 'In production',
    problemEs: 'Una distribuidora regional de gas validaba manualmente los códigos de quema en 14 rutas de reparto, con errores de transcripción diarios y horas de re-proceso antes de facturar.',
    problemEn: 'A regional gas distribution operator validated burn codes by hand across 14 delivery routes, with daily transcription errors and hours of rework before billing.',
    solutionEs: 'Bot de procesamiento automático con validación contra reglas de negocio, dashboard de métricas por ruta y reportería diaria. Stack commodity en su propia infra, cero licenciamiento enterprise.',
    solutionEn: 'Automated code processing bot with business-rule validation, per-route metrics dashboard and daily reporting. Commodity stack, no enterprise licensing lock-in.',
    metrics: [
      { label: 'Códigos procesados', value: '4,040' },
      { label: 'Tasa de éxito', value: '88.7%' },
      { label: 'Rutas automatizadas', value: '14' },
    ],
    images: ['/case-studies/bot-gas-distribution.png'],
    serviceSlug: 'rpa',
  },
  {
    slug: 'soma',
    titleEs: 'KPI de mantenimiento minero desde Excel de SAP.',
    titleEn: 'Mining maintenance KPIs straight from SAP Excel.',
    role: 'Plataforma BI',
    stack: ['React', 'TypeScript', 'Vite', 'Express', 'Prisma', 'PostgreSQL'],
    dateEs: 'En producción',
    dateEn: 'In production',
    problemEs: 'Los equipos de operaciones en gran minería necesitaban ver KPIs de mantenimiento —OEE, MTBF, MTTR, disponibilidad, CAUE— pero solo disponían de exports Excel de SAP PM (IH01, IW21-39, IP10-18, IL03), sin conexión directa al ERP.',
    problemEn: 'Mining ops teams needed maintenance KPIs — OEE, MTBF, MTTR, availability, CAUE — but only had Excel exports from SAP PM (IH01, IW21-39, IP10-18, IL03) with no direct ERP connection.',
    solutionEs: 'Plataforma que ingiere los exports Excel de SAP PM, normaliza la data y calcula KPI siguiendo la metodología SOMA de 8 fases (A–H) del ciclo de mantenimiento. Dashboards interactivos para directores de operaciones, con comparativas históricas y matrices de criticidad ABC.',
    solutionEn: 'Platform that ingests SAP PM Excel exports, normalizes the data and computes KPIs following the SOMA 8-phase (A–H) maintenance lifecycle. Interactive dashboards for ops directors with historical comparisons and ABC criticality matrices.',
    metrics: [
      { label: 'KPI set', value: 'OEE · MTBF · MTTR · CAUE' },
      { label: 'Metodología', value: 'SOMA 8 fases' },
      { label: 'Fuente de datos', value: 'SAP PM Excel' },
    ],
    images: [
      '/cases/soma/01.webp',
      '/cases/soma/02.webp',
      '/cases/soma/03.webp',
      '/cases/soma/04.webp',
      '/cases/soma/05.webp',
      '/cases/soma/06.webp',
    ],
    serviceSlug: 'business-intelligence',
  },
  {
    slug: 'speakly',
    titleEs: 'Inglés 24/7: profesor humano, copiloto IA y avatar 3D.',
    titleEn: 'English 24/7: human teacher, AI copilot and 3D avatar.',
    role: 'Producto propio',
    stack: ['Next.js 14', 'LiveKit', 'OpenAI GPT-4o', 'Deepgram Nova-2', 'OpenAI TTS', 'Turborepo'],
    dateEs: 'En desarrollo',
    dateEn: 'In development',
    problemEs: 'Las plataformas de inglés tradicionales son o 100% humanas (caras, no escalan) o 100% IA (sin guía real). Ninguna acompaña al profesor en vivo durante la clase ni ofrece práctica disponible 24/7 con calidad conversacional realista.',
    problemEn: 'Traditional English platforms are either 100% human (expensive, do not scale) or 100% AI (no real guidance). Neither supports the teacher in real time during class, nor offers 24/7 practice with realistic conversational quality.',
    solutionEs: 'Plataforma con cuatro modos: profesor humano con copiloto IA en clase, avatar 3D conversacional para práctica libre, pizarra colaborativa (Tldraw + Yjs) y test CEFR con OpenAI Realtime. Pipeline STT→LLM→TTS sobre Deepgram Nova-2, GPT-4o y OpenAI TTS para latencia de práctica libre.',
    solutionEn: 'Platform with four modes: human teacher with in-class AI copilot, 3D conversational avatar for free practice, collaborative whiteboard (Tldraw + Yjs) and CEFR test on OpenAI Realtime. STT→LLM→TTS pipeline over Deepgram Nova-2, GPT-4o and OpenAI TTS for low-latency free practice.',
    metrics: [
      { label: 'Modos', value: 'Humano · Avatar · Pizarra · Test' },
      { label: 'Voice stack', value: 'GPT-4o + Deepgram + TTS' },
      { label: 'Test de nivel', value: 'CEFR Realtime' },
    ],
    images: ['/cases/speakly/01.webp', '/cases/speakly/02.webp'],
    serviceSlug: 'asistentes-ia',
  },
];
