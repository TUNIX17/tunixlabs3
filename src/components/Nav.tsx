'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

/**
 * Global top nav. Fixed, transparent at the top of the viewport and
 * fading into a smoked-ink backdrop once the user has scrolled past 40px.
 *
 * NOTE: `/v3` manages its own nav via DOM-takeover, so this component is
 * mounted in the locale layout but v3/page.tsx intentionally bypasses it.
 */
export default function Nav() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const switchLocale = (newLocale: string) => {
    if (newLocale === locale) return;
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;
    router.replace(pathname, { locale: newLocale });
  };

  const links: { href: '/inicio' | '/servicios' | '/casos' | '/sobre' | '/contacto'; label: string }[] = [
    { href: '/inicio', label: locale === 'es' ? 'Inicio' : 'Home' },
    { href: '/servicios', label: locale === 'es' ? 'Servicios' : 'Services' },
    { href: '/casos', label: locale === 'es' ? 'Casos' : 'Cases' },
    { href: '/sobre', label: locale === 'es' ? 'Sobre' : 'About' },
    { href: '/contacto', label: locale === 'es' ? 'Contacto' : 'Contact' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'backdrop-blur-md bg-ink/70 border-b border-white/5'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        <Link
          href="/"
          className="font-mono uppercase tracking-[0.2em] text-acid text-sm md:text-base"
          aria-label="Tunix Labs — Home"
        >
          TUNIX LABS
        </Link>

        <div className="hidden md:flex gap-8">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm text-white/80 hover:text-acid transition-colors duration-200"
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-1">
          {routing.locales.map((loc) => (
            <button
              key={loc}
              type="button"
              onClick={() => switchLocale(loc)}
              className={`px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-widest transition-all duration-200 ${
                locale === loc
                  ? 'bg-acid text-ink'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
              aria-label={`Switch to ${loc === 'es' ? 'Spanish' : 'English'}`}
              aria-pressed={locale === loc}
            >
              {loc.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
