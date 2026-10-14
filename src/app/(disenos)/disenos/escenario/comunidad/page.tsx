import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { datosComunidad } from '@/disenos/datos';
import { Areas } from '@/disenos/escenario/Areas';
import { BandaFoto } from '@/disenos/escenario/BandaFoto';
import { Cabecera } from '@/disenos/escenario/Cabecera';
import { Camino } from '@/disenos/escenario/Camino';
import { FLECHA, FLECHA_TARJETA, claseBoton } from '@/disenos/escenario/estilos';
import { FlechaEnlace } from '@/disenos/escenario/FlechaEnlace';
import { Foto } from '@/disenos/escenario/Foto';
import { rutaCrecer } from '@/disenos/escenario/menu';
import { CRECER, MINISTERIOS } from '@/disenos/escenario/rutas';
import { TituloPagina } from '@/disenos/escenario/TituloPagina';
import { toneVar } from '@/lib/css-vars';
import { DAY_NAMES, formatTime } from '@/lib/dates';
import { FRECUENCIAS_LABEL } from '@/lib/grupos-public';
import { edadText, ministerioName } from '@/lib/ministerios';

export const revalidate = 300;

export const metadata: Metadata = { title: 'D · Escenario · Comunidad' };

const COLLAGE = [
  {
    src: '/fotos-ejemplo/ministerio-adultos.webp',
    alt: 'Una mesa larga de hermanos compartiendo una cena en casa.',
  },
  { src: '/fotos-ejemplo/grupo-jovenes.webp', alt: 'Jóvenes de un grupo conversan y ríen.' },
  {
    src: '/fotos-ejemplo/grupo-familias.webp',
    alt: 'Familias reunidas en una sala para estudiar la Biblia.',
  },
];

/**
 * Comunidad de la propuesta D · Escenario: los grupos en casa (reales, con barrio, día y hora),
 * los ministerios por edad, las áreas de servicio y «Tu siguiente paso».
 */
