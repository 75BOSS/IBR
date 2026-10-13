import Image from 'next/image';
import { Raya, Titulo } from '../piezas';

/**
 * Foto grande con la frase debajo, enmarcada como una nota de periódico. En escritorio la frase
 * larga de la imagen 13 con su raya roja; en el celular, la corta de la imagen 15.
 */
export function FotoFrase({ className = '' }: { className?: string }) {
  return (
    <div className={`@container flex flex-col border-2 border-ink p-1 ${className}`}>
      <div className="relative aspect-[1.92] grow overflow-hidden @2xl/pagina:aspect-[2.22]">
        <Image
          src="/disenos/poster/mesa.webp"
          alt="Hermanos de la iglesia conversan y ríen alrededor de una mesa"
          fill
          priority
          sizes="(min-width: 64rem) 58vw, 100vw"
          className="object-cover"
        />
      </div>
      <div className="flex flex-col gap-[2.2cqi] px-[2.6cqi] pt-[2.4cqi] pb-[1.8cqi] @2xl/pagina:pt-[2.8cqi] @2xl/pagina:pb-[2.6cqi]">
        <Titulo
          as="p"
          estilo="grueso"
          className="text-[clamp(1.625rem,11cqi,5.5rem)] font-stretch-[85%] @2xl/pagina:text-[clamp(1.5rem,5.8cqi,3.5rem)] @2xl/pagina:font-stretch-[72%] @2xl/pagina:[word-spacing:0.06em]"
        >
          La fe <span className="hidden @2xl/pagina:inline">también </span>se vive{' '}
          <span className="@2xl/pagina:hidden">juntos</span>
          <span className="hidden @2xl/pagina:inline">alrededor de una mesa</span>.
        </Titulo>
        <Raya className="hidden @2xl/pagina:block" />
      </div>
    </div>
  );
}
