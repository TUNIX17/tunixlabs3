'use client';
import { forwardRef, useImperativeHandle } from 'react';
export type TerminalHandle = Record<string, any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Terminal = forwardRef<TerminalHandle, any>(function Terminal(_, ref) {
  useImperativeHandle(ref, () => ({}));
  return null;
});