export default async function ComunidadEscenario() {
  const { content, grupos, ministerios, areas } = await datosComunidad();
  const barrios = [...new Set(grupos.map((g) => g.zona).filter((z): z is string => Boolean(z)))];

  return (
    <>
      <TituloPagina
        id="comunidad"
        etiqueta="Comunidad"
        antes="Nadie camina"
        destacado="solo."
        texto="La iglesia también sucede entre semana: en casas de distintos barrios de Riobamba, en los ministerios de cada edad y en los equipos donde servimos juntos."
      />

      <div className="container-page grid grid-cols-2 gap-[clamp(0.625rem,1.6vw,1rem)] pt-[clamp(1.75rem,4vw,2.75rem)] md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,1fr)]">
        {COLLAGE.map((f, i) => (
          <div key={f.src} className={i === 0 ? 'col-span-2 md:col-span-1' : 'md:pt-10'}>
            <Foto
              src={f.src}
              alt={f.alt}
              sizes={i === 0 ? '(min-width: 48rem) 40vw, 100vw' : '(min-width: 48rem) 25vw, 50vw'}
              marco={`rounded-[1.25rem] shadow-card ${i === 0 ? 'aspect-[16/8] md:aspect-[4/3]' : 'aspect-[4/3]'}`}
              prioridad={i === 0}
            />
          </div>
        ))}
      </div>

      <section
        aria-labelledby="grupos-titulo"
        id="grupos"
        className="container-page flex flex-col gap-[clamp(1.5rem,4vw,2.25rem)] py-[clamp(3rem,7vw,5rem)]"
      >
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
          <Cabecera
            id="grupos-titulo"
            etiqueta="Grupos en casa"
            titulo={
              <>
                Un grupo <em className="font-semibold italic">cerca de ti.</em>
              </>
            }
            texto="Grupos pequeños que se reúnen en casas para leer la Biblia, orar y compartir la vida."
          />
          {content.grupos && <FlechaEnlace href="/grupos">Ver todos los grupos</FlechaEnlace>}
        </div>

        {barrios.length > 0 && (
          <div className="flex flex-col gap-2">
            <p className="caps text-ink-soft">Barrios con grupos</p>
            <ul className="flex flex-wrap gap-2">
              {barrios.map((b) => (
                <li
                  key={b}
                  className="inline-flex min-h-9 items-center gap-2 rounded-full bg-sunken px-3.5 text-sm font-semibold text-ink"
                >
                  <Icon name="mapPin" className="size-4 text-accent" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        )}

        {grupos.length > 0 ? (
          <div className="@container">
            <ul className="grid gap-[clamp(0.75rem,2cqi,1rem)] @4xl:grid-cols-2">
              {grupos.map((g) => (
                <li key={g.id}>
                  <Link
                    href={content.grupos ? `/grupos/${g.id}` : '/contacto#mensaje'}
                    className="d-tarjeta grid grid-cols-[5.25rem_minmax(0,1fr)_auto] items-center gap-x-[clamp(0.75rem,3cqi,1.25rem)] rounded-2xl bg-surface p-[clamp(0.75rem,2.5cqi,1rem)] ring-1 ring-line @md:grid-cols-[6.5rem_minmax(0,1fr)_5.5rem]"
                  >
                    <span className="flex flex-col items-center gap-0.5 border-r border-line pr-2 text-center">
                      <span className="caps text-[0.6875rem] text-accent">
                        {g.dia_semana ? DAY_NAMES[g.dia_semana] : 'Por definir'}
                      </span>
                      {g.hora && (
                        <span className="font-display text-[clamp(1.375rem,1.2rem+0.8cqi,1.75rem)] leading-none font-extrabold tracking-[-0.04em] text-(--d-rojo)">
                          {formatTime(g.hora)}
                        </span>
                      )}
                    </span>
                    <span className="flex min-w-0 flex-col gap-1">
                      <span className="font-headline text-[clamp(1.0625rem,1rem+0.4cqi,1.25rem)] leading-tight font-extrabold tracking-[-0.02em] [overflow-wrap:anywhere] text-ink">
                        {g.nombre}
                      </span>
                      <span className="text-sm text-ink-soft">
                        {[g.zona ?? g.ubicacion, FRECUENCIAS_LABEL[g.frecuencia]]
                          .filter(Boolean)
                          .join(' · ')}
                      </span>
                      {g.rango_edad && (
                        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink">
                          <span
                            aria-hidden="true"
                            style={toneVar(g.rango_color)}
                            className="size-2 rounded-full bg-(--tone)"
                          />
                          {g.rango_edad}
                        </span>
                      )}
                    </span>
                    {g.imagen_url ? (
                      <span className="relative hidden aspect-square overflow-hidden rounded-xl @md:block">
                        <Image
                          src={g.imagen_url}
                          alt=""
                          fill
                          sizes="5.5rem"
                          className="d-zoom object-cover"
                        />
                      </span>
                    ) : (
                      <span className="hidden @md:block" />
                    )}
                    <Icon
                      name="arrowRight"
                      className={`${FLECHA_TARJETA} col-start-3 row-start-1 @md:hidden`}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-ink-soft">
            Estamos abriendo grupos en nuevos barrios.{' '}
            <Link href="/contacto#mensaje" className="link">
              Escríbenos y te avisamos
            </Link>
            .
          </p>
        )}
      </section>

      {ministerios.length > 0 && (
        <section aria-labelledby="por-edad-titulo" className="bg-sunken py-[clamp(3rem,7vw,5rem)]">
          <div className="container-page flex flex-col gap-[clamp(1.5rem,4vw,2.25rem)]">
            <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
              <Cabecera
                id="por-edad-titulo"
                etiqueta="Ministerios"
                titulo={
                  <>
                    Para <em className="font-semibold italic">cada edad.</em>
                  </>
                }
              />
              <FlechaEnlace href={MINISTERIOS}>Ver todos los ministerios</FlechaEnlace>
            </div>
            <div className="@container">
              <ul className="grid grid-cols-2 gap-[clamp(0.625rem,2cqi,1rem)] @3xl:grid-cols-3 @5xl:grid-cols-5">
                {ministerios.map((m, i) => (
                  <li key={m.id} className={i === 0 ? 'col-span-2 @5xl:col-span-1' : ''}>
                    <Link
                      href={`${MINISTERIOS}#${m.slug}`}
                      className="d-tarjeta relative isolate flex aspect-[4/3] flex-col justify-end overflow-hidden rounded-2xl bg-(--d-marino) p-[clamp(0.75rem,3cqi,1.125rem)] text-cream on-dark @5xl:aspect-[3/4]"
                    >
                      {m.imagen_url && (
                        <Image
                          src={m.imagen_url}
                          alt=""
                          fill
                          sizes="(min-width: 64rem) 15rem, (min-width: 48rem) 30vw, 50vw"
                          className="d-zoom -z-20 object-cover"
                        />
                      )}
                      <span
                        aria-hidden="true"
                        className="absolute inset-0 -z-10 bg-(image:--d-velo-tarjeta)"
                      />
                      <span className="font-headline text-[clamp(1.125rem,1rem+0.9cqi,1.5rem)] leading-tight font-extrabold tracking-[-0.03em] [overflow-wrap:anywhere]">
                        {ministerioName(m)}
                      </span>
                      {edadText(m) && <span className="text-sm text-cream/85">{edadText(m)}</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {areas.length > 0 && (
        <section
          aria-labelledby="servir-titulo"
          id="servir"
          className="container-page flex flex-col gap-[clamp(1.5rem,4vw,2.25rem)] py-[clamp(3rem,7vw,5rem)]"
        >
          <Cabecera
            id="servir-titulo"
            etiqueta="Áreas de servicio"
            titulo={
              <>
                Sirve <em className="font-semibold italic">con tus dones.</em>
              </>
            }
            texto="Equipos de voluntarios que hacen posible cada domingo y cada encuentro."
          />
          <Areas areas={areas} hayServir={content.servir} />
        </section>
      )}

      <section
        aria-labelledby="tu-paso-titulo"
        className="border-t border-line bg-canvas py-[clamp(3rem,7vw,5rem)]"
      >
        <div className="container-page flex flex-col gap-[clamp(1.75rem,4vw,2.75rem)]">
          <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
            <Cabecera
              id="tu-paso-titulo"
              etiqueta="Crecer"
              titulo={
                <>
                  Tu siguiente <em className="font-semibold italic">paso.</em>
                </>
              }
            />
            <FlechaEnlace href={CRECER}>Ver la ruta completa</FlechaEnlace>
          </div>
          <Camino pasos={rutaCrecer(content, false)} resumido />
        </div>
      </section>

      <BandaFoto
        id="tu-grupo"
        titulo={
          <>
            ¿Buscas <em className="font-semibold italic">tu grupo?</em>
          </>
        }
        texto="Cuéntanos en qué barrio vives y te ayudamos a encontrar uno cerca."
      >
        <Link
          href={content.grupos ? '/grupos' : '/contacto#mensaje'}
          className={claseBoton('rojo')}
        >
          Encuentra tu grupo
          <Icon name="arrowRight" className={FLECHA} />
        </Link>
      </BandaFoto>
    </>
  );
}
