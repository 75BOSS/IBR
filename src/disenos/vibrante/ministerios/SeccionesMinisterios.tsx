import Link from 'next/link';
import { Icon } from '@/components/Icon';
import type { MinisterioExtra } from '@/disenos/contenido';
import { Inclinable } from '@/disenos/vibrante/animacion/Inclinable';
import { Paralaje } from '@/disenos/vibrante/animacion/Paralaje';
import { botonClases } from '@/disenos/vibrante/boton';
import { Contenedor } from '@/disenos/vibrante/Contenedor';
import { FlechaEnlace } from '@/disenos/vibrante/FlechaEnlace';
import { Foto } from '@/disenos/vibrante/Foto';
import { fotoMinisterio } from '@/disenos/vibrante/fotoMinisterio';
import type { FotoVibrante } from '@/disenos/vibrante/fotos';
import { CabeceraSeccion, Seccion } from '@/disenos/vibrante/Seccion';
import { toneVar } from '@/lib/css-vars';
import { DAY_NAMES, formatTime } from '@/lib/dates';
import type { GrupoPublico } from '@/lib/grupos-public';
import { type Ministerio, edadText, ministerioName } from '@/lib/ministerios';
import type { Reunion } from '@/lib/reuniones';

/** Una entrada del índice de la página: ancla, nombre y color del ministerio. */
export type EntradaIndice = { slug: string; nombre: string; color: string | null };

/** «Ir a»: los ministerios de la página como pastillas que saltan a su sección. */
export function IndiceMinisterios({ entradas }: { entradas: EntradaIndice[] }) {
  return (
    <nav aria-label="Ministerios de esta página" className="border-b border-line">
      <Contenedor className="flex flex-wrap items-center gap-2 py-[clamp(1rem,3vw,1.5rem)]">
        <span className="mr-2 caps text-ink-soft">Ir a</span>
        {entradas.map((e) => (
          <a
            key={e.slug}
            href={`#${e.slug}`}
            style={toneVar(e.color, 'var(--color-accent)')}
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-surface px-4 font-semibold ring-1 ring-line transition-colors hover:bg-ink hover:text-canvas hover:ring-ink"
          >
            <span aria-hidden="true" className="size-2.5 rounded-full bg-(--tone)" />
            {e.nombre}
          </a>
        ))}
      </Contenedor>
    </nav>
  );
}

/** «Sábado · 15:00» (y «a 17:00» si tiene hora de fin). */
function horario(r: Pick<Reunion, 'dia_semana' | 'hora_inicio' | 'hora_fin'>): string {
  const fin = r.hora_fin ? ` a ${formatTime(r.hora_fin)}` : '';
  return `${DAY_NAMES[r.dia_semana]} · ${formatTime(r.hora_inicio)}${fin}`;
}

/**
 * Un ministerio de la BD: foto grande (se desplaza con el cursor) y, al lado, su nombre gigante,
 * edades, descripción, sus reuniones y grupos, y el enlace a su página. Las secciones alternan
 * el lado de la foto y el fondo. El color propio del ministerio (BD) marca la raya y los puntos.
 */
