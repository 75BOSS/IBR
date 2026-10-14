import Link from 'next/link';
import { Icon } from '@/components/Icon';
import type { Valor } from '@/disenos/contenido';
import { Inclinable } from '@/disenos/vibrante/animacion/Inclinable';
import { Foto } from '@/disenos/vibrante/Foto';
import { FOTOS } from '@/disenos/vibrante/fotos';
import { fotoMinisterio } from '@/disenos/vibrante/fotoMinisterio';
import { horarioPrincipal } from '@/disenos/vibrante/horarios';
import { IconoNavegar } from '@/disenos/vibrante/iconos';
import { RUTAS } from '@/disenos/vibrante/menu';
import { CabeceraSeccion, Seccion } from '@/disenos/vibrante/Seccion';
import { botonClases } from '@/disenos/vibrante/boton';
import { toneVar } from '@/lib/css-vars';
import { DAY_NAMES, formatTime } from '@/lib/dates';
import { type Ministerio, edadText, ministerioName } from '@/lib/ministerios';
import type { Reunion } from '@/lib/reuniones';

/**
 * «Cuándo nos reunimos.» (fondo negro): la reunión principal en grande (el día en plural y la
 * hora gigante) y las demás en filas con su ministerio. Solo con reuniones de la BD.
 */
