import type { Metadata } from 'next';
import { ButtonLink } from '@/components/Button';
import { PageHeader } from '@/components/PageHeader';
import { PUBLIC_NAV } from '@/lib/nav';

export const metadata: Metadata = { title: 'Página no encontrada' };

export default function PublicNotFound() {
  return (
    <section className="container-page py-[clamp(3rem,10vw,6rem)]">
      <PageHeader
        eyebrow="Error 404"
        title="No encontramos esta página"
        intro="Puede que el enlace esté mal escrito o que esta sección todavía se esté preparando. Estas páginas sí te pueden ayudar:"
      />
      <ul className="mt-6 flex flex-wrap gap-2">
        {PUBLIC_NAV.map((item) => (
          <li key={item.href}>
            <ButtonLink href={item.href} variant={item.href === '/' ? 'primary' : 'secondary'}>
              {item.label}
            </ButtonLink>
          </li>
        ))}
      </ul>
    </section>
  );
}
