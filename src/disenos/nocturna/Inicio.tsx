import Link from 'next/link';
import { Icon } from '@/components/Icon';
import type { SiteContent } from '@/lib/nav';
import { DEVOCIONALES, RUTA_CRECER } from '../contenido';
import { FocoCursor, ZonaBrillo } from './efectos';
import { destinoPaso } from './menu';
import { RUTAS } from './rutas';
import { devocionalDeHoy } from './semana';
import { CONTENEDOR, CURSIVA, EnlaceFlecha, Etiqueta, TituloSeccion, pildora } from './ui';

/**
 * Los cinco pasos de RUTA_CRECER como tarjetas con el número calado en durazno. Los usan el
 * inicio (las anclas llevan a Crecer) y la propia página Crecer (`enCrecer`: solo el ancla).
 */
export function RutaPasos({
  content,
  enCrecer = false,
}: {
  content: Pick<SiteContent, 'grupos' | 'servir'>;
  enCrecer?: boolean;
}) {
  return (
    <ZonaBrillo
      as="ol"
      className="grid gap-[clamp(0.75rem,1.4vw,1rem)] md:grid-cols-2 lg:grid-cols-5"
    >
      {RUTA_CRECER.map((paso) => (
        // Tarjeta ancha (celular, tablet): el número a la izquierda; angosta (cinco columnas
        // en escritorio): el número arriba. Lo decide el ancho de la propia tarjeta.
        <li
          key={paso.numero}
          className="d-brillo d-aparece @container rounded-xl bg-cream/4 ring-1 ring-cream/12 md:last:col-span-2 lg:last:col-span-1"
        >
          <div className="flex h-full flex-col p-[clamp(1.25rem,7cqi,1.75rem)] @[18rem]:grid @[18rem]:grid-cols-[auto_minmax(0,1fr)] @[18rem]:content-start @[18rem]:gap-x-5">
            <span
              aria-hidden="true"
              className="font-display text-[clamp(3rem,24cqi,4.5rem)] leading-none font-extrabold tracking-[-0.05em] text-transparent tabular-nums [-webkit-text-stroke:1.5px_var(--color-peach)] @[18rem]:row-span-3 @[18rem]:text-[clamp(2.75rem,14cqi,4rem)]"
            >
              {paso.numero}
            </span>
            <span
              aria-hidden="true"
              className="mt-4 h-px w-full bg-linear-to-r from-peach/70 to-peach/0 @[18rem]:hidden"
            />
            <h3 className="mt-4 font-display text-[clamp(1.25rem,9cqi,1.5rem)] leading-tight font-bold tracking-[-0.02em] break-words @[18rem]:mt-0">
              {paso.titulo}
            </h3>
            <p className="mt-2 text-[0.9375rem] leading-snug text-cream/80">{paso.texto}</p>
            <EnlaceFlecha
              href={destinoPaso(paso.href, content, enCrecer)}
              className="mt-auto pt-3 text-peach hover:text-cream @[18rem]:col-start-2"
            >
              {paso.accion}
            </EnlaceFlecha>
          </div>
        </li>
      ))}
    </ZonaBrillo>
  );
}

/** «Tu siguiente paso» del inicio: la ruta de crecimiento resumida y el camino a Crecer. */
export function SiguientePaso({ content }: { content: Pick<SiteContent, 'grupos' | 'servir'> }) {
  return (
    <section
      aria-labelledby="paso-titulo"
      className="relative isolate bg-(--d-tinta) text-cream on-dark"
    >
      <FocoCursor />
      <div
        className={`${CONTENEDOR} flex flex-col gap-[clamp(2rem,4vw,3rem)] py-[clamp(3rem,8vw,6rem)]`}
      >
        <div className="flex flex-wrap items-end justify-between gap-6">
          <TituloSeccion
            id="paso-titulo"
            etiqueta="Crecer"
            oscuro
            intro="Seguir a Jesús es un camino. Estos son los pasos que damos juntos, a tu ritmo y acompañado."
          >
            Tu siguiente <em>paso.</em>
          </TituloSeccion>
          <Link href={RUTAS.crecer} className={pildora({ tono: 'contornoClaro' })}>
            Ver la ruta completa
            <Icon name="arrowRight" className="size-[1.15em]" />
          </Link>
        </div>
        <RutaPasos content={content} />
      </div>
    </section>
  );
}

/**
 * Adelanto de Recursos: el devocional que toca hoy (o el del lunes el fin de semana) en una
 * tarjeta azul con su propio foco de luz, y los cinco días de la semana como accesos al plan.
 */
export function PalabraDeHoy({ fecha }: { fecha: string }) {
  const hoy = devocionalDeHoy(DEVOCIONALES, fecha);
  if (!hoy) return null;
  const { devocional, indice } = hoy;
  const plan = `${RUTAS.recursos}#devocionales`;
  return (
    <section aria-labelledby="palabra-titulo" className="bg-canvas text-ink">
      <div
        className={`${CONTENEDOR} grid gap-[clamp(2rem,4vw,4rem)] py-[clamp(3rem,8vw,6rem)] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center`}
      >
        <div className="flex flex-col items-start gap-[clamp(1.25rem,2.4vw,1.75rem)]">
          <TituloSeccion
            id="palabra-titulo"
            etiqueta="Devocional de la semana"
            intro="Cinco lecturas cortas para empezar el día con la Biblia abierta, de lunes a viernes."
          >
            Una palabra para <em>hoy.</em>
          </TituloSeccion>
          <ul className="flex flex-wrap gap-2" aria-label="Plan de la semana">
            {DEVOCIONALES.map((d, i) => (
              <li key={d.dia}>
                <Link
                  href={plan}
                  aria-current={i === indice ? 'true' : undefined}
                  className={`inline-flex min-h-10 items-center rounded-full px-4 text-sm font-semibold transition-colors ${
                    i === indice
                      ? 'bg-brand text-cream on-dark'
                      : 'border border-line text-ink hover:border-accent hover:text-accent-strong'
                  }`}
                >
                  {d.dia}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <article className="d-aparece @container relative isolate flex flex-col gap-[clamp(0.75rem,3cqi,1.125rem)] overflow-hidden rounded-2xl bg-(--d-noche) p-[clamp(1.5rem,7cqi,3.25rem)] text-cream ring-1 ring-peach/25 on-dark">
          <FocoCursor />
          <Etiqueta className="text-(--d-arena)">
            {hoy.hoy ? `Hoy · ${devocional.dia}` : `Empieza el ${devocional.dia.toLowerCase()}`}
          </Etiqueta>
          <p className={`text-[clamp(1.5rem,6cqi,2.25rem)] leading-none text-peach ${CURSIVA}`}>
            {devocional.pasaje}
          </p>
          <h3 className="font-display text-[clamp(2.25rem,11cqi,4rem)] leading-[0.95] font-extrabold tracking-[-0.035em] break-words">
            {devocional.titulo}
          </h3>
          <p className="max-w-[28rem] text-[clamp(1rem,3.6cqi,1.1875rem)] leading-snug text-cream/85">
            {devocional.texto}
          </p>
          <div className="mt-2">
            <Link href={plan} className={pildora({ tono: 'durazno' })}>
              Leer el plan
              <Icon name="arrowRight" className="size-[1.15em]" />
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}
