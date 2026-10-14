import Link from 'next/link';
import type { ReactNode } from 'react';
import { Icon } from '@/components/Icon';
import { toneVar } from '@/lib/css-vars';
import { DAY_NAMES, formatTime } from '@/lib/dates';
import { FRECUENCIAS_LABEL, type GrupoPublico } from '@/lib/grupos-public';
import { type Ministerio, edadText, ministerioName } from '@/lib/ministerios';
import type { Area } from '@/lib/servir';
import { FocoCursor, ZonaBrillo } from './efectos';
import { FranjaCierre, PortadaInterior } from './Secciones';
import { RUTAS } from './rutas';
import {
  CONTENEDOR,
  EnlaceFlecha,
  Etiqueta,
  Foto,
  PestanaNueva,
  SUBTITULAR,
  TituloSeccion,
  pildora,
} from './ui';

/** Portada de Comunidad (imagen 8): «La vida se comparte.». */
export function PortadaComunidad({ nombre }: { nombre: string }) {
  return (
    <PortadaInterior
      id="comunidad-titulo"
      etiquetas={['Comunidad', nombre]}
      foto="comunidad.webp"
      encuadre="object-[62%_center]"
      titulo={
        <>
          La vida <em className="block text-[1em]">se comparte.</em>
        </>
      }
      texto="En IBR creemos que la fe se vive mejor en familia. Aquí encontrarás personas reales, relaciones auténticas y un lugar donde puedes pertenecer."
    />
  );
}

type Tarjeta = {
  href: string;
  foto: string;
  titulo: string;
  texto: string;
  /** Dato real sobre la foto (cuántos grupos, el ministerio de niños, cuántos equipos). */
  dato: string;
  /** Color propio del ministerio (BD) para el punto del dato. */
  color?: string | null;
};

function TarjetaComunidad({ tarjeta }: { tarjeta: Tarjeta }) {
  return (
    <li className="d-aparece @container flex">
      <Link href={tarjeta.href} className="group flex w-full flex-col">
        <div className="relative overflow-hidden rounded-[0.3rem]">
          <Foto
            src={tarjeta.foto}
            sizes="(min-width: 48rem) 30vw, 100vw"
            efecto="transition-transform duration-700 ease-(--ease-out-soft) motion-safe:group-hover:scale-105"
            className="aspect-[16/9] @md:aspect-[2.35/1]"
          />
          <span
            style={tarjeta.color !== undefined ? toneVar(tarjeta.color) : undefined}
            className="absolute bottom-3 left-3 inline-flex max-w-[calc(100%-1.5rem)] items-center gap-2 rounded-full bg-(--d-tinta)/85 px-3 py-1.5 text-[0.8125rem] font-semibold text-cream"
          >
            {tarjeta.color !== undefined && (
              <span aria-hidden="true" className="size-2.5 shrink-0 rounded-full bg-(--tone)" />
            )}
            <span className="min-w-0 break-words">{tarjeta.dato}</span>
          </span>
        </div>
        <h2 className="mt-[clamp(0.625rem,3cqi,0.875rem)] font-display text-[clamp(1.5rem,7cqi,2.05rem)] leading-tight font-bold tracking-[-0.03em] text-ink group-hover:text-brand">
          {tarjeta.titulo}
        </h2>
        <p className="mt-2 max-w-[25rem] text-[clamp(0.9375rem,3.7cqi,1.0625rem)] leading-[1.4] tracking-[0.01em] text-ink-soft">
          {tarjeta.texto}
        </p>
        <span className="mt-auto inline-flex items-center gap-3 pt-[clamp(0.875rem,4cqi,1.25rem)] text-[0.9375rem] font-semibold tracking-[0.12em] text-accent-strong uppercase">
          Conoce más
          <Icon
            name="arrowRight"
            className="size-5 transition-transform motion-safe:group-hover:translate-x-1"
          />
        </span>
      </Link>
    </li>
  );
}

const plural = (n: number, uno: string, varios: string) => `${n} ${n === 1 ? uno : varios}`;

/** El ministerio de los más pequeños (el de menor edad que empieza antes de los 12 años). */
export function ministerioNinos(ministerios: Ministerio[]): Ministerio | undefined {
  return ministerios
    .filter((m) => m.edad_min !== null && m.edad_min < 12)
    .sort((a, b) => (a.edad_min ?? 0) - (b.edad_min ?? 0))[0];
}

