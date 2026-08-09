/**
 * Legal identity block — the registered entity behind the "Tunix Labs" brand.
 *
 * Rendered in every page footer on purpose. The public brand ("Tunix Labs")
 * and the registered name ("Servicios Integrales de Inteligencia Artificial
 * Alejandro Moyano EIRL") are different strings, and anyone who has to
 * reconcile this site against incorporation documents — Meta business
 * verification, payment processors, procurement at a mining client — needs
 * both visible in the same place. A site that only shows the brand and
 * documents that only show the registered name look like two different
 * companies, which is exactly how those reviews fail.
 *
 * Every value here is transcribed to match the Meta business portfolio
 * (id 746345414611884), which in turn matches the SII record. If one of them
 * changes, change both — a reviewer compares the site against the documents.
 * The one thing that is NOT worth chasing is the punctuation of "EIRL":
 * Meta's own form normalizes "E.I.R.L." to "EIRL", and no human reviewer
 * fails a business over periods. Keep whichever form the portfolio stores.
 *
 * Deliberately NOT translated: a registered name, a RUT and a domicile are
 * proper nouns. Localizing them would defeat the only purpose of the block.
 *
 * Inline styles rather than Tailwind classes: this drops into four footers,
 * one of which (V3Client) is styled entirely inline, so inline keeps the
 * rendering identical across all of them.
 */

export const LEGAL_NAME =
  'Servicios Integrales de Inteligencia Artificial Alejandro Moyano EIRL';
export const LEGAL_RUT = '78.336.075-6';
export const LEGAL_STREET = 'César Jiménez 323';
export const LEGAL_CITY = 'Rancagua';
export const LEGAL_REGION = "Región de O'Higgins";
export const LEGAL_POSTAL_CODE = '2820438';
export const LEGAL_ADDRESS = `${LEGAL_STREET}, ${LEGAL_CITY}, ${LEGAL_REGION} ${LEGAL_POSTAL_CODE}, Chile`;
export const LEGAL_PHONE = '+56 9 3036 7979';
export const LEGAL_PHONE_E164 = '+56930367979';
export const LEGAL_EMAIL = 'contacto@tunixlabs.com';

type Props = {
  /** Extra spacing above the block when the host footer has none of its own. */
  spaced?: boolean;
};

const LegalIdentity = ({ spaced = true }: Props) => {
  return (
    <div
      // `address` semantics without the <address> tag: several of the host
      // footers already sit inside <footer>, and nesting <address> there adds
      // no machine-readable value beyond the JSON-LD in seo/schemas.ts.
      style={{
        marginTop: spaced ? 16 : 0,
        padding: '0 24px',
        fontFamily: 'JetBrains Mono, ui-monospace, monospace',
        fontSize: 10,
        lineHeight: 1.7,
        letterSpacing: '0.02em',
        color: 'rgba(245,245,242,0.32)',
        textAlign: 'center',
      }}
    >
      <div>
        {LEGAL_NAME} · RUT {LEGAL_RUT}
      </div>
      <div>
        {LEGAL_ADDRESS} ·{' '}
        <a
          href={`tel:${LEGAL_PHONE_E164}`}
          style={{ color: 'inherit', textDecoration: 'none' }}
        >
          {LEGAL_PHONE}
        </a>{' '}
        ·{' '}
        <a
          href={`mailto:${LEGAL_EMAIL}`}
          style={{ color: 'inherit', textDecoration: 'none' }}
        >
          {LEGAL_EMAIL}
        </a>
      </div>
    </div>
  );
};

export default LegalIdentity;
