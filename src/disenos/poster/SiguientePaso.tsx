import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { type Paso, RUTA_CRECER as PASOS } from '@/disenos/contenido';
import type { SiteContent } from '@/lib/nav';
import { RUTA_CRECER } from './enlaces';
import { CabeceraSeccion, Numero, Titulo } from './piezas';

/**
 * A dónde lleva un paso de la ruta: las anclas (#bautismo…) son secciones de Crecer (desde otra
 * página, con la ruta delante); Grupos y Servir solo si tienen contenido, si no, el formulario
 * de contacto (siempre existe).
 */
export function destinoPaso(paso: Paso, content: SiteContent, enCrecer = false): string {
  if (paso.href.startsWith('#')) return enCrecer ? paso.href : `${RUTA_CRECER}${paso.href}`;
  if (paso.href === '/grupos') return content.grupos ? '/grupos' : '/contacto#mensaje';
  if (paso.href === '/servir') return content.servir ? '/servir' : '/contacto#mensaje';
  return paso.href;
}

/**
 * «Tu siguiente paso» resumido (inicio y Comunidad): los cinco pasos de la ruta de Crecer como
 * cajas de periódico con su número grande; al pasar el cursor la caja se invierte. Angosta, una
 * fila por paso; ancha, cinco columnas. Lleva a la ruta completa.
 */
export function SiguientePaso({
  content,
  className = '',
}: {
  content: SiteContent;
  className?: string;
}) {
  return (
    <section aria-labelledby="siguiente-paso" className={`flex flex-col gap-1 ${className}`}>
      <CabeceraSeccion
        id="siguiente-paso"
        lema="Crecer"
        titulo={
          <>
            Tu siguiente <em>paso</em>
          </>
        }
        accion={{ href: RUTA_CRECER, texto: 'Ver la ruta completa' }}
      />
      <ol className="@container grid gap-1 @4xl:grid-cols-5">
        {PASOS.map((p) => (
          <li key={p.numero} className="flex">
            <Link
              href={destinoPaso(p, content)}
              className="group d-invierte flex flex-1 items-center gap-[clamp(0.875rem,4cqi,1.5rem)] border-2 border-(--inv-borde) p-[clamp(0.875rem,3cqi,1.25rem)] @4xl:flex-col @4xl:items-start @4xl:justify-between @4xl:gap-[clamp(1.25rem,2.4cqi,2rem)] @4xl:p-[clamp(1rem,1.8cqi,1.5rem)]"
            >
              <Numero className="shrink-0 text-[clamp(2.75rem,12cqi,4rem)] text-(--inv-acento) @4xl:text-[clamp(3rem,6cqi,5.5rem)]">
                {p.numero}
              </Numero>
              <span className="flex min-w-0 flex-1 flex-col gap-1">
                <Titulo
                  as="h3"
                  estilo="condensado"
                  className="text-[clamp(1.25rem,5.4cqi,1.75rem)] @4xl:text-[clamp(1.25rem,2.3cqi,1.75rem)]"
                >
                  {p.titulo}
                </Titulo>
                <span className="text-[0.9375rem] leading-snug text-(--inv-suave) @max-xl:hidden @4xl:line-clamp-3">
                  {p.texto}
                </span>
              </span>
              <span className="flex shrink-0 items-center gap-2 font-display font-bold text-(--inv-acento) font-stretch-[92%]">
                <span className="hidden @4xl:inline">{p.accion}</span>
                <Icon name="arrowRight" className="d-flecha size-6" />
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