export function HorariosVisita({ reuniones }: { reuniones: Reunion[] }) {
  const principal = horarioPrincipal(reuniones);
  const [primera, ...resto] = reuniones;
  if (!principal || !primera) return null;
  return (
    <Seccion tono="negro" id="horarios" tituloId="horarios-titulo">
      <div className="grid gap-[clamp(2rem,5vw,4rem)] lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
        <div className="flex flex-col gap-[clamp(1.5rem,4vw,2.5rem)]">
          <CabeceraSeccion
            oscuro
            etiqueta="Horarios"
            id="horarios-titulo"
            tamano="columna"
            lineas={['Cuándo nos', <em key="reunimos">reunimos.</em>]}
          />
          <Inclinable
            grados={4}
            cursor={null}
            className="@container flex flex-col gap-2 rounded-[0.5rem] bg-accent p-[clamp(1.25rem,6cqi,2.25rem)] text-canvas on-dark"
          >
            <p className="eyebrow">{primera.nombre}</p>
            <p className="font-display text-[clamp(3rem,22cqi,6.5rem)] leading-[0.9] font-black tracking-[-0.05em]">
              {principal.dias}
            </p>
            <p className="font-display text-[clamp(2.25rem,14cqi,4.5rem)] leading-none font-black tracking-[-0.04em] text-(--d-negro)">
              {principal.hora}
              {primera.hora_fin && (
                <span className="text-[0.45em] tracking-[-0.02em] text-canvas">
                  {' '}
                  a {formatTime(primera.hora_fin)}
                </span>
              )}
            </p>
            {primera.ubicacion && <p className="pt-2 font-semibold">{primera.ubicacion}</p>}
          </Inclinable>
        </div>
        {resto.length > 0 && (
          <ul className="self-end border-b border-canvas/25">
            {resto.map((r) => (
              <li
                key={r.id}
                style={toneVar(r.rango_color, 'var(--d-rojo-vivo)')}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1 border-t border-canvas/25 py-[clamp(1rem,2.5vw,1.5rem)]"
              >
                <span className="flex min-w-0 flex-col gap-1">
                  <span className="caps text-(--d-rojo-vivo)">{DAY_NAMES[r.dia_semana]}</span>
                  <span className="font-display text-[clamp(1.375rem,1.1rem+1vw,2rem)] leading-tight font-black tracking-[-0.03em]">
                    {r.nombre}
                  </span>
                  {(r.rango_edad || r.en_linea) && (
                    <span className="flex flex-wrap items-center gap-x-2 text-(--d-crema-tenue)">
                      {r.rango_edad && (
                        <span className="inline-flex items-center gap-1.5">
                          <span aria-hidden="true" className="size-2.5 rounded-full bg-(--tone)" />
                          {r.rango_edad}
                        </span>
                      )}
                      {r.en_linea && <span>· En línea</span>}
                    </span>
                  )}
                </span>
                <span className="font-display text-[clamp(1.75rem,1.3rem+1.8vw,3rem)] leading-none font-black tracking-[-0.04em]">
                  {formatTime(r.hora_inicio)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Seccion>
  );
}

/**
 * «Qué puedes esperar.»: la foto del auditorio y los cuatro momentos del domingo (QUE_ESPERAR)
 * con número grande; el primero destacado en negro.
 */
export function QueEsperar({ momentos }: { momentos: Valor[] }) {
  return (
    <Seccion tituloId="esperar-titulo">
      <div className="grid gap-[clamp(2rem,5vw,4rem)] lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)]">
        <div className="flex flex-col gap-[clamp(1.5rem,4vw,2.5rem)]">
          <CabeceraSeccion
            etiqueta="Tu primer domingo"
            id="esperar-titulo"
            tamano="columna"
            lineas={['Qué puedes', <em key="esperar">esperar.</em>]}
            texto="Una reunión sencilla y alegre, pensada para que te sientas en casa desde que llegas."
          />
          <Foto
            foto={FOTOS.escenario}
            sizes="(min-width: 64rem) 34vw, 100vw"
            className="aspect-[4/3] rounded-[0.75rem] lg:aspect-[5/4]"
          />
        </div>
        <ol className="grid content-start gap-3 md:grid-cols-2">
          {momentos.map((m, i) => (
            <li key={m.titulo} className="flex">
              <Inclinable
                cursor={null}
                className={`@container flex flex-1 flex-col gap-3 rounded-[0.5rem] p-[clamp(1.25rem,7cqi,2rem)] ${
                  i === 0
                    ? 'bg-(--d-negro-hondo) text-canvas on-dark'
                    : i === momentos.length - 1
                      ? 'bg-accent text-canvas on-dark'
                      : 'bg-surface ring-1 ring-line'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`font-display text-[clamp(3rem,22cqi,5rem)] leading-none font-black tracking-[-0.05em] ${
                    i === 0
                      ? 'text-(--d-rojo-vivo)'
                      : i === momentos.length - 1
                        ? ''
                        : 'text-accent'
                  }`}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="font-display text-[clamp(1.5rem,10cqi,2rem)] leading-[1.02] font-black tracking-[-0.03em] text-balance">
                  {m.titulo}
                </h3>
                <p
                  className={`text-[clamp(1rem,5cqi,1.125rem)] leading-snug ${
                    i === 0
                      ? 'text-(--d-crema-tenue)'
                      : i === momentos.length - 1
                        ? ''
                        : 'text-ink-soft'
                  }`}
                >
                  {m.texto}
                </p>
              </Inclinable>
            </li>
          ))}
        </ol>
      </div>
    </Seccion>
  );
}

/**
 * «Tus hijos también tienen su lugar.»: los ministerios de niños y adolescentes de la BD (menores
 * de 18), con su horario si tienen reunión propia, y cada uno a su sección en Ministerios.
 */
export function NinosVisita({
  ministerios,
  reuniones,
}: {
  ministerios: Ministerio[];
  reuniones: Pick<Reunion, 'id' | 'rango_edad_id' | 'dia_semana' | 'hora_inicio'>[];
}) {
  const menores = ministerios.filter((m) => m.edad_min !== null && m.edad_min < 18);
  if (menores.length === 0) return null;
  return (
    <Seccion tono="hundido" id="ninos" tituloId="ninos-titulo">
      <div className="grid gap-[clamp(2rem,5vw,4rem)] lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
        <div className="flex flex-col gap-[clamp(1.25rem,3vw,2rem)]">
          <CabeceraSeccion
            etiqueta="Niños y adolescentes"
            id="ninos-titulo"
            tamano="columna"
            lineas={['Tus hijos', 'también tienen', <em key="lugar">su lugar.</em>]}
            texto="Mientras estás en el culto, ellos aprenden de Jesús a su manera, con maestros preparados y en un espacio seguro."
          />
        </div>
        <ul className="grid gap-3 md:grid-cols-2">
          {menores.map((m) => {
            const propia = reuniones.find((r) => r.rango_edad_id === m.id);
            return (
              <li key={m.id} style={toneVar(m.color, 'var(--color-accent)')} className="flex">
                <Inclinable
                  grados={5}
                  className="group @container flex flex-1 flex-col overflow-hidden rounded-[0.5rem] bg-surface ring-1 ring-line"
                >
                  <Foto
                    foto={fotoMinisterio(m)}
                    decorativa
                    zoom
                    cursor={null}
                    sizes="(min-width: 64rem) 25vw, (min-width: 48rem) 50vw, 100vw"
                    className="aspect-[16/10]"
                  />
                  <div className="flex flex-1 flex-col gap-2 border-t-4 border-(--tone) p-[clamp(1rem,6cqi,1.75rem)]">
                    <h3 className="font-display text-[clamp(1.5rem,10cqi,2.125rem)] leading-none font-black tracking-[-0.03em] [overflow-wrap:anywhere]">
                      <Link
                        href={`${RUTAS.ministerios}#${m.slug}`}
                        className="after:absolute after:inset-0"
                      >
                        {ministerioName(m)}
                      </Link>
                    </h3>
                    <p className="flex flex-wrap gap-x-2 text-ink-soft">
                      {edadText(m) && <span>{edadText(m)}</span>}
                      {propia && (
                        <span>
                          · {DAY_NAMES[propia.dia_semana]} {formatTime(propia.hora_inicio)}
                        </span>
                      )}
                    </p>
                    <span className="mt-auto inline-flex items-center gap-2 pt-2 font-bold text-accent">
                      Conoce más
                      <Icon
                        name="arrowRight"
                        className="size-5 transition-transform motion-safe:group-hover:translate-x-1"
                      />
                    </span>
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

/**
 * «¿Cómo llegar?» (fondo negro): la dirección y la referencia de la config, si hay, y el botón a
 * Google Maps. Solo existe si hay a dónde llevar.
 */
export function ComoLlegarVisita({
  href,
  direccion,
  referencia,
}: {
  href: string;
  direccion: string | null;
  referencia: string | null;
}) {
  return (
    <Seccion tono="negro" id="como-llegar" tituloId="llegar-titulo">
      <div className="grid items-center gap-[clamp(2rem,5vw,4rem)] lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)]">
        <div className="flex flex-col gap-[clamp(1.25rem,3vw,2rem)]">
          <CabeceraSeccion
            oscuro
            etiqueta="Cómo llegar"
            id="llegar-titulo"
            tamano="banda"
            lineas={['Te esperamos', <em key="riobamba">en Riobamba.</em>]}
            texto={
              direccion ??
              'Abre el mapa y llega sin perderte: el auditorio está marcado en Google Maps.'
            }
          />
          {referencia && (
            <p className="flex max-w-[48ch] gap-2 text-(--d-crema-tenue)">
              <Icon name="info" className="mt-0.5 size-5 text-(--d-rojo-vivo)" />
              {referencia}
            </p>
          )}
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={botonClases({ tamano: 'lg', className: 'self-start' })}
          >
            <IconoNavegar className="size-5" /> Abrir en Google Maps
            <span className="sr-only"> (se abre en una pestaña nueva)</span>
          </a>
        </div>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={-1}
          aria-hidden="true"
          className="group relative block overflow-hidden rounded-[0.75rem]"
        >
          <Foto
            foto={FOTOS.auditorio}
            decorativa
            zoom
            cursor="Mapa"
            sizes="(min-width: 64rem) 40vw, 100vw"
            className="aspect-[4/3]"
          />
          <span className="absolute bottom-[clamp(0.75rem,3vw,1.5rem)] left-[clamp(0.75rem,3vw,1.5rem)] grid size-[clamp(3.5rem,8vw,5rem)] place-items-center rounded-full bg-accent text-canvas shadow-pop transition-transform duration-500 ease-out-soft motion-safe:group-hover:-translate-y-2">
            <Icon name="mapPin" className="size-1/2" />
          </span>
        </a>
      </div>
    </Seccion>
  );
}
