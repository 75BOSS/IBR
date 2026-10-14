import Image from 'next/image';
import type { Hito } from '@/disenos/contenido';
import { Inclinable } from '@/disenos/vibrante/animacion/Inclinable';
import { CabeceraSeccion, Seccion } from '@/disenos/vibrante/Seccion';
import type { Creencia } from '@/lib/config-fields';
import type { EquipoRow } from '@/lib/equipo';
import type { ChurchStats } from '@/lib/stats';

/**
 * «Nuestra historia.» con sus párrafos (config o un texto breve) y, al lado, la visión en rojo y
 * la misión en negro (de la config; cada una solo si existe).
 */
export function HistoriaVision({
  parrafos,
  vision,
  mision,
}: {
  parrafos: string[];
  vision: string | null;
  mision: string | null;
}) {
  const [primero, ...resto] = parrafos;
  return (
    <Seccion tituloId="historia-titulo">
      <div className="grid gap-[clamp(2rem,5vw,4.5rem)] lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <div className="flex flex-col gap-[clamp(1.25rem,3vw,2rem)]">
          <CabeceraSeccion
            etiqueta="Nuestra historia"
            id="historia-titulo"
            lineas={['Una Biblia abierta', <em key="casa">en una casa.</em>]}
          />
          {primero && (
            <p className="max-w-[46ch] font-display text-[clamp(1.25rem,1.05rem+0.8vw,1.75rem)] leading-snug font-semibold tracking-[-0.01em]">
              {primero}
            </p>
          )}
          {resto.map((p) => (
            <p
              key={p.slice(0, 40)}
              className="max-w-[62ch] text-[clamp(1rem,0.95rem+0.25vw,1.125rem)] leading-relaxed text-ink-soft"
            >
              {p}
            </p>
          ))}
        </div>
        {(vision || mision) && (
          <div className="grid content-start gap-3">
            {vision && (
              <Inclinable
                grados={4}
                cursor={null}
                className="@container flex flex-col gap-3 rounded-[0.5rem] bg-accent p-[clamp(1.5rem,7cqi,2.5rem)] text-canvas on-dark"
              >
                <h3 className="eyebrow">Visión</h3>
                <p className="font-display text-[clamp(1.75rem,9cqi,2.75rem)] leading-[1] font-black tracking-[-0.04em] text-balance">
                  {vision}
                </p>
              </Inclinable>
            )}
            {mision && (
              <Inclinable
                grados={4}
                cursor={null}
                className="@container flex flex-col gap-3 rounded-[0.5rem] bg-(--d-negro-hondo) p-[clamp(1.5rem,7cqi,2.5rem)] text-canvas on-dark"
              >
                <h3 className="eyebrow text-(--d-rojo-vivo)">Misión</h3>
                <p className="text-[clamp(1.125rem,5.5cqi,1.5rem)] leading-snug font-semibold text-balance">
                  {mision}
                </p>
              </Inclinable>
            )}
          </div>
        )}
      </div>
    </Seccion>
  );
}

/**
 * Cifras reales en una franja roja: el año en que empezamos (config) y lo que hay hoy en la BD
 * (grupos, ministerios, reuniones y equipos); solo las mayores que cero.
 */
