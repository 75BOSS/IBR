import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { toneVar } from '@/lib/css-vars';
import { DAY_NAMES, formatTime } from '@/lib/dates';
import type { GrupoPublico } from '@/lib/grupos-public';
import { type Ministerio, edadText, ministerioName } from '@/lib/ministerios';
import type { Reunion } from '@/lib/reuniones';
import { MINISTERIOS_EXTRA } from '../contenido';
import { FocoCursor, ZonaBrillo } from './efectos';
import { PortadaInterior } from './Secciones';
import {
  CONTENEDOR,
  ENTRADA,
  EnlaceFlecha,
  Etiqueta,
  Foto,
  TITULAR,
  TituloSeccion,
  pildora,
} from './ui';

/** Fotos para los ministerios de ejemplo (Mujeres, Matrimonios, Hombres). */
const FOTOS_EXTRA: Record<string, string> = {
  mujeres: '/fotos-ejemplo/grupo-mujeres.webp',
  matrimonios: '/fotos-ejemplo/grupo-matrimonios.webp',
  hombres: '/fotos-ejemplo/grupo-estudio.webp',
};

/** Fotos de la propuesta para un ministerio que aún no tiene la suya. */
const FOTOS_RESPALDO = [
  'ninos.webp',
  'amigos.webp',
  'alabanza.webp',
  'mesa-familia.webp',
  'grupos.webp',
];

/**
 * Portada de Ministerios: «Un lugar para cada edad.» con un índice de la página (cada ministerio
 * real y los de ejemplo), para saltar al que interesa.
 */
