import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { DAY_NAMES, formatTime } from '@/lib/dates';
import { FRECUENCIAS_LABEL, type GrupoPublico } from '@/lib/grupos-public';
import { CabeceraSeccion, Lema, Titulo } from '../piezas';

/**
 * Todos los grupos en casa como avisos clasificados: el barrio en rojo, el nombre del grupo, el
 * día y la hora grandes, cada cuánto se reúne y para qué edad. Cada aviso lleva a la página del
 * grupo y se invierte al pasar el cursor. Solo datos reales (sin dirección: la da el líder).
 */
export function GruposBarrio({ grupos }: { grupos: GrupoPublico[] }) {
  if (grupos.length === 0) return null;
  return (
    <section id="barrios" aria-labelledby="barrios-titulo" className="flex flex-col gap-1">
      <CabeceraSeccion
        id="barrios-titulo"
        lema="Durante la semana"
        titulo={
          <>
            Grupos por <em>barrio</em>
          </>
        }
        accion={{ href: '/grupos', texto: 'Buscar mi grupo' }}
      />
      <ul className="grid gap-1 @2xl/pagina:grid-cols-2 @5xl/pagina:grid-cols-3">
        {grupos.map((g) => (
          <li key={g.id} className="@container flex reveal">
            <Link
              href={`/grupos/${g.id}`}
              className="group d-invierte flex flex-1 flex-col gap-[clamp(0.75rem,4cqi,1.25rem)] border-2 border-(--inv-borde) p-[clamp(1rem,6cqi,1.5rem)]"
            >
              <span className="flex items-center justify-between gap-3">
                <Lema as="span" tamano="text-[0.75rem]" className="min-w-0 text-(--inv-acento)">
                  {g.zona ?? (g.ubicacion_tipo === 'en_linea' ? 'En línea' : g.ubicacion)}
                </Lema>
                <Icon name="arrowRight" className="d-flecha size-5 shrink-0 text-(--inv-acento)" />
              </span>
              <Titulo
                as="h3"
                estilo="condensado"
                className="text-[clamp(1.5rem,9cqi,2.25rem)] [overflow-wrap:anywhere]"
              >
                {g.nombre}
              </Titulo>
              <span className="mt-auto flex flex-wrap items-end justify-between gap-x-4 gap-y-2 border-t border-(--inv-borde) pt-[clamp(0.625rem,3cqi,1rem)]">
                {g.dia_semana !== null ? (
                  <span className="font-display text-[clamp(1.25rem,7cqi,1.75rem)] leading-none font-extrabold font-stretch-[85%]">
                    {DAY_NAMES[g.dia_semana]} {formatTime(g.hora)}
                  </span>
                ) : (
                  <span className="font-semibold">Pregunta el día al líder</span>
                )}
                <span className="text-sm text-(--inv-suave)">
                  {FRECUENCIAS_LABEL[g.frecuencia]}
                  {g.rango_edad && ` · ${g.rango_edad}`}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
