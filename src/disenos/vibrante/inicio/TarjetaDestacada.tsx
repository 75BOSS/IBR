import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { Inclinable } from '@/disenos/vibrante/animacion/Inclinable';
import { Foto } from '@/disenos/vibrante/Foto';
import { FOTOS } from '@/disenos/vibrante/fotos';

export type Destacado = {
  etiqueta: string;
  titulo: string;
  /** Segunda línea en itálica (la serie de la prédica, la fecha del evento). */
  enfasis: string | null;
  meta: string | null;
  accion: { href: string; texto: string } | null;
};

/** El titular se achica si el título es largo: «Logos» llena la tarjeta; una frase, no. */
function tamanoTitulo(titulo: string): string {
  if (titulo.length <= 10) return 'text-[clamp(2.75rem,15cqi,5.5rem)]';
  if (titulo.length <= 24) return 'text-[clamp(2rem,9cqi,3.75rem)]';
  return 'text-[clamp(1.625rem,6.5cqi,2.75rem)]';
}

/**
 * Tarjeta negra junto al collage (imagen 4): la última prédica con su título enorme y la serie en
 * itálica. Si aún no hay prédica, la página le pasa otro destacado real (Prédicas del canal o el
 * próximo evento); el diseño es el mismo. Se inclina un poco con el cursor.
 */
export function TarjetaDestacada({ destacado }: { destacado: Destacado }) {
  const { etiqueta, titulo, enfasis, meta, accion } = destacado;
  return (
    <Inclinable
      as="article"
      grados={4}
      className="@container isolate flex h-full min-h-[clamp(20rem,22vw,23rem)] overflow-hidden rounded-[0.5rem] bg-(--d-negro-hondo) text-canvas on-dark"
    >
      <Foto
        foto={FOTOS.predicador}
        decorativa
        absoluta
        cursor={null}
        sizes="(min-width: 80rem) 20vw, 50vw"
        className="inset-y-0 right-0 -z-10 w-[52%]"
      />
      {/* Velo: el texto que se monta sobre la foto conserva su contraste. */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 right-0 -z-10 w-[52%] bg-linear-to-r from-(--d-negro-hondo) via-(--d-negro-hondo)/25 to-transparent"
      />
      <div className="flex max-w-[64%] flex-col justify-center gap-[clamp(0.875rem,3.5cqi,1.5rem)] p-[clamp(1.25rem,5.5cqi,2rem)]">
        <p className="eyebrow">{etiqueta}</p>
        <h3
          className={`font-display leading-[0.9] font-black tracking-[-0.04em] [--em-escala:0.74em] ${tamanoTitulo(titulo)}`}
        >
          {titulo}
          {enfasis && <em className="mt-[0.12em] block leading-[0.95]">{enfasis}</em>}
        </h3>
        {meta && <p className="text-sm text-(--d-crema-tenue)">{meta}</p>}
        {accion && (
          <Link
            href={accion.href}
            className="group/accion inline-flex min-h-11 items-center gap-4 self-start font-bold after:absolute after:inset-0"
          >
            <span className="grid size-[clamp(2.75rem,9cqi,3rem)] place-items-center rounded-full ring-2 ring-canvas transition-colors group-hover/accion:bg-canvas group-hover/accion:text-ink">
              <Icon name="play" fill="currentColor" className="ml-0.5 size-5" />
            </span>
            {accion.texto}
          </Link>
        )}
      </div>
    </Inclinable>
  );
}
