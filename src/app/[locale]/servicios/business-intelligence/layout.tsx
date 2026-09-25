import { pageMetadata } from '@/lib/seo/pageMetadata';

export function generateMetadata({ params }: { params: { locale: string } }) {
  return pageMetadata(params.locale, 'Services.businessIntelligence.meta', '/servicios/business-intelligence');
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
