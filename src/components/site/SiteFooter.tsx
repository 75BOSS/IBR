import Link from 'next/link';
import { BrandMark } from '@/components/BrandMark';
import { Icon, type IconName } from '@/components/Icon';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import type { SiteConfig } from '@/lib/config';
import { PUBLIC_NAV } from '@/lib/nav';

const SOCIALS: {
  key: 'instagram' | 'tiktok' | 'youtube' | 'facebook';
  label: string;
  icon: IconName;
}[] = [
  { key: 'instagram', label: 'Instagram', icon: 'instagram' },
  { key: 'youtube', label: 'YouTube', icon: 'youtube' },
  { key: 'tiktok', label: 'TikTok', icon: 'tiktok' },
  { key: 'facebook', label: 'Facebook', icon: 'facebook' },
];

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-sans text-xs font-bold tracking-[0.16em] text-footer-muted uppercase">
      {children}
    </h2>
  );
}

export function SiteFooter({ config }: { config: SiteConfig }) {
  const socials = SOCIALS.filter((s) => config[s.key]);
  const hasContact = Boolean(config.whatsapp || config.telefono || config.email);
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-footer text-footer-ink on-dark">
      <div className="container-page grid gap-x-10 gap-y-8 py-[clamp(2.5rem,6vw,4.5rem)] md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div className="flex flex-col gap-4 md:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3">
            <BrandMark />
            <p className="font-display text-lg leading-tight font-semibold md:text-xl">
              {config.nombre_iglesia}
            </p>
          </div>
          {config.vision && (
            <p className="max-w-sm font-display text-h3 leading-snug text-footer-ink/90 italic">
              «{config.vision}»
            </p>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <FooterHeading>Visítanos</FooterHeading>
          {config.direccion ? (
            <address className="flex gap-2 not-italic">
              <Icon name="mapPin" className="mt-0.5 size-5 text-footer-muted" />
              <span>
                {config.direccion}
                {config.referencia_llegada && (
                  <span className="mt-1 block text-sm text-footer-muted">
                    {config.referencia_llegada}
                  </span>
                )}
              </span>
            </address>
          ) : (
            <p className="text-footer-muted">Pronto publicaremos la dirección del auditorio.</p>
          )}
          <Link
            href="/reuniones"
            className="inline-flex items-center gap-1.5 font-semibold text-footer-ink underline decoration-accent decoration-2 underline-offset-4 hover:decoration-footer-ink"
          >
            Horarios y cómo llegar
            <Icon name="arrowRight" className="size-4" />
          </Link>
        </div>

        <div className="flex flex-col gap-3">
          <FooterHeading>Contacto</FooterHeading>
          {hasContact ? (
            <ul className="flex flex-col gap-2.5">
              {config.telefono && (
                <li>
                  <a
                    href={`tel:${config.telefono.replace(/\s/g, '')}`}
                    className="inline-flex items-center gap-2 hover:underline"
                  >
                    <Icon name="phone" className="size-5 text-footer-muted" />
                    {config.telefono}
                  </a>
                </li>
              )}
              {config.email && (
                <li>
                  <a
                    href={`mailto:${config.email}`}
                    className="inline-flex items-center gap-2 break-all hover:underline"
                  >
                    <Icon name="mail" className="size-5 text-footer-muted" />
                    {config.email}
                  </a>
                </li>
              )}
              {config.whatsapp && (
                <li className="pt-1">
                  <WhatsAppButton
                    number={config.whatsapp}
                    message="Hola, les escribo desde la página web."
                  />
                </li>
              )}
            </ul>
          ) : (
            <p className="text-footer-muted">
              Escríbenos por nuestras redes mientras publicamos el contacto.
            </p>
          )}
        </div>

        <div className="flex flex-col gap-3 md:col-span-2 lg:col-span-1">
          <FooterHeading>Síguenos</FooterHeading>
          <ul className="flex flex-wrap gap-x-6 gap-y-1 lg:flex-col lg:gap-1">
            {socials.map((s) => (
              <li key={s.key}>
                <a
                  href={config[s.key] ?? undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-10 items-center gap-2.5 rounded-lg hover:underline"
                >
                  <Icon name={s.icon} className="size-5" />
                  {s.label}
                  <span className="sr-only"> (se abre en una pestaña nueva)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-footer-ink/15">
        <div className="container-page flex flex-col gap-3 py-5 text-sm text-footer-muted md:flex-row md:items-center md:justify-between">
          <nav aria-label="Pie de página">
            <ul className="flex flex-wrap gap-x-4 gap-y-1">
              {PUBLIC_NAV.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-footer-ink hover:underline">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/privacidad" className="hover:text-footer-ink hover:underline">
                  Privacidad
                </Link>
              </li>
            </ul>
          </nav>
          <p>
            © {year} {config.nombre_corto ?? 'IBR'} · Sitio por Grupo Pixelia
          </p>
        </div>
      </div>
    </footer>
  );
}
