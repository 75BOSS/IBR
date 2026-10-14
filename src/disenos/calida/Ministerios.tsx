import Link from 'next/link';
import type { MinisterioExtra } from '@/disenos/contenido';
import { Icon } from '@/components/Icon';
import { toneVar } from '@/lib/css-vars';
import { DAY_NAMES, formatTime } from '@/lib/dates';
import { edadText, ministerioName, type Ministerio } from '@/lib/ministerios';
import { EnlaceFlecha } from './EnlaceFlecha';
import { Foto } from './Foto';
import { Titulo } from './Titulo';
import { Texto } from './Texto';

/** Fotos de la propuesta para un ministerio sin foto propia (rota entre ellas). */
const FOTOS_RESPALDO = [
  '/disenos/calida/ninos.webp',
  '/disenos/calida/vida-real.webp',
  '/disenos/calida/comunidad.webp',
  '/disenos/calida/grupos.webp',
];

/**
 * Un ministerio real (rangos_edad) como fila editorial: la foto y el texto se alternan de lado
 * (zigzag) desde tablet. Su color (`--tone`, o el naranja si no tiene) marca la raya de la foto,
 * el punto y sus grupos (no el texto: un color claro de la BD no tendría contraste). Muestra sus reuniones y grupos reales y lleva a su página.
 * `id` = su slug, para las anclas del menú (#kids, #jovenes…).
 */
