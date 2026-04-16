/**
 * SERVICE_FAQS — canonical Q&A corpus per service slug, per locale.
 *
 * Why a typed const instead of i18n:
 * -----------------------------------
 * The FAQs ship as FAQPage JSON-LD, not as visible UI. Putting them in the
 * i18n tree would force next-intl to hydrate them into the client bundle and
 * make every edit a JSON round-trip. Here they live as a typed module that
 * server components and the client ServiceLayout wrappers can both import.
 *
 * Voice guidelines:
 * - ES targets LATAM buyers (Chile/LATAM enterprise): directo, sin anglicismos
 *   innecesarios, con precios en USD y referencias regulatorias locales.
 * - EN targets US/nearshore buyers: professional, compliance-aware (SOC2, data
 *   residency), pricing model framed against typical US agency cost.
 * - Answers are 1–3 sentences, concrete, reference real tools (WhatsApp Cloud
 *   API, Playwright, Dataiku, Next.js, Prisma, pgvector, YOLO, etc.).
 * - No vaporware. No name-dropping of client brands protected by NDA.
 */

export type Faq = { question: string; answer: string };
export type LocaleFaqs = { es: Faq[]; en: Faq[] };

export const SERVICE_FAQS: Record<string, LocaleFaqs> = {
  'asistentes-ia': {
    es: [
      {
        question: '¿Que es un asistente de IA Tunix?',
        answer:
          'Un agente conversacional (voz o texto) construido sobre LLMs frontera como Claude o Gemini, integrado al backend del cliente con herramientas y memoria explicitas. No usamos Dialogflow ni Rasa: orquestamos el modelo sobre tu stack actual.',
      },
      {
        question: '¿Se integra con WhatsApp Business?',
        answer:
          'Si. Conectamos via WhatsApp Cloud API oficial (Meta) con numero verificado, templates HSM aprobados y webhooks que enrutan mensajes a tu backend. Tambien soportamos Telegram, web widget y telefonia SIP para voice AI.',
      },
      {
        question: '¿Como maneja la privacidad de datos?',
        answer:
          'Los datos nunca se envian a entrenamiento del modelo (Claude y Gemini tienen flags de opt-out por API). Guardamos conversaciones en tu base Postgres o en la nuestra cifrada, segun eligas. Cumplimos Ley 19.628 (Chile) y soportamos residencia de datos regional.',
      },
      {
        question: '¿Que idiomas soporta?',
        answer:
          'Los LLMs frontera manejan espanol neutro, espanol de Chile, ingles y portugues con la misma calidad. Podemos forzar el idioma por sesion o dejar que el modelo detecte el idioma del usuario y responda en el mismo.',
      },
      {
        question: '¿En cuanto tiempo se despliega?',
        answer:
          'Un MVP conversacional con 2-3 herramientas conectadas toma 4 a 6 semanas. Un asistente de voz con SIP, transcripcion en tiempo real y handoff a humano toma 8 a 12 semanas. Entregamos en sprints de 2 semanas con demo al cierre.',
      },
    ],
    en: [
      {
        question: 'What is a Tunix AI assistant?',
        answer:
          'A conversational agent (voice or text) built on frontier LLMs like Claude or Gemini, integrated into the client backend with explicit tools and memory. We do not use Dialogflow or Rasa: we orchestrate the model over your existing stack.',
      },
      {
        question: 'Does it integrate with WhatsApp Business API?',
        answer:
          'Yes. We connect via the official WhatsApp Cloud API (Meta) with verified business numbers, approved HSM templates and webhooks that route messages to your backend. We also support Telegram, web widgets and SIP telephony for voice AI.',
      },
      {
        question: 'How do you handle data privacy?',
        answer:
          'Conversation data is never sent to model training — Claude and Gemini both expose opt-out flags at the API level. Transcripts are stored in your own Postgres or in our encrypted store, your choice. We are SOC2-ready and support regional data residency (us-east, eu-west, sa-east).',
      },
      {
        question: 'What languages are supported?',
        answer:
          'Frontier LLMs handle English, Spanish (neutral and regional), and Portuguese with equivalent quality. We can pin the language per session or let the model detect the user input and mirror it, useful for US/LATAM dual-market deployments.',
      },
      {
        question: 'What is the typical deployment timeline?',
        answer:
          'A conversational MVP with two or three connected tools ships in 4 to 6 weeks. A voice assistant with SIP telephony, live transcription and human handoff takes 8 to 12 weeks. We deliver in two-week sprints with an executive demo at the end of each.',
      },
    ],
  },

  'business-intelligence': {
    es: [
      {
        question: '¿Que es BI corporativo en Tunix?',
        answer:
          'Un sistema de dashboards operacionales conectado a tus fuentes reales (ERP, CRM, planillas) con un modelo dimensional abajo. No son reportes estaticos: son KPIs accionables que el gerente abre antes del comite y operaciones consulta desde el telefono.',
      },
      {
        question: '¿Con que data warehouses y ERPs conectan?',
        answer:
          'Conectamos con SAP (RFC/BAPIs, HANA), Oracle (REST + JDBC), Odoo (XML-RPC/JSON-RPC), Defontana, SAP Business One y Google Sheets. El warehouse puede ser Postgres, BigQuery o Snowflake. Los dashboards corren en Power BI, Metabase o frontend custom segun el caso.',
      },
      {
        question: '¿Cuanto demora la implementacion?',
        answer:
          'Un dashboard operacional con 3 a 5 fuentes y 10 a 15 KPIs toma 8 a 12 semanas desde el kickoff. Incluye pipelines ETL, modelo dimensional, RBAC y documentacion. El primer dashboard navegable suele estar listo en la semana 4.',
      },
      {
        question: '¿Cual es el costo estimado?',
        answer:
          'Un BI de produccion para una operacion mediana parte en USD 25k a 60k. Depende del numero de fuentes, profundidad del modelo y plataforma. Incluye ETL, modelo estrella o copo de nieve, dashboards y 3 meses de soporte hypercare post go-live.',
      },
      {
        question: '¿Que SLA y mantenimiento ofrecen?',
        answer:
          'SLA estandar 99.5% mensual con dashboards con caching y fallback a snapshot diario. Ofrecemos planes de soporte mensual que incluyen nuevas metricas, cambios de modelo, tuning de queries y monitoreo proactivo de pipelines con alertas.',
      },
    ],
    en: [
      {
        question: 'What does enterprise BI mean at Tunix?',
        answer:
          'A dashboarding system wired to your real sources (ERP, CRM, spreadsheets) with a proper dimensional model underneath. Not static reports: actionable KPIs your executive opens before the committee and ops consults from a phone.',
      },
      {
        question: 'Which data warehouses and ERPs do you connect to?',
        answer:
          'We connect to SAP (RFC/BAPIs, HANA), Oracle (REST + JDBC), NetSuite, Odoo (XML-RPC/JSON-RPC), Salesforce and Google Sheets. Warehouses: Postgres, BigQuery or Snowflake. Dashboards run on Power BI, Metabase or a custom frontend depending on the use case.',
      },
      {
        question: 'What about compliance and data residency?',
        answer:
          'We deploy SOC2-aligned pipelines, row-level RBAC and audit trails from day one. Data residency is enforced per deployment: us-east-1, eu-west-1 or sa-east-1. We sign DPAs and can operate under HIPAA-BAA or GDPR where required.',
      },
      {
        question: 'What is the cost model?',
        answer:
          'A production BI engagement starts at USD 25k to 60k for a mid-size operation. Pricing scales with source count, modeling depth and platform. Cost typically lands at 30 to 50 percent of an equivalent US agency build, with senior engineers as the default on every project.',
      },
      {
        question: 'What SLA and ongoing maintenance do you provide?',
        answer:
          'Standard 99.5 percent monthly SLA with cached dashboards and daily snapshot fallback. Monthly retainers cover new metrics, model changes, query tuning and proactive pipeline monitoring with alerting. Hypercare for 90 days post go-live is included.',
      },
    ],
  },

  'consultoria-ia': {
    es: [
      {
        question: '¿Que incluye una consultoria de IA con Tunix?',
        answer:
          'Un diagnostico de AI readiness: auditoria de datos, casos de uso priorizados, arquitectura objetivo y roadmap de 6 a 12 meses. Entregamos decision matrix (build vs buy), estimacion de costos y riesgos, y plan de go-to-production sin POCs eternas.',
      },
      {
        question: '¿Cuanto dura el engagement?',
        answer:
          'Un diagnostico corto toma 3 a 5 semanas. Un engagement completo con acompanamiento de arquitectura hasta el primer MVP dura 8 a 16 semanas. Trabajamos en sprints de 2 semanas con reuniones ejecutivas quincenales.',
      },
      {
        question: '¿Cual es la primera entrega?',
        answer:
          'Al cierre de la semana 2 entregamos el mapa de casos de uso evaluados en impacto vs complejidad, con al menos 3 quick wins de 6 a 10 semanas. Evitamos el anti-patron de entregar un PDF de 80 paginas al mes 3 sin codigo abajo.',
      },
      {
        question: '¿Cuanto cuesta?',
        answer:
          'Un diagnostico parte en USD 12k a 25k. Un engagement completo con acompanamiento tecnico hasta go-live del primer caso esta entre USD 40k y 90k. Facturamos fijo por fase, no por hora, para alinear incentivos en avance real.',
      },
      {
        question: '¿Tienen casos de referencia en LATAM?',
        answer:
          '15 anos operando negocios reales en Chile, Peru y Colombia. Hemos desplegado IA en distribucion de gas, mineria, retail y educacion. Podemos compartir referencias bajo NDA tras firma de mutual NDA en la primera semana.',
      },
    ],
    en: [
      {
        question: 'What does an AI consulting engagement cover?',
        answer:
          'An AI readiness audit: data infrastructure review, prioritized use cases, target architecture and a 6 to 12 month roadmap. Deliverables include a build-vs-buy matrix, cost and risk estimates, and a go-to-production plan that avoids endless POCs.',
      },
      {
        question: 'How long is the engagement?',
        answer:
          'A short diagnostic runs 3 to 5 weeks. A full engagement with architecture accompaniment through the first MVP takes 8 to 16 weeks. We operate in two-week sprints with bi-weekly executive reviews.',
      },
      {
        question: 'What is the first deliverable?',
        answer:
          'By the end of week 2 you get a use-case map ranked by impact vs complexity, including at least three quick wins scoped for 6 to 10 weeks. We refuse the anti-pattern of shipping an 80-page PDF at month three with no code underneath.',
      },
      {
        question: 'What is the pricing model?',
        answer:
          'A diagnostic starts at USD 12k to 25k. A full engagement through first-case go-live runs USD 40k to 90k. We bill fixed per phase, not hourly, to align incentives on actual progress rather than time.',
      },
      {
        question: 'Do you have US-nearshore references?',
        answer:
          'Leadership holds MIT Professional Education credentials in AI/ML and 15 years running real operations. We work in US Eastern/Central time zones, bill in USD and have delivered for US-LATAM hybrid teams. References available under mutual NDA.',
      },
    ],
  },

  'desarrollos-web': {
    es: [
      {
        question: '¿Que stack usan para desarrollo web?',
        answer:
          'Next.js 14+ (App Router) en el frontend, Fastify o Next API routes en backend, Postgres con Prisma, Redis para caching y colas, deploy en Railway o Vercel. Tailwind y shadcn/ui para el diseno. Usamos TypeScript estricto en todo el stack.',
      },
      {
        question: '¿Cuanto demora un SaaS vertical?',
        answer:
          'Un MVP funcional con auth, CRUD principal y billing ship en 8 a 12 semanas. Un sistema completo con multi-tenancy, RBAC, reportes y RPA integrado toma 4 a 7 meses. Primer deploy navegable al final de la semana 3.',
      },
      {
        question: '¿Los sistemas son mobile-first?',
        answer:
          'Si. Operamos por default mobile-first porque los usuarios finales en faena (minera, distribucion, retail) abren el sistema desde el telefono. Testeamos en iPhone SE y Android low-end antes del desktop.',
      },
      {
        question: '¿Como hacen el deploy?',
        answer:
          'Deploy continuo desde GitHub a Railway (preferido para full-stack) o Vercel (frontend only). Cada PR genera un preview environment. Tenemos pipelines de migraciones Prisma, tests E2E en Playwright y monitoreo con Sentry.',
      },
      {
        question: '¿Como manejan el SEO?',
        answer:
          'Next.js con SSR y App Router por default para que Google vea HTML estatico. Metatags por ruta, sitemap.xml dinamico, JSON-LD para entidades (Organization, Product, FAQPage), Core Web Vitals en verde. Auditoria Lighthouse al cierre de cada sprint.',
      },
    ],
    en: [
      {
        question: 'What stack do you use for web development?',
        answer:
          'Next.js 14+ (App Router) on the frontend, Fastify or Next API routes on the backend, Postgres with Prisma, Redis for caching and queues, deployed to Railway or Vercel. Tailwind and shadcn/ui for design. Strict TypeScript across the stack.',
      },
      {
        question: 'What timelines can we expect?',
        answer:
          'A functional MVP with auth, core CRUD and billing ships in 8 to 12 weeks. A full system with multi-tenancy, RBAC, reporting and RPA integration takes 4 to 7 months. First navigable deploy lands at the end of week 3.',
      },
      {
        question: 'Are systems mobile-first by default?',
        answer:
          'Yes. We operate mobile-first because end users in the field (mining, distribution, retail) open the system from their phone. We test on iPhone SE and low-end Android before desktop, and target LCP under 2.5 seconds on 4G.',
      },
      {
        question: 'How do you deploy?',
        answer:
          'Continuous deployment from GitHub to Railway (preferred for full-stack) or Vercel (frontend only). Every PR spins up a preview environment. Prisma migrations are automated, Playwright E2E runs on CI, and Sentry monitors production.',
      },
      {
        question: 'What is the performance budget?',
        answer:
          'Every project targets green Core Web Vitals: LCP under 2.5s, INP under 200ms, CLS under 0.1. Per-route metadata, dynamic sitemap.xml, JSON-LD for Organization/Product/FAQPage, and a Lighthouse audit at the end of every sprint.',
      },
    ],
  },

  'machine-learning': {
    es: [
      {
        question: '¿Que casos de uso de ML resuelven?',
        answer:
          'Forecasting de demanda, clasificacion (fraude, scoring, tipificacion de tickets), OCR de documentos regulados, segmentacion de clientes y sistemas de recomendacion. Priorizamos casos donde el modelo se embebe en un flujo operativo existente, no notebooks huerfanos.',
      },
      {
        question: '¿Cuantos datos minimos necesitan?',
        answer:
          'Depende del problema. Para clasificacion con datos estructurados basta desde 1k a 10k ejemplos etiquetados. Para OCR con LLMs frontera partimos desde 50 a 200 documentos anotados. Si no tienes data etiquetada, disenamos el pipeline de labeling con tu equipo.',
      },
      {
        question: '¿Que precision esperar?',
        answer:
          'Declaramos accuracy, precision y recall por caso antes de entrenar, con baseline humano o heuristico como piso. En clasificacion binaria apuntamos 85-95% F1 en produccion. No prometemos 99% si el baseline humano es 80%.',
      },
      {
        question: '¿Tienen MLOps?',
        answer:
          'Si. Cada modelo en produccion tiene versionado (git + DVC o MLflow), CI/CD de reentrenamiento, monitoreo de drift (PSI, KS) y shadow deployment antes del cutover. Stack base: Python + PyTorch o scikit-learn, Dataiku DSS para pipelines empresariales.',
      },
      {
        question: '¿Cada cuanto reentrenar?',
        answer:
          'Depende del drift. Modelos estables (OCR, clasificacion documental) cada 6 a 12 meses. Modelos sensibles al comportamiento (fraude, churn) cada 1 a 3 meses con reentrenamiento automatizado. Alertas de drift disparan reentrenamiento ad-hoc.',
      },
    ],
    en: [
      {
        question: 'What ML use cases do you ship?',
        answer:
          'Demand forecasting, classification (fraud, scoring, ticket routing), OCR on regulated documents, customer segmentation and recommendation systems. We prioritize cases where the model is embedded in an existing operational flow, not orphan notebooks.',
      },
      {
        question: 'What is the minimum data volume required?',
        answer:
          'Problem-dependent. Structured classification typically starts at 1k to 10k labeled rows. LLM-based OCR gets to production with 50 to 200 annotated documents. If no labels exist yet, we design the labeling pipeline alongside your team.',
      },
      {
        question: 'What accuracy can we expect?',
        answer:
          'We declare accuracy, precision and recall targets per case before training, with a human or heuristic baseline as the floor. Binary classification typically targets 85 to 95 percent F1 in production. We do not promise 99 percent when the human baseline is 80.',
      },
      {
        question: 'Do you do MLOps?',
        answer:
          'Yes. Every production model gets versioning (git + DVC or MLflow), CI/CD for retraining, drift monitoring (PSI, KS) and shadow deployment before cutover. Default stack: Python + PyTorch or scikit-learn, Dataiku DSS for enterprise pipelines.',
      },
      {
        question: 'What is the retraining cadence?',
        answer:
          'Drift-dependent. Stable models (OCR, document classification) retrain every 6 to 12 months. Behavior-sensitive models (fraud, churn) retrain every 1 to 3 months with automated pipelines. Drift alerts trigger ad-hoc retraining runs.',
      },
    ],
  },

  rpa: {
    es: [
      {
        question: '¿Que es RPA con Playwright?',
        answer:
          'Automatizacion de procesos que replican lo que un humano hace en un navegador o app legacy: logins, formularios, descargas, consolidaciones. Usamos Playwright en TypeScript porque da selectores robustos, screenshots de evidencia y corre en Docker sin display.',
      },
      {
        question: '¿Pueden scrapear sistemas legacy?',
        answer:
          'Si. Automatizamos SAP GUI, portales bancarios, SII (Chile), planillas Excel en SharePoint, intranets sin API y ERPs de los 2000. Cuando hay API la usamos, cuando no, Playwright navega el UI como un operador humano con tiempos humanos.',
      },
      {
        question: '¿Que SLA ofrecen los bots?',
        answer:
          'SLA estandar 99% mensual con retry exponencial, screenshots de cada paso y alertas a Slack o email cuando falla. Los bots corren en contenedores Docker con health checks y redundancia. Tiempo promedio de recuperacion ante cambios de UI: menos de 4 horas.',
      },
      {
        question: '¿Cuanto cuesta?',
        answer:
          'Un bot RPA simple (login + extraccion + consolidacion) ship en 3 a 5 semanas por USD 8k a 18k. Procesos complejos con 10+ pasos, manejo de excepciones y OCR entre USD 20k y 45k. Mantenimiento mensual 10-15% del costo de construccion.',
      },
      {
        question: '¿Que soporte dan post go-live?',
        answer:
          'Ofrecemos planes de soporte mensual que cubren cambios de UI del sistema origen (las UIs cambian, es ley), nuevas reglas de negocio, monitoreo proactivo y reentrenamiento de selectores. Respuesta a incidentes criticos en menos de 2 horas laborables.',
      },
    ],
    en: [
      {
        question: 'What is Playwright-based RPA?',
        answer:
          'Process automation that replicates what a human does in a browser or legacy app: logins, form submissions, downloads, consolidations. We use Playwright in TypeScript because it gives robust selectors, evidence screenshots and runs in Docker without a display.',
      },
      {
        question: 'Can you automate legacy systems?',
        answer:
          'Yes. We automate SAP GUI, bank portals, government tax portals, SharePoint Excel files, intranets without APIs and early-2000s ERPs. When an API exists we use it; when it does not, Playwright drives the UI like a human operator with human-paced timing.',
      },
      {
        question: 'What SLA do bots meet?',
        answer:
          'Standard 99 percent monthly SLA with exponential retry, per-step screenshots and failure alerts to Slack or email. Bots run in Docker containers with health checks and redundancy. Mean time to recovery from upstream UI changes: under 4 hours.',
      },
      {
        question: 'What is the pricing?',
        answer:
          'A simple RPA bot (login + extraction + consolidation) ships in 3 to 5 weeks for USD 8k to 18k. Complex processes with 10+ steps, exception handling and OCR land in USD 20k to 45k. Monthly maintenance runs 10 to 15 percent of build cost.',
      },
      {
        question: 'What does post-launch support cover?',
        answer:
          'Monthly retainers cover upstream UI changes (they always change), new business rules, proactive monitoring and selector retraining. Critical incident response under 2 business hours, with a dedicated Slack channel shared with your ops team.',
      },
    ],
  },

  'vision-artificial': {
    es: [
      {
        question: '¿Que modelos de vision usan?',
        answer:
          'YOLOv8 y v9 para deteccion de objetos en tiempo real, Detectron2 para segmentacion de instancias y SAM para segmentacion zero-shot. Para OCR de documentos regulados usamos LLMs frontera multimodales (Claude, Gemini) que superan a Tesseract en layouts complejos.',
      },
      {
        question: '¿Con que camaras son compatibles?',
        answer:
          'Cualquier camara IP RTSP, USB webcam, camaras industriales Basler/FLIR via GigE Vision, y streams HLS. Para edge usamos NVIDIA Jetson (Nano, Orin) o Raspberry Pi 5 con Coral TPU cuando la latencia lo justifica.',
      },
      {
        question: '¿Edge vs cloud?',
        answer:
          'Depende del caso. Edge (Jetson, Coral) cuando necesitas inferencia sub-100ms o privacidad estricta de video. Cloud (GPU en AWS, Railway) cuando el volumen es bajo o los modelos pesan mas de 8GB. Hibrido con pre-filtrado en edge y analisis profundo en cloud es frecuente.',
      },
      {
        question: '¿Casos tipicos en LATAM?',
        answer:
          'Lectura automatica de guias de despacho y boletas (faena y retail), deteccion de EPP en minera (casco, chaleco reflectante), conteo de clientes en retail, deteccion de defectos en packaging industrial y lectura de medidores antiguos sin telemetria.',
      },
      {
        question: '¿Que precision lograr?',
        answer:
          'Deteccion de objetos genericos: 85-95% mAP@0.5 con modelos fine-tuneados sobre 500-2000 imagenes anotadas. OCR con LLMs multimodales: 97-99% de exactitud en campos clave de documentos regulados. Declaramos metricas por caso antes del commit.',
      },
    ],
    en: [
      {
        question: 'What vision models do you use?',
        answer:
          'YOLOv8 and v9 for real-time object detection, Detectron2 for instance segmentation and SAM for zero-shot segmentation. For regulated-document OCR we use multimodal frontier LLMs (Claude, Gemini) which outperform Tesseract on complex layouts.',
      },
      {
        question: 'Which cameras are compatible?',
        answer:
          'Any IP camera via RTSP, USB webcams, industrial cameras (Basler, FLIR) via GigE Vision, and HLS streams. For edge deployments we run NVIDIA Jetson (Nano, Orin) or Raspberry Pi 5 with a Coral TPU when latency budgets demand it.',
      },
      {
        question: 'Edge or cloud inference?',
        answer:
          'Case-dependent. Edge (Jetson, Coral) when you need sub-100ms inference or strict video privacy. Cloud (GPU on AWS or Railway) when volume is low or models exceed 8GB. Hybrid pipelines with edge pre-filtering and cloud deep analysis are common.',
      },
      {
        question: 'What are typical use cases?',
        answer:
          'Automatic reading of shipping waybills and receipts, PPE detection on industrial sites (helmet, high-vis vest), retail footfall counting, packaging defect detection, and legacy meter reading without telemetry. Same stack, different domain tuning.',
      },
      {
        question: 'What accuracy can we expect?',
        answer:
          'Generic object detection: 85 to 95 percent mAP@0.5 with models fine-tuned on 500 to 2000 annotated images. Multimodal LLM OCR: 97 to 99 percent accuracy on key fields of regulated documents. We declare per-case metrics before the engagement starts.',
      },
    ],
  },
};
