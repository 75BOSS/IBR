import type { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { ADN, HISTORIA } from '@/disenos/contenido';
import { datosConocenos } from '@/disenos/datos';
import { BandaFoto } from '@/disenos/escenario/BandaFoto';
import { Cabecera } from '@/disenos/escenario/Cabecera';
import { Equipo } from '@/disenos/escenario/Equipo';
import { FLECHA, claseBoton } from '@/disenos/escenario/estilos';
import { Foto } from '@/disenos/escenario/Foto';
import { LineaTiempo } from '@/disenos/escenario/LineaTiempo';
import { Puntuacion } from '@/disenos/escenario/Puntuacion';
import { PRIMERA_VISITA } from '@/disenos/escenario/rutas';
import { TituloPagina } from '@/disenos/escenario/TituloPagina';
import { paragraphs } from '@/lib/text';

export const revalidate = 300;

export const metadata: Metadata = { title: 'D · Escenario · Conócenos' };

/** Si la iglesia aún no escribió su historia en el panel, una versión breve de ejemplo. */
const HISTORIA_BREVE = [
  'Empezamos como un grupo pequeño que se reunía en una casa para leer la Biblia y orar por Riobamba. Con los años llegaron más familias, más barrios y más formas de servir.',
  'Hoy seguimos creyendo lo mismo que al principio: la Palabra de Dios cambia vidas y nadie camina solo.',
];

const CIFRAS = [
  { clave: 'reuniones', texto: 'reuniones cada semana' },
  { clave: 'grupos', texto: 'grupos en casas' },
  { clave: 'ministerios', texto: 'ministerios por edad' },
  { clave: 'areas', texto: 'equipos para servir' },
] as const;

/** Conócenos de la propuesta D · Escenario: historia, visión, ADN, creencias y liderazgo. */
export default async function ConocenosEscenario() {
  const { historia, mision, vision, creencias, imagen, anioFundacion, equipo, cifras } =
    await datosConocenos();
  const parrafos = paragraphs(historia);
  const cifrasVisibles = CIFRAS.filter((c) => cifras[c.clave] > 0);
  const [primero, ...valores] = ADN;

  return (
    <>
      <TituloPagina
        id="conocenos"
        etiqueta="Conócenos"
        antes={
          <>
            Somos familia
            <Puntuacion signo="," />
          </>
        }
        destacado={anioFundacion ? `desde ${anioFundacion}.` : 'en Riobamba.'}
        texto="Una iglesia de Riobamba que abre la Biblia, comparte la mesa y sale a servir a su ciudad. Esta es nuestra historia y lo que nos mueve."
      />

      <div className="container-page pt-[clamp(1.75rem,4vw,2.75rem)]">
        <Foto
          src={imagen ?? '/fotos-ejemplo/nosotros.webp'}
          alt="Hermanos de la iglesia cantando juntos en un culto."
          sizes="(min-width: 76rem) 72rem, 100vw"
          marco="aspect-[16/9] rounded-[clamp(1.25rem,3vw,2rem)] shadow-card md:aspect-[21/8]"
          prioridad
        />
      </div>

      <section
        aria-labelledby="historia-titulo"
        id="historia"
        className="container-page grid gap-[clamp(1.25rem,4vw,3.5rem)] py-[clamp(3rem,7vw,5rem)] lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]"
      >
        <Cabecera
          id="historia-titulo"
          etiqueta="Nuestra historia"
          titulo={
            <>
              Una casa
              <Puntuacion signo="," /> <em className="font-semibold italic">una Biblia abierta.</em>
            </>
          }
        />
        <div className="space-y-4 text-[clamp(1.0625rem,1rem+0.25vw,1.1875rem)] text-ink-soft first-letter:float-left first-letter:mr-2 first-letter:font-serif first-letter:text-[3.5em] first-letter:leading-[0.85] first-letter:font-black first-letter:text-(--d-rojo)">
          {(parrafos.length > 0 ? parrafos : HISTORIA_BREVE).map((p) => (
            <p key={p.slice(0, 40)}>{p}</p>
          ))}
        </div>
      </section>

      {(vision || mision) && (
        <section aria-labelledby="proposito" className="bg-(--d-marino) text-cream on-dark">
          <div className="container-page flex flex-col gap-[clamp(1.5rem,4vw,2.5rem)] py-[clamp(3rem,7vw,5rem)]">
            <h2 id="proposito" className="sr-only">
              Visión y misión
            </h2>
            <dl className="grid gap-[clamp(1.5rem,4vw,3rem)] md:grid-cols-2">
              {vision && (
                <div className="d-sube flex flex-col gap-3 border-l-4 border-(--d-rojo) pl-[clamp(1rem,3vw,1.75rem)]">
                  <dt className="caps text-peach">Nuestra visión</dt>
                  <dd className="font-serif text-[clamp(1.5rem,1.1rem+1.8vw,2.375rem)] leading-tight font-medium text-balance italic">
                    {vision}
                  </dd>
                </div>
              )}
              {mision && (
                <div className="d-sube flex flex-col gap-3 border-l-4 border-(--d-rojo) pl-[clamp(1rem,3vw,1.75rem)]">
                  <dt className="caps text-peach">Nuestra misión</dt>
                  <dd className="text-[clamp(1.125rem,1rem+0.6vw,1.375rem)] leading-relaxed text-cream/90">
                    {mision}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </section>
      )}

      <section
        aria-labelledby="linea"
        className="container-page flex flex-col gap-[clamp(1rem,3vw,1.5rem)] pt-[clamp(3rem,7vw,5rem)] pb-[clamp(2rem,5vw,3rem)]"
      >
        <Cabecera
          id="linea"
          etiqueta="Paso a paso"
          centrada
          titulo={
            <>
              Lo que Dios ha hecho <em className="font-semibold italic">en estos años.</em>
            </>
          }
          texto="Algunos momentos que marcaron a nuestra familia (fechas de ejemplo)."
        />
        <LineaTiempo
          nivel="h3"
          pasos={HISTORIA.map((h) => ({ titulo: h.titulo, texto: h.texto, anio: h.anio }))}
        />
      </section>

      <section
        aria-labelledby="adn-titulo"
        id="adn"
        className="container-page flex flex-col gap-[clamp(1.5rem,4vw,2.5rem)] py-[clamp(3rem,7vw,5rem)]"
      >
        <Cabecera
          id="adn-titulo"
          etiqueta="Nuestro ADN"
          titulo={
            <>
              Lo que nos <em className="font-semibold italic">define.</em>
            </>
          }
          texto="Seis convicciones que se notan en cada domingo, en cada grupo y en cada equipo."
        />
        <div className="@container">
          <ol className="grid gap-[clamp(0.875rem,2.2cqi,1.25rem)] @2xl:grid-cols-2 @5xl:grid-cols-3">
            {primero && (
              <li className="d-tarjeta flex flex-col justify-end gap-3 rounded-[1.5rem] bg-(--d-marino) p-[clamp(1.5rem,4cqi,2.25rem)] text-cream on-dark @2xl:col-span-2 @5xl:row-span-2">
                <span
                  aria-hidden="true"
                  className="font-serif text-[clamp(3.5rem,10cqi,6rem)] leading-none font-black text-(--d-rojo) italic"
                >
                  01
                </span>
                <h3 className="font-headline text-[clamp(1.75rem,1.3rem+2cqi,2.5rem)] leading-tight font-extrabold tracking-[-0.04em]">
                  {primero.titulo}
                </h3>
                <p className="text-[clamp(1.0625rem,1rem+0.3cqi,1.1875rem)] text-cream/85">
                  {primero.texto}
                </p>
              </li>
            )}
            {valores.map((v, i) => (
              <li
                key={v.titulo}
                className="d-tarjeta grid grid-cols-[2.75rem_minmax(0,1fr)] content-start gap-x-4 gap-y-1 rounded-[1.25rem] bg-surface p-[clamp(1.25rem,3.5cqi,1.75rem)] ring-1 ring-line @2xl:last:col-span-2 @5xl:last:col-span-1"
              >
                <span
                  aria-hidden="true"
                  className="row-span-2 font-serif text-[clamp(2rem,1.6rem+1.5cqi,2.75rem)] leading-none font-black text-(--d-rojo) italic"
                >
                  {String(i + 2).padStart(2, '0')}
                </span>
                <h3 className="font-headline text-[clamp(1.25rem,1.1rem+0.7cqi,1.5rem)] leading-tight font-extrabold tracking-[-0.03em] text-ink">
                  {v.titulo}
                </h3>
                <p className="text-ink-soft">{v.texto}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {creencias.length > 0 && (
        <section
          aria-labelledby="creemos-titulo"
          id="creemos"
          className="bg-sunken py-[clamp(3rem,7vw,5rem)]"
        >
          <div className="container-page flex flex-col gap-[clamp(1.5rem,4vw,2.5rem)]">
            <Cabecera
              id="creemos-titulo"
              etiqueta="En qué creemos"
              titulo={
                <>
                  Firmes en <em className="font-semibold italic">la Palabra.</em>
                </>
              }
            />
            <div className="@container">
              <ol className="grid gap-x-[clamp(1.5rem,5cqi,3.5rem)] @3xl:grid-cols-2">
                {creencias.map((c, i) => (
                  <li
                    key={c.titulo ?? c.texto.slice(0, 30)}
                    className="grid grid-cols-[3rem_minmax(0,1fr)] gap-x-3 border-t border-line py-[clamp(1rem,3cqi,1.5rem)]"
                  >
                    <span
                      aria-hidden="true"
                      className="font-display text-[1.5rem] leading-none font-bold text-(--d-rojo)"
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="flex flex-col gap-1">
                      {c.titulo && (
                        <h3 className="font-headline text-[clamp(1.1875rem,1.05rem+0.6cqi,1.375rem)] leading-tight font-extrabold tracking-[-0.03em] text-ink">
                          {c.titulo}
                        </h3>
                      )}
                      <p className="text-ink-soft">{c.texto}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>
      )}

      {equipo.length > 0 && (
        <section
          aria-labelledby="equipo-titulo"
          id="equipo"
          className="container-page flex flex-col gap-[clamp(1.5rem,4vw,2.5rem)] py-[clamp(3rem,7vw,5rem)]"
        >
          <Cabecera
            id="equipo-titulo"
            etiqueta="Liderazgo"
            titulo={
              <>
                Quienes te <em className="font-semibold italic">acompañan.</em>
              </>
            }
            texto="Pastores y líderes que sirven a la iglesia con alegría."
          />
          <Equipo equipo={equipo} />
        </section>
      )}

      {cifrasVisibles.length > 0 && (
        <section aria-labelledby="cifras" className="border-y border-line bg-sunken">
          <h2 id="cifras" className="sr-only">
            La iglesia en cifras
          </h2>
          <dl className="container-page grid grid-cols-2 gap-y-6 py-[clamp(2rem,5vw,3rem)] md:grid-cols-4">
            {cifrasVisibles.map((c) => (
              <div key={c.clave} className="d-sube flex flex-col items-center gap-1 text-center">
                <dt className="order-2 max-w-[10rem] text-ink-soft">{c.texto}</dt>
                <dd className="order-1 font-headline text-[clamp(2.75rem,2rem+3.5vw,4.5rem)] leading-none font-extrabold tracking-[-0.05em] text-(--d-rojo)">
                  {cifras[c.clave]}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      <BandaFoto
        id="ven-a-conocernos"
        titulo={
          <>
            Ven a <em className="font-semibold italic">conocernos.</em>
          </>
        }
        texto="La mejor forma de conocer a una familia es sentarse a su mesa. Te esperamos el domingo."
      >
        <Link href={PRIMERA_VISITA} className={claseBoton('rojo')}>
          Planifica tu visita
          <Icon name="arrowRight" className={FLECHA} />
        </Link>
      </BandaFoto>
    </>
  );
}
