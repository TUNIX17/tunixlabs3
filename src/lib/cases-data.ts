// Tunix Labs — 7 production cases.
// Copy reuses v3/page.tsx CASES_ES/CASES_EN (problem/solution inferred from desc + verified project realities).
// Image paths reflect real assets under /public/cases/<slug>/ (gasco preserves legacy /case-studies/ path).

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
    titleEs: 'Tesoreros cobran cuotas por WhatsApp.',
    titleEn: 'School fee collection via WhatsApp.',
    role: 'Lead engineer',
    stack: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL', 'WhatsApp Cloud API'],
    dateEs: 'Enero 2025',
    dateEn: 'January 2025',
    problemEs: 'Los tesoreros de centros de padres perdian horas cada mes reconciliando transferencias en Excel, perseguian comprobantes por grupos de WhatsApp y cerraban el mes sin saber quien debia cuanto.',
    problemEn: 'Parent-association treasurers lost hours every month reconciling transfers in spreadsheets, chased receipts across WhatsApp groups, and closed each month without knowing who owed what.',
    solutionEs: 'SaaS multi-tenant donde los padres envian la foto del comprobante por WhatsApp, una IA lee el monto, lo concilia contra la cuota y confirma el pago automaticamente. Un dashboard para tesoreros y estado de cuenta en vivo para cada apoderado.',
    solutionEn: 'Multi-tenant SaaS where parents send the receipt photo via WhatsApp, AI reads the amount, reconciles it against the fee, and confirms the payment automatically. Treasurer dashboard and live balance for every parent.',
    metrics: [
      { label: 'Verificacion', value: 'Automatica' },
      { label: 'Canal primario', value: 'WhatsApp' },
      { label: 'Integracion pagos', value: 'Khipu + Stripe' },
    ],
    images: ['/cases/apoderapp/01.webp'],
    serviceSlug: 'desarrollos-web',
  },
  {
    slug: 'fernandez',
    titleEs: 'Transformacion digital de una maestranza.',
    titleEn: 'Digital transformation of an industrial workshop.',
    role: 'Sitio + CMS',
    stack: ['Next.js', 'Payload', 'Vercel'],
    dateEs: 'Noviembre 2024',
    dateEn: 'November 2024',
    problemEs: 'Una maestranza con 50 anos de historia seguia operando con facturas en papel, herramientas sin trazabilidad y un sitio institucional estancado. La identidad digital no reflejaba la escala del negocio.',
    problemEn: '50 years of industrial-workshop history still ran on paper invoices, untracked tools, and a stale institutional site. The digital identity did not match the scale of the business.',
    solutionEs: 'Rediseno completo del sitio con CMS headless para el equipo interno, OCR que lee facturas de proveedores, QR fisico para identificar herramientas y IA que extrae datos estructurados desde documentos escaneados.',
    solutionEn: 'Full site redesign with a headless CMS for the internal team, OCR that reads supplier invoices, physical QR tagging for tools, and AI that extracts structured data from scanned documents.',
    metrics: [
      { label: 'Historia migrada', value: '50 anos' },
      { label: 'Scope', value: 'Sitio + OCR + QR' },
    ],
    images: ['/cases/fernandez/01.webp', '/cases/fernandez/02.webp'],
    serviceSlug: 'desarrollos-web',
  },
  {
    slug: 'schwager',
    titleEs: 'Operarios llenan formularios hablando.',
    titleEn: 'Workers fill safety forms by talking.',
    role: 'RPA + backend',
    stack: ['Playwright', 'Node', 'Docker', 'Railway'],
    dateEs: 'Agosto 2025',
    dateEn: 'August 2025',
    problemEs: 'Operarios mineros con guantes, bajo lluvia y sin senal debian rellenar formularios de seguridad en papel o en apps tactiles imposibles de usar en terreno. La data llegaba tarde, incompleta y en baja calidad.',
    problemEn: 'Mining field workers in gloves, under rain, with no signal had to fill safety forms on paper or touch apps that were impossible to use on-site. Data arrived late, incomplete, and of low quality.',
    solutionEs: 'Voice AI sobre Google Gemini que permite llenar formularios solo hablando, con latencia bajo 100ms y colas offline que sincronizan cuando vuelve la senal. RPA en el backoffice empuja los datos al ERP del cliente.',
    solutionEn: 'Voice AI on Google Gemini lets workers fill the forms by speaking, with sub-100ms latency and offline queues that sync when signal returns. Backoffice RPA pushes the data into the client ERP.',
    metrics: [
      { label: 'Operarios activos', value: '195+' },
      { label: 'Latencia voz', value: '<100 ms' },
      { label: 'Modo offline', value: 'Si' },
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
    titleEs: '4,000 hojas de ruta digitales al dia.',
    titleEn: '4,000 digital route sheets per day.',
    role: 'Backend + dashboards',
    stack: ['Next.js', 'Prisma', 'MySQL', 'Railway'],
    dateEs: 'Marzo 2025',
    dateEn: 'March 2025',
    problemEs: 'El sistema legacy de mantenimiento minero imprimia 4.000 hojas de ruta diarias, exigia firmas en papel, trasladaba supervisores para aprobar y auditaba manualmente a fin de mes. Cero visibilidad operacional en vivo.',
    problemEn: 'The legacy mining-maintenance system printed 4,000 route sheets per day, required paper signatures, relied on supervisors traveling to approve, and audited manually end-of-month. Zero live operational visibility.',
    solutionEs: 'Reemplazo completo del legacy con una app con QR en terreno, aprobacion movil para supervisores, auditoria automatica y dashboards KPI. 19.000 ordenes migradas y cero papel en faena.',
    solutionEn: 'Full legacy replacement: on-site QR, mobile supervisor approval, automated audit trail, and KPI dashboards. 19,000 work orders migrated and zero paper in the field.',
    metrics: [
      { label: 'Rutas por dia', value: '4.000' },
      { label: 'OTs migradas', value: '19K' },
      { label: 'Papel en faena', value: 'Cero' },
    ],
    images: ['/cases/sime/01.webp', '/cases/sime/02.webp'],
    serviceSlug: 'business-intelligence',
  },
  {
    slug: 'gasco',
    titleEs: 'De 5 min por codigo a 30 segundos.',
    titleEn: 'From 5 min per code to 30 seconds.',
    role: 'Bot conversacional',
    stack: ['Node', 'WhatsApp Cloud API', 'Postgres'],
    dateEs: 'Junio 2025',
    dateEn: 'June 2025',
    problemEs: 'Los repartidores de gas dependian de una aplicacion interna lenta para quemar codigos tras cada entrega. Perdian hasta cinco minutos por entrega, y los codigos sin quemar eran auditoria manual al final del dia.',
    problemEn: 'Gas drivers relied on a slow internal app to burn codes after each delivery. They lost up to five minutes per delivery, and unburned codes became manual end-of-day audit work.',
    solutionEs: 'Bot conversacional por WhatsApp: el repartidor envia la foto del codigo, el bot lo lee, valida contra la base de datos y lo quema en 30 segundos. Sin app que instalar, sin friccion.',
    solutionEn: 'Conversational WhatsApp bot: the driver sends a photo of the code, the bot reads it, validates against the database and burns it in 30 seconds. No app to install, zero friction.',
    metrics: [
      { label: 'Tiempo por codigo', value: '30 s' },
      { label: 'Reduccion vs. legacy', value: '10x' },
      { label: 'Repartidores en ruta', value: '14' },
    ],
    images: ['/case-studies/bot-gas-distribution.png'],
    serviceSlug: 'asistentes-ia',
  },
  {
    slug: 'soma',
    titleEs: 'Dashboards KPI que reemplazan 50 Excel.',
    titleEn: 'BI dashboards replacing 50 spreadsheets.',
    role: 'Plataforma integral',
    stack: ['Next.js', 'Prisma', 'Postgres', 'pgvector'],
    dateEs: 'Septiembre 2025',
    dateEn: 'September 2025',
    problemEs: 'Los directores de operaciones de una minera mantenian 50 planillas Excel paralelas para seguir KPIs. La data llegaba desfasada, habia versiones divergentes y no habia alertas en tiempo real.',
    problemEn: 'Mining ops directors kept 50 parallel spreadsheets to track KPIs. Data was stale, versions diverged, and there were no real-time alerts.',
    solutionEs: 'Plataforma BI con data de SAP sincronizada, dashboards operacionales y ejecutivos, alertas en tiempo real y busqueda semantica sobre documentos tecnicos con pgvector. Los directores la revisan antes del cafe.',
    solutionEn: 'BI platform with SAP-synced data, operational and executive dashboards, real-time alerts, and semantic search over technical docs with pgvector. Ops directors check it before coffee.',
    metrics: [
      { label: 'Excel reemplazados', value: '50' },
      { label: 'Fuente de verdad', value: 'SAP sync' },
      { label: 'Alertas', value: 'Tiempo real' },
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
    titleEs: 'Profesor + avatar AI con copiloto.',
    titleEn: 'Teacher + AI avatar with copilot.',
    role: 'IA coach de ingles',
    stack: ['Next.js', 'OpenAI', 'LiveKit', 'Deepgram'],
    dateEs: 'Octubre 2025',
    dateEn: 'October 2025',
    problemEs: 'Las plataformas de ingles tradicionales o son 100% humanas (caras, no escalan) o 100% AI (sin guia real). Ninguna acompana al profesor en tiempo real ni adapta la progresion del alumno.',
    problemEn: 'Traditional English platforms are either 100% human (expensive, do not scale) or 100% AI (no real guidance). Neither supports the teacher in real time nor adapts the student\u2019s progression.',
    solutionEs: 'Plataforma con copiloto AI que asiste al profesor en clase, avatares conversacionales con voz realista para practica libre, progresion adaptativa por alumno y cero friccion en login. Profesor y AI en la misma clase.',
    solutionEn: 'Platform with an AI copilot assisting the teacher during class, conversational avatars with realistic voice for free practice, adaptive per-student progression, and zero login friction. Teacher and AI in the same class.',
    metrics: [
      { label: 'Stack', value: 'Voice + avatar' },
      { label: 'Progresion', value: 'Adaptativa' },
      { label: 'Asistencia profesor', value: 'Tiempo real' },
    ],
    images: ['/cases/speakly/01.webp', '/cases/speakly/02.webp'],
    serviceSlug: 'asistentes-ia',
  },
];