export function MinisterioFila({
  m,
  i,
  reuniones,
  grupos,
}: {
  m: Ministerio;
  i: number;
  reuniones: { id: number; nombre: string; dia_semana: number; hora_inicio: string }[];
  grupos: { id: number; nombre: string; dia_semana: number | null; zona: string | null }[];
}) {
  const nombre = ministerioName(m);
  const edad = edadText(m);
  const tituloId = `calida-ministerio-${m.slug}`;
  return (
    <article
      id={m.slug}
      aria-labelledby={tituloId}
      style={toneVar(m.color, 'var(--color-accent)')}
      className="group @container scroll-mt-28"
    >
      <div className="grid items-center gap-[clamp(1.25rem,4cqi,4rem)] @3xl:grid-cols-2">
        <Foto
          src={m.imagen_url ?? FOTOS_RESPALDO[i % FOTOS_RESPALDO.length] ?? FOTOS_RESPALDO[0]!}
          alt={`Actividad del ministerio ${nombre}`}
          sizes="(min-width: 48rem) 48vw, 100vw"
          zoom
          className={`calida-aparece relative aspect-[16/10] rounded-[0.875rem] ${i % 2 === 1 ? '@3xl:order-2' : ''}`}
        >
          <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1.5 bg-(--tone)" />
        </Foto>
        <div className="calida-aparece flex min-w-0 flex-col items-start gap-3">
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="font-script text-[clamp(2rem,1.7rem+1.2vw,2.75rem)] leading-none text-accent-strong italic">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span aria-hidden="true" className="size-2.5 rounded-full bg-(--tone)" />
            {edad && (
              <span className="text-[0.75rem] font-bold tracking-[0.2em] text-accent-strong uppercase">
                {edad}
              </span>
            )}
          </p>
          <Titulo como="h3" id={tituloId} tamano="seccion" className="hyphens-auto text-ink">
            {nombre}
          </Titulo>
          {m.descripcion && <Texto className="max-w-[34rem] text-ink-soft">{m.descripcion}</Texto>}
          {reuniones.length > 0 && (
            <ul className="flex flex-col gap-1.5 pt-1">
              {reuniones.map((r) => (
                <li key={r.id} className="flex items-center gap-2 font-semibold text-ink">
                  <Icon name="clock" className="size-4 shrink-0 text-accent-strong" />
                  {DAY_NAMES[r.dia_semana]} · {formatTime(r.hora_inicio)} · {r.nombre}
                </li>
              ))}
            </ul>
          )}
          {grupos.length > 0 && (
            <div className="flex flex-col gap-2 pt-1">
              <p className="text-[0.75rem] font-bold tracking-[0.2em] text-ink-soft uppercase">
                Grupos en casa
              </p>
              <ul className="flex flex-col gap-1.5">
                {grupos.map((g) => (
                  <li key={g.id} className="flex flex-wrap items-baseline gap-x-2">
                    <span
                      aria-hidden="true"
                      className="size-2.5 shrink-0 translate-y-[-0.05em] rounded-full bg-(--tone)"
                    />
                    <span className="font-semibold text-ink">{g.nombre}</span>
                    {(g.dia_semana || g.zona) && (
                      <span className="text-[0.95rem] text-ink-soft">
                        {[g.dia_semana ? DAY_NAMES[g.dia_semana] : null, g.zona]
                          .filter(Boolean)
                          .join(' · ')}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="pt-2">
            <EnlaceFlecha href={`/ministerios/${m.slug}`}>Conoce {nombre}</EnlaceFlecha>
          </div>
        </div>
      </div>
    </article>
  );
}

/** Fotos de los ministerios de ejemplo (no están en la BD). */
const FOTOS_EXTRA: Record<string, { src: string; alt: string }> = {
  mujeres: {
    src: '/fotos-ejemplo/grupo-mujeres.webp',
    alt: 'Mujeres de la iglesia conversan y ríen en un encuentro',
  },
  matrimonios: {
    src: '/fotos-ejemplo/evento-matrimonios.webp',
    alt: 'Una pareja se abraza y ríe con sus amigos en un encuentro de matrimonios',
  },
  hombres: {
    src: '/fotos-ejemplo/grupo-estudio.webp',
    alt: 'Un grupo de hombres estudia la Biblia en una sala',
  },
};

/**
 * Más formas de conectar (MINISTERIOS_EXTRA: Mujeres, Matrimonios, Hombres): el primero grande a
 * la izquierda y los otros dos apilados a su lado. Cada uno con su ancla (#mujeres…), su foto,
 * para quién es y «Quiero participar» (a Contacto: aún no tienen página propia).
 */
export function MinisteriosExtra({ extras }: { extras: MinisterioExtra[] }) {
  return (
    <div className="@container">
      <ul className="calida-escalonado grid gap-[clamp(1rem,2.5cqi,1.75rem)] @4xl:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] @4xl:grid-rows-2">
        {extras.map((x, i) => {
          const foto = FOTOS_EXTRA[x.slug] ?? FOTOS_EXTRA.mujeres!;
          const grande = i === 0;
          return (
            <li
              key={x.slug}
              id={x.slug}
              className={`group calida-elevar @container relative isolate flex scroll-mt-28 flex-col justify-end overflow-clip rounded-[0.875rem] bg-(--d-noche) text-cream on-dark ${
                grande
                  ? 'min-h-[clamp(22rem,60cqi,34rem)] @4xl:row-span-2'
                  : 'min-h-[clamp(16rem,40cqi,17rem)]'
              }`}
            >
              <Foto
                src={foto.src}
                alt={foto.alt}
                sizes="(min-width: 64rem) 50vw, 100vw"
                zoom
                className="absolute inset-0 -z-10"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-linear-to-t from-(--d-noche) from-10% via-(--d-noche)/55 via-50% to-transparent"
                />
              </Foto>
              <div className="flex flex-col items-start gap-2 p-[clamp(1.25rem,6cqi,2.5rem)]">
                <span className="rounded-full bg-cream/15 px-3 py-1 text-[0.8rem] font-semibold text-cream">
                  {x.para}
                </span>
                <h3
                  className={`font-display leading-none ${
                    grande
                      ? 'text-[clamp(2.25rem,8cqi,3.75rem)]'
                      : 'text-[clamp(1.875rem,7cqi,2.5rem)]'
                  }`}
                >
                  {x.nombre}
                </h3>
                <p className="max-w-[28rem] text-cream/90">{x.texto}</p>
                <Link
                  href="/contacto#mensaje"
                  className="group/x mt-1 inline-flex items-center gap-2 font-semibold text-peach"
                >
                  <span className="calida-trazo">Quiero participar</span>
                  <Icon
                    name="arrowRight"
                    className="size-4 transition-transform motion-safe:group-hover/x:translate-x-1"
                  />
                </Link>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