/**
 * Las tres puertas de Comunidad (imagen 8): grupos en casa, niños y familias, servir juntos.
 * Llevan a las secciones de esta misma página (y al ministerio de niños de la propuesta).
 */
export function TarjetasComunidad({
  grupos,
  ministerios,
  areas,
}: {
  grupos: GrupoPublico[];
  ministerios: Ministerio[];
  areas: Area[];
}) {
  const zonas = zonasDe(grupos);
  const ninos = ministerioNinos(ministerios);

  const tarjetas: Tarjeta[] = [
    ...(grupos.length > 0
      ? [
          {
            href: '#grupos',
            foto: 'grupos.webp',
            titulo: 'Grupos en casa',
            texto: 'Conecta, crece y comparte la vida en grupos más pequeños durante la semana.',
            dato: [plural(grupos.length, 'grupo', 'grupos'), zonas.slice(0, 3).join(', ')]
              .filter(Boolean)
              .join(' · '),
          },
        ]
      : []),
    ...(ministerios.length > 0
      ? [
          {
            href: ninos ? `${RUTAS.ministerios}#${ninos.slug}` : '#edades',
            foto: 'ninos.webp',
            titulo: 'Niños y familias',
            texto:
              'Un espacio seguro y divertido para que los más pequeños conozcan y amen a Jesús.',
            dato: ninos
              ? [ministerioName(ninos), edadText(ninos)].filter(Boolean).join(' · ')
              : plural(ministerios.length, 'ministerio por edad', 'ministerios por edad'),
            color: ninos ? ninos.color : undefined,
          },
        ]
      : []),
    ...(areas.length > 0
      ? [
          {
            href: '#servir',
            foto: 'servir.webp',
            titulo: 'Servir juntos',
            texto: 'Usa tus dones para bendecir a otros y ser parte de lo que Dios está haciendo.',
            dato: plural(areas.length, 'equipo de servicio', 'equipos de servicio'),
          },
        ]
      : []),
  ];
  if (tarjetas.length === 0) return null;

  return (
    <section aria-label="Formas de conectar" className="bg-canvas">
      <ul
        className={`${CONTENEDOR} grid gap-x-[clamp(1.25rem,2vw,1.75rem)] gap-y-10 pt-6 pb-[clamp(2.5rem,6vw,4rem)] md:auto-cols-fr md:grid-flow-col`}
      >
        {tarjetas.map((t) => (
          <TarjetaComunidad key={t.href} tarjeta={t} />
        ))}
      </ul>
    </section>
  );
}

/** Zonas de Riobamba con algún grupo, sin repetir. */
function zonasDe(grupos: GrupoPublico[]): string[] {
  return [...new Set(grupos.map((g) => g.zona).filter((z): z is string => Boolean(z)))];
}

/** «Miércoles 19:30» (o solo el día, o nada si el grupo aún no tiene horario). */
function cuandoGrupo(g: GrupoPublico): string {
  const dia = g.dia_semana ? DAY_NAMES[g.dia_semana] : '';
  return [dia, formatTime(g.hora)].filter(Boolean).join(' ');
}

