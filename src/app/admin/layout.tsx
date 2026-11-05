import type { Metadata } from 'next';
import AdminShell from './AdminShell';
import '../../styles/globals.css';

// El panel no está bajo [locale]: emite su propio <html>/<body>, como el
// layout de idioma, y trae los estilos globales (Tailwind) que antes le faltaban.
export const metadata: Metadata = {
  title: 'TunixLabs CRM',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <AdminShell>{children}</AdminShell>
      </body>
    </html>
  );
}
