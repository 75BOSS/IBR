import Link from 'next/link';
import { Icon, type IconName } from '@/components/Icon';
import { formatDateOnly, formatDateTime } from '@/lib/dates';
import type { Predica } from '@/lib/predicas';
import { youTubeThumbnail, youTubeWatchUrl } from '@/lib/youtube';
import type { ChannelVideo } from '@/lib/youtube-api';
import { DEVOCIONALES, SERIES } from '../contenido';
import { FocoCursor, ZonaBrillo } from './efectos';
import { PortadaInterior } from './Secciones';
import { devocionalDeHoy } from './semana';
import {
  Aro,
  CONTENEDOR,
  CURSIVA,
  EnlaceFlecha,
  Etiqueta,
  Foto,
  PestanaNueva,
  SUBTITULAR,
  TituloSeccion,
  pildora,
} from './ui';

type Red = { label: string; icon: IconName; href: string };

/** Portada de Recursos con accesos a sus secciones. */
export function PortadaRecursos() {
  const accesos = [
    { href: '#predicas', texto: 'Prédicas' },
    { href: '#series', texto: 'Series' },
    { href: '#devocionales', texto: 'Devocionales' },
    { href: '#testimonios', texto: 'Testimonios' },
  ];
  return (
    <PortadaInterior
      id="recursos-titulo"
      etiquetas={['Recursos', 'Para tu semana']}
      foto="escenario.webp"
      encuadre="object-[50%_30%]"
      titulo={
        <>
          Alimento para tu <em className="block text-[1em]">semana.</em>
        </>
      }
      texto="Los mensajes de cada domingo, lecturas para cada día e historias de lo que Dios hace en nuestra familia."
    >
      <nav aria-label="Secciones de Recursos">
        <ul className="flex flex-wrap gap-2">
          {accesos.map((a) => (
            <li key={a.href}>
              <Link
                href={a.href}
                className="inline-flex min-h-10 items-center rounded-full border border-peach/40 px-4 text-sm font-semibold text-cream transition-colors hover:border-peach hover:bg-peach hover:text-ink"
              >
                {a.texto}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </PortadaInterior>
  );
}

type Mensaje = {
  videoId: string;
  titulo: string;
  detalle: string;
  serie: string | null;
  miniatura: string;
};

/** Prédicas del panel o, si no hay, videos del canal: el mismo formato para dibujarlas. */
function mensajesDe(predicas: Predica[], videos: ChannelVideo[]): Mensaje[] {
  if (predicas.length > 0) {
    return predicas.map((p) => ({
      videoId: p.youtube_id,
      titulo: p.titulo,
      detalle: [p.predicador, p.pasaje, formatDateOnly(p.fecha)].filter(Boolean).join(' · '),
      serie: p.serie,
      miniatura: p.miniatura_url ?? youTubeThumbnail(p.youtube_id),
    }));
  }
  return videos.map((v) => ({
    videoId: v.videoId,
    titulo: v.titulo,
    detalle: `Publicado el ${formatDateTime(new Date(v.publicado), { dateStyle: 'long' })}`,
    serie: null,
    miniatura: youTubeThumbnail(v.videoId),
  }));
}

/** Botón de reproducir sobre una miniatura (crece al pasar el mouse). */
function Reproducir({ grande = false }: { grande?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`absolute inset-0 grid place-items-center bg-(--d-tinta)/25 transition-colors group-hover:bg-(--d-tinta)/10`}
    >
      <span
        className={`grid place-items-center rounded-full bg-(--d-durazno) text-ink shadow-pop transition-transform duration-300 motion-safe:group-hover:scale-110 ${
          grande ? 'size-[clamp(3.5rem,8vw,5rem)]' : 'size-10'
        }`}
      >
        <Icon name="play" fill="currentColor" className="ml-[0.12em] size-[40%]" />
      </span>
    </span>
  );
}

/**
 * Prédicas (id="predicas"): la más reciente grande con su miniatura de YouTube y las siguientes
 * en filas. Sin mensajes (ni del panel ni del canal), una tarjeta de cine que invita al canal.
 */
export function Predicas({
  predicas,
  videos,
  verTodas,
  youtube,
}: {
  predicas: Predica[];
  videos: ChannelVideo[];
  /** /predicas tiene contenido. */
  verTodas: boolean;
  /** Canal de YouTube de la configuración (redes). */
  youtube: string | null;
}) {
  const [primero, ...resto] = mensajesDe(predicas, videos);
  const respaldo = verTodas
    ? { href: '/predicas', externo: false }
    : youtube
      ? { href: youtube, externo: true }
      : null;
  if (!primero && !respaldo) return null;
  return (
    <section
      id="predicas"
      aria-labelledby="predicas-titulo"
      className="relative isolate bg-(--d-tinta) text-cream on-dark"
    >
      <FocoCursor />
      <div
        className={`${CONTENEDOR} flex flex-col gap-[clamp(2rem,4vw,3rem)] py-[clamp(3rem,8vw,6rem)]`}
      >
        <div className="flex flex-wrap items-end justify-between gap-6">
          <TituloSeccion
            id="predicas-titulo"
            etiqueta="Prédicas"
            oscuro
            intro="Cada domingo abrimos la Biblia juntos. Si no pudiste venir, aquí está el mensaje completo."
          >
            Escucha la <em>Palabra.</em>
          </TituloSeccion>
          {verTodas && (
            <EnlaceFlecha href="/predicas" className="text-peach hover:text-cream">
              Ver todas las prédicas
            </EnlaceFlecha>
          )}
        </div>
        {primero ? (
          <ZonaBrillo
            className={`grid gap-[clamp(0.75rem,1.6vw,1.25rem)] ${resto.length > 0 ? 'lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]' : ''}`}
          >
            <a
              href={youTubeWatchUrl(primero.videoId)}
              target="_blank"
              rel="noopener noreferrer"
              className="group d-brillo d-aparece @container overflow-hidden rounded-2xl bg-(--d-noche) ring-1 ring-cream/10"
            >
              {/* Sola, la prédica ocupa todo el ancho: miniatura y texto lado a lado. */}
              <div className="flex h-full flex-col @3xl:flex-row">
                <div className="relative @3xl:w-[58%] @3xl:shrink-0">
                  <Foto
                    src={primero.miniatura}
                    sizes="(min-width: 64rem) 55vw, 100vw"
                    efecto="transition-transform duration-700 motion-safe:group-hover:scale-105"
                    className="aspect-video"
                  />
                  <Reproducir grande />
                </div>
                <div className="flex flex-col justify-center gap-2 p-[clamp(1.25rem,4cqi,2.5rem)]">
                  <Etiqueta className="text-(--d-arena)">Mensaje más reciente</Etiqueta>
                  <span className={`${SUBTITULAR} group-hover:text-peach`}>{primero.titulo}</span>
                  {primero.serie && (
                    <span className={`text-lg text-peach ${CURSIVA}`}>{primero.serie}</span>
                  )}
                  <span className="text-sm text-cream/75">{primero.detalle}</span>
                  <span className="mt-3 inline-flex items-center gap-2 font-display font-semibold text-peach">
                    Ver el mensaje completo
                    <Icon
                      name="arrowRight"
                      className="size-5 transition-transform motion-safe:group-hover:translate-x-1"
                    />
                  </span>
                </div>
              </div>
              <PestanaNueva que="se abre en YouTube" />
            </a>
            {resto.length > 0 && (
              <ul className="flex flex-col gap-[clamp(0.5rem,1vw,0.75rem)]">
                {resto.slice(0, 4).map((m) => (
                  <li key={m.videoId} className="d-aparece">
                    <a
                      href={youTubeWatchUrl(m.videoId)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group d-brillo flex items-center gap-4 rounded-xl bg-(--d-noche) p-3 ring-1 ring-cream/10"
                    >
                      <div className="relative w-[clamp(7rem,30%,9.5rem)] shrink-0 overflow-hidden rounded-lg">
                        <Foto src={m.miniatura} sizes="10rem" className="aspect-video" />
                        <Reproducir />
                      </div>
                      <span className="flex min-w-0 flex-col gap-1">
                        <span className="line-clamp-2 font-display leading-snug font-semibold break-words group-hover:text-peach">
                          {m.titulo}
                        </span>
                        <span className="text-xs text-cream/70">{m.detalle}</span>
                      </span>
                      <PestanaNueva que="se abre en YouTube" />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </ZonaBrillo>
        ) : (
          respaldo && (
            <ZonaBrillo>
              <a
                href={respaldo.href}
                {...(respaldo.externo ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="group d-brillo d-aparece @container relative isolate flex min-h-[clamp(18rem,40vw,26rem)] flex-col justify-end gap-3 overflow-hidden rounded-2xl p-[clamp(1.5rem,5cqi,3rem)] ring-1 ring-cream/10"
              >
                <Foto
                  src="escenario.webp"
                  sizes="100vw"
                  capa
                  encuadre="object-[50%_35%]"
                  efecto="d-ken-burns"
                  className="inset-0 -z-10"
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-0 -z-10 bg-linear-to-r from-(--d-tinta) via-(--d-tinta)/75 to-(--d-tinta)/20"
                />
                <Aro className="size-[clamp(3.5rem,8cqi,4.5rem)] text-peach transition-colors group-hover:bg-peach group-hover:text-ink">
                  <Icon name="play" fill="currentColor" className="ml-[0.12em] size-[38%]" />
                </Aro>
                <span className="max-w-[32rem] font-display text-[clamp(1.75rem,5cqi,3rem)] leading-[1.02] font-extrabold tracking-[-0.03em]">
                  Los cultos completos, cuando quieras.
                </span>
                <span className="max-w-[30rem] text-cream/85">
                  Mira las prédicas de cada domingo en nuestro canal y compártelas con quien las
                  necesite.
                </span>
                <span className="inline-flex items-center gap-2 font-display font-semibold text-peach">
                  {respaldo.externo ? 'Ir al canal de YouTube' : 'Ver las prédicas'}
                  <Icon
                    name="arrowRight"
                    className="size-5 transition-transform motion-safe:group-hover:translate-x-1"
                  />
                </span>
                {respaldo.externo && <PestanaNueva />}
              </a>
            </ZonaBrillo>
          )
        )}
      </div>
    </section>
  );
}

/** Series de prédicas (SERIES de ejemplo): la primera destacada en azul y las otras en crema. */
export function Series() {
  return (
    <section id="series" aria-labelledby="series-titulo" className="bg-canvas text-ink">
      <div
        className={`${CONTENEDOR} flex flex-col gap-[clamp(2rem,4vw,3rem)] py-[clamp(3rem,8vw,6rem)]`}
      >
        <TituloSeccion
          id="series-titulo"
          etiqueta="Series"
          intro="Mensajes que recorren un tema o un libro de la Biblia durante varias semanas."
        >
          Series de <em>mensajes.</em>
        </TituloSeccion>
        <ZonaBrillo
          as="ul"
          className="grid gap-[clamp(0.75rem,1.6vw,1.25rem)] md:grid-cols-2 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)]"
        >
          {SERIES.map((s, i) => {
            const primera = i === 0;
            return (
              <li
                key={s.titulo}
                className={`d-brillo d-aparece @container flex flex-col gap-3 rounded-2xl p-[clamp(1.25rem,7cqi,2rem)] md:min-h-[clamp(14rem,22vw,18rem)] ${
                  primera
                    ? 'relative isolate min-h-[16rem] overflow-hidden bg-(--d-noche) text-cream ring-1 ring-peach/30 on-dark md:col-span-2 lg:col-span-1'
                    : 'd-brillo-claro bg-surface ring-1 ring-line'
                }`}
              >
                {primera && (
                  <>
                    <Foto
                      src="predicador.webp"
                      sizes="(min-width: 64rem) 30vw, 100vw"
                      capa
                      encuadre="object-[50%_20%]"
                      className="inset-y-0 right-0 -z-10 w-[48%] mask-l-from-40%"
                    />
                    <Etiqueta className="text-(--d-arena)">Serie actual</Etiqueta>
                  </>
                )}
                <span
                  className={`text-sm font-semibold ${primera ? 'text-cream/80' : 'text-accent-strong'}`}
                >
                  {s.mensajes} mensajes
                </span>
                <h3
                  className={`mt-auto text-[clamp(1.75rem,11cqi,2.5rem)] leading-[1.02] break-words ${CURSIVA} ${
                    primera ? 'max-w-[62%]' : 'max-w-[16rem]'
                  } ${primera ? 'text-peach' : 'text-ink'}`}
                >
                  {s.titulo}
                </h3>
                <p
                  className={`text-[0.9375rem] leading-snug ${primera ? 'max-w-[58%] text-cream/85' : 'max-w-[22rem] text-ink-soft'}`}
                >
                  {s.texto}
                </p>
              </li>
            );
          })}
        </ZonaBrillo>
      </div>
    </section>
  );
}

/**
 * Devocionales (id="devocionales"): el plan de la semana de lunes a viernes, con el día de hoy
 * resaltado (el fin de semana, el lunes como el próximo).
 */
export function Devocionales({ fecha }: { fecha: string }) {
  const hoy = devocionalDeHoy(DEVOCIONALES, fecha);
  return (
    <section
      id="devocionales"
      aria-labelledby="devocionales-titulo"
      className="relative isolate bg-(--d-noche) text-cream on-dark"
    >
      <FocoCursor />
      <div
        className={`${CONTENEDOR} flex flex-col gap-[clamp(2rem,4vw,3rem)] py-[clamp(3rem,8vw,6rem)]`}
      >
        <TituloSeccion
          id="devocionales-titulo"
          etiqueta="Devocionales"
          oscuro
          intro="Una lectura corta para cada día: lee el pasaje, piensa en la frase y conviértela en oración."
        >
          Plan de la <em>semana.</em>
        </TituloSeccion>
        <ZonaBrillo
          as="ol"
          className="grid gap-[clamp(0.625rem,1.2vw,0.875rem)] md:grid-cols-2 lg:grid-cols-5"
        >
          {DEVOCIONALES.map((d, i) => {
            const actual = hoy?.indice === i;
            return (
              <li
                key={d.dia}
                aria-current={actual && hoy?.hoy ? 'date' : undefined}
                className={`d-brillo d-aparece @container flex flex-col gap-2 rounded-2xl p-[clamp(1.125rem,8cqi,1.5rem)] ring-1 md:last:col-span-2 lg:last:col-span-1 ${
                  actual ? 'bg-(--d-marino) ring-peach/60' : 'bg-cream/4 ring-cream/12'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <Etiqueta raya={false} className="text-(--d-arena)">
                    {d.dia}
                  </Etiqueta>
                  {actual && (
                    <span className="rounded-full bg-(--d-durazno) px-2.5 py-0.5 text-xs font-semibold text-ink">
                      {hoy?.hoy ? 'Hoy' : 'Próximo'}
                    </span>
                  )}
                </div>
                <span
                  className={`text-[clamp(1.125rem,8cqi,1.375rem)] leading-tight text-peach ${CURSIVA}`}
                >
                  {d.pasaje}
                </span>
                <h3 className="font-display text-[clamp(1.25rem,10cqi,1.5rem)] leading-tight font-bold break-words">
                  {d.titulo}
                </h3>
                <p className="text-[0.9375rem] leading-snug text-cream/80">{d.texto}</p>
              </li>
            );
          })}
        </ZonaBrillo>
      </div>
    </section>
  );
}

/** Canales (redes de la configuración) en filas grandes que brillan con el cursor. */
export function Canales({ redes }: { redes: Red[] }) {
  if (redes.length === 0) return null;
  return (
    <section
      aria-labelledby="canales-titulo"
      className="relative isolate bg-(--d-marino) text-cream on-dark"
    >
      <FocoCursor />
      <div
        className={`${CONTENEDOR} grid gap-[clamp(2rem,4vw,4rem)] py-[clamp(3rem,8vw,6rem)] lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-center`}
      >
        <div className="flex flex-col items-start gap-6">
          <TituloSeccion
            id="canales-titulo"
            etiqueta="Canales"
            oscuro
            intro="Avisos, transmisiones y momentos de la semana. Síguenos y comparte con tus amigos."
          >
            Síguenos en <em>línea.</em>
          </TituloSeccion>
          <Link href="/oracion" className={pildora({ tono: 'contornoClaro' })}>
            Pedir oración
          </Link>
        </div>
        <ZonaBrillo as="ul" className="grid gap-[clamp(0.5rem,1vw,0.75rem)]">
          {redes.map((red) => (
            <li key={red.href} className="d-aparece">
              <a
                href={red.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group d-brillo flex min-h-20 items-center gap-4 rounded-xl bg-(--d-tinta) px-5 py-4 ring-1 ring-cream/10"
              >
                <Aro className="size-12 text-peach transition-colors group-hover:bg-peach group-hover:text-ink">
                  <Icon name={red.icon} className="size-5" />
                </Aro>
                <span className="flex min-w-0 grow flex-col">
                  <span className="font-display text-lg font-semibold">{red.label}</span>
                  <span className="text-sm break-all text-cream/70">
                    {red.href.replace(/^https?:\/\/(www\.)?/, '')}
                  </span>
                </span>
                <Icon
                  name="arrowUpRight"
                  className="size-5 shrink-0 text-peach transition-transform motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5"
                />
                <PestanaNueva />
              </a>
            </li>
          ))}
        </ZonaBrillo>
      </div>
    </section>
  );
}