/** Ficha de un grupo: día y hora como un boleto a la izquierda y lo demás a la derecha. */
function FichaGrupo({ grupo, destacado }: { grupo: GrupoPublico; destacado: boolean }) {
  const dia = (grupo.dia_semana && DAY_NAMES[grupo.dia_semana]?.slice(0, 3)) || '—';
  const lugar = grupo.zona ?? grupo.ubicacion;
  return (
    <li
      className={`d-brillo d-aparece @container overflow-hidden rounded-xl bg-(--d-tinta) ring-1 ring-cream/10 ${
        destacado ? 'md:col-span-2' : ''
      }`}
    >
      <Link
        href={`/grupos/${grupo.id}`}
        className={`group flex h-full flex-col ${destacado ? '@xl:flex-row' : ''}`}
      >
        {destacado && (
          <Foto
            src={grupo.imagen_url ?? 'grupos.webp'}
            sizes="(min-width: 64rem) 40vw, 100vw"
            efecto="transition-transform duration-700 motion-safe:group-hover:scale-105"
            className="aspect-[16/8] shrink-0 @xl:aspect-auto @xl:w-[46%]"
          />
        )}
        <div className="flex grow items-stretch gap-[clamp(0.875rem,4cqi,1.5rem)] p-[clamp(1rem,4.5cqi,1.5rem)]">
          <span
            aria-hidden="true"
            className="flex w-[clamp(3.5rem,16cqi,4.5rem)] shrink-0 flex-col items-center justify-center border-r border-cream/15 pr-[clamp(0.75rem,3.5cqi,1.25rem)] leading-none"
          >
            <span className="font-display text-[clamp(1.375rem,7cqi,1.875rem)] font-extrabold tracking-[-0.03em]">
              {dia}
            </span>
            <span className="mt-1 text-[0.9375rem] font-semibold text-peach">
              {formatTime(grupo.hora) || '·'}
            </span>
          </span>
          <span className="flex min-w-0 flex-col gap-1.5">
            <span className="font-display text-[clamp(1.125rem,5.2cqi,1.375rem)] leading-tight font-bold break-words group-hover:text-peach">
              {grupo.nombre}
            </span>
            <span className="sr-only">{cuandoGrupo(grupo)}</span>
            {lugar && (
              <span className="inline-flex items-center gap-1.5 text-sm text-cream/80">
                <Icon name="mapPin" className="size-4 shrink-0 text-(--d-arena)" />
                <span className="min-w-0 break-words">{lugar}</span>
              </span>
            )}
            <span className="mt-1 flex flex-wrap gap-2">
              {grupo.rango_edad && (
                <span
                  style={toneVar(grupo.rango_color, 'var(--d-durazno)')}
                  className="inline-flex items-center gap-1.5 rounded-full bg-cream/8 px-2.5 py-1 text-xs font-semibold"
                >
                  <span aria-hidden="true" className="size-2 rounded-full bg-(--tone)" />
                  {grupo.rango_edad}
                </span>
              )}
              <span className="inline-flex items-center rounded-full bg-cream/8 px-2.5 py-1 text-xs font-semibold text-cream/85">
                {FRECUENCIAS_LABEL[grupo.frecuencia]}
              </span>
            </span>
          </span>
        </div>
      </Link>
    </li>
  );
}

/**
 * «Grupos en casa»: los grupos reales (día, hora, barrio y edad), el primero destacado con su
 * foto, y las zonas de Riobamba donde hay grupos. Sin grupos, la sección no se dibuja.
 */
