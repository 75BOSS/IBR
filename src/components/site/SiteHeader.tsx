import Link from 'next/link';
import { BrandMark } from '@/components/BrandMark';
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
            <Link href="/" className="flex min-w-0 items-center gap-2.5 rounded-lg">
              <BrandMark />
              <span className="min-w-0 leading-tight">
                <span className="block truncate font-display text-[1.05rem] font-medium tracking-tight text-brand-strong md:text-xl">
                  Iglesia Bíblica
                </span>
                <span className="block text-[0.65rem] font-bold tracking-[0.28em] text-accent-strong uppercase md:text-[0.7rem]">
                  Riobamba
                </span>
              </span>
              <span className="sr-only">— {config.nombre_iglesia}, ir al inicio</span>
            </Link>
          }
        />
      </div>
    </header>
  );
}
