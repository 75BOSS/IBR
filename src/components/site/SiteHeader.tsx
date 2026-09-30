import Link from 'next/link';
import { BrandMark } from '@/components/BrandMark';
import { MainNav } from '@/components/site/MainNav';
import type { SiteConfig } from '@/lib/config';

export function SiteHeader({ config }: { config: SiteConfig }) {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-canvas/95 backdrop-blur">
      <div className="container-page flex h-16 items-center gap-2 md:h-18 md:gap-3">
        <Link href="/" className="mr-auto flex min-w-0 items-center gap-2.5 rounded-lg">
          <BrandMark />
          <span className="min-w-0 leading-tight">
            <span className="block truncate font-display text-[0.95rem] font-semibold text-brand-strong md:text-lg">
              Iglesia Bíblica
            </span>
            <span className="block text-[0.7rem] font-semibold tracking-[0.14em] text-ink-soft uppercase md:text-xs">
              Riobamba
            </span>
          </span>
          <span className="sr-only">— {config.nombre_iglesia}, ir al inicio</span>
        </Link>
        <MainNav whatsapp={config.whatsapp} />
      </div>
    </header>
  );
}
