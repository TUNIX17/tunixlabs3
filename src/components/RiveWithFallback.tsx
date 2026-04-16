'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState, type FC } from 'react';
import SvgMonitor from './SvgMonitor';

type HeroRiveProps = {
  className?: string;
  onLoad?: () => void;
};

const HeroRive = dynamic<HeroRiveProps>(() => import('./HeroRive'), {
  ssr: false,
  loading: () => null,
});

const LOAD_TIMEOUT_MS = 2000;

type Props = { className?: string };

const RiveWithFallback: FC<Props> = ({ className }) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [errored, setErrored] = useState<boolean>(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setErrored((prev) => (loaded ? prev : true));
    }, LOAD_TIMEOUT_MS);
    return () => {
      window.clearTimeout(timer);
    };
  }, [loaded]);

  const showFallback = !loaded || errored;
  const containerClass =
    `relative w-full max-w-[520px] aspect-[16/10] mx-auto ${className ?? ''}`.trim();

  return (
    <div className={containerClass}>
      {showFallback ? (
        <div className="absolute inset-0">
          <SvgMonitor />
        </div>
      ) : null}
      {!errored ? (
        <div
          className={`absolute inset-0 transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        >
          <HeroRive onLoad={() => setLoaded(true)} />
        </div>
      ) : null}
    </div>
  );
};

export default RiveWithFallback;
