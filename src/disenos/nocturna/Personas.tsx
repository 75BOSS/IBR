import Link from 'next/link';
import { Icon } from '@/components/Icon';
import type { datosPortada } from '@/disenos/datos';
import { youTubeWatchUrl } from '@/lib/youtube';
import { Alterna, Aro, CONTENEDOR, CURSIVA, Etiqueta, Foto, PestanaNueva, pildora } from './ui';

type UltimaPredica = Awaited<ReturnType<typeof datosPortada>>['ultimaPredica'];

/**
 * Tarjeta azul tinta del mensaje más reciente (imagen 7): título en blanco, la serie en la
 * itálica durazno y la foto del predicador fundida a la derecha. Sin prédica cargada pero con
 * canal de prédicas, invita a la página de prédicas; sin ninguna de las dos, no se dibuja.
 */
function TarjetaPredica({ predica }: { predica: NonNullable<UltimaPredica> | null }) {
  const enlace = predica
    ? { href: youTubeWatchUrl(predica.videoId), texto: 'Ver mensaje', externo: true }
    : { href: '/predicas', texto: 'Ver prédicas', externo: false };
  const contenidoEnlace = (
    <>
      <Aro className="size-[clamp(2.75rem,10cqi,3.125rem)] transition-colors group-hover:bg-cream group-hover:text-(--d-tinta)">
        <Icon name="play" fill="currentColor" className="ml-[0.15em] size-[40%]" />
      </Aro>
      {enlace.texto}
    </>
  );
  const titulo = predica ? predica.titulo : 'Cada domingo';
  // Los títulos que llegan del canal son largos («… | Pstr. …»): van un punto más chicos.
  const serie = predica ? predica.serie : 'en la Palabra';
  const claseEnlace =
    'group mt-auto inline-flex items-center gap-[clamp(0.875rem,4cqi,1.25rem)] self-start rounded-full pr-2 font-display text-[clamp(0.9375rem,3.4cqi,1.0625rem)] font-semibold';

  return (
    <article
      aria-labelledby="predica-titulo"
      className="@container relative isolate col-span-2 flex min-h-[19rem] overflow-hidden rounded-xl bg-(--d-tinta) text-cream ring-1 ring-cream/10 on-dark lg:col-span-1 lg:row-span-2"
    >
      <Foto
        src="predicador.webp"
        sizes="(min-width: 64rem) 16vw, 45vw"
        encuadre="object-[50%_15%]"
        capa
        className="inset-y-0 right-0 -z-10 w-[44%]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-y-0 right-[24%] -z-10 w-[24%] bg-linear-to-r from-(--d-tinta) to-(--d-tinta)/0"
      />
      <div className="flex w-[62%] flex-col gap-[clamp(0.5rem,2.4cqi,0.875rem)] p-[clamp(1.25rem,5cqi,1.75rem)] pt-[clamp(1.5rem,7cqi,2.25rem)]">
        <Etiqueta className="text-(--d-arena)">
          {predica ? 'Mensaje más reciente' : 'Prédicas'}
        </Etiqueta>
        <h3
          id="predica-titulo"
          className={`line-clamp-4 font-display leading-[1.02] font-bold tracking-[-0.03em] ${
            titulo.length > 26
              ? 'text-[clamp(1.375rem,6.4cqi,2.125rem)]'
              : 'text-[clamp(1.75rem,8.4cqi,2.75rem)]'
          }`}
        >
          {titulo}
          {serie && (
            <span
              className={`mt-1 block text-[0.92em] leading-[1.05] tracking-normal text-peach ${CURSIVA}`}
            >
              {serie}
            </span>
          )}
        </h3>
        <span aria-hidden="true" className="my-1 block h-px w-8 bg-cream/60" />
        <p className="max-w-[15rem] text-[clamp(0.9375rem,3.4cqi,1.0625rem)] leading-snug text-cream/85">
          {predica?.meta || 'Escucha los mensajes completos cuando quieras.'}
        </p>
        {enlace.externo ? (
          <a href={enlace.href} target="_blank" rel="noopener noreferrer" className={claseEnlace}>
            {contenidoEnlace}
            <PestanaNueva que="se abre en YouTube" />
          </a>
        ) : (
          <Link href={enlace.href} className={claseEnlace}>
            {contenidoEnlace}
          </Link>
        )}
      </div>
    </article>
  );
}

