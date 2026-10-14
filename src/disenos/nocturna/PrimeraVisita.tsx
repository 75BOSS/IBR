import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { toneVar } from '@/lib/css-vars';
import { DAY_NAMES, formatTime } from '@/lib/dates';
import { type Ministerio, edadText, ministerioName } from '@/lib/ministerios';
import type { Reunion } from '@/lib/reuniones';
import { PREGUNTAS_VISITA, QUE_ESPERAR } from '../contenido';
import { IconoMapa } from './IconoMapa';
import { FocoCursor, ZonaBrillo } from './efectos';
import { FranjaCierre, PortadaInterior } from './Secciones';
import { type DiaDeReunion, unirHoras } from './dia-de-reunion';
import { RUTAS } from './rutas';
import {
  Acordeon,
  Aro,
  CONTENEDOR,
  CURSIVA,
  ENTRADA,
  EnlaceFlecha,
  Foto,
  PestanaNueva,
  SUBTITULAR,
  TituloSeccion,
  pildora,
} from './ui';

const SOY_NUEVO = '/soy-nuevo';
const DOMINGO = 7;

/** Portada de la Primera visita: «Ven tal como eres.». */
export function PortadaVisita({
  nombre,
  comoLlegar,
}: {
  nombre: string;
  comoLlegar: string | null;
}) {
  return (
    <PortadaInterior
      id="visita-titulo"
      etiquetas={['Primera visita', nombre]}
      foto="auditorio.webp"
      encuadre="object-[50%_60%]"
      titulo={
        <>
          Ven tal como <em className="block text-[1em]">eres.</em>
        </>
      }
      texto="Queremos que te sientas en casa desde que llegas. Aquí te contamos cómo es una reunión, qué hacer con tus hijos y cómo llegar."
    >
      <Link href={SOY_NUEVO} className={pildora({ tono: 'durazno', tamano: 'lg' })}>
        Déjanos tus datos
        <Icon name="arrowRight" className="size-[1.2em]" />
      </Link>
      {comoLlegar && (
        <a
          href={comoLlegar}
          target="_blank"
          rel="noopener noreferrer"
          className={pildora({ tono: 'contornoClaro', tamano: 'lg' })}
        >
          <Icon name="mapPin" className="size-[1.1em]" />
          Cómo llegar
          <PestanaNueva que="abre Google Maps" />
        </a>
      )}
    </PortadaInterior>
  );
}

/** Reuniones agrupadas por día: el domingo primero y luego de lunes a sábado. */
function porDia(reuniones: Reunion[]): { dia: number; reuniones: Reunion[] }[] {
  const dias = [...new Set(reuniones.map((r) => r.dia_semana))].sort(
    (a, b) => (a === DOMINGO ? 0 : a) - (b === DOMINGO ? 0 : b),
  );
  return dias.map((dia) => ({
    dia,
    reuniones: reuniones
      .filter((r) => r.dia_semana === dia)
      .sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio) || a.orden - b.orden),
  }));
}

/**
 * Horarios reales (id="horarios"), un día por tarjeta: el domingo grande y los demás a su lado.
 * Cada reunión con su hora, su ministerio (con su color) y si es en línea o dónde.
 */
