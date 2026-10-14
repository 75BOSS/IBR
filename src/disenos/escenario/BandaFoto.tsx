import { FotoArte } from './FotoArte';
import { Reflector } from './Reflector';

/**
 * Banda azul marino con una foto teñida detrás (imagen 11 «¿Tienes alguna pregunta?» e imagen 12
 * «Somos Familia para toda la vida.»): título, una frase y una acción, todo centrado. Con mouse,
 * un reflector de teatro sigue al cursor sobre la banda.
 */
export function BandaFoto({
  id,
  titulo,
  texto,
  children,
}: {
  id: string;
  titulo: React.ReactNode;
  texto: string;
  children: React.ReactNode;
}) {
  return (
    <section
      aria-labelledby={id}
      className="relative isolate overflow-hidden bg-(--d-marino) text-cream on-dark"
    >
      <FotoArte
        ancha={{ src: '/disenos/escenario/banda.webp', width: 1536, height: 196 }}
        angosta={{ src: '/disenos/escenario/banda-celular.webp', width: 728, height: 264 }}
        className="absolute inset-0 -z-20 size-full object-cover"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-(image:--d-velo-banda)" />
      <Reflector />
      <div className="container-page flex max-w-[48rem] flex-col items-center gap-[clamp(0.75rem,1.8vw,1.125rem)] py-[clamp(2.25rem,5vw,2.75rem)] text-center">
        <h2
          id={id}
          className="font-headline text-[clamp(2rem,1.45rem+2.3vw,2.875rem)] leading-[1.02] font-extrabold tracking-[-0.04em] text-balance"
        >
          {titulo}
        </h2>
        <p className="max-w-[30rem] text-[clamp(1.0625rem,0.98rem+0.3vw,1.1875rem)] text-cream/90">
          {texto}
        </p>
        <div className="mt-[clamp(0.25rem,1vw,0.5rem)]">{children}</div>
      </div>
    </section>
  );
}
