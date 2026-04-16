'use client';
import { useEffect } from 'react';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Preloader(props: any) {
  useEffect(() => { props?.onComplete?.(); }, []);
  return null;
}
