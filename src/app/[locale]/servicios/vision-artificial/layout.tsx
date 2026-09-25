import { pageMetadata } from '@/lib/seo/pageMetadata';

export function generateMetadata({ params }: { params: { locale: string } }) {
  return pageMetadata(params.locale, 'Services.computerVision.meta', '/servicios/vision-artificial');
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
