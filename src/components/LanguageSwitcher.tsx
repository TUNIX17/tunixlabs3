'use client';

import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

type Props = {
  locale: string;
};

export default function LanguageSwitcher({ locale }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  const switchLocale = (newLocale: string) => {
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="flex items-center gap-1">
      {routing.locales.map((loc) => (
        <button
          key={loc}
          onClick={() => switchLocale(loc)}
          className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
            locale === loc
              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
              : 'text-gray-300 hover:text-white hover:bg-white/10'
          }`}
          aria-label={`Switch to ${loc === 'es' ? 'Spanish' : 'English'}`}
        >
          {loc.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