export function Horarios({
  reuniones,
  verTodos,
}: {
  reuniones: Reunion[];
  /** /reuniones tiene horarios. */
  verTodos: boolean;
}) {
  const dias = porDia(reuniones);
  return (
    <section
      id="horarios"
      aria-labelledby="horarios-titulo"
      className="relative isolate bg-(--d-marino) text-cream on-dark"
    >
      <FocoCursor />
      <div
        className={`${CONTENEDOR} flex flex-col gap-[clamp(2rem,4vw,3rem)] py-[clamp(3rem,8vw,6rem)]`}
      >
        <div className="flex flex-wrap items-end justify-between gap-6">
          <TituloSeccion
            id="horarios-titulo"
            etiqueta="Horarios"
            oscuro
            intro="Elige el día que te quede mejor. El domingo es nuestra reunión principal, con clase para los niños a la misma hora."
          >
            Cuándo nos <em>reunimos.</em>
          </TituloSeccion>
          {verTodos && (
            <EnlaceFlecha href="/reuniones" className="text-peach hover:text-cream">
              Todos los horarios
            </EnlaceFlecha>
          )}
        </div>
        {dias.length > 0 ? (
          <ZonaBrillo
            as="ul"
            className={`grid gap-[clamp(0.75rem,1.4vw,1rem)] md:grid-cols-2 ${
              dias.length >= 3 ? 'lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)_minmax(0,1fr)]' : ''
            }`}
          >
            {dias.map(({ dia, reuniones: delDia }, i) => {
              const principal = i === 0;
              return (
                <li
                  key={dia}
                  className={`d-brillo d-aparece @container flex flex-col gap-4 rounded-2xl p-[clamp(1.25rem,7cqi,2rem)] ring-1 ${
                    principal
                      ? 'bg-(--d-noche) ring-peach/40 md:col-span-2 lg:col-span-1'
                      : 'bg-(--d-tinta) ring-cream/10'
                  }`}
                >
                  <h3
                    className={`font-display leading-none font-extrabold tracking-[-0.035em] break-words ${
                      principal
                        ? 'text-[clamp(2.5rem,16cqi,4rem)]'
                        : 'text-[clamp(1.75rem,12cqi,2.25rem)]'
                    }`}
                  >
                    {DAY_NAMES[dia]}
                  </h3>
                  <ul className="flex flex-col divide-y divide-cream/12">
                    {delDia.map((r) => (
                      <li
                        key={r.id}
                        style={toneVar(r.rango_color, 'var(--d-durazno)')}
                        className="flex items-start gap-4 py-3 first:pt-0 last:pb-0"
                      >
                        <span className="w-[3.25rem] shrink-0 font-display text-lg font-semibold text-peach tabular-nums">
                          {formatTime(r.hora_inicio)}
                        </span>
                        <span className="flex min-w-0 flex-col gap-1">
                          <span className="font-display leading-tight font-semibold break-words">
                            {r.nombre}
                          </span>
                          <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-cream/75">
                            {r.rango_edad && (
                              <span className="inline-flex items-center gap-1.5">
                                <span
                                  aria-hidden="true"
                                  className="size-2 rounded-full bg-(--tone)"
                                />
                                {r.rango_edad}
                              </span>
                            )}
                            {r.en_linea ? (
                              <span>En línea</span>
                            ) : (
                              r.ubicacion && <span className="break-words">{r.ubicacion}</span>
                            )}
                          </span>
                        </span>
                      </li>
                    ))}
                  </ul>
                  {principal && (
                    <span className="mt-auto inline-flex items-center gap-2 self-start rounded-full bg-(--d-durazno) px-3 py-1 text-xs font-semibold text-ink">
                      <Icon name="sparkle" className="size-3.5" />
                      Ideal para tu primera visita
                    </span>
                  )}
                </li>
              );
            })}
          </ZonaBrillo>
        ) : (
          <p className="max-w-[34rem] text-cream/85">
            Pronto publicaremos los horarios.{' '}
            <Link href="/contacto#mensaje" className="link">
              Escríbenos
            </Link>{' '}
            y te contamos cuándo reunirnos.
          </p>
        )}
      </div>
    </section>
  );
}

