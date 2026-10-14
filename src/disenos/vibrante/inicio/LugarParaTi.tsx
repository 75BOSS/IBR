import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { Contenedor } from '@/disenos/vibrante/Contenedor';
import { Foto } from '@/disenos/vibrante/Foto';
import { FOTOS } from '@/disenos/vibrante/fotos';
import { RUTAS } from '@/disenos/vibrante/menu';
import { Titular } from '@/disenos/vibrante/Titular';
import { toneVar } from '@/lib/css-vars';
import { type Ministerio, edadText, ministerioName } from '@/lib/ministerios';

/**
 * «Un lugar para ti.» (imagen 6): titular y frase junto a una foto redondeada; debajo, los
 * ministerios por edad (cada uno con su color de la BD, lleva a su sección en Ministerios). Sin
 * ministerios con contenido, queda la invitación con la foto.
 */
export function LugarParaTi({ ministerios }: { ministerios: Ministerio[] }) {
  return (
    <section aria-labelledby="lugar-titulo" className="border-t border-line">
      <Contenedor className="grid grid-cols-2 gap-x-[clamp(1rem,3.5vw,4rem)] gap-y-8 py-[clamp(2.5rem,7vw,5.5rem)] lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:grid-rows-[auto_1fr]">
        <div className="@container flex flex-col justify-center gap-[clamp(0.875rem,5cqi,1.5rem)]">
          <Titular
            id="lugar-titulo"
            tamano="libre"
            className="text-[clamp(2.125rem,22cqi,4.75rem)] leading-[0.95] [--em-escala:1.18em]"
            lineas={[
              'Un lugar',
              <span key="ti">
                para <em>ti.</em>
              </span>,
            ]}
          />
          <p className="max-w-[32ch] text-[clamp(1rem,0.92rem+0.35vw,1.25rem)] leading-snug">
            No importa en qué etapa estés, aquí siempre hay un lugar para ti.
          </p>
        </div>
        <Foto
          foto={FOTOS.lugar}
          sizes="(min-width: 64rem) 50vw, 50vw"
          className="min-h-[clamp(10rem,40vw,20rem)] rounded-[0.75rem] lg:row-span-2 lg:min-h-[clamp(22rem,30vw,32rem)]"
        />
        {ministerios.length > 0 && (
          <ul className="col-span-2 flex flex-col self-end lg:col-span-1">
            {ministerios.map((m) => (
              <li key={m.id} style={toneVar(m.color, 'var(--color-accent)')}>
                <Link
                  href={`${RUTAS.ministerios}#${m.slug}`}
                  className="group flex min-h-14 items-center gap-4 border-t border-line py-3"
                >
                  <span aria-hidden="true" className="size-3 shrink-0 rounded-full bg-(--tone)" />
                  <span className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-3">
                    <span className="font-display text-[clamp(1.25rem,1rem+1vw,1.75rem)] font-black tracking-[-0.03em] group-hover:text-accent">
                      {ministerioName(m)}
                    </span>
                    {edadText(m) && <span className="text-ink-soft">{edadText(m)}</span>}
                  </span>
                  <Icon
                    name="arrowRight"
                    className="size-5 text-accent transition-transform motion-safe:group-hover:translate-x-1"
                  />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Contenedor>
    </section>
  );
}