/**
 * «Personas como tú.» (imagen 7) / «Un lugar para ti.» (imagen 9): en escritorio, sección crema
 * con el texto, el collage de tres fotos y la tarjeta de la prédica; en celular y tablet, sobre el
 * azul de la página, el texto junto a una sola foto y la tarjeta debajo.
 */
export function Personas({
  predica,
  predicas,
}: {
  predica: UltimaPredica;
  /** Hay prédicas (panel o canal de YouTube): sin prédica cargada, la tarjeta invita a verlas. */
  predicas: boolean;
}) {
  const conTarjeta = predica !== null || predicas;
  return (
    <section
      aria-labelledby="personas-titulo"
      className="bg-(--d-noche) text-cream on-dark lg:bg-canvas lg:text-ink lg:[--focus-ring:var(--color-accent)] lg:[--title-em:var(--color-accent-strong)]"
    >
      <div
        className={`${CONTENEDOR} grid grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)] items-start gap-x-[clamp(1rem,4vw,2rem)] gap-y-[clamp(1.75rem,5vw,2.5rem)] pt-[clamp(1.75rem,4vw,2rem)] pb-[clamp(2.5rem,7vw,4rem)] lg:items-stretch lg:gap-x-2 lg:gap-y-4 ${
          conTarjeta
            ? 'lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1fr)_minmax(0,1fr)]'
            : 'lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.6fr)]'
        }`}
      >
        <div className="flex flex-col items-start gap-[clamp(0.75rem,1.6vw,1.25rem)] lg:col-start-1 lg:row-start-1 lg:pr-6">
          <Etiqueta className="text-(--d-arena) lg:text-accent-strong">
            <Alterna movil="Un lugar" escritorio="Una comunidad real" />
          </Etiqueta>
          <h2
            id="personas-titulo"
            className="font-display text-[clamp(2.125rem,1.3rem+3.3vw,3.875rem)] leading-[0.98] font-extrabold tracking-[-0.035em]"
          >
            <Alterna
              movil={
                <>
                  Un lugar para <em>ti.</em>
                </>
              }
              escritorio={
                <>
                  Personas como <em>tú.</em>
                </>
              }
            />
          </h2>
          <p className="max-w-[21rem] text-[clamp(0.9375rem,0.85rem+0.35vw,1.0625rem)] leading-[1.45] text-cream/90 lg:text-ink-soft">
            <Alterna
              movil="Aquí puedes ser tú. No importa tu historia, edad o etapa de vida. Siempre hay un lugar para ti en esta familia."
              escritorio="En IBR creemos que la iglesia es más que un lugar, es una familia. Aquí puedes encontrar amistad, crecer en tu fe y servir junto a otros."
            />
          </p>
        </div>

        {/* Celular y tablet: una foto junto al texto (imagen 9). Escritorio: collage (imagen 7). */}
        <Foto
          src="abrazo-movil.webp"
          sizes="46vw"
          encuadre="object-[60%_center]"
          className="aspect-[1/1.05] rounded-[clamp(0.75rem,2.5vw,1rem)] md:aspect-[4/3.4] lg:hidden"
        />
        <div className="hidden min-h-[clamp(18rem,1rem+21vw,21.25rem)] grid-cols-[46fr_54fr] grid-rows-2 gap-[0.45rem] lg:row-span-2 lg:grid">
          <Foto src="abrazo.webp" sizes="16vw" className="row-span-2 rounded-md" />
          <Foto src="alabanza.webp" sizes="18vw" className="rounded-md" />
          <Foto src="amigos.webp" sizes="18vw" className="rounded-md" />
        </div>

        {/* Fuera de la columna del texto: en celular esa columna es angosta (va junto a la foto) y
            el botón ocupa su propia fila; en escritorio vuelve bajo el texto. */}
        <div className="col-span-2 lg:col-span-1 lg:col-start-1 lg:row-start-2 lg:self-end">
          <Link href="/nosotros" className={pildora({ tono: 'contornoMixto' })}>
            Conócenos más
            <Icon name="arrowRight" className="size-[1.15em]" />
          </Link>
        </div>

        {conTarjeta && <TarjetaPredica predica={predica} />}
      </div>
    </section>
  );
}
