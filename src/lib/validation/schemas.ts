/**
 * Zod validation schemas for all API inputs.
 * Centralized schema definitions to ensure consistent validation across routes.
 */

import { z } from 'zod';

/** LeadStatus values matching Prisma enum */
const LeadStatusValues = [
  'NEW',
  'CONTACTED',
  'QUALIFIED',
  'PROPOSAL',
  'NEGOTIATION',
  'WON',
  'LOST',
] as const;

export const LeadStatusEnum = z.enum(LeadStatusValues);

// ---------------------------------------------------------------------------
// Lead Schemas
// ---------------------------------------------------------------------------

/** POST /api/leads - Create a new lead */
export const CreateLeadSchema = z
  .object({
    name: z.string().max(200).optional(),
    email: z.string().email().max(255).optional(),
    phone: z.string().max(50).optional(),
    company: z.string().max(200).optional(),
    role: z.string().max(200).optional(),
    interests: z
      .array(z.string().max(100))
      .max(10)
      .optional(),
    painPoints: z
      .array(z.string().max(100))
      .max(10)
      .optional(),
    budget: z.string().max(100).optional(),
    timeline: z.string().max(100).optional(),
    companySize: z.string().max(100).optional(),
    location: z.string().max(200).optional(),
    source: z.string().max(100).optional(),
    notes: z.string().max(5000).optional(),
  })
  .refine((data) => data.name || data.email, {
    message: 'At least name or email is required',
  });

/** PUT /api/leads/[id] - Update an existing lead (no score allowed) */
export const UpdateLeadSchema = z.object({
  name: z.string().max(200).optional(),
  email: z.string().email().max(255).optional(),
  phone: z.string().max(50).optional(),
  company: z.string().max(200).optional(),
  role: z.string().max(200).optional(),
  interests: z
    .array(z.string().max(100))
    .max(10)
    .optional(),
  painPoints: z
    .array(z.string().max(100))
    .max(10)
    .optional(),
  budget: z.string().max(100).optional(),
  timeline: z.string().max(100).optional(),
  companySize: z.string().max(100).optional(),
  location: z.string().max(200).optional(),
  source: z.string().max(100).optional(),
  notes: z.string().max(5000).optional(),
  status: LeadStatusEnum.optional(),
});

/** Message entry within a capture payload */
const CaptureMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().max(10000),
});

/** POST /api/leads/capture - Capture lead from conversation session */
export const CaptureLeadSchema = z.object({
  // Lead fields (all optional)
  name: z.string().max(200).optional(),
  email: z.string().email().max(255).optional(),
  phone: z.string().max(50).optional(),
  company: z.string().max(200).optional(),
  role: z.string().max(200).optional(),
  interests: z
    .array(z.string().max(100))
    .max(10)
    .optional(),
  painPoints: z
    .array(z.string().max(100))
    .max(10)
    .optional(),
  budget: z.string().max(100).optional(),
  timeline: z.string().max(100).optional(),
  companySize: z.string().max(100).optional(),
  location: z.string().max(200).optional(),
  notes: z.string().max(5000).optional(),
  // Session fields
  sessionId: z.string().max(200).optional(),
  conversationPhase: z.string().max(100).optional(),
  turnCount: z.number().int().min(0).max(1000).optional(),
  sessionDurationSeconds: z.number().min(0).max(36000).optional(),
  messages: z.array(CaptureMessageSchema).max(200).optional(),
  source: z.string().max(100).optional(),
});

/** GET /api/leads - Query parameters */
export const LeadQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: LeadStatusEnum.optional(),
  search: z.string().max(200).optional(),
  source: z.string().max(100).optional(),
  startDate: z.string().max(30).optional(),
  endDate: z.string().max(30).optional(),
});

// ---------------------------------------------------------------------------
// Proxy Schemas
// ---------------------------------------------------------------------------

/** POST /api/cerebras-proxy */
export const CerebrasProxySchema = z.object({
  endpoint: z.enum(['/chat/completions', '/models']),
  payload: z.record(z.string(), z.unknown()),
  method: z.enum(['POST', 'GET']).default('POST'),
});

/** POST /api/groq-proxy */
export const GroqProxySchema = z.object({
  endpoint: z.enum([
    '/chat/completions',
    '/audio/speech',
    '/audio/transcriptions',
    '/models',
  ]),
  payload: z.record(z.string(), z.unknown()),
  method: z.enum(['POST', 'GET']).default('POST'),
  responseType: z.enum(['json', 'arraybuffer']).default('json'),
});

// ---------------------------------------------------------------------------
// Webhook Schemas
// ---------------------------------------------------------------------------

/** POST /api/webhooks/calendly */
export const CalendlyWebhookSchema = z.object({
  event: z.string(),
  payload: z.object({
    event_type: z.object({
      uuid: z.string().optional(),
      name: z.string().optional(),
    }),
    event: z.object({
      uuid: z.string().optional(),
      start_time: z.string().optional(),
      end_time: z.string().optional(),
    }),
    invitee: z.object({
      uuid: z.string().optional(),
      name: z.string().optional(),
      email: z.string().optional(),
    }),
  }),
});

// ---------------------------------------------------------------------------
// Contact & Auth Schemas
// ---------------------------------------------------------------------------

/** POST /api/contact */
export const ContactFormSchema = z.object({
  nombre: z.string().min(2, 'El nombre es muy corto').max(200),
  email: z.string().email('Email invalido').max(255),
  asunto: z.string().min(3, 'El asunto es muy corto').max(200),
  mensaje: z.string().min(10, 'El mensaje es muy corto').max(5000),
});

/** POST /api/auth/login */
export const LoginSchema = z.object({
  password: z.string().min(1).max(200),
});
