import { pageMetadata } from '@/lib/seo/pageMetadata';

export function generateMetadata({ params }: { params: { locale: string } }) {
  return pageMetadata(params.locale, 'Services.aiConsulting.meta', '/servicios/consultoria-ia');
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
