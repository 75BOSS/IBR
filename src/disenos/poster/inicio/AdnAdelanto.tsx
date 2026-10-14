import Image from 'next/image';
import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { ADN } from '@/disenos/contenido';
import { RUTA_CONOCENOS } from '../enlaces';
import { TitularDesliza } from '../movimiento/TitularDesliza';
import { Lema, Numero, Raya, Titulo } from '../piezas';

/**
 * Adelanto de Conócenos en el inicio: «BIBLIA ✶ FAMILIA ✶ GRACIA…» enorme que corre con el
 * scroll y, debajo, la foto del abrazo junto a tres valores del ADN en filas con flecha (la raya
 * roja se dibuja al pasar). Lleva a la sección #adn de Conócenos.
 */
export function AdnAdelanto({ className = '' }: { className?: string }) {
  return (
    <section aria-labelledby="adn-adelanto" className={`flex flex-col gap-1 ${className}`}>
      <TitularDesliza
        className="-mx-(--d-margen) lg:-mx-1.5"
        texto="Biblia ✶ Familia ✶ Gracia ✶ Servicio ✶ Generosidad ✶ Riobamba ✶ Biblia ✶ Familia ✶"
      />
      <div className="grid gap-1 @4xl/pagina:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div className="group relative min-h-[clamp(15rem,45vw,26rem)] overflow-hidden border-2 border-ink">
          <Image
            src="/disenos/poster/abrazo.webp"
            alt="Dos amigas se abrazan sonriendo después del culto"
            fill
            sizes="(min-width: 64rem) 40vw, 100vw"
            className="d-foto object-cover"
          />
        </div>
        <div className="@container flex flex-col gap-[clamp(1rem,4cqi,1.5rem)] border-2 border-ink p-[clamp(1.25rem,5cqi,2.5rem)]">
          <Lema className="text-accent">Conócenos</Lema>
          <Titulo
            id="adn-adelanto"
            estilo="negro"
            className="pt-[0.1em] text-[clamp(2.5rem,14cqi,5.5rem)] font-stretch-[80%]"
          >
            Nuestro <em>ADN</em>
          </Titulo>
          <Raya />
          <ul className="flex flex-col border-t-2 border-ink">
            {ADN.slice(0, 3).map((v, n) => (
              <li
                key={v.titulo}
                className="d-fila grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-4 border-b-2 border-ink py-3"
              >
                <Numero className="text-[clamp(1.75rem,8cqi,2.75rem)] text-accent">
                  {String(n + 1).padStart(2, '0')}
                </Numero>
                <span className="flex flex-col gap-0.5">
                  <span className="font-display text-[clamp(1.25rem,5.5cqi,1.75rem)] leading-tight font-extrabold font-stretch-[80%]">
                    {v.titulo}
                  </span>
                  <span className="text-[0.9688rem] leading-snug text-ink-soft">{v.texto}</span>
                </span>
              </li>
            ))}
          </ul>
          <Link
            href={`${RUTA_CONOCENOS}#adn`}
            className="group mt-auto inline-flex min-h-11 w-fit items-center gap-2 font-display text-[clamp(1.0625rem,1rem+0.4vw,1.375rem)] font-bold text-accent font-stretch-[92%]"
          >
            Conoce los seis valores
            <Icon name="arrowRight" className="d-flecha size-[1.1em]" />
          </Link>
        </div>
      </div>
    </section>
  );
}
