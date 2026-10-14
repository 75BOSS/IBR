import Link from 'next/link';
import type { Creencia } from '@/lib/config-fields';
import type { EquipoRow } from '@/lib/equipo';
import type { ChurchStats } from '@/lib/stats';
import { paragraphs } from '@/lib/text';
import { ADN, HISTORIA } from '../contenido';
import { Cifra, FocoCursor, ZonaBrillo } from './efectos';
import { PortadaInterior } from './Secciones';
import { RUTAS } from './rutas';
import {
  CONTENEDOR,
  CURSIVA,
  ENTRADA,
  Etiqueta,
  Foto,
  SUBTITULAR,
  TituloSeccion,
  iniciales,
  pildora,
} from './ui';

/** Portada de Conócenos: «Una familia con historia.» y desde cuándo. */
export function PortadaConocenos({
  nombre,
  anioFundacion,
}: {
  nombre: string;
  anioFundacion: string | null;
}) {
  return (
    <PortadaInterior
      id="conocenos-titulo"
      etiquetas={['Conócenos', anioFundacion ? `Desde ${anioFundacion}` : nombre]}
      foto="abrazo-ancho.webp"
      encuadre="object-[60%_center]"
      titulo={
        <>
          Una familia <em className="block text-[1em]">con historia.</em>
        </>
      }
      texto={`Somos la ${nombre}: personas que creen en la Palabra, se cuidan como hermanos y sirven a Riobamba.`}
    >
      <Link href="#historia" className={pildora({ tono: 'durazno', tamano: 'lg' })}>
        Nuestra historia
      </Link>
      <Link href="#adn" className={pildora({ tono: 'contornoClaro', tamano: 'lg' })}>
        Nuestro ADN
      </Link>
    </PortadaInterior>
  );
}

const HISTORIA_BREVE =
  'Empezamos como un grupo pequeño que se reunía en una casa para estudiar la Biblia y orar por la ciudad. Con los años, Dios fue sumando familias, jóvenes y niños.';

/**
 * Historia (texto de la configuración), con la foto de «Nosotros» y la visión y la misión en dos
 * tarjetas que brillan con el cursor. Sin texto en la configuración, una línea breve.
 */
export function Historia({
  historia,
  vision,
  mision,
  imagen,
}: {
  historia: string | null;
  vision: string | null;
  mision: string | null;
  imagen: string | null;
}) {
  const [primero, ...resto] = paragraphs(historia).length ? paragraphs(historia) : [HISTORIA_BREVE];
  return (
    <section id="historia" aria-labelledby="historia-titulo" className="bg-canvas text-ink">
      <div
        className={`${CONTENEDOR} grid gap-[clamp(2rem,4.5vw,4.5rem)] py-[clamp(3rem,8vw,6rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]`}
      >
        <div className="flex flex-col gap-[clamp(1rem,2vw,1.5rem)]">
          <TituloSeccion id="historia-titulo" etiqueta="Quiénes somos">
            Cómo <em>empezamos.</em>
          </TituloSeccion>
          <p className="d-aparece text-[clamp(1.1875rem,1.05rem+0.6vw,1.5rem)] leading-[1.4] text-ink">
            {primero}
          </p>
          {resto.map((p) => (
            <p key={p.slice(0, 32)} className={`d-aparece text-ink-soft ${ENTRADA}`}>
              {p}
            </p>
          ))}
        </div>
        <ZonaBrillo className="grid content-start gap-[clamp(0.75rem,1.4vw,1rem)] md:grid-cols-2">
          <Foto
            src={imagen ?? 'abrazo-ancho.webp'}
            sizes="(min-width: 64rem) 45vw, 100vw"
            efecto="transition-transform duration-1000 ease-(--ease-out-soft) motion-safe:hover:scale-105"
            className="d-brillo d-aparece aspect-[16/10] rounded-2xl md:col-span-2"
          />
          {vision && (
            <figure className="d-brillo d-aparece @container flex flex-col gap-3 rounded-2xl bg-(--d-tinta) p-[clamp(1.25rem,7cqi,2rem)] text-cream ring-1 ring-cream/10 on-dark">
              <Etiqueta className="text-(--d-arena)">Visión</Etiqueta>
              <blockquote
                className={`text-[clamp(1.375rem,9cqi,1.875rem)] leading-[1.15] text-peach ${CURSIVA}`}
              >
                {vision}
              </blockquote>
            </figure>
          )}
          {mision && (
            <figure className="d-brillo d-aparece @container flex flex-col gap-3 rounded-2xl bg-(--d-marino) p-[clamp(1.25rem,7cqi,2rem)] text-cream ring-1 ring-cream/10 on-dark">
              <Etiqueta className="text-(--d-arena)">Misión</Etiqueta>
              <blockquote className="text-[clamp(1.0625rem,6cqi,1.25rem)] leading-snug text-cream/90">
                {mision}
              </blockquote>
            </figure>
          )}
        </ZonaBrillo>
      </div>
    </section>
  );
}