export function BloqueMinisterio({
  ministerio: m,
  reuniones,
  grupos,
  indice,
  verGrupos,
}: {
  ministerio: Ministerio;
  reuniones: Reunion[];
  grupos: GrupoPublico[];
  indice: number;
  verGrupos: boolean;
}) {
  const nombre = ministerioName(m);
  const edad = edadText(m);
  const par = indice % 2 === 1;
  const tituloId = `ministerio-${m.slug}-titulo`;
  return (
    <section
      id={m.slug}
      aria-labelledby={tituloId}
      style={toneVar(m.color, 'var(--color-accent)')}
      className={par ? 'bg-sunken [--color-accent:var(--color-accent-strong)]' : ''}
    >
      <Contenedor className="grid items-center gap-[clamp(1.5rem,5vw,4.5rem)] py-[clamp(2.5rem,7vw,5rem)] md:grid-cols-2">
        <Paralaje className={`relative ${par ? 'md:order-2' : ''}`}>
          <Foto
            foto={fotoMinisterio(m)}
            profundidad={2}
            sizes="(min-width: 48rem) 46vw, 100vw"
            className="aspect-[4/3] rounded-[0.75rem]"
          />
          <span
            aria-hidden="true"
            className="absolute -bottom-3 left-[clamp(1rem,4vw,2rem)] h-6 w-[clamp(5rem,20%,9rem)] rounded-[0.25rem] bg-(--tone)"
          />
        </Paralaje>
        <div className="@container flex flex-col gap-[clamp(0.75rem,3cqi,1.25rem)]">
          {edad && <p className="eyebrow text-accent">{edad}</p>}
          <h2
            id={tituloId}
            className="font-display text-[clamp(2.25rem,13cqi,5.5rem)] leading-[0.92] font-black tracking-[-0.045em] text-balance"
          >
            {nombre}
          </h2>
          {m.descripcion && (
            <p className="max-w-[52ch] text-[clamp(1rem,0.95rem+0.3vw,1.1875rem)] leading-snug">
              {m.descripcion}
            </p>
          )}
          {(reuniones.length > 0 || grupos.length > 0) && (
            <dl className="grid gap-x-6 gap-y-3 border-t-2 border-ink pt-4 @lg:grid-cols-2">
              {reuniones.length > 0 && (
                <div className="flex flex-col gap-1">
                  <dt className="caps text-accent">Se reúne</dt>
                  {reuniones.map((r) => (
                    <dd key={r.id} className="font-semibold">
                      {horario(r)}
                    </dd>
                  ))}
                </div>
              )}
              {grupos.length > 0 && (
                <div className="flex flex-col gap-1">
                  <dt className="caps text-accent">
                    {grupos.length === 1 ? '1 grupo en casa' : `${grupos.length} grupos en casa`}
                  </dt>
                  {grupos.slice(0, 3).map((g) => (
                    <dd key={g.id}>
                      <Link href={`/grupos/${g.id}`} className="font-semibold hover:underline">
                        {g.nombre}
                      </Link>
                      {g.zona && <span className="text-ink-soft"> · {g.zona}</span>}
                    </dd>
                  ))}
                </div>
              )}
            </dl>
          )}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-1">
            <Link href={`/ministerios/${m.slug}`} className={botonClases()}>
              Ver {nombre} <Icon name="arrowRight" className="size-4" />
            </Link>
            {verGrupos && grupos.length > 3 && (
              <FlechaEnlace href="/grupos">Ver todos los grupos</FlechaEnlace>
            )}
          </div>
        </div>
      </Contenedor>
    </section>
  );
}

/**
 * Ministerios que aún no son rangos de edad en la BD (MINISTERIOS_EXTRA, ejemplo): tres tarjetas
 * con foto, cada una con su ancla (#mujeres…) y el paso para sumarse (Contacto).
 */
export function MinisteriosExtra({
  extras,
  fotos,
}: {
  extras: MinisterioExtra[];
  fotos: Record<string, FotoVibrante>;
}) {
  if (extras.length === 0) return null;
  return (
    <Seccion tono="negro" tituloId="extras-titulo">
      <div className="grid gap-[clamp(2rem,5vw,3.5rem)]">
        <CabeceraSeccion
          oscuro
          etiqueta="Y también"
          id="extras-titulo"
          lineas={['Crecer en cada', <em key="etapa">etapa.</em>]}
          texto="Encuentros para mujeres, matrimonios y hombres, con amistad y la Biblia abierta."
        />
        <ul className="grid gap-3 md:grid-cols-3">
          {extras.map((x, i) => {
            const foto = fotos[x.slug];
            return (
              <li key={x.slug} id={x.slug} className="flex">
                <Inclinable
                  grados={5}
                  className={`group @container flex flex-1 flex-col overflow-hidden rounded-[0.5rem] ${
                    i === 0 ? 'bg-accent' : 'bg-(--d-negro-hondo) ring-1 ring-canvas/10'
                  }`}
                >
                  {foto && (
                    <Foto
                      foto={foto}
                      decorativa
                      zoom
                      cursor={null}
                      sizes="(min-width: 48rem) 33vw, 100vw"
                      className="aspect-[16/10]"
                    />
                  )}
                  <div className="flex flex-1 flex-col gap-2 p-[clamp(1.25rem,7cqi,2rem)]">
                    <p className={`caps ${i === 0 ? '' : 'text-(--d-rojo-vivo)'}`}>{x.para}</p>
                    <h3 className="font-display text-[clamp(1.875rem,13cqi,2.75rem)] leading-none font-black tracking-[-0.04em] [overflow-wrap:anywhere]">
                      {x.nombre}
                    </h3>
                    <p className={`leading-snug ${i === 0 ? '' : 'text-(--d-crema-tenue)'}`}>
                      {x.texto}
                    </p>
                    <Link
                      href="/contacto#mensaje"
                      className="mt-auto inline-flex min-h-11 items-center gap-2 pt-2 font-bold after:absolute after:inset-0 hover:underline"
                    >
                      Quiero participar
                      <span className="sr-only"> en {x.nombre}</span>
                      <Icon
                        name="arrowRight"
                        className="size-5 transition-transform motion-safe:group-hover:translate-x-1"
                      />
                    </Link>
                  </div>
                </Inclinable>
              </li>
            );
          })}
        </ul>
      </div>
    </Seccion>
  );
}
