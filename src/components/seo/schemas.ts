/**
 * schema.org payloads emitted as JSON-LD on every locale layout.
 *
 * Keep these immutable-by-default (`as const` is unnecessary because JsonLd
 * expects `Record<string, unknown>`, but never mutate at runtime). When adding
 * a new schema, copy the shape literal style — don't share sub-objects between
 * schemas to keep serialization deterministic and easy to audit.
 *
 * Logo fallback note: there is no /logo.svg in /public yet, so we point at the
 * existing OG bitmap used by metadata.openGraph.images. When a real SVG ships,
 * swap the URL in `organizationSchema.logo` only.
 */

import {
  LEGAL_NAME,
  LEGAL_RUT,
  LEGAL_STREET,
  LEGAL_CITY,
  LEGAL_REGION,
  LEGAL_POSTAL_CODE,
  LEGAL_PHONE_E164,
} from '@/components/LegalIdentity';

const SITE_URL = 'https://tunixlabs.com';
const LOGO_URL = `${SITE_URL}/og/tunixlabs-og.png`;

export const organizationSchema: Record<string, unknown> = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Tunix Labs',
  // `legalName` and `taxID` are what let an automated reviewer tie the brand
  // to the incorporation documents. `addressLocality` said "Santiago" until
  // 2026-08-09, which contradicted the registered domicile in Rancagua —
  // exactly the kind of mismatch a verification check flags. Keep these in
  // sync with src/components/LegalIdentity.tsx, the single source for the
  // human-readable copy of the same facts.
  legalName: LEGAL_NAME,
  taxID: LEGAL_RUT,
  url: SITE_URL,
  logo: LOGO_URL,
  founder: {
    '@type': 'Person',
    name: 'Alejandro Moyano Foncea',
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: LEGAL_STREET,
    addressLocality: LEGAL_CITY,
    addressRegion: LEGAL_REGION,
    postalCode: LEGAL_POSTAL_CODE,
    addressCountry: 'CL',
  },
  telephone: LEGAL_PHONE_E164,
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    email: 'hola@tunixlabs.com',
    telephone: LEGAL_PHONE_E164,
  },
};

export const personSchema: Record<string, unknown> = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Alejandro Moyano Foncea',
  url: SITE_URL,
  jobTitle: 'CEO',
  worksFor: {
    '@type': 'Organization',
    name: 'Tunix Labs',
  },
  // MIT URL is a reasonable placeholder pointing at the public-facing
  // professional education portal. Swap to the actual certificate/alumni URL
  // once MIT issues the permanent alumni landing.
  sameAs: [
    'https://www.linkedin.com/in/alejandromoyanofoncea',
    'https://professional.mit.edu/programs/short-programs/machine-learning-big-data',
  ],
};

export const websiteSchema: Record<string, unknown> = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  url: SITE_URL,
  name: 'Tunix Labs',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE_URL}/buscar?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};
