import type { FC } from 'react';

type TileSpec = {
  x: number;
  y: number;
  fill: string;
  label: string;
  labelColor: string;
  iconPath: string;
};

const PAPER = '#f5f5f2';
const INK = '#0a0a0a';
const TILE_W = 260;
const TILE_H = 160;

const TILES: TileSpec[] = [
  {
    x: 0,
    y: 0,
    fill: '#ccff00',
    label: 'VOICE',
    labelColor: INK,
    iconPath:
      'M12 15c1.66 0 3-1.34 3-3V6c0-1.66-1.34-3-3-3S9 4.34 9 6v6c0 1.66 1.34 3 3 3zm5-3c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V22h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z',
  },
  {
    x: 260,
    y: 0,
    fill: '#0369a1',
    label: 'BI',
    labelColor: PAPER,
    iconPath: 'M4 20h16v2H4v-2zm2-8h3v6H6v-6zm5-6h3v12h-3V6zm5 3h3v9h-3V9z',
  },
  {
    x: 0,
    y: 160,
    fill: '#a855f7',
    label: 'SaaS',
    labelColor: PAPER,
    iconPath:
      'M12 2 2 7l10 5 10-5-10-5zm0 10L2 7v4l10 5 10-5V7l-10 5zm0 6L2 13v4l10 5 10-5v-4l-10 5z',
  },
  {
    x: 260,
    y: 160,
    fill: '#06b6d4',
    label: 'ML',
    labelColor: INK,
    iconPath:
      'M9 2v2H7v2H5v2H3v8h2v2h2v2h2v2h6v-2h2v-2h2v-2h2V8h-2V6h-2V4h-2V2H9zm0 4h6v2h2v8h-2v2H9v-2H7V8h2V6zm2 3v2H9v2h2v2h2v-2h2v-2h-2V9h-2z',
  },
];

type Props = { className?: string };

const SvgMonitor: FC<Props> = ({ className }) => {
  return (
    <svg
      viewBox="0 0 520 320"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Tunix capability monitor: voice, BI, SaaS, ML"
      className={`w-full max-w-[520px] aspect-[16/10] mx-auto ${className ?? ''}`}
    >
      <rect x={0} y={0} width={520} height={320} fill={PAPER} />
      {TILES.map((tile) => {
        const iconX = tile.x + 12;
        const iconY = tile.y + 12;
        const labelX = tile.x + 12;
        const labelY = tile.y + TILE_H - 12;
        return (
          <g key={tile.label}>
            <rect
              x={tile.x}
              y={tile.y}
              width={TILE_W}
              height={TILE_H}
              fill={tile.fill}
              stroke={INK}
              strokeWidth={2}
            />
            <g transform={`translate(${iconX} ${iconY})`}>
              <path d={tile.iconPath} fill={tile.labelColor} />
            </g>
            <text
              x={labelX}
              y={labelY}
              fill={tile.labelColor}
              fontSize={14}
              fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
              style={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}
            >
              {tile.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

export default SvgMonitor;
