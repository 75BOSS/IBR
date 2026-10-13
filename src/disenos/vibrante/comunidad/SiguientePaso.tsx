import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { botonClases } from '@/disenos/vibrante/boton';
import { Foto } from '@/disenos/vibrante/Foto';
import { FOTOS } from '@/disenos/vibrante/fotos';

/**
 * Banda negra de cierre (imagen 5): «Siempre hay un lugar para ti.» con la segunda línea en
 * rojo, la invitación con «Soy nuevo» y una foto que se funde con el negro.
 */
export function SiguientePaso() {
  return (
    <section
      aria-labelledby="siguiente-titulo"
      className="grid bg-(--d-negro) text-canvas on-dark lg:grid-cols-[minmax(0,58.5fr)_minmax(0,41.5fr)]"
    >
      <div className="@container grid items-center gap-x-[clamp(1.5rem,4cqi,3.5rem)] gap-y-6 py-[clamp(2.5rem,7vw,3rem)] pr-[clamp(1rem,3.9vw,2rem)] pl-[clamp(1rem,3.9vw,3.75rem)] md:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-3">
          <p className="eyebrow">Tu siguiente paso</p>
          <h2
            id="siguiente-titulo"
            className="font-display text-[clamp(2.375rem,9cqi,4rem)] leading-[0.92] font-black tracking-[-0.04em]"
          >
            Siempre hay un <span className="block text-(--d-rojo-vivo)">lugar para ti.</span>
          </h2>
        </div>
        <div className="flex flex-col items-start gap-4">
          <p className="max-w-[36ch] text-[clamp(1rem,0.95rem+0.2vw,1.0625rem)] leading-snug">
            Conoce más sobre nuestra iglesia, resuelve tus dudas y da tu primer paso. Queremos
            conocerte.
          </p>
          <Link href="/soy-nuevo" className={botonClases()}>
            Soy nuevo <Icon name="arrowRight" className="size-4" />
          </Link>
        </div>
      </div>
      <div className="relative min-h-[clamp(12rem,40vw,16rem)] lg:min-h-0">
        <Foto
          foto={FOTOS.siguientePaso}
          absoluta
          sizes="(min-width: 64rem) 42vw, 100vw"
          className="inset-0"
        />
        {/* La foto se funde con la banda: hacia arriba en celular, hacia la izquierda desde lg. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-b from-(--d-negro) via-transparent to-transparent lg:bg-linear-to-r lg:via-(--d-negro)/10"
        />
      </div>
    </section>
  );
}
