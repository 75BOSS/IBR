import Image from 'next/image';
import type { EquipoRow } from '@/lib/equipo';

/** Iniciales para quien aún no tiene foto (sin «Pastor/Pastora» delante del nombre). */
function iniciales(nombre: string): string {
  return nombre
    .split(/\s+/)
    .filter((p) => p && !/^pastora?$/i.test(p))
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase())
    .join('');
}

/**
 * Retrato del equipo: con mouse, en gris hasta que pasa el cursor (`d-retrato`, tema.css); en el
 * celular, siempre a color. Sin foto, las iniciales en la serifa roja sobre azul marino.
 */
function Retrato({ persona, marco, sizes }: { persona: EquipoRow; marco: string; sizes: string }) {
  return (
    <div className={`relative overflow-hidden bg-(--d-marino) ${marco}`}>
      {persona.foto_url ? (
        <Image
          src={persona.foto_url}
          alt={`Foto de ${persona.nombre}`}
          fill
          sizes={sizes}
          className="d-zoom object-cover"
        />
      ) : (
        <span
          aria-hidden="true"
          className="absolute inset-0 grid place-items-center font-serif text-[clamp(2.5rem,12cqi,4.5rem)] font-black text-(--d-rojo) italic"
        >
          {iniciales(persona.nombre)}
        </span>
      )}
    </div>
  );
}

/**
 * Liderazgo (equipo visible del panel): los pastores en tarjetas grandes con su foto y su
 * historia; el resto del equipo en una grilla de retratos. Mide su contenedor.
 */
export function Equipo({ equipo }: { equipo: EquipoRow[] }) {
  const pastores = equipo.filter((p) => p.es_pastor);
  const lideres = equipo.filter((p) => !p.es_pastor);
  return (
    <div className="@container flex flex-col gap-[clamp(1.5rem,4vw,2.5rem)]">
      {pastores.length > 0 && (
        <ul className="grid gap-[clamp(1rem,2.5cqi,1.5rem)] @4xl:grid-cols-2">
          {pastores.map((p) => (
            <li
              key={p.id}
              className="d-retrato d-tarjeta grid overflow-hidden rounded-[1.5rem] bg-surface shadow-card ring-1 ring-line @md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]"
            >
              <Retrato
                persona={p}
                marco="aspect-[4/3] @md:aspect-auto @md:min-h-[17rem]"
                sizes="(min-width: 64rem) 16rem, (min-width: 30rem) 40vw, 100vw"
              />
              <div className="flex flex-col gap-2 p-[clamp(1.25rem,4cqi,2rem)]">
                <p className="caps text-accent">{p.rol}</p>
                <h3 className="font-headline text-[clamp(1.375rem,1.15rem+1cqi,1.75rem)] leading-tight font-extrabold tracking-[-0.03em] text-ink">
                  {p.nombre}
                </h3>
                {p.bio && <p className="text-ink-soft">{p.bio}</p>}
              </div>
            </li>
          ))}
        </ul>
      )}
      {lideres.length > 0 && (
        <ul className="grid grid-cols-2 gap-x-[clamp(0.75rem,2.5cqi,1.5rem)] gap-y-[clamp(1.25rem,3cqi,2rem)] @2xl:grid-cols-4">
          {lideres.map((p) => (
            <li key={p.id} className="d-retrato group flex flex-col gap-3">
              <Retrato
                persona={p}
                marco="aspect-square rounded-2xl"
                sizes="(min-width: 64rem) 14rem, 45vw"
              />
              <div className="flex flex-col">
                <h3 className="font-display text-[clamp(1rem,0.95rem+0.4cqi,1.1875rem)] leading-tight font-bold [overflow-wrap:anywhere] text-ink">
                  {p.nombre}
                </h3>
                <p className="text-sm text-ink-soft">{p.rol}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
