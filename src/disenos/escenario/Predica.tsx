import Image from 'next/image';
import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { FLECHA, claseBoton } from './estilos';
import { Puntuacion } from './Puntuacion';

type UltimaPredica = { videoId: string; titulo: string; serie: string | null; meta: string };

/**
 * La última prédica (la del panel o el último culto del canal). Con video: banda azul marino con
 * la miniatura y el título. Sin video pero con la página de prédicas (canal configurado): una
 * invitación corta. Sin ninguna de las dos, no se muestra.
 */
export function Predica({
  predica,
  hayPredicas,
}: {
  predica: UltimaPredica | null;
  hayPredicas: boolean;
}) {
  const boton = hayPredicas && (
    <Link href="/predicas" className={claseBoton('rojo')}>
      Ver prédicas
      <Icon name="arrowRight" className={FLECHA} />
    </Link>
  );

  if (!predica) {
    if (!hayPredicas) return null;
    return (
      <section aria-labelledby="predicas" className="container-page">
        <div className="flex flex-col items-start gap-5 rounded-[1.75rem] bg-(--d-marino) p-[clamp(1.5rem,4.5vw,3rem)] text-cream on-dark md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-2">
            <h2
              id="predicas"
              className="font-headline text-[clamp(1.625rem,1.1rem+2.2vw,2.5rem)] leading-[1.05] font-extrabold tracking-[-0.04em]"
            >
              La Palabra
              <Puntuacion signo="," /> <em className="font-semibold italic">cada domingo.</em>
            </h2>
            <p className="text-cream/85">Mira las prédicas en video cuando quieras.</p>
          </div>
          {boton}
        </div>
      </section>
    );
  }

  return (
    <section aria-labelledby="ultima-predica" className="bg-(--d-marino) text-cream on-dark">
      <div className="container-page grid items-center gap-[clamp(1.5rem,4vw,3.5rem)] py-[clamp(3rem,7vw,5rem)] lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <div className="relative aspect-video overflow-hidden rounded-2xl bg-(--d-marino-hondo)">
          <Image
            src={`https://i.ytimg.com/vi/${encodeURIComponent(predica.videoId)}/hqdefault.jpg`}
            alt={`Miniatura de la prédica «${predica.titulo}»`}
            fill
            sizes="(min-width: 64rem) 36rem, 100vw"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col items-start gap-4">
          <p className="eyebrow text-cream/75">Última prédica</p>
          <h2
            id="ultima-predica"
            className="font-headline text-[clamp(1.75rem,1.1rem+2.6vw,3rem)] leading-[1.05] font-extrabold tracking-[-0.035em]"
          >
            {predica.titulo}
          </h2>
          {predica.serie && (
            <p className="font-serif text-[1.375rem] text-cream/90 italic">{predica.serie}</p>
          )}
          {predica.meta && <p className="text-cream/80">{predica.meta}</p>}
          {boton}
        </div>
      </div>
    </section>
  );
}