export function PortadaMinisterios({ ministerios }: { ministerios: Ministerio[] }) {
  const indice = [
    ...ministerios.map((m) => ({ slug: m.slug, nombre: ministerioName(m) })),
    ...MINISTERIOS_EXTRA.map((m) => ({ slug: m.slug, nombre: m.nombre })),
  ];
  return (
    <PortadaInterior
      id="ministerios-titulo"
      etiquetas={['Ministerios', 'Comunidad']}
      foto="mesa-familia.webp"
      encuadre="object-[55%_center]"
      titulo={
        <>
          Un lugar para <em className="block text-[1em]">cada edad.</em>
        </>
      }
      texto="Niños, adolescentes, jóvenes, adultos y abuelos: cada etapa tiene su espacio, su equipo y personas que te esperan."
    >
      <nav aria-label="Ministerios en esta página">
        <ul className="flex flex-wrap gap-2">
          {indice.map((m) => (
            <li key={m.slug}>
              <Link
                href={`#${m.slug}`}
                className="inline-flex min-h-10 items-center rounded-full border border-peach/40 px-4 text-sm font-semibold text-cream transition-colors hover:border-peach hover:bg-peach hover:text-ink"
              >
                {m.nombre}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </PortadaInterior>
  );
}

/** «3–11» / «65+» para el número calado de fondo. */
function rangoCorto(m: Pick<Ministerio, 'edad_min' | 'edad_max'>): string | null {
  if (m.edad_min === null) return null;
  return m.edad_max !== null ? `${m.edad_min}–${m.edad_max}` : `${m.edad_min}+`;
}

/**
 * Un ministerio real (id = su slug, para las anclas #kids, #jovenes…): foto con su color, el
 * rango de edad calado en grande, la descripción, sus reuniones y sus grupos. Se alternan crema y
 * noche, y la foto cambia de lado, para que la página tenga ritmo.
 */
function BloqueMinisterio({
  ministerio,
  indice,
  reuniones,
  grupos,
  verGrupos,
}: {
  ministerio: Ministerio;
  indice: number;
  reuniones: Reunion[];
  grupos: GrupoPublico[];
  /** /grupos tiene contenido. */
  verGrupos: boolean;
}) {
  const oscuro = indice % 2 === 1;
  const edad = edadText(ministerio);
  const rango = rangoCorto(ministerio);
  const tituloId = `${ministerio.slug}-titulo`;
  return (
    <section
      id={ministerio.slug}
      aria-labelledby={tituloId}
      style={toneVar(ministerio.color, oscuro ? 'var(--d-durazno)' : 'var(--color-accent)')}
      className={`relative isolate overflow-hidden ${
        oscuro ? 'bg-(--d-noche) text-cream on-dark' : 'bg-canvas text-ink'
      }`}
    >
      {oscuro && <FocoCursor />}
      <div
        className={`${CONTENEDOR} grid items-center gap-[clamp(1.75rem,4.5vw,4.5rem)] py-[clamp(3rem,7vw,5.5rem)] md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:grid-cols-2`}
      >
        <div className={`relative ${oscuro ? 'md:order-2' : ''}`}>
          <Foto
            src={
              ministerio.imagen_url ??
              FOTOS_RESPALDO[indice % FOTOS_RESPALDO.length] ??
              'grupos.webp'
            }
            sizes="(min-width: 64rem) 45vw, 100vw"
            efecto="transition-transform duration-1000 ease-(--ease-out-soft) motion-safe:hover:scale-105"
            className="d-aparece aspect-[4/3] rounded-2xl"
          />
          <span
            aria-hidden="true"
            className={`absolute -bottom-3 h-1.5 w-[38%] rounded-full bg-(--tone) ${oscuro ? 'right-6' : 'left-6'}`}
          />
        </div>
        <div className="relative flex flex-col items-start gap-[clamp(0.875rem,1.6vw,1.25rem)]">
          {rango && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -top-[clamp(2.75rem,7vw,5rem)] right-0 -z-10 hidden font-display text-[clamp(4.5rem,1.5rem+9vw,11rem)] leading-none font-extrabold tracking-[-0.05em] text-transparent opacity-25 [-webkit-text-stroke:1.5px_var(--tone)] md:block"
            >
              {rango}
            </span>
          )}
          <Etiqueta className={oscuro ? 'text-(--d-arena)' : 'text-accent-strong'}>
            {edad ?? 'Para todas las edades'}
          </Etiqueta>
          <h2 id={tituloId} className={`d-aparece ${TITULAR}`}>
            {ministerioName(ministerio)}
          </h2>
          {ministerio.descripcion && (
            <p
              className={`d-aparece max-w-[34rem] ${ENTRADA} ${oscuro ? 'text-cream/85' : 'text-ink-soft'}`}
            >
              {ministerio.descripcion}
            </p>
          )}
          {(reuniones.length > 0 || grupos.length > 0) && (
            <ul
              className={`d-aparece flex w-full max-w-[34rem] flex-col divide-y rounded-xl ring-1 ${
                oscuro ? 'divide-cream/12 ring-cream/12' : 'divide-line bg-surface ring-line'
              }`}
            >
              {reuniones.map((r) => (
                <li key={`r${r.id}`} className="flex items-center gap-3 px-4 py-3">
                  <Icon name="clock" className="size-5 shrink-0 text-(--tone)" />
                  <span className="min-w-0">
                    <span className="font-semibold">
                      {DAY_NAMES[r.dia_semana]} {formatTime(r.hora_inicio)}
                    </span>
                    <span className={oscuro ? 'text-cream/75' : 'text-ink-soft'}>
                      {' · '}
                      {r.nombre}
                      {r.en_linea ? ' · en línea' : r.ubicacion ? ` · ${r.ubicacion}` : ''}
                    </span>
                  </span>
                </li>
              ))}
              {grupos.length > 0 && (
                <li className="flex items-center gap-3 px-4 py-3">
                  <Icon name="users" className="size-5 shrink-0 text-(--tone)" />
                  <span className="min-w-0">
                    <span className="font-semibold">
                      {grupos.length === 1 ? '1 grupo en casa' : `${grupos.length} grupos en casa`}
                    </span>
                    <span className={oscuro ? 'text-cream/75' : 'text-ink-soft'}>
                      {' · '}
                      {grupos
                        .slice(0, 3)
                        .map((g) => g.nombre)
                        .join(', ')}
                    </span>
                  </span>
                </li>
              )}
            </ul>
          )}
          <div className="mt-1 flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link
              href={`/ministerios/${ministerio.slug}`}
              className={pildora({ tono: oscuro ? 'durazno' : 'marino' })}
            >
              Conoce {ministerioName(ministerio)}
              <Icon name="arrowRight" className="size-[1.15em]" />
            </Link>
            {verGrupos && grupos.length > 0 && (
              <EnlaceFlecha
                href="/grupos"
                className={
                  oscuro ? 'text-peach hover:text-cream' : 'text-accent-strong hover:text-ink'
                }
              >
                Ver grupos
              </EnlaceFlecha>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Los ministerios reales de la BD, cada uno con sus reuniones y grupos. */
export function MinisteriosReales({
  ministerios,
  reuniones,
  grupos,
  verGrupos,
}: {
  ministerios: Ministerio[];
  reuniones: Reunion[];
  grupos: GrupoPublico[];
  verGrupos: boolean;
}) {
  return (
    <>
      {ministerios.map((m, i) => (
        <BloqueMinisterio
          key={m.id}
          ministerio={m}
          indice={i}
          reuniones={reuniones.filter((r) => r.rango_edad_id === m.id)}
          grupos={grupos.filter((g) => g.rango_edad_id === m.id)}
          verGrupos={verGrupos}
        />
      ))}
    </>
  );
}

/**
 * Mujeres, Matrimonios y Hombres (MINISTERIOS_EXTRA de ejemplo): tarjetas con foto, cada una con
 * su ancla (id = slug) como las de los ministerios reales.
 */
export function MinisteriosExtra() {
  return (
    <section
      aria-labelledby="extra-titulo"
      className="relative isolate bg-(--d-tinta) text-cream on-dark"
    >
      <FocoCursor />
      <div
        className={`${CONTENEDOR} flex flex-col gap-[clamp(2rem,4vw,3rem)] py-[clamp(3rem,8vw,6rem)]`}
      >
        <TituloSeccion
          id="extra-titulo"
          etiqueta="Más ministerios"
          oscuro
          intro="Espacios para crecer según tu etapa: amistad, estudio y oración con personas que viven lo mismo que tú."
        >
          También caminamos <em>juntos.</em>
        </TituloSeccion>
        <ZonaBrillo
          as="ul"
          className="grid items-start gap-[clamp(0.75rem,1.6vw,1.25rem)] md:grid-cols-3"
        >
          {MINISTERIOS_EXTRA.map((m, i) => (
            <li
              key={m.slug}
              id={m.slug}
              className={`group d-brillo d-aparece @container flex flex-col overflow-hidden rounded-2xl bg-(--d-tinta) ring-1 ring-cream/10 ${
                i === 1 ? 'md:mt-[clamp(1.5rem,4vw,3.5rem)]' : ''
              }`}
            >
              <Foto
                src={FOTOS_EXTRA[m.slug] ?? 'grupos.webp'}
                sizes="(min-width: 48rem) 30vw, 100vw"
                efecto="transition-transform duration-700 ease-(--ease-out-soft) motion-safe:group-hover:scale-105"
                className="aspect-[4/3]"
              />
              <div className="flex grow flex-col gap-2 p-[clamp(1.25rem,7cqi,1.75rem)]">
                <Etiqueta raya={false} className="text-(--d-arena)">
                  {m.para}
                </Etiqueta>
                <h3 className="font-display text-[clamp(1.5rem,10cqi,2rem)] leading-tight font-bold tracking-[-0.025em] break-words">
                  {m.nombre}
                </h3>
                <p className="leading-snug text-cream/80">{m.texto}</p>
                <EnlaceFlecha
                  href="/contacto#mensaje"
                  className="mt-auto pt-2 text-peach hover:text-cream"
                >
                  Quiero ser parte
                </EnlaceFlecha>
              </div>
            </li>
          ))}
        </ZonaBrillo>
      </div>
    </section>
  );
}
