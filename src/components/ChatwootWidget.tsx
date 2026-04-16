'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    chatwootSDK: { run: (config: { websiteToken: string; baseUrl: string }) => void };
    $chatwoot: { toggle: (state?: string) => void; isOpen: boolean };
  }
}

/**
 * Loads Chatwoot SDK and hides the default bubble.
 * Chat is opened programmatically via window.$chatwoot.toggle('open').
 */
export function ChatwootWidget() {
  useEffect(() => {
    const BASE_URL = 'https://app.chatwoot.com';
    const script = document.createElement('script');
    script.src = `${BASE_URL}/packs/js/sdk.js`;
    script.async = true;
    script.onload = () => {
      window.chatwootSDK.run({
        websiteToken: '295pYkAcDUvzEiURvTzGQ8di',
        baseUrl: BASE_URL,
      });
    };
    document.head.appendChild(script);

    // Hide the default floating bubble
    const style = document.createElement('style');
    style.textContent = '.woot-widget-bubble, .woot--bubble-holder { display: none !important; }';
    document.head.appendChild(style);

    return () => {
      script.remove();
      style.remove();
    };
  }, []);

  return null;
}

/** Open Chatwoot chat programmatically */
export function openChatwoot() {
  if (typeof window !== 'undefined' && window.$chatwoot) {
    window.$chatwoot.toggle('open');
  }
}
