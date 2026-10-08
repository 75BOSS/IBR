import { SiteFooter } from '@/components/site/SiteFooter';
import { SiteHeader } from '@/components/site/SiteHeader';
import { getSiteConfig } from '@/lib/config';
import { visibleNav } from '@/lib/nav';
import { getSiteContent } from '@/lib/site-content';

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const [config, content] = await Promise.all([getSiteConfig(), getSiteContent()]);
  // Un solo cálculo para el encabezado y el pie: ningún enlace lleva a una página vacía.
  const nav = visibleNav(content);
  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#contenido"
        className="sr-only z-50 rounded-lg bg-brand px-4 py-2 font-semibold text-surface focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Saltar al contenido
      </a>
      <SiteHeader config={config} nav={nav} showAccount={content.cuenta} />
      <main id="contenido" tabIndex={-1} className="flex-1 focus:outline-none">
        {children}
      </main>
      <SiteFooter config={config} nav={nav} />
    </div>
  );
}