/**
 * Cifras reales de la iglesia que cuentan hacia arriba al aparecer (solo las mayores que cero)
 * y los años desde la fundación si la configuración la tiene.
 */
export function Cifras({
  cifras,
  anioFundacion,
}: {
  cifras: ChurchStats;
  anioFundacion: string | null;
}) {
  const fundacion = Number(anioFundacion);
  const anios =
    Number.isInteger(fundacion) && fundacion > 1900 ? new Date().getFullYear() - fundacion : 0;
  const lista = [
    { valor: anios, texto: 'años caminando juntos' },
    { valor: cifras.grupos, texto: cifras.grupos === 1 ? 'grupo en casa' : 'grupos en casa' },
    { valor: cifras.ministerios, texto: cifras.ministerios === 1 ? 'ministerio' : 'ministerios' },
    {
      valor: cifras.reuniones,
      texto: cifras.reuniones === 1 ? 'reunión cada semana' : 'reuniones cada semana',
    },
    {
      valor: cifras.areas,
      texto: cifras.areas === 1 ? 'equipo de servicio' : 'equipos de servicio',
    },
  ].filter((c) => c.valor > 0);
  if (lista.length === 0) return null;
  return (
    <section
      aria-label="La iglesia en cifras"
      className="relative isolate bg-(--d-marino) text-cream on-dark"
    >
      <FocoCursor />
      <ul
        className={`${CONTENEDOR} grid grid-cols-2 gap-x-[clamp(1rem,3vw,2.5rem)] gap-y-8 py-[clamp(2.5rem,6vw,4rem)] md:grid-cols-3 lg:grid-cols-5`}
      >
        {lista.map((c) => (
          <li
            key={c.texto}
            className="d-aparece flex flex-col gap-2 border-l border-peach/35 pl-[clamp(0.875rem,2vw,1.25rem)]"
          >
            <Cifra
              valor={c.valor}
              className="font-display text-[clamp(2.75rem,2rem+3vw,4.5rem)] leading-none font-extrabold tracking-[-0.04em] text-peach"
            />
            <span className="text-[clamp(0.9375rem,0.88rem+0.2vw,1.0625rem)] leading-snug text-cream/85">
              {c.texto}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/**
 * Línea de tiempo (HISTORIA de ejemplo): horizontal en escritorio, con el año grande en durazno,
 * y vertical en celular. Cada hito aparece desenfocado y se aclara al llegar a él.
 */
export function LineaDeTiempo() {
  return (
    <section
      aria-labelledby="linea-titulo"
      className="relative isolate overflow-hidden bg-(--d-noche) text-cream on-dark"
    >
      <FocoCursor />
      <div
        className={`${CONTENEDOR} flex flex-col gap-[clamp(2.5rem,5vw,4rem)] py-[clamp(3rem,8vw,6rem)]`}
      >
        <TituloSeccion
          id="linea-titulo"
          etiqueta="Nuestra historia"
          oscuro
          intro="De una casa con la Biblia abierta a una familia en toda la ciudad."
        >
          Lo que Dios ha <em>hecho.</em>
        </TituloSeccion>
        <ol className="relative grid gap-y-[clamp(2rem,6vw,2.75rem)] before:absolute before:inset-y-1 before:left-[0.5rem] before:w-px before:bg-linear-to-b before:from-peach/70 before:to-peach/10 lg:grid-cols-5 lg:gap-x-[clamp(1rem,2vw,2rem)] lg:before:inset-x-0 lg:before:top-[0.5rem] lg:before:bottom-auto lg:before:h-px lg:before:w-auto lg:before:bg-linear-to-r">
          {HISTORIA.map((hito) => (
            <li
              key={hito.anio}
              className="d-aparece @container relative flex flex-col gap-2 pl-[clamp(2.25rem,9vw,3rem)] lg:pt-[clamp(2.25rem,3vw,3rem)] lg:pl-0"
            >
              <span
                aria-hidden="true"
                className="absolute top-0 left-0 size-4 rounded-full border-[3px] border-(--d-noche) bg-peach ring-1 ring-peach"
              />
              <span className="font-display text-[clamp(2.5rem,22cqi,3.75rem)] leading-none font-extrabold tracking-[-0.04em] text-peach">
                {hito.anio}
              </span>
              <h3 className="font-display text-[clamp(1.1875rem,9cqi,1.375rem)] leading-tight font-bold break-words">
                {hito.titulo}
              </h3>
              <p className="max-w-[24rem] text-[0.9375rem] leading-snug text-cream/80">
                {hito.texto}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/**
 * «Nuestro ADN» (id="adn", destino del menú): el primer valor grande sobre una foto y los demás
 * en tarjetas crema numeradas cuyo borde brilla donde pasa el cursor.
 */
export function Adn() {
  const [primero, ...resto] = ADN;
  if (!primero) return null;
  return (
    <section id="adn" aria-labelledby="adn-titulo" className="bg-canvas text-ink">
      <div
        className={`${CONTENEDOR} flex flex-col gap-[clamp(2rem,4vw,3rem)] py-[clamp(3rem,8vw,6rem)]`}
      >
        <TituloSeccion
          id="adn-titulo"
          etiqueta="Lo que nos define"
          intro="Seis convicciones que se notan en cada domingo, cada grupo y cada equipo."
        >
          Nuestro <em>ADN.</em>
        </TituloSeccion>
        <ZonaBrillo
          as="ul"
          className="grid gap-[clamp(0.75rem,1.4vw,1rem)] md:grid-cols-2 lg:grid-cols-3"
        >
          <li className="d-brillo d-aparece @container relative isolate flex min-h-[clamp(20rem,40vw,26rem)] flex-col justify-end overflow-hidden rounded-2xl bg-(--d-tinta) p-[clamp(1.5rem,7cqi,2.5rem)] text-cream on-dark md:col-span-2 lg:row-span-2">
            <Foto
              src="adoracion-ancha.webp"
              sizes="(min-width: 64rem) 60vw, 100vw"
              capa
              encuadre="object-[40%_center]"
              className="inset-0 -z-10"
            />
            <span
              aria-hidden="true"
              className="absolute inset-0 -z-10 bg-linear-to-t from-(--d-tinta) from-20% via-(--d-tinta)/70 to-(--d-tinta)/10"
            />
            <span
              aria-hidden="true"
              className={`text-[clamp(2.5rem,12cqi,4rem)] leading-none text-peach ${CURSIVA}`}
            >
              01
            </span>
            <h3 className="mt-2 font-display text-[clamp(2rem,9cqi,3.5rem)] leading-[0.98] font-extrabold tracking-[-0.035em] break-words">
              {primero.titulo}
            </h3>
            <p className="mt-3 max-w-[30rem] text-[clamp(1rem,3cqi,1.1875rem)] leading-snug text-cream/90">
              {primero.texto}
            </p>
          </li>
          {resto.map((valor, i) => (
            <li
              key={valor.titulo}
              className={`d-brillo d-brillo-claro d-aparece @container flex flex-col gap-2 rounded-2xl bg-surface p-[clamp(1.25rem,7cqi,1.75rem)] ring-1 ring-line ${
                i === resto.length - 1 && resto.length % 2 === 1
                  ? 'md:col-span-2 lg:col-span-1'
                  : ''
              }`}
            >
              <span
                aria-hidden="true"
                className={`text-[clamp(1.75rem,12cqi,2.25rem)] leading-none text-accent-strong ${CURSIVA}`}
              >
                {String(i + 2).padStart(2, '0')}
              </span>
              <h3 className={SUBTITULAR}>{valor.titulo}</h3>
              <p className="text-[0.9375rem] leading-snug text-ink-soft">{valor.texto}</p>
            </li>
          ))}
        </ZonaBrillo>
      </div>
    </section>
  );
}

/** «En qué creemos» (id="creemos"): las creencias de la configuración, numeradas en dos columnas. */
export function Creencias({ creencias }: { creencias: Creencia[] }) {
  if (creencias.length === 0) return null;
  return (
    <section
      id="creemos"
      aria-labelledby="creemos-titulo"
      className="relative isolate bg-(--d-tinta) text-cream on-dark"
    >
      <FocoCursor />
      <div
        className={`${CONTENEDOR} grid gap-[clamp(2rem,4vw,4rem)] py-[clamp(3rem,8vw,6rem)] lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.6fr)]`}
      >
        <TituloSeccion
          id="creemos-titulo"
          etiqueta="Nuestra fe"
          oscuro
          intro="Lo esencial que creemos, con la Biblia como guía para la fe y para la vida."
          className="lg:sticky lg:top-[calc(var(--d-cabecera)+2rem)] lg:self-start"
        >
          En qué <em>creemos.</em>
        </TituloSeccion>
        <ol className="grid gap-x-[clamp(1.5rem,3vw,2.5rem)] md:grid-cols-2">
          {creencias.map((c, i) => (
            <li
              key={`${c.titulo ?? ''}${c.texto.slice(0, 24)}`}
              className="d-aparece flex gap-4 border-t border-cream/15 py-[clamp(1.25rem,2.5vw,1.75rem)]"
            >
              <span
                aria-hidden="true"
                className={`w-9 shrink-0 text-[1.75rem] leading-none text-peach ${CURSIVA}`}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="flex min-w-0 flex-col gap-1.5">
                {c.titulo && (
                  <h3 className="font-display text-[clamp(1.125rem,1rem+0.5vw,1.3125rem)] leading-tight font-bold break-words">
                    {c.titulo}
                  </h3>
                )}
                <p className="leading-relaxed text-cream/80">{c.texto}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** Retrato del equipo: la foto o, si no hay, las iniciales sobre azul. */
function Retrato({
  persona,
  sizes,
  className,
}: {
  persona: EquipoRow;
  sizes: string;
  className: string;
}) {
  return persona.foto_url ? (
    <Foto
      src={persona.foto_url}
      sizes={sizes}
      encuadre="object-[50%_25%]"
      efecto="transition-transform duration-700 ease-(--ease-out-soft) motion-safe:group-hover:scale-105"
      className={className}
    />
  ) : (
    <div
      aria-hidden="true"
      className={`grid place-items-center bg-brand font-display text-[clamp(2rem,14cqi,3.5rem)] font-extrabold text-peach ${className}`}
    >
      {iniciales(persona.nombre)}
    </div>
  );
}

/**
 * Liderazgo (id="equipo"): los pastores en retratos grandes con su reseña y el resto del equipo
 * en una fila de retratos más chicos. Sin equipo visible, la sección no se dibuja.
 */
export function Equipo({ equipo }: { equipo: EquipoRow[] }) {
  if (equipo.length === 0) return null;
  const pastores = equipo.filter((p) => p.es_pastor);
  const lideres = equipo.filter((p) => !p.es_pastor);
  return (
    <section id="equipo" aria-labelledby="equipo-titulo" className="bg-sunken text-ink">
      <div
        className={`${CONTENEDOR} flex flex-col gap-[clamp(2rem,4vw,3rem)] py-[clamp(3rem,8vw,6rem)]`}
      >
        <TituloSeccion
          id="equipo-titulo"
          etiqueta="Liderazgo"
          intro="Pastores y líderes que sirven, enseñan y acompañan a cada familia de la iglesia."
        >
          Quienes nos <em>guían.</em>
        </TituloSeccion>
        <ZonaBrillo className="flex flex-col gap-[clamp(1rem,2vw,1.5rem)]">
          {pastores.length > 0 && (
            <ul className="grid gap-[clamp(0.75rem,1.6vw,1.25rem)] md:grid-cols-2">
              {pastores.map((p) => (
                <li
                  key={p.id}
                  className="group d-brillo d-brillo-claro d-aparece @container overflow-hidden rounded-2xl bg-surface ring-1 ring-line"
                >
                  {/* La tarjeta decide su forma por su propio ancho: foto al lado si cabe. */}
                  <div className="flex h-full flex-col @lg:flex-row">
                    <Retrato
                      persona={p}
                      sizes="(min-width: 48rem) 25vw, 100vw"
                      className="aspect-[4/3] w-full shrink-0 @lg:aspect-auto @lg:min-h-[18rem] @lg:w-[46%]"
                    />
                    <div className="flex flex-col justify-center gap-2 p-[clamp(1.25rem,6cqi,2rem)]">
                      <Etiqueta className="text-accent-strong">{p.rol}</Etiqueta>
                      <h3 className={SUBTITULAR}>{p.nombre}</h3>
                      {p.bio && <p className="leading-snug text-ink-soft">{p.bio}</p>}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {lideres.length > 0 && (
            <ul className="grid grid-cols-2 gap-[clamp(0.75rem,1.6vw,1.25rem)] lg:grid-cols-4">
              {lideres.map((p) => (
                <li
                  key={p.id}
                  className="group d-brillo d-brillo-claro d-aparece @container flex flex-col overflow-hidden rounded-xl bg-surface ring-1 ring-line"
                >
                  <Retrato
                    persona={p}
                    sizes="(min-width: 64rem) 20vw, (min-width: 48rem) 30vw, 50vw"
                    className="aspect-square w-full"
                  />
                  <div className="flex flex-col gap-1 p-[clamp(0.875rem,7cqi,1.25rem)]">
                    <h3 className="font-display text-[clamp(1rem,8cqi,1.25rem)] leading-tight font-bold break-words">
                      {p.nombre}
                    </h3>
                    <p className="text-[clamp(0.8125rem,6cqi,0.9375rem)] leading-snug text-ink-soft">
                      {p.rol}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </ZonaBrillo>
        <div>
          <Link href={RUTAS.primeraVisita} className={pildora({ tono: 'naranja' })}>
            Ven a conocernos
          </Link>
        </div>
      </div>
    </section>
  );
}
