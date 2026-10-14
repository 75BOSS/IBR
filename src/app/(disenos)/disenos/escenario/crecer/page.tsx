import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { BAUTISMO, CURSOS, SALVACION } from '@/disenos/contenido';
import { datosCrecer } from '@/disenos/datos';
import { Acordeon } from '@/disenos/escenario/Acordeon';
import { Areas } from '@/disenos/escenario/Areas';
import { BandaFoto } from '@/disenos/escenario/BandaFoto';
import { Cabecera } from '@/disenos/escenario/Cabecera';
import { Camino } from '@/disenos/escenario/Camino';
import { FLECHA, claseBoton } from '@/disenos/escenario/estilos';
import { FlechaEnlace } from '@/disenos/escenario/FlechaEnlace';
import { Foto } from '@/disenos/escenario/Foto';
import { rutaCrecer } from '@/disenos/escenario/menu';
import { Reflector } from '@/disenos/escenario/Reflector';
import { TituloPagina } from '@/disenos/escenario/TituloPagina';

export const revalidate = 300;

export const metadata: Metadata = { title: 'D · Escenario · Crecer' };

/**
 * Crecer de la propuesta D · Escenario: la ruta en cinco pasos y, debajo, cada paso con su
 * sección (salvación, bautismo, Escuela de Discipulado y servir). Contenido de ejemplo salvo las
 * áreas de servicio, que son las del panel.
 */