export function Cifras({
  cifras,
  anioFundacion,
}: {
  cifras: ChurchStats;
  anioFundacion: string | null;
}) {
  const conteos = [
    { clave: 'grupos', n: cifras.grupos, texto: 'grupos en casas de Riobamba' },
    { clave: 'ministerios', n: cifras.ministerios, texto: 'ministerios para cada edad' },
    { clave: 'reuniones', n: cifras.reuniones, texto: 'reuniones cada semana' },
    { clave: 'areas', n: cifras.areas, texto: 'equipos de servicio' },
  ];
  const datos = [
    ...(anioFundacion
      ? [{ clave: 'anio', valor: anioFundacion, texto: 'el año en que empezamos' }]
      : []),
    ...conteos.filter((c) => c.n > 0).map((c) => ({ ...c, valor: String(c.n) })),
  ];
  if (datos.length === 0) return null;
  const columnas: Record<number, string> = {
    1: 'md:grid-cols-1',
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
    5: 'md:grid-cols-5',
  };
  return (
    <section
      aria-label="La iglesia en cifras"
      data-cursor-claro
      className="bg-accent text-canvas on-dark"
    >
      <ul
        className={`mx-auto grid w-full max-w-[100rem] grid-cols-2 px-[clamp(1rem,3.9vw,3.75rem)] ${columnas[datos.length] ?? ''}`}
      >
        {datos.map((d) => (
          <li
            key={d.clave}
            className="@container flex flex-col gap-1 border-canvas/30 py-[clamp(1.5rem,4vw,2.75rem)] pr-3 not-last:border-b md:border-b-0 md:px-[clamp(0.75rem,2vw,1.75rem)] md:not-last:border-r md:first:pl-0"
          >
            <span className="font-display text-[clamp(2.75rem,30cqi,5.5rem)] leading-none font-black tracking-[-0.05em]">
              {d.valor}
            </span>
            <span className="max-w-[18ch] text-[clamp(0.9375rem,0.9rem+0.2vw,1.0625rem)] leading-snug font-semibold">
              {d.texto}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/**
 * Línea de tiempo (HISTORIA, ejemplo): años gigantes de contorno que se llenan de rojo al pasar
 * el mouse, unidos por una raya que se dibuja al bajar. Vertical en el celular.
 */
export function LineaTiempo({ hitos }: { hitos: Hito[] }) {
  return (
    <Seccion tono="negro" tituloId="tiempo-titulo">
      <div className="grid gap-[clamp(2rem,5vw,3.5rem)]">
        <CabeceraSeccion
          oscuro
          etiqueta="Nuestro camino"
          id="tiempo-titulo"
          lineas={['Lo que Dios', <em key="hecho">ha hecho.</em>]}
          texto="Fechas y hechos de ejemplo: la iglesia los revisará y completará."
        />
        <div className="relative">
          <span
            aria-hidden="true"
            className="vibrante-trazo absolute top-3 bottom-3 left-[0.4375rem] w-[3px] origin-top bg-(--d-rojo-vivo) lg:top-[0.4375rem] lg:right-0 lg:bottom-auto lg:left-0 lg:h-[3px] lg:w-auto lg:origin-left"
          />
          <ol className="relative grid gap-[clamp(1.75rem,4vw,2.5rem)] lg:grid-cols-5 lg:gap-[clamp(1rem,2vw,2rem)]">
            {hitos.map((h) => (
              <li
                key={h.anio}
                className="group @container grid grid-cols-[1rem_minmax(0,1fr)] gap-x-[clamp(1rem,4vw,1.5rem)] gap-y-2 lg:grid-cols-1 lg:gap-y-4"
              >
                <span
                  aria-hidden="true"
                  className="row-span-4 mt-1.5 size-4 rounded-full bg-(--d-negro) ring-[3px] ring-(--d-rojo-vivo) transition-colors group-hover:bg-(--d-rojo-vivo) lg:row-span-1 lg:mt-0"
                />
                <p className="vibrante-contorno font-display text-[clamp(3.5rem,30cqi,5.5rem)] leading-[0.85] font-black tracking-[-0.05em] transition-colors group-hover:text-(--d-rojo-vivo)">
                  {h.anio}
                </p>
                <h3 className="font-display text-[clamp(1.375rem,12cqi,1.75rem)] leading-[1.05] font-black tracking-[-0.03em] text-balance">
                  {h.titulo}
                </h3>
                <p className="max-w-[40ch] text-[clamp(0.9375rem,6cqi,1.0625rem)] leading-snug text-(--d-crema-tenue)">
                  {h.texto}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Seccion>
  );
}

/** «En qué creemos» (config): cada creencia numerada, con su título si lo tiene. */
export function Creemos({ creencias }: { creencias: Creencia[] }) {
  if (creencias.length === 0) return null;
  return (
    <Seccion tono="hundido" id="creemos" tituloId="creemos-titulo">
      <div className="grid gap-[clamp(2rem,5vw,4rem)] lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]">
        <CabeceraSeccion
          etiqueta="Nuestra fe"
          id="creemos-titulo"
          tamano="columna"
          lineas={['En qué', <em key="creemos">creemos.</em>]}
          texto="Lo esencial de lo que enseñamos, siempre con la Biblia abierta."
          className="self-start lg:sticky lg:top-28"
        />
        <ol className="grid gap-x-[clamp(1.5rem,3vw,3rem)] md:grid-cols-2">
          {creencias.map((c, i) => (
            <li
              key={`${c.titulo ?? ''}-${i}`}
              className="flex flex-col gap-2 border-t-2 border-ink py-[clamp(1rem,2.5vw,1.5rem)]"
            >
              <span className="caps text-accent">{String(i + 1).padStart(2, '0')}</span>
              {c.titulo && (
                <h3 className="font-display text-[clamp(1.375rem,1.1rem+1vw,1.875rem)] leading-tight font-black tracking-[-0.03em] [overflow-wrap:anywhere]">
                  {c.titulo}
                </h3>
              )}
              <p className="max-w-[48ch] leading-relaxed text-ink-soft">{c.texto}</p>
            </li>
          ))}
        </ol>
      </div>
    </Seccion>
  );
}

/** «Ana Pérez» → «AP» (sin foto, en su lugar van las iniciales sobre rojo). */
function iniciales(nombre: string): string {
  return nombre
    .replace(/^(Pastora?|Pr\.|Pstr\.)\s+/i, '')
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p.charAt(0))
    .join('')
    .toUpperCase();
}

function FotoPersona({ persona, sizes }: { persona: EquipoRow; sizes: string }) {
  return (
    <div className="relative aspect-[4/5] overflow-hidden bg-accent">
      {persona.foto_url ? (
        <Image
          src={persona.foto_url}
          alt={persona.nombre}
          fill
          sizes={sizes}
          className="object-cover object-top transition-transform duration-700 ease-out-soft motion-safe:group-hover:scale-105"
        />
      ) : (
        <span
          aria-hidden="true"
          className="grid size-full place-items-center font-display text-[clamp(3rem,30cqi,6rem)] font-black tracking-[-0.05em] text-canvas"
        >
          {iniciales(persona.nombre)}
        </span>
      )}
    </div>
  );
}

/**
 * Liderazgo (equipo visible de la BD): los pastores grandes, con su reseña, y el resto del
 * equipo en una fila de tarjetas más chicas. Cada tarjeta se inclina con el cursor.
 */
export function Equipo({ equipo }: { equipo: EquipoRow[] }) {
  if (equipo.length === 0) return null;
  const pastores = equipo.filter((p) => p.es_pastor);
  const lideres = equipo.filter((p) => !p.es_pastor);
  return (
    <Seccion id="equipo" tituloId="equipo-titulo">
      <div className="grid gap-[clamp(2rem,5vw,3.5rem)]">
        <CabeceraSeccion
          etiqueta="Liderazgo"
          id="equipo-titulo"
          lineas={['Quiénes nos', <em key="guian">guían.</em>]}
          texto="Pastores y líderes que sirven a la familia con la Biblia en la mano y el corazón abierto."
        />
        {pastores.length > 0 && (
          <ul className="grid gap-3 md:grid-cols-2">
            {pastores.map((p) => (
              <li key={p.id} className="@container flex">
                <Inclinable
                  grados={4}
                  className="group grid flex-1 overflow-hidden rounded-[0.5rem] bg-(--d-negro-hondo) text-canvas on-dark @[34rem]:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]"
                >
                  <FotoPersona persona={p} sizes="(min-width: 48rem) 25vw, 100vw" />
                  <div className="flex flex-col justify-end gap-2 p-[clamp(1.25rem,5cqi,2rem)]">
                    <p className="eyebrow text-(--d-rojo-vivo)">{p.rol}</p>
                    <h3 className="font-display text-[clamp(1.75rem,7cqi,2.5rem)] leading-[0.98] font-black tracking-[-0.04em] text-balance">
                      {p.nombre}
                    </h3>
                    {p.bio && <p className="leading-snug text-(--d-crema-tenue)">{p.bio}</p>}
                  </div>
                </Inclinable>
              </li>
            ))}
          </ul>
        )}
        {lideres.length > 0 && (
          <ul className="grid grid-cols-2 gap-3 md:grid-cols-[repeat(auto-fit,minmax(10rem,1fr))]">
            {lideres.map((p) => (
              <li key={p.id} className="flex">
                <Inclinable className="group @container flex flex-1 flex-col overflow-hidden rounded-[0.5rem] bg-surface ring-1 ring-line">
                  <FotoPersona persona={p} sizes="(min-width: 48rem) 20vw, 50vw" />
                  <div className="flex flex-col gap-1 p-[clamp(0.75rem,7cqi,1.25rem)]">
                    <h3 className="font-display text-[clamp(1.0625rem,10cqi,1.375rem)] leading-tight font-black tracking-[-0.03em] [overflow-wrap:anywhere]">
                      {p.nombre}
                    </h3>
                    <p className="text-sm text-ink-soft">{p.rol}</p>
                  </div>
                </Inclinable>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Seccion>
  );
}
