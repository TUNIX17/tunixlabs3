'use client';

import dynamic from 'next/dynamic';
import type { FC } from 'react';
import SvgMonitor from './SvgMonitor';

type RiveWithFallbackProps = { className?: string };

const RiveWithFallback = dynamic<RiveWithFallbackProps>(
  () => import('./RiveWithFallback'),
  { ssr: false, loading: () => <SvgMonitor /> },
);

const RIVE_FLAG = process.env.NEXT_PUBLIC_RIVE_HERO;

type Props = { className?: string };

const HeroMonitor: FC<Props> = ({ className }) => {
  if (RIVE_FLAG !== '1') {
    return <SvgMonitor className={className} />;
  }
  return <RiveWithFallback className={className} />;
};

export default HeroMonitor;
