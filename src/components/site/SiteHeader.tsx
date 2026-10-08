import Link from 'next/link';
import { BrandLogo } from '@/components/BrandMark';
import { MainNav } from '@/components/site/MainNav';
import type { SiteConfig } from '@/lib/config';
import type { visibleNav } from '@/lib/nav';

export function SiteHeader({
  config,
  nav,
  showAccount,
}: {
  config: SiteConfig;
  nav: ReturnType<typeof visibleNav>;
  showAccount: boolean;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-line/60 bg-canvas/90 backdrop-blur-md">
      <div className="container-page flex h-16 items-center gap-2 md:h-18 md:gap-3">
        <MainNav
          whatsapp={config.whatsapp}
          menu={nav.menu}
          links={nav.links}
          showAccount={showAccount}
          logo={
            <Link href="/" className="flex min-w-0 items-center rounded-lg text-brand-strong">
              <BrandLogo className="h-10 md:h-11" />
              <span className="sr-only">
                {config.nombre_iglesia ?? 'Iglesia Bíblica Riobamba'}, ir al inicio
              </span>
            </Link>
          }
        />
      </div>
    </header>
  );
}
