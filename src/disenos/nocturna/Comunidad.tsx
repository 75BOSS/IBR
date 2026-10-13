import Link from 'next/link';
import { Icon } from '@/components/Icon';
import type { GrupoPublico } from '@/lib/grupos-public';
import { toneVar } from '@/lib/css-vars';
import { type Ministerio, edadText, ministerioName } from '@/lib/ministerios';
import type { SiteContent } from '@/lib/nav';
import type { Area } from '@/lib/servir';
import { CONTENEDOR, Etiqueta, Foto, PestanaNueva, pildora } from './ui';

/**
 * Portada de Comunidad (imagen 8): la foto ancha a la derecha fundida en el azul y, a la
 * izquierda, «La vida se comparte.». En celular y tablet la foto va arriba y se funde hacia el
 * texto.
 */
export function PortadaComunidad({ nombre }: { nombre: string }) {
  return (
    <section
      aria-labelledby="comunidad-titulo"
      className="relative isolate overflow-hidden bg-(--d-noche) text-cream on-dark"
    >
      <Foto
        src="comunidad.webp"
        sizes="(min-width: 64rem) 64vw, 100vw"
        prioridad
        encuadre="object-[62%_center]"
        className="aspect-[16/11] w-full mask-b-from-55% md:aspect-[16/8] lg:absolute lg:inset-y-0 lg:right-0 lg:-z-10 lg:aspect-auto lg:w-[64%] lg:mask-b-from-100% lg:mask-l-from-60%"
      />
      <div
        className={`${CONTENEDOR} relative -mt-[clamp(4rem,16vw,7rem)] pb-[clamp(2.5rem,7vw,3.25rem)] lg:mt-0 lg:pt-[clamp(2.5rem,4.2vw,3.5rem)] lg:pb-[clamp(1.75rem,2.5vw,2.25rem)]`}
      >
        <div className="flex max-w-[40rem] flex-col items-start gap-[clamp(0.75rem,1.4vw,1rem)] lg:pl-[clamp(0rem,8vw_-_3.5rem,4.375rem)]">
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-(--d-arena)">
            <Etiqueta>Comunidad</Etiqueta>
            <Etiqueta>{nombre}</Etiqueta>
          </div>
          <h1
            id="comunidad-titulo"
            className="font-display text-[clamp(3rem,2.1rem+4vw,5.9rem)] leading-[0.92] font-extrabold tracking-[-0.035em]"
          >
            La vida <em className="block text-[1em]">se comparte.</em>
          </h1>
          <p className="mt-1 max-w-[29rem] text-[clamp(1rem,0.93rem+0.3vw,1.125rem)] leading-[1.35] tracking-[0.01em] text-cream/95">
            En IBR creemos que la fe se vive mejor en familia. Aquí encontrarás personas reales,
            relaciones auténticas y un lugar donde puedes pertenecer.
          </p>
        </div>
      </div>
    </section>
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
    <li className="@container flex">
      <Link href={tarjeta.href} className="group flex w-full flex-col">
        <div className="relative overflow-hidden rounded-[0.3rem]">
          <Foto
            src={tarjeta.foto}
            sizes="(min-width: 48rem) 30vw, 100vw"
            className="aspect-[16/9] transition-transform duration-500 ease-(--ease-out-soft) motion-safe:group-hover:scale-105 @md:aspect-[2.35/1]"
          />
          <span
            style={tarjeta.color !== undefined ? toneVar(tarjeta.color) : undefined}
            className="absolute bottom-3 left-3 inline-flex max-w-[calc(100%-1.5rem)] items-center gap-2 rounded-full bg-(--d-tinta)/85 px-3 py-1.5 text-[0.8125rem] font-semibold text-cream"
          >
            {tarjeta.color !== undefined && (
              <span aria-hidden="true" className="size-2.5 shrink-0 rounded-full bg-(--tone)" />
            )}
            <span className="truncate">{tarjeta.dato}</span>
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

/**
 * Las tres puertas de Comunidad (imagen 8): grupos en casa, niños y familias, servir juntos.
 * Cada una solo aparece si su página tiene contenido; las que quedan se reparten el ancho.
 */
export function TarjetasComunidad({
  content,
  grupos,
  ministerios,
  areas,
}: {
  content: SiteContent;
  grupos: GrupoPublico[];
  ministerios: Ministerio[];
  areas: Area[];
}) {
  const zonas = [...new Set(grupos.map((g) => g.zona).filter((z): z is string => Boolean(z)))];
  // El ministerio de los más pequeños (el de menor edad que empieza antes de los 12 años).
  const ninos = ministerios
    .filter((m) => m.edad_min !== null && m.edad_min < 12)
    .sort((a, b) => (a.edad_min ?? 0) - (b.edad_min ?? 0))[0];

  const tarjetas: Tarjeta[] = [
    ...(content.grupos && grupos.length > 0
      ? [
          {
            href: '/grupos',
            foto: 'grupos.webp',
            titulo: 'Grupos en casa',
            texto: 'Conecta, crece y comparte la vida en grupos más pequeños durante la semana.',
            dato: [plural(grupos.length, 'grupo', 'grupos'), zonas.slice(0, 3).join(', ')]
              .filter(Boolean)
              .join(' · '),
          },
        ]
      : []),
    ...(content.ministerios && ministerios.length > 0
      ? [
          {
            href: ninos ? `/ministerios/${ninos.slug}` : '/ministerios',
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
    ...(content.servir && areas.length > 0
      ? [
          {
            href: '/servir',
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
        className={`${CONTENEDOR} grid gap-x-[clamp(1.25rem,2vw,1.75rem)] gap-y-10 pt-6 pb-10 md:auto-cols-fr md:grid-flow-col lg:pb-6`}
      >
        {tarjetas.map((t) => (
          <TarjetaComunidad key={t.href} tarjeta={t} />
        ))}
      </ul>
    </section>
  );
}

/**
 * Franja final (imagen 8): «Hay un lugar para ti aquí.» sobre azul marino con «Soy nuevo» y
 * «Cómo llegar» (solo si hay mapa o dirección), y la foto a la derecha.
 */
export function FranjaLugar({ comoLlegar }: { comoLlegar: string | null }) {
  return (
    <section
      aria-labelledby="lugar-titulo"
      className="grid bg-(--d-marino) text-cream on-dark lg:grid-cols-[minmax(0,0.93fr)_minmax(0,1.07fr)]"
    >
      <div className="flex flex-col items-start justify-center gap-[clamp(0.75rem,1.2vw,1rem)] py-10 pr-[clamp(1rem,4vw,2.5rem)] pl-[clamp(1rem,8.5vw,8.125rem)] lg:py-9">
        <Etiqueta className="text-(--d-arena)">Tu siguiente paso</Etiqueta>
        <h2
          id="lugar-titulo"
          className="font-display text-[clamp(2.125rem,1.45rem+2.5vw,3.25rem)] leading-[0.98] font-extrabold tracking-[-0.035em]"
        >
          Hay un lugar{' '}
          <span className="block">
            para ti <em>aquí.</em>
          </span>
        </h2>
        <p className="max-w-[24rem] text-[clamp(0.9375rem,0.9rem+0.15vw,1rem)] leading-[1.4] tracking-[0.01em] text-cream/90">
          Conoce más sobre nuestra iglesia, resuelve tus dudas y da tu primer paso. Nos encantaría
          conocerte.
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-x-7 gap-y-3">
          <Link href="/soy-nuevo" className={pildora({ tono: 'naranja' })}>
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
        </div>
      </div>
      <Foto
        src="lugar.webp"
        sizes="(min-width: 64rem) 54vw, 100vw"
        encuadre="object-[45%_center]"
        className="min-h-[clamp(14rem,48vw,17.5rem)]"
      />
    </section>
  );
}
