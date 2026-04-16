/**
 * Static SVG fallback for ServiceCard when the Rive asset fails, is disabled,
 * or hasn't loaded within the 2s budget. Each glyph mirrors the *first frame*
 * of the matching rive motion grammar so the hand-off is visually continuous:
 *
 *   asistentes-ia       → 5 vertical bars (waveform rest pose)
 *   business-intelligence → 4 bars + spark dot
 *   consultoria-ia      → 2 cursors on their start positions
 *   desarrollos-web     → 3 offset stack layers
 *   machine-learning    → 7 scattered dots
 *   rpa                 → 2 octagonal gears with hubs
 *   vision-artificial   → crosshair + reticle
 *
 * Pure RSC — no "use client", no JS. Tuned to the same 240×160 viewBox as the
 * .riv artboards, so swapping between SVG and Rive incurs no layout shift.
 */
type Slug =
  | 'asistentes-ia'
  | 'business-intelligence'
  | 'consultoria-ia'
  | 'desarrollos-web'
  | 'machine-learning'
  | 'rpa'
  | 'vision-artificial';

interface Props {
  slug: string;
  className?: string;
}

const INK = '#0a0a0a';
const PAPER = '#f5f5f2';

function Glyph({ slug }: { slug: Slug }) {
  switch (slug) {
    case 'asistentes-ia':
      return (
        <>
          {[48, 84, 120, 156, 192].map((x, i) => {
            const h = [48, 80, 96, 80, 48][i];
            return (
              <rect
                key={x}
                x={x - 7}
                y={80 - h / 2}
                width={14}
                height={h}
                fill="#ccff00"
                stroke={INK}
                strokeWidth={1}
              />
            );
          })}
        </>
      );
    case 'business-intelligence':
      return (
        <>
          {[48, 88, 128, 168].map((x, i) => {
            const h = [50, 80, 68, 96][i];
            return (
              <rect
                key={x}
                x={x - 12}
                y={140 - h}
                width={24}
                height={h}
                fill="#0369a1"
                stroke={INK}
                strokeWidth={1}
              />
            );
          })}
          <circle cx={210} cy={30} r={4} fill={INK} />
        </>
      );
    case 'consultoria-ia':
      return (
        <>
          <polygon
            points="22,74 38,82 22,90"
            fill="#4ade80"
            stroke={INK}
            strokeWidth={1.5}
          />
          <polygon
            points="112,14 128,14 120,28"
            fill={INK}
            stroke={INK}
            strokeWidth={1}
          />
        </>
      );
    case 'desarrollos-web':
      return (
        <>
          <rect
            x={60}
            y={92}
            width={120}
            height={24}
            rx={2}
            fill="#d4d4d4"
            stroke={INK}
            strokeWidth={1.5}
          />
          <rect
            x={60}
            y={72}
            width={120}
            height={24}
            rx={2}
            fill="#a3a3a3"
            stroke={INK}
            strokeWidth={1.5}
          />
          <rect
            x={60}
            y={52}
            width={120}
            height={24}
            rx={2}
            fill="#737373"
            stroke={INK}
            strokeWidth={1.5}
          />
        </>
      );
    case 'machine-learning':
      return (
        <>
          {[
            [30, 50],
            [60, 110],
            [90, 40],
            [120, 120],
            [150, 55],
            [180, 100],
            [210, 45],
          ].map(([cx, cy]) => (
            <circle
              key={`${cx}-${cy}`}
              cx={cx}
              cy={cy}
              r={5}
              fill="#06b6d4"
              stroke={INK}
              strokeWidth={1}
            />
          ))}
        </>
      );
    case 'rpa':
      return (
        <>
          <polygon
            points="85,45 110,58 110,88 85,115 60,102 60,72"
            fill="#ff6b6b"
            stroke={INK}
            strokeWidth={1.5}
          />
          <circle
            cx={85}
            cy={80}
            r={8}
            fill={PAPER}
            stroke={INK}
            strokeWidth={1.5}
          />
          <polygon
            points="165,50 188,61 188,85 165,110 142,99 142,75"
            fill={INK}
            stroke={INK}
            strokeWidth={1}
          />
          <circle
            cx={165}
            cy={80}
            r={6}
            fill={PAPER}
            stroke={INK}
            strokeWidth={1.5}
          />
        </>
      );
    case 'vision-artificial':
      return (
        <>
          <line
            x1={10}
            y1={80}
            x2={230}
            y2={80}
            stroke={INK}
            strokeWidth={1}
          />
          <line
            x1={120}
            y1={10}
            x2={120}
            y2={150}
            stroke={INK}
            strokeWidth={1}
          />
          <circle
            cx={60}
            cy={40}
            r={14}
            fill="transparent"
            stroke="#f59e0b"
            strokeWidth={2}
          />
          <line
            x1={51}
            y1={40}
            x2={69}
            y2={40}
            stroke="#f59e0b"
            strokeWidth={2}
          />
          <line
            x1={60}
            y1={31}
            x2={60}
            y2={49}
            stroke="#f59e0b"
            strokeWidth={2}
          />
        </>
      );
    default:
      return null;
  }
}

const KNOWN_SLUGS: ReadonlySet<Slug> = new Set<Slug>([
  'asistentes-ia',
  'business-intelligence',
  'consultoria-ia',
  'desarrollos-web',
  'machine-learning',
  'rpa',
  'vision-artificial',
]);

function isKnownSlug(value: string): value is Slug {
  return KNOWN_SLUGS.has(value as Slug);
}

export default function ServiceIconSvg({ slug, className }: Props) {
  const safeSlug: Slug = isKnownSlug(slug) ? slug : 'asistentes-ia';
  return (
    <svg
      viewBox="0 0 240 160"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-hidden="true"
      className={`w-full h-full ${className ?? ''}`.trim()}
      preserveAspectRatio="xMidYMid meet"
    >
      <rect width={240} height={160} fill={PAPER} />
      <Glyph slug={safeSlug} />
    </svg>
  );
}
