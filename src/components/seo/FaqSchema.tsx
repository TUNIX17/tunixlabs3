import JsonLd from '@/components/seo/JsonLd';

export type Faq = { question: string; answer: string };

type Props = {
  faqs: Faq[];
};

/**
 * FaqSchema — reusable FAQPage JSON-LD emitter for service detail pages.
 *
 * Server-safe: no client hooks, no browser APIs, pure JsonLd emission. Can be
 * embedded directly inside client components because it produces a plain
 * <script type="application/ld+json"> element with static stringified JSON.
 *
 * The schema follows schema.org/FAQPage with mainEntity → Question → Answer.
 * If faqs is empty we return null so we do not ship a dangling FAQPage with no
 * questions (Google flags those as invalid structured data).
 */
export default function FaqSchema({ faqs }: Props) {
  if (!faqs || faqs.length === 0) {
    return null;
  }

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };

  return <JsonLd schema={schema} />;
}
