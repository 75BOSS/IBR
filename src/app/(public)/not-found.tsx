import type { Metadata } from 'next';
import { ButtonLink } from '@/components/Button';
import { PUBLIC_NAV } from '@/lib/nav';

export const metadata: Metadata = { title: 'Página no encontrada' };

export default function PublicNotFound() {
  return (
    <section className="container-page py-[clamp(3rem,10vw,6rem)]">
      <p className="text-sm font-semibold tracking-widest text-accent uppercase">Error 404</p>
      <h1 className="mt-3 max-w-2xl text-h1 font-semibold text-brand-strong">
        No encontramos esta página
      </h1>
      <p className="mt-4 max-w-prose text-lg text-ink-soft">
        Puede que el enlace esté mal escrito o que esta sección todavía se esté preparando. Estas
        páginas sí te pueden ayudar:
      </p>
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
