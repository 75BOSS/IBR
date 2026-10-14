import Image from 'next/image';
import type { EquipoRow } from '@/lib/equipo';
import { CabeceraSeccion, Lema, Titulo } from '../piezas';

/** Iniciales para quien aún no tiene foto («Juan Carlos Mena» → «JM»). */
function iniciales(nombre: string): string {
  const palabras = nombre
    .replace(/^(Pastora?|Hno\.?|Hna\.?)\s+/i, '')
    .split(/\s+/)
    .filter(Boolean);
  return ((palabras[0]?.[0] ?? '') + (palabras.at(-1)?.[0] ?? '')).toUpperCase();
}

/** Foto de la persona (gris que pasa a color al pasar) o un bloque rojo con sus iniciales. */
function Retrato({ persona, sizes }: { persona: EquipoRow; sizes: string }) {
  return persona.foto_url ? (
    <Image
      src={persona.foto_url}
      alt=""
      fill
      sizes={sizes}
      className="d-foto object-cover object-top"
    />
  ) : (
    <span
      aria-hidden="true"
      className="absolute inset-0 grid place-items-center bg-accent font-display text-[clamp(3rem,30cqi,7rem)] font-black text-canvas font-stretch-[75%]"
    >
      {iniciales(persona.nombre)}
    </span>
  );
}

/**
 * Liderazgo (equipo visible del panel): los pastores en fichas grandes con su reseña y los
 * líderes en una grilla de retratos con nombre y rol. Las fotos están en gris y pasan a color al
 * pasar el cursor; quien no tiene foto lleva sus iniciales. Sin equipo visible, no se dibuja.
 */
export function Equipo({ equipo }: { equipo: EquipoRow[] }) {
  if (equipo.length === 0) return null;
  const pastores = equipo.filter((p) => p.es_pastor);
  const lideres = equipo.filter((p) => !p.es_pastor);
  return (
    <section id="equipo" aria-labelledby="equipo-titulo" className="flex flex-col gap-1">
      <CabeceraSeccion
        id="equipo-titulo"
        lema="Liderazgo"
        titulo={
          <>
            Quienes <em>sirven</em>
          </>
        }
      />
      {pastores.length > 0 && (
        <ul className="grid gap-1 @4xl/pagina:grid-cols-2">
          {pastores.map((p) => (
            <li key={p.id} className="group @container flex border-2 border-ink">
              <article className="grid flex-1 @lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                <div className="relative aspect-[4/3] overflow-hidden @lg:aspect-auto @lg:min-h-[clamp(16rem,40cqi,22rem)]">
                  <Retrato persona={p} sizes="(min-width: 64rem) 22vw, 100vw" />
                </div>
                <div className="flex flex-col gap-3 p-[clamp(1.125rem,5cqi,2rem)]">
                  <Lema as="span" tamano="text-[0.75rem]" className="text-accent">
                    {p.rol}
                  </Lema>
                  <Titulo
                    as="h3"
                    estilo="grueso"
                    className="text-[clamp(1.75rem,8cqi,2.75rem)] text-balance"
                  >
                    {p.nombre}
                  </Titulo>
                  {p.bio && <p className="line-clamp-6 leading-snug text-ink-soft">{p.bio}</p>}
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
      {lideres.length > 0 && (
        <ul className="grid grid-cols-2 gap-1 @3xl/pagina:grid-cols-3 @5xl/pagina:grid-cols-4">
          {lideres.map((p) => (
            <li key={p.id} className="group @container flex border-2 border-ink">
              <article className="d-invierte flex flex-1 flex-col">
                <div className="relative aspect-square overflow-hidden">
                  <Retrato
                    persona={p}
                    sizes="(min-width: 80rem) 20vw, (min-width: 48rem) 30vw, 50vw"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-1 border-t-2 border-(--inv-borde) p-[clamp(0.75rem,6cqi,1.25rem)]">
                  <Titulo
                    as="h3"
                    estilo="condensado"
                    className="text-[clamp(1.125rem,11cqi,1.625rem)] hyphens-auto"
                  >
                    {p.nombre}
                  </Titulo>
                  <span className="text-[clamp(0.8125rem,7cqi,0.9375rem)] leading-snug text-(--inv-suave)">
                    {p.rol}
                  </span>
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
