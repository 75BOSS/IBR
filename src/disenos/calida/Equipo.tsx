import Image from 'next/image';

type Persona = {
  id: number;
  nombre: string;
  rol: string;
  bio: string | null;
  foto_url: string | null;
};

/** Iniciales para cuando no hay foto (sin «Pastor»/«Pastora» delante). */
function iniciales(nombre: string): string {
  return nombre
    .replace(/^(Pastora?|Pr\.?)\s+/i, '')
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p.charAt(0))
    .join('')
    .toUpperCase();
}

/** Retrato con zoom lento al pasar el mouse; sin foto, las iniciales en serifa sobre azul noche. */
function Retrato({ p, sizes, className }: { p: Persona; sizes: string; className: string }) {
  return (
    <div className={`relative overflow-clip bg-(--d-noche) ${className}`}>
      {p.foto_url ? (
        <Image
          src={p.foto_url}
          alt={`Foto de ${p.nombre}`}
          fill
          sizes={sizes}
          className="object-cover object-top transition-[scale] duration-[1600ms] ease-(--ease-out-soft) motion-safe:pointer-fine:group-hover:scale-[1.06]"
        />
      ) : (
        <span
          aria-hidden="true"
          className="absolute inset-0 grid place-items-center font-display text-[clamp(2.5rem,2rem+3vw,4.5rem)] text-peach"
        >
          {iniciales(p.nombre)}
        </span>
      )}
    </div>
  );
}

/**
 * Liderazgo (tabla equipo, solo visibles): los pastores destacados con retrato grande y su
 * reseña; el resto del equipo en retratos más pequeños. Nada de tarjetas iguales: dos tamaños.
 * Cada persona se eleva con sombra cálida al pasar el mouse.
 */
export function Equipo({ pastores, lideres }: { pastores: Persona[]; lideres: Persona[] }) {
  return (
    <div className="flex flex-col gap-[clamp(2rem,4vw,3rem)]">
      {pastores.length > 0 && (
        <ul className="calida-escalonado grid gap-[clamp(1rem,2vw,1.75rem)] md:grid-cols-2">
          {pastores.map((p) => (
            <li
              key={p.id}
              className="group calida-elevar @container grid overflow-clip rounded-[0.875rem] bg-surface ring-1 ring-line"
            >
              <div className="grid @md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
                <Retrato
                  p={p}
                  sizes="(min-width: 48rem) 22vw, 100vw"
                  className="aspect-[4/3] @md:aspect-auto @md:min-h-[18rem]"
                />
                <div className="flex flex-col justify-center gap-2 p-[clamp(1.25rem,5cqi,2rem)]">
                  <p className="text-[0.75rem] font-bold tracking-[0.2em] text-accent-strong uppercase">
                    {p.rol}
                  </p>
                  <h3 className="font-display text-[clamp(1.625rem,1.3rem+1.2vw,2.25rem)] leading-tight text-ink">
                    {p.nombre}
                  </h3>
                  {p.bio && (
                    <p className="text-[clamp(0.95rem,0.92rem+0.2vw,1.0625rem)] leading-normal text-ink-soft">
                      {p.bio}
                    </p>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      {lideres.length > 0 && (
        <ul className="calida-escalonado grid grid-cols-2 gap-x-[clamp(0.75rem,2vw,1.75rem)] gap-y-[clamp(1.5rem,3vw,2.25rem)] md:grid-cols-3 xl:grid-cols-4">
          {lideres.map((p) => (
            <li key={p.id} className="group flex min-w-0 flex-col gap-3">
              <Retrato
                p={p}
                sizes="(min-width: 80rem) 20vw, (min-width: 48rem) 30vw, 45vw"
                className="calida-elevar aspect-[4/5] rounded-[0.875rem]"
              />
              <div className="flex flex-col gap-0.5">
                <h3 className="font-display text-[clamp(1.25rem,1.1rem+0.6vw,1.5rem)] leading-tight text-ink">
                  {p.nombre}
                </h3>
                <p className="text-[0.95rem] text-ink-soft">{p.rol}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