export default async function CrecerEscenario() {
  const { content, areas } = await datosCrecer();
  const [primerCurso, ...cursos] = CURSOS;

  return (
    <>
      <TituloPagina
        id="crecer"
        etiqueta="Crecer"
        antes="Tu siguiente"
        destacado="paso."
        texto="Seguir a Jesús es un camino, no un evento. Estos cinco pasos te ayudan a crecer en la fe, en comunidad y sirviendo a otros."
      />

      <section
        aria-label="La ruta en cinco pasos"
        id="ruta"
        className="container-page pt-[clamp(2rem,5vw,3.5rem)] pb-[clamp(3rem,7vw,5rem)]"
      >
        <Camino pasos={rutaCrecer(content, true)} />
      </section>

      <section
        aria-labelledby="salvacion-titulo"
        id="salvacion"
        className="relative isolate overflow-hidden bg-(--d-marino) text-cream on-dark"
      >
        <Image
          src="/disenos/escenario/adoracion.webp"
          alt=""
          fill
          sizes="100vw"
          className="-z-20 object-cover object-[50%_30%]"
        />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-(image:--d-velo-salvacion)" />
        <Reflector />
        <div className="container-page grid gap-[clamp(1.75rem,5vw,4rem)] py-[clamp(3.5rem,8vw,6rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center">
          <Cabecera
            id="salvacion-titulo"
            etiqueta="Paso 01 · Conoce a Jesús"
            tono="oscuro"
            titulo={
              <>
                Un nuevo <em className="font-semibold italic">comienzo.</em>
              </>
            }
            texto={SALVACION.texto}
          />
          <figure className="d-sube flex flex-col gap-4 rounded-[1.75rem] bg-cream p-[clamp(1.5rem,4.5vw,2.75rem)] text-ink shadow-lift">
            <figcaption className="caps text-accent">Una oración sencilla</figcaption>
            <blockquote className="relative pl-[clamp(1rem,3vw,1.5rem)] font-serif text-[clamp(1.375rem,1.05rem+1.5vw,2rem)] leading-snug font-medium text-balance italic before:absolute before:inset-y-1 before:left-0 before:w-1 before:rounded-full before:bg-(--d-rojo)">
              {SALVACION.oracion}
            </blockquote>
            <p className="text-ink-soft">{SALVACION.siguiente}</p>
            <FlechaEnlace href="/contacto#mensaje">Cuéntanos tu decisión</FlechaEnlace>
          </figure>
        </div>
      </section>

      <section
        aria-labelledby="bautismo-titulo"
        id="bautismo"
        className="container-page grid gap-[clamp(1.75rem,5vw,4rem)] py-[clamp(3.5rem,8vw,6rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]"
      >
        <div className="flex flex-col gap-4 lg:sticky lg:top-28 lg:self-start">
          <Foto
            src="/fotos-ejemplo/evento-bautismos.webp"
            alt="Dos hermanas se abrazan con alegría después de un bautismo."
            sizes="(min-width: 64rem) 30rem, 100vw"
            marco="aspect-[4/3] rounded-[1.5rem] shadow-card"
          />
          <p className="inline-flex items-center gap-3 self-start rounded-2xl bg-accent-soft px-4 py-2.5 font-semibold text-ink">
            <Icon name="calendar" className="size-5 shrink-0 text-accent" />
            {BAUTISMO.proximo}
          </p>
        </div>
        <div className="flex flex-col gap-[clamp(1.25rem,3vw,1.75rem)]">
          <Cabecera
            id="bautismo-titulo"
            etiqueta="Paso 02 · Bautízate"
            titulo={
              <>
                El <em className="font-semibold italic">bautismo.</em>
              </>
            }
            texto={BAUTISMO.texto}
          />
          <Acordeon preguntas={BAUTISMO.preguntas} nombre="bautismo" />
        </div>
      </section>

      <section
        aria-labelledby="formacion-titulo"
        id="formacion"
        className="bg-sunken py-[clamp(3.5rem,8vw,6rem)]"
      >
        <div className="container-page flex flex-col gap-[clamp(1.5rem,4vw,2.5rem)]">
          <Cabecera
            id="formacion-titulo"
            etiqueta="Paso 04 · Fórmate"
            titulo={
              <>
                Escuela de <em className="font-semibold italic">Discipulado.</em>
              </>
            }
            texto="Cuatro módulos para tener bases firmes en la fe, paso a paso y en comunidad. Cada uno con su grupo, su maestro y su material."
          />
          <div className="@container">
            <ol className="grid gap-[clamp(0.875rem,2cqi,1.25rem)] @2xl:grid-cols-2 @5xl:grid-cols-4">
              {primerCurso && (
                <li className="d-tarjeta flex flex-col gap-3 rounded-[1.5rem] bg-(--d-marino) p-[clamp(1.25rem,4cqi,1.75rem)] text-cream on-dark">
                  <p className="flex flex-wrap items-center justify-between gap-2">
                    <span className="caps text-peach">Módulo 01</span>
                    <span className="rounded-full bg-accent px-3 py-1 text-sm font-semibold text-cream">
                      Empieza aquí
                    </span>
                  </p>
                  <h3 className="font-headline text-[clamp(1.375rem,1.15rem+1cqi,1.75rem)] leading-tight font-extrabold tracking-[-0.03em]">
                    {primerCurso.titulo}
                  </h3>
                  <p className="text-cream/85">{primerCurso.texto}</p>
                  <p className="mt-auto inline-flex items-center gap-2 pt-2 text-sm font-semibold text-cream/90">
                    <Icon name="clock" className="size-4 text-peach" />
                    {primerCurso.duracion}
                  </p>
                </li>
              )}
              {cursos.map((c, i) => (
                <li
                  key={c.titulo}
                  className="d-tarjeta flex flex-col gap-3 rounded-[1.5rem] border-t-4 border-(--d-rojo) bg-surface p-[clamp(1.25rem,4cqi,1.75rem)] shadow-card"
                >
                  <p className="caps text-accent">Módulo {String(i + 2).padStart(2, '0')}</p>
                  <h3 className="font-headline text-[clamp(1.375rem,1.15rem+1cqi,1.75rem)] leading-tight font-extrabold tracking-[-0.03em] text-ink">
                    {c.titulo}
                  </h3>
                  <p className="text-ink-soft">{c.texto}</p>
                  <p className="mt-auto inline-flex items-center gap-2 pt-2 text-sm font-semibold text-ink">
                    <Icon name="clock" className="size-4 text-accent" />
                    {c.duracion}
                  </p>
                </li>
              ))}
            </ol>
          </div>
          <FlechaEnlace href="/contacto#mensaje">Quiero inscribirme</FlechaEnlace>
        </div>
      </section>

      <section
        aria-labelledby="servir-titulo"
        id="servir"
        className="container-page flex flex-col gap-[clamp(1.5rem,4vw,2.5rem)] py-[clamp(3.5rem,8vw,6rem)]"
      >
        <Cabecera
          id="servir-titulo"
          etiqueta="Paso 05 · Sirve"
          titulo={
            <>
              Usa tus <em className="font-semibold italic">dones.</em>
            </>
          }
          texto={
            areas.length > 0
              ? 'Hay un equipo para ti. Elige dónde te gustaría servir y te contamos cómo empezar.'
              : 'Cuéntanos qué te gusta hacer y te ayudamos a encontrar tu lugar en un equipo.'
          }
        >
          {areas.length === 0 && (
            <FlechaEnlace href="/contacto#mensaje">Quiero servir</FlechaEnlace>
          )}
        </Cabecera>
        {areas.length > 0 && <Areas areas={areas} hayServir={content.servir} />}
      </section>

      <BandaFoto
        id="siguiente-paso"
        titulo={
          <>
            ¿Listo para <em className="font-semibold italic">tu siguiente paso?</em>
          </>
        }
        texto="Escríbenos y una persona del equipo te acompaña, sin prisa y sin presión."
      >
        <Link href="/contacto#mensaje" className={claseBoton('rojo')}>
          Quiero dar mi siguiente paso
          <Icon name="arrowRight" className={FLECHA} />
        </Link>
      </BandaFoto>
    </>
  );
}
