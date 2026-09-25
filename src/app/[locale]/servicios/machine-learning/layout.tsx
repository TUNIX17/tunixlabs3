import { pageMetadata } from '@/lib/seo/pageMetadata';

export function generateMetadata({ params }: { params: { locale: string } }) {
  return pageMetadata(params.locale, 'Services.machineLearning.meta', '/servicios/machine-learning');
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