export function GruposEnCasa({ grupos }: { grupos: GrupoPublico[] }) {
  if (grupos.length === 0) return null;
  const zonas = zonasDe(grupos);
  const visibles = grupos.slice(0, 5);
  return (
    <section
      id="grupos"
      aria-labelledby="grupos-titulo"
      className="relative isolate bg-(--d-noche) text-cream on-dark"
    >
      <FocoCursor />
      <div
        className={`${CONTENEDOR} grid gap-[clamp(2rem,4vw,3.5rem)] py-[clamp(3rem,8vw,6rem)] lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.7fr)]`}
      >
        <div className="flex flex-col items-start gap-[clamp(1.25rem,2.4vw,1.75rem)] lg:sticky lg:top-[calc(var(--d-cabecera)+2rem)] lg:self-start">
          <TituloSeccion
            id="grupos-titulo"
            etiqueta="Durante la semana"
            oscuro
            intro="Un grupo cerca de tu casa para leer la Biblia, orar y hacer amigos de verdad. Elige el día y el barrio que te queden mejor."
          >
            Grupos en <em>casa.</em>
          </TituloSeccion>
          {zonas.length > 0 && (
            <div className="flex flex-col gap-2.5">
              <Etiqueta raya={false} className="text-(--d-arena)">
                Barrios con grupos
              </Etiqueta>
              <ul className="flex flex-wrap gap-2">
                {zonas.map((z) => (
                  <li
                    key={z}
                    className="rounded-full border border-peach/35 px-3 py-1.5 text-sm text-cream/90"
                  >
                    {z}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <Link href="/grupos" className={pildora({ tono: 'durazno' })}>
            {grupos.length > visibles.length
              ? `Ver los ${grupos.length} grupos`
              : 'Buscar un grupo'}
            <Icon name="arrowRight" className="size-[1.15em]" />
          </Link>
        </div>
        <ZonaBrillo
          as="ul"
          className="grid content-start gap-[clamp(0.75rem,1.4vw,1rem)] md:grid-cols-2"
        >
          {visibles.map((g, i) => (
            <FichaGrupo key={g.id} grupo={g} destacado={i === 0} />
          ))}
        </ZonaBrillo>
      </div>
    </section>
  );
}

/** Columnas de la línea de las edades en escritorio: una por ministerio (hasta seis). */
const COLUMNAS_EDADES: Record<number, string> = {
  2: 'lg:grid-cols-2',
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
  5: 'lg:grid-cols-5',
  6: 'lg:grid-cols-6',
};

/** «3–11» / «65+»: el rango de edad corto para la línea de las edades. */
function rangoCorto(m: Pick<Ministerio, 'edad_min' | 'edad_max'>): string | null {
  if (m.edad_min === null) return null;
  return m.edad_max !== null ? `${m.edad_min}–${m.edad_max}` : `${m.edad_min}+`;
}

/**
 * «Un lugar para cada edad»: los ministerios reales en una línea de vida, de los más pequeños a
 * los mayores (horizontal en escritorio, vertical en celular), cada uno con su color.
 */
export function EdadesComunidad({ ministerios }: { ministerios: Ministerio[] }) {
  if (ministerios.length === 0) return null;
  const ordenados = [...ministerios].sort(
    (a, b) => (a.edad_min ?? 999) - (b.edad_min ?? 999) || a.orden - b.orden,
  );
  return (
    <section id="edades" aria-labelledby="edades-titulo" className="bg-canvas text-ink">
      <div
        className={`${CONTENEDOR} flex flex-col gap-[clamp(2rem,4vw,3.5rem)] py-[clamp(3rem,8vw,6rem)]`}
      >
        <div className="flex flex-wrap items-end justify-between gap-6">
          <TituloSeccion
            id="edades-titulo"
            etiqueta="Ministerios"
            intro="Desde los más pequeños hasta los abuelos: cada etapa de la vida tiene su espacio, su equipo y su reunión."
          >
            Un lugar para cada <em>edad.</em>
          </TituloSeccion>
          <EnlaceFlecha href={RUTAS.ministerios} className="text-accent-strong hover:text-ink">
            Ver los ministerios
          </EnlaceFlecha>
        </div>
        <ol
          className={`relative grid gap-y-[clamp(1.75rem,5vw,2.5rem)] before:absolute before:inset-y-2 before:left-[0.4375rem] before:w-px before:bg-line lg:gap-x-[clamp(1rem,2vw,2rem)] lg:before:inset-x-0 lg:before:top-[0.4375rem] lg:before:bottom-auto lg:before:h-px lg:before:w-auto ${COLUMNAS_EDADES[Math.min(ordenados.length, 6)] ?? ''}`}
        >
          {ordenados.map((m) => (
            <li
              key={m.id}
              style={toneVar(m.color, 'var(--color-accent)')}
              className="d-aparece @container relative grid content-start gap-2 pl-[clamp(2rem,8vw,2.75rem)] lg:pt-[clamp(2rem,3vw,2.75rem)] lg:pl-0"
            >
              <span
                aria-hidden="true"
                className="absolute top-0 left-0 size-[0.9375rem] rounded-full border-[3px] border-canvas bg-(--tone) ring-1 ring-(--tone)"
              />
              {rangoCorto(m) && (
                <span className="font-display text-[clamp(2rem,15cqi,3rem)] leading-none font-extrabold tracking-[-0.04em] text-ink">
                  {rangoCorto(m)}
                  <span className="ml-1.5 text-[0.4em] font-semibold tracking-normal text-ink-soft">
                    años
                  </span>
                </span>
              )}
              <h3 className={`${SUBTITULAR} text-[clamp(1.25rem,9cqi,1.625rem)]`}>
                <Link
                  href={`${RUTAS.ministerios}#${m.slug}`}
                  className="underline decoration-(--tone) decoration-2 underline-offset-[0.3em] transition-colors hover:text-accent-strong"
                >
                  {ministerioName(m)}
                </Link>
              </h3>
              {m.descripcion && (
                <p className="line-clamp-3 max-w-[22rem] text-[0.9375rem] leading-snug text-ink-soft">
                  {m.descripcion}
                </p>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/**
 * Áreas de servicio reales en mosaico (la primera grande), con su foto y a dónde anotarse.
 * La usan Comunidad y Crecer; sin áreas, no se dibuja.
 */
export function AreasServicio({
  areas,
  servir,
  id = 'servir',
  titulo,
  intro,
}: {
  areas: Area[];
  /** /servir tiene contenido: cada área lleva a anotarse en ella. */
  servir: boolean;
  id?: string;
  titulo: ReactNode;
  intro: string;
}) {
  if (areas.length === 0) return null;
  const sobraUna = (areas.length - 1) % 2 === 1;
  return (
    <section
      id={id}
      aria-labelledby={`${id}-titulo`}
      className="relative isolate bg-(--d-noche) text-cream on-dark"
    >
      <FocoCursor />
      <div
        className={`${CONTENEDOR} flex flex-col gap-[clamp(2rem,4vw,3rem)] py-[clamp(3rem,8vw,6rem)]`}
      >
        <div className="flex flex-wrap items-end justify-between gap-6">
          <TituloSeccion id={`${id}-titulo`} etiqueta="Servir juntos" oscuro intro={intro}>
            {titulo}
          </TituloSeccion>
          <EnlaceFlecha
            href={servir ? '/servir' : '/contacto#mensaje'}
            className="text-peach hover:text-cream"
          >
            {servir ? 'Quiero servir' : 'Escríbenos'}
          </EnlaceFlecha>
        </div>
        <ZonaBrillo
          as="ul"
          className="grid grid-flow-dense grid-cols-2 gap-[clamp(0.5rem,1.2vw,0.875rem)] md:grid-cols-3"
        >
          {areas.map((a, i) => {
            const grande = i === 0;
            const ultimaSola = sobraUna && i === areas.length - 1;
            return (
              <li
                key={a.id}
                className={`d-brillo d-aparece @container overflow-hidden rounded-xl ${
                  grande ? 'col-span-2 md:row-span-2' : ultimaSola ? 'col-span-2 md:col-span-1' : ''
                }`}
              >
                <Link
                  href={servir ? `/servir?area=${a.slug}#quiero-servir` : '/contacto#mensaje'}
                  className="group relative isolate flex h-full min-h-[clamp(9rem,26vw,13rem)] flex-col justify-end p-[clamp(0.875rem,5cqi,1.75rem)]"
                >
                  <Foto
                    src={a.imagen_url ?? 'servir.webp'}
                    sizes={
                      grande ? '(min-width: 48rem) 60vw, 100vw' : '(min-width: 48rem) 30vw, 50vw'
                    }
                    capa
                    efecto="transition-transform duration-700 ease-(--ease-out-soft) motion-safe:group-hover:scale-105"
                    className="inset-0 -z-10"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 -z-10 bg-linear-to-t from-(--d-tinta)/95 via-(--d-tinta)/45 to-(--d-tinta)/0"
                  />
                  <span
                    className={`font-display leading-tight font-bold tracking-[-0.02em] break-words group-hover:text-peach ${
                      grande
                        ? 'text-[clamp(1.625rem,7cqi,2.75rem)]'
                        : 'text-[clamp(1.125rem,9cqi,1.5rem)]'
                    }`}
                  >
                    {a.nombre}
                  </span>
                  {a.descripcion && (
                    <span
                      className={`mt-1 text-cream/85 ${grande ? 'line-clamp-3 max-w-[30rem] text-[clamp(0.9375rem,2.6cqi,1.0625rem)]' : 'hidden text-sm @[16rem]:line-clamp-2'}`}
                    >
                      {a.descripcion}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ZonaBrillo>
      </div>
    </section>
  );
}

/**
 * Franja final (imagen 8): «Hay un lugar para ti aquí.» con «Soy nuevo» (la primera visita de
 * la propuesta) y «Cómo llegar» (solo si hay mapa o dirección).
 */
export function FranjaLugar({ comoLlegar }: { comoLlegar: string | null }) {
  return (
    <FranjaCierre
      id="lugar-titulo"
      etiqueta="Tu siguiente paso"
      foto="lugar.webp"
      titulo={
        <>
          Hay un lugar{' '}
          <span className="block">
            para ti <em>aquí.</em>
          </span>
        </>
      }
      texto="Conoce más sobre nuestra iglesia, resuelve tus dudas y da tu primer paso. Nos encantaría conocerte."
    >
      <Link href={RUTAS.primeraVisita} className={pildora({ tono: 'naranja' })}>
        Soy nuevo
      </Link>
      {comoLlegar && (
        <a
          href={comoLlegar}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex min-h-11 items-center gap-3 text-sm font-semibold"
        >
          <span className="underline decoration-cream/70 underline-offset-4 group-hover:decoration-peach">
            Cómo llegar
          </span>
          <Icon
            name="arrowRight"
            className="size-5 transition-transform motion-safe:group-hover:translate-x-1"
          />
          <PestanaNueva que="abre Google Maps" />
        </a>
      )}
    </FranjaCierre>
  );
}
