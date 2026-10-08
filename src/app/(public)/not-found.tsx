import type { Metadata } from 'next';
import Link from 'next/link';
import { buttonClasses } from '@/components/button-styles';
import { PageHeader } from '@/components/PageHeader';
import { visibleNav } from '@/lib/nav';
import { getSiteContent } from '@/lib/site-content';

export const metadata: Metadata = { title: 'Página no encontrada' };

export default async function PublicNotFound() {
  // Solo se recomiendan páginas que tienen algo que ver.
  const { menu } = visibleNav(await getSiteContent());
  return (
    <section className="container-page page-flow">
      <PageHeader
        size="display"
        eyebrow="Error 404"
        title={
          <>
            Esta página <em>no está</em>
          </>
        }
        intro="Puede que el enlace esté mal escrito o que esta sección todavía se esté preparando. Estas páginas sí te pueden ayudar:"
        actions={
          <Link href="/" className={buttonClasses({ size: 'lg' })}>
            Ir al inicio
          </Link>
        }
      />
      <nav aria-label="Páginas del sitio" className="grid gap-8 md:grid-cols-3">
        {menu.map((group) => (
          <div key={group.title} className="flex flex-col gap-3">
            <h2 className="eyebrow text-accent-strong">{group.title}</h2>
            <ul className="flex flex-col divide-y divide-line/70 border-y border-line/70">
              {group.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex flex-col py-3 hover:text-brand-strong hover:underline"
                  >
                    <span className="font-display text-h3">{item.label}</span>
                    <span className="text-sm text-ink-soft">{item.description}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </section>
  );
}
