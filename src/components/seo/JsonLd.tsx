type Props = { schema: Record<string, unknown> };

/**
 * Emits a single JSON-LD block for schema.org consumers (Google/Bing/LinkedIn).
 *
 * We MUST use dangerouslySetInnerHTML here — this is the canonical pattern for
 * JSON-LD in React and the only way to get raw un-escaped JSON text inside the
 * <script type="application/ld+json"> node. The payload is produced locally by
 * `JSON.stringify` on a typed Record<string, unknown> literal defined in
 * `schemas.ts`. No user input, no fetched content — so no XSS surface.
 */
export default function JsonLd({ schema }: Props) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
