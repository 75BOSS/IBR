import Link from 'next/link';
import { Icon } from '@/components/Icon';
import type { Area } from '@/lib/servir';
import { FLECHA_TARJETA } from './estilos';
import { Foto } from './Foto';

/**
 * Áreas de servicio reales (panel → Servir) como tarjetas con foto: la primera grande y las demás
 * alrededor, para no repetir la misma tarjeta en cuadrícula. Cada una lleva al formulario de
 * Servir con el área elegida; si Servir no tiene contenido, a escribirnos. Mide su contenedor.
 */
export function Areas({ areas, hayServir }: { areas: Area[]; hayServir: boolean }) {
  return (
    <div className="@container">
      <ul className="grid gap-[clamp(0.875rem,2.2cqi,1.25rem)] @xl:grid-cols-2 @4xl:grid-cols-3">
        {areas.map((a) => (
          <li key={a.id} className="group/area flex @4xl:first:col-span-2 @4xl:first:row-span-2">
            <Link
              href={hayServir ? `/servir?area=${a.slug}#quiero-servir` : '/contacto#mensaje'}
              className="d-tarjeta flex w-full flex-col overflow-hidden rounded-2xl bg-surface shadow-card ring-1 ring-line"
            >
              {a.imagen_url && (
                <Foto
                  src={a.imagen_url}
                  alt=""
                  sizes="(min-width: 64rem) 30rem, (min-width: 36rem) 45vw, 100vw"
                  marco="aspect-[16/9] @4xl:group-first/area:aspect-auto @4xl:group-first/area:min-h-[14rem] @4xl:group-first/area:flex-1"
                />
              )}
              <span className="flex flex-col gap-1.5 p-[clamp(1rem,3cqi,1.5rem)]">
                <span className="flex items-center justify-between gap-3">
                  <span className="font-headline text-[clamp(1.25rem,1.1rem+0.7cqi,1.625rem)] leading-tight font-extrabold tracking-[-0.03em] [overflow-wrap:anywhere] text-ink">
                    {a.nombre}
                  </span>
                  <Icon name="arrowRight" className={FLECHA_TARJETA} />
                </span>
                {a.descripcion && (
                  <span className="line-clamp-3 text-ink-soft">{a.descripcion}</span>
                )}
                <span className="sr-only">
                  {hayServir ? 'Quiero servir aquí' : 'Escríbenos para servir'}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
