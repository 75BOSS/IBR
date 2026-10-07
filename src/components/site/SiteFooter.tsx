import Link from 'next/link';
import { buttonClasses } from '@/components/button-styles';
import { EmphasizeLast } from '@/components/Emphasis';
import { Icon } from '@/components/Icon';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import type { SiteConfig } from '@/lib/config';
import { LEGAL_NAV, MENU_LINKS, PUBLIC_MENU, socialLinks } from '@/lib/nav';
import { formatPhoneEc } from '@/lib/whatsapp';

function FooterHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="eyebrow text-footer-muted">{children}</h2>;
}

/** Pie del sitio: nombre grande con la visión, los grupos del menú, visítanos y contacto. */
export function SiteFooter({ config }: { config: SiteConfig }) {
  const socials = socialLinks(config);
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-footer text-footer-ink on-dark">
      <div className="container-page flex flex-col gap-[clamp(2.5rem,6vw,4.5rem)] py-[clamp(3rem,8vw,6rem)]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex max-w-3xl flex-col gap-4">
            <p className="font-headline text-section text-footer-ink">
              <EmphasizeLast text={config.nombre_iglesia ?? 'Iglesia Bíblica Riobamba'} />
            </p>
            {config.vision && (
              <p className="max-w-xl font-display text-h3 leading-snug text-footer-ink/85 italic">
                «{config.vision}»
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/soy-nuevo"
              className={buttonClasses({
                variant: 'accent',
                size: 'lg',
                shape: 'pill',
              })}
            >
              Es mi primera vez
            </Link>
            {MENU_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={buttonClasses({
                  variant: 'inverseOutline',
                  size: 'lg',
                  shape: 'pill',
                })}
              >
                {item.label} <Icon name="arrowUpRight" className="size-5" />
              </Link>
            ))}
          </div>
        </div>

        <div className="grid gap-x-10 gap-y-10 border-t border-footer-ink/15 pt-[clamp(2rem,5vw,3.5rem)] xs:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div className="flex flex-col gap-4 xs:col-span-2 lg:col-span-1">
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
            <ul className="flex flex-col gap-2">
              {config.telefono && (
                <li>
                  <a
                    href={`tel:${config.telefono.replace(/\s/g, '')}`}
                    className="inline-flex items-center gap-2 hover:underline"
                  >
                    <Icon name="phone" className="size-5 text-footer-muted" />
                    {formatPhoneEc(config.telefono)}
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
            </ul>
            <div className="flex flex-wrap items-center gap-2">
              {config.whatsapp && (
                <WhatsAppButton
                  number={config.whatsapp}
                  label="WhatsApp"
                  message="Hola, les escribo desde la página web."
                />
              )}
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid size-11 place-items-center rounded-full ring-1 ring-footer-ink/25 transition-colors hover:bg-footer-ink/10"
                >
                  <Icon name={s.icon} className="size-5" />
                  <span className="sr-only">{s.label} (se abre en una pestaña nueva)</span>
                </a>
              ))}
            </div>
          </div>

          {PUBLIC_MENU.map((group) => (
            <nav key={group.title} aria-label={group.title} className="flex flex-col gap-4">
              <FooterHeading>{group.title}</FooterHeading>
              <ul className="flex flex-col gap-2.5">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="font-display text-lg text-footer-ink/90 transition-colors hover:text-peach hover:italic"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      <div className="border-t border-footer-ink/15">
        <div className="container-page flex flex-col gap-3 py-5 text-sm text-footer-muted md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {config.nombre_corto ?? 'IBR'} · Sitio por Grupo Pixelia
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-1">
            {LEGAL_NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-footer-ink hover:underline">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