/** «Qué puedes esperar» (QUE_ESPERAR): la foto de la bienvenida y los cuatro momentos. */
export function QueEsperar() {
  return (
    <section aria-labelledby="esperar-titulo" className="bg-canvas text-ink">
      <div
        className={`${CONTENEDOR} grid gap-[clamp(2rem,4.5vw,4.5rem)] py-[clamp(3rem,8vw,6rem)] lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]`}
      >
        <div className="flex flex-col gap-[clamp(1.25rem,2.4vw,1.75rem)] lg:sticky lg:top-[calc(var(--d-cabecera)+2rem)] lg:self-start">
          <TituloSeccion
            id="esperar-titulo"
            etiqueta="Tu primer domingo"
            intro="Una reunión dura alrededor de una hora y media. Esto es lo que vas a vivir."
          >
            Qué puedes <em>esperar.</em>
          </TituloSeccion>
          <figure className="d-aparece flex flex-col gap-2">
            <Foto
              src="bienvenida.webp"
              sizes="(min-width: 64rem) 45vw, 100vw"
              encuadre="object-[45%_center]"
              efecto="transition-transform duration-1000 ease-(--ease-out-soft) motion-safe:hover:scale-105"
              className="aspect-[16/9] rounded-2xl"
            />
            <figcaption className="text-sm text-ink-soft">
              El equipo de bienvenida te espera en la entrada.
            </figcaption>
          </figure>
        </div>
        <ol className="flex flex-col">
          {QUE_ESPERAR.map((m, i) => (
            <li
              key={m.titulo}
              className="d-aparece grid grid-cols-[auto_minmax(0,1fr)] gap-x-[clamp(1rem,3vw,2rem)] border-t border-line py-[clamp(1.5rem,3.5vw,2.5rem)] last:border-b"
            >
              <span
                aria-hidden="true"
                className={`text-[clamp(2.75rem,2rem+3vw,4.5rem)] leading-[0.85] text-accent-strong ${CURSIVA}`}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="flex flex-col gap-2">
                <h3 className={SUBTITULAR}>{m.titulo}</h3>
                <p className={`text-ink-soft ${ENTRADA}`}>{m.texto}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/**
 * Niños (ministerios reales para menores de edad): la respuesta de la visita y, por ministerio,
 * su edad y cuándo se reúne, con enlace a su lugar en la página Ministerios.
 */
export function NinosVisita({
  ministerios,
  reuniones,
}: {
  ministerios: Ministerio[];
  reuniones: Reunion[];
}) {
  const menores = ministerios
    .filter((m) => m.edad_min !== null && m.edad_min < 18)
    .sort((a, b) => (a.edad_min ?? 0) - (b.edad_min ?? 0));
  const ninos = PREGUNTAS_VISITA.find((p) => p.pregunta.includes('hijos'));
  if (menores.length === 0 && !ninos) return null;
  const foto = menores[0]?.imagen_url ?? 'ninos.webp';
  return (
    <section
      aria-labelledby="ninos-titulo"
      className="relative isolate overflow-hidden bg-(--d-noche) text-cream on-dark"
    >
      <FocoCursor />
      <div
        className={`${CONTENEDOR} grid items-center gap-[clamp(2rem,4.5vw,4.5rem)] py-[clamp(3rem,8vw,6rem)] lg:grid-cols-2`}
      >
        <Foto
          src={foto}
          sizes="(min-width: 64rem) 45vw, 100vw"
          encuadre="object-[50%_35%]"
          className="d-aparece aspect-[4/3] rounded-2xl ring-1 ring-cream/10 md:aspect-[16/8] lg:order-2 lg:aspect-[4/3]"
        />
        <div className="flex flex-col gap-[clamp(1.25rem,2.4vw,1.75rem)]">
          <TituloSeccion
            id="ninos-titulo"
            etiqueta="Niños y adolescentes"
            oscuro
            intro={ninos?.respuesta}
          >
            Tus hijos, en buenas <em>manos.</em>
          </TituloSeccion>
          {menores.length > 0 && (
            <ZonaBrillo as="ul" className="flex flex-col gap-[clamp(0.5rem,1vw,0.75rem)]">
              {menores.map((m) => {
                const propias = reuniones.filter((r) => r.rango_edad_id === m.id);
                return (
                  <li key={m.id} style={toneVar(m.color, 'var(--d-durazno)')} className="d-aparece">
                    <Link
                      href={`${RUTAS.ministerios}#${m.slug}`}
                      className="group d-brillo flex items-center gap-4 overflow-hidden rounded-xl bg-(--d-tinta) py-4 pr-5 pl-4 ring-1 ring-cream/10"
                    >
                      <span
                        aria-hidden="true"
                        className="h-12 w-1.5 shrink-0 rounded-full bg-(--tone)"
                      />
                      <span className="flex min-w-0 grow flex-col gap-0.5">
                        <span className="font-display text-[clamp(1.125rem,1rem+0.5vw,1.375rem)] leading-tight font-bold break-words group-hover:text-peach">
                          {ministerioName(m)}
                        </span>
                        <span className="text-sm text-cream/75">
                          {[
                            edadText(m),
                            ...propias.map(
                              (r) => `${DAY_NAMES[r.dia_semana]} ${formatTime(r.hora_inicio)}`,
                            ),
                          ]
                            .filter(Boolean)
                            .join(' · ')}
                        </span>
                      </span>
                      <Icon
                        name="arrowRight"
                        className="size-5 shrink-0 text-peach transition-transform motion-safe:group-hover:translate-x-1"
                      />
                    </Link>
                  </li>
                );
              })}
            </ZonaBrillo>
          )}
        </div>
      </div>
    </section>
  );
}

/** Preguntas de la primera visita en acordeón, con una salida para la que no esté. */
export function PreguntasVisita() {
  return (
    <section aria-labelledby="preguntas-titulo" className="bg-canvas text-ink">
      <div
        className={`${CONTENEDOR} grid gap-[clamp(2rem,4.5vw,4.5rem)] py-[clamp(3rem,8vw,6rem)] lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]`}
      >
        <div className="flex flex-col items-start gap-[clamp(1.25rem,2.4vw,1.75rem)]">
          <TituloSeccion id="preguntas-titulo" etiqueta="Preguntas">
            Lo que muchos <em>preguntan.</em>
          </TituloSeccion>
          <div className="d-aparece flex flex-col items-start gap-2 rounded-2xl bg-sunken p-[clamp(1.25rem,2.5vw,1.75rem)]">
            <p className="font-display text-lg font-semibold">¿Tienes otra pregunta?</p>
            <p className="text-ink-soft">Escríbenos y alguien del equipo te responde.</p>
            <EnlaceFlecha href="/contacto#mensaje" className="text-accent-strong hover:text-ink">
              Escribir un mensaje
            </EnlaceFlecha>
          </div>
        </div>
        <div className="d-aparece">
          <Acordeon nombre="visita" preguntas={PREGUNTAS_VISITA} />
        </div>
      </div>
    </section>
  );
}

/**
 * Cómo llegar (solo si hay mapa o dirección): dónde, la referencia y cuándo, con el botón al
 * mapa y un pin que late (quieto con «reducir movimiento»).
 */
export function ComoLlegar({
  href,
  direccion,
  referencia,
  visita,
}: {
  href: string;
  direccion: string | null;
  referencia: string | null;
  visita: DiaDeReunion | null;
}) {
  const datos = [
    { termino: 'Dónde', valor: direccion ?? 'Riobamba' },
    ...(referencia ? [{ termino: 'Referencia', valor: referencia }] : []),
    ...(visita
      ? [
          {
            termino: 'Cuándo',
            valor: [visita.dia, unirHoras(visita.horas)].filter(Boolean).join(' · '),
          },
        ]
      : []),
  ];
  return (
    <section id="como-llegar" aria-labelledby="llegar-titulo" className="bg-sunken text-ink">
      <ZonaBrillo
        className={`${CONTENEDOR} grid items-center gap-[clamp(2rem,4.5vw,4.5rem)] py-[clamp(3rem,8vw,6rem)] lg:grid-cols-2`}
      >
        <div className="flex flex-col items-start gap-[clamp(1.25rem,2.4vw,1.75rem)]">
          <TituloSeccion
            id="llegar-titulo"
            etiqueta="Cómo llegar"
            intro="Abre el mapa y te lleva desde donde estés. Si vienes por primera vez, llega unos minutos antes."
          >
            Te esperamos <em>aquí.</em>
          </TituloSeccion>
          <dl className="d-aparece grid w-full max-w-[32rem] grid-cols-[auto_minmax(0,1fr)] gap-x-6 gap-y-3 border-t border-line pt-4">
            {datos.map((d) => (
              <div key={d.termino} className="contents">
                <dt className="caps text-ink-soft">{d.termino}</dt>
                <dd className="font-semibold break-words">{d.valor}</dd>
              </div>
            ))}
          </dl>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={pildora({ tono: 'naranja' })}
          >
            <Icon name="mapPin" className="size-[1.1em]" />
            Abrir en Google Maps
            <PestanaNueva que="abre Google Maps" />
          </a>
        </div>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="group d-brillo d-aparece @container relative isolate flex min-h-[clamp(18rem,36vw,24rem)] flex-col items-center justify-center gap-4 overflow-hidden rounded-2xl bg-(--d-noche) p-8 text-center text-cream ring-1 ring-peach/30 on-dark"
        >
          <FocoCursor />
          <span className="relative grid place-items-center">
            <span
              aria-hidden="true"
              className="absolute size-full rounded-full border-2 border-peach/60 motion-safe:animate-ping"
            />
            <Aro className="size-[clamp(5rem,22cqi,7rem)] bg-(--d-tinta) text-peach transition-colors group-hover:bg-peach group-hover:text-ink">
              <IconoMapa className="size-[42%]" />
            </Aro>
          </span>
          <span className="font-display text-[clamp(1.5rem,7cqi,2.25rem)] leading-tight font-extrabold tracking-[-0.03em]">
            {direccion ?? 'Riobamba'}
          </span>
          <span className="inline-flex items-center gap-2 font-display font-semibold text-peach">
            Ver la ruta en el mapa
            <Icon
              name="arrowRight"
              className="size-5 transition-transform motion-safe:group-hover:translate-x-1"
            />
          </span>
          <PestanaNueva que="abre Google Maps" />
        </a>
      </ZonaBrillo>
    </section>
  );
}

/** Cierre: «Déjanos tus datos» lleva al formulario de Soy nuevo del sitio. */
export function CierreVisita() {
  return (
    <FranjaCierre
      id="cierre-visita-titulo"
      etiqueta="Antes de venir"
      foto="lugar.webp"
      titulo={
        <>
          Te guardamos un <em>lugar.</em>
        </>
      }
      texto="Cuéntanos que vienes y alguien del equipo de bienvenida te espera en la entrada para acompañarte."
    >
      <Link href={SOY_NUEVO} className={pildora({ tono: 'naranja' })}>
        Déjanos tus datos
        <Icon name="arrowRight" className="size-[1.15em]" />
      </Link>
    </FranjaCierre>
  );
}
