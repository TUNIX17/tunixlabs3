'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas';
import { useLocale } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

function NavBrandMark() {
  const [ok, setOk] = useState(true);
  const { RiveComponent } = useRive({
    src: '/design-explorations/rive/brand-mark.riv',
    autoplay: true,
    layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
    onLoadError: () => setOk(false),
  });
  if (!ok) return (
    <Image src="/logo_nav.webp" alt="" width={28} height={28}
      style={{ filter: 'drop-shadow(0 0 8px rgba(0,229,204,0.4))' }} />
  );
  return (
    <div style={{ width: 28, height: 28, filter: 'drop-shadow(0 0 8px rgba(0,229,204,0.4))' }}>
      <RiveComponent />
    </div>
  );
}

export default function Nav() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const switchLocale = (newLocale: string) => {
    if (newLocale === locale) return;
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;
    router.replace(pathname as any, { locale: newLocale });
  };

  const links: { href: '/inicio' | '/servicios' | '/casos' | '/sobre' | '/contacto'; label: string }[] = [
    { href: '/inicio', label: locale === 'es' ? 'Inicio' : 'Home' },
    { href: '/servicios', label: locale === 'es' ? 'Servicios' : 'Services' },
    { href: '/casos', label: locale === 'es' ? 'Casos' : 'Cases' },
    { href: '/sobre', label: locale === 'es' ? 'Sobre' : 'About' },
    { href: '/contacto', label: locale === 'es' ? 'Contacto' : 'Contact' },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[210] transition-all duration-300 ${
          scrolled || mobileOpen
            ? 'backdrop-blur-md bg-ink/70 border-b border-white/5'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
          <Link
            href="/"
            className="flex items-center gap-2.5"
            aria-label="Tunix Labs — Home"
          >
            <Image
              src="/logo_nav.webp"
              alt=""
              width={36}
              height={36}
              style={{ filter: 'drop-shadow(0 0 10px rgba(0,229,204,0.5))' }}
            />
            <span className="font-mono uppercase tracking-[0.2em] text-acid text-sm md:text-base">
              TUNIX LABS
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex gap-8">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href as any}
                className={`text-sm transition-colors duration-200 ${
                  pathname === href
                    ? 'text-acid'
                    : 'text-white/80 hover:text-acid'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {/* Locale switcher */}
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

            {/* Hamburger button — mobile only */}
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden relative w-8 h-8 flex flex-col items-center justify-center gap-1.5"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              <span
                className="block w-5 h-px bg-white transition-all duration-300"
                style={{
                  transform: mobileOpen ? 'rotate(45deg) translateY(3.5px)' : 'none',
                }}
              />
              <span
                className="block w-5 h-px bg-white transition-all duration-300"
                style={{
                  opacity: mobileOpen ? 0 : 1,
                }}
              />
              <span
                className="block w-5 h-px bg-white transition-all duration-300"
                style={{
                  transform: mobileOpen ? 'rotate(-45deg) translateY(-3.5px)' : 'none',
                }}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay menu */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[200] bg-ink/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8"
          style={{ paddingTop: 80 }}
        >
          {links.map(({ href, label }, i) => (
            <Link
              key={href}
              href={href as any}
              onClick={() => setMobileOpen(false)}
              className={`text-2xl font-mono tracking-wider transition-colors duration-200 ${
                pathname === href ? 'text-acid' : 'text-white/80 hover:text-acid'
              }`}
              style={{
                opacity: 0,
                animation: `v3fadeIn 0.3s ease forwards`,
                animationDelay: `${i * 60}ms`,
              }}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
