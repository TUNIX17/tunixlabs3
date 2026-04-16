'use client';

/**
 * Global provider for the Terminal Chat. Mounted once near the root of the
 * app so every CTA on any page can call `useTerminalChat().open()` to pop
 * the terminal without worrying about where the UI lives.
 *
 * The `<TerminalChat />` component renders at the end of the subtree so it
 * paints above normal content without layout contributions.
 */
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { TerminalChat } from './TerminalChat';

type TerminalChatCtx = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const Ctx = createContext<TerminalChatCtx | null>(null);

const NOOP: TerminalChatCtx = {
  isOpen: false,
  open: () => {},
  close: () => {},
};

export function useTerminalChat(): TerminalChatCtx {
  // Return no-ops when called outside provider (e.g. during SSR of a component
  // mounted in a context where the provider is not yet attached). This keeps
  // builds green and avoids hard crashes if something renders on the server
  // path before the provider is in the tree.
  return useContext(Ctx) ?? NOOP;
}

export function TerminalChatProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo<TerminalChatCtx>(
    () => ({ isOpen, open, close }),
    [isOpen, open, close]
  );

  return (
    <Ctx.Provider value={value}>
      {children}
      <TerminalChat />
    </Ctx.Provider>
  );
}
