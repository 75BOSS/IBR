import type { Metadata } from 'next';
import Link from 'next/link';
import { BrandLogo } from '@/components/BrandMark';
import { PageHeader } from '@/components/PageHeader';
import { ArrowLink } from '@/components/site/ArrowLink';
import { DISENOS, NOMBRE_PAGINA, type PaginaDiseno } from '@/disenos/registro';

export const metadata: Metadata = { title: 'Propuestas de diseño' };

/** Índice para comparar: cada propuesta con sus páginas. Es el enlace que se manda a la iglesia. */
export default function DisenosPage() {
  return (
    <main className="container-page page-flow py-[clamp(2rem,6vw,4rem)]">
      <Link href="/" className="w-fit rounded-lg text-brand-strong">
        <BrandLogo className="h-11" />
        <span className="sr-only">Ir al sitio</span>
      </Link>
      <PageHeader
        size="display"
        eyebrow="Para elegir"
        title={
          <>
            Propuestas de <em>diseño</em>
          </>
        }
        intro="El mismo sitio, con los mismos datos, en cinco estilos. Abre cada una en el celular y en la compu; con el botón de abajo a la izquierda cambias de diseño sin perder la página."
      />
      <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {DISENOS.map((d) => (
          <li
            key={d.slug}
            className="flex flex-col gap-3 rounded-2xl bg-surface p-[clamp(1.125rem,2.5vw,1.5rem)] shadow-card"
          >
            <h2 className="card-title text-h2 text-brand-strong">{d.nombre}</h2>
            <p className="text-ink-soft">{d.resumen}</p>
            <ul className="mt-auto flex flex-wrap gap-x-5 gap-y-2">
              {(Object.entries(d.paginas) as [PaginaDiseno, string][]).map(([pagina, href]) => (
                <li key={pagina}>
                  <ArrowLink href={href}>{NOMBRE_PAGINA[pagina]}</ArrowLink>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </main>
  );
}
