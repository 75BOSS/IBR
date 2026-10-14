import Link from 'next/link';
import type { Valor } from '@/disenos/contenido';
import { Icon, type IconName } from '@/components/Icon';
import { toneVar } from '@/lib/css-vars';
import { DAY_NAMES, formatTime } from '@/lib/dates';
import { edadText, ministerioName } from '@/lib/ministerios';
import { Etiqueta } from './Etiqueta';
import { EnlaceFlecha } from './EnlaceFlecha';
import { Foto } from './Foto';
import { Titulo } from './Titulo';
import { botonCalida } from './botones';
import { Texto } from './Texto';
import { diaPrincipal, rutaCalida } from './textos';

type Reunion = {
  id: number;
  nombre: string;
  dia_semana: number;
  hora_inicio: string;
  hora_fin: string | null;
  en_linea: boolean;
  ubicacion: string | null;
  rango_edad: string | null;
  rango_color: string | null;
  rango_edad_id: number | null;
};

/** Enlace externo a Google Maps (avisa que abre otra pestaña). */
function AMapa({
  href,
  className,
  children,
}: {
  href: string;
  className: string;
  children: string;
}) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      <Icon name="mapPin" className="size-5" />
      {children}
      <span className="sr-only"> (abre Google Maps en una pestaña nueva)</span>
    </a>
  );
}

/**
 * Horarios reales: la tarjeta azul noche con el día principal en grande (luz cálida que sigue al
 * mouse) y, a su lado, todas las reuniones de la semana con su hora, ministerio y lugar.
 */
export function HorariosVisita({
  reuniones,
  comoLlegar,
}: {
  reuniones: Reunion[];
  comoLlegar: string | null;
}) {
  const principal = diaPrincipal(reuniones);
  return (
    <div className="@container">
      <div className="grid gap-[clamp(1rem,2.5cqi,2rem)] @4xl:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <div
          data-luz=""
          className="calida-aparece calida-luz @container relative isolate flex flex-col justify-between gap-8 overflow-clip rounded-[0.875rem] bg-(--d-noche) p-[clamp(1.5rem,5cqi,2.75rem)] text-cream on-dark"
        >
          <div className="flex flex-col gap-3">
            <Etiqueta className="text-peach">Te esperamos</Etiqueta>
            <Titulo
              como="p"
              tamano="libre"
              className="text-[clamp(2.75rem,15cqi,4.75rem)] leading-[0.95]"
            >
              {principal?.dia ?? 'Cada semana'}
            </Titulo>
            {principal && (
              <p className="font-script text-[clamp(1.75rem,1.4rem+1.4vw,2.5rem)] leading-none text-peach italic">
                a las {principal.horas}
              </p>
            )}
            <p className="max-w-[24rem] pt-2 text-cream/85">
              Llega unos minutos antes: te ayudamos a encontrar un lugar y a dejar a tus hijos en su
              clase.
            </p>
          </div>
          {comoLlegar && (
            <AMapa
              href={comoLlegar}
              className={botonCalida('contornoClaro', 'normal', 'self-start')}
            >
              Cómo llegar
            </AMapa>
          )}
        </div>
        <ol className="calida-escalonado flex flex-col border-t border-line">
          {reuniones.map((r) => (
            <li
              key={r.id}
              className="grid grid-cols-[clamp(4.5rem,16cqi,6.5rem)_minmax(0,1fr)] items-start gap-x-[clamp(0.875rem,3cqi,1.75rem)] border-b border-line py-[clamp(1rem,2.4cqi,1.375rem)]"
            >
              <span className="font-display text-[clamp(1.75rem,1.4rem+1.4vw,2.5rem)] leading-none text-accent-strong">
                {formatTime(r.hora_inicio)}
              </span>
              <span className="flex min-w-0 flex-col gap-1.5">
                <span className="text-[0.75rem] font-bold tracking-[0.18em] text-ink-soft uppercase">
                  {DAY_NAMES[r.dia_semana]}
                  {r.hora_fin ? ` · hasta las ${formatTime(r.hora_fin)}` : ''}
                </span>
                <span className="font-display text-[clamp(1.25rem,1.1rem+0.6vw,1.625rem)] leading-tight text-ink">
                  {r.nombre}
                </span>
                <span className="flex flex-wrap gap-x-4 gap-y-1 text-[0.95rem] text-ink-soft">
                  {r.rango_edad && (
                    <span className="inline-flex items-center gap-2">
                      <span
                        aria-hidden="true"
                        style={toneVar(r.rango_color, 'var(--color-accent)')}
                        className="size-2.5 rounded-full bg-(--tone)"
                      />
                      {r.rango_edad}
                    </span>
                  )}
                  {r.en_linea && (
                    <span className="inline-flex items-center gap-1.5">
                      <Icon name="video" className="size-4 text-accent-strong" /> También en línea
                    </span>
                  )}
                  {r.ubicacion && (
                    <span className="inline-flex items-center gap-1.5">
                      <Icon name="mapPin" className="size-4 text-accent-strong" /> {r.ubicacion}
                    </span>
                  )}
                </span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

const ICONOS_ESPERAR: IconName[] = ['handHeart', 'sparkle', 'book', 'heartHandshake'];

/**
 * «Qué esperar»: la foto alta a un lado y los cuatro momentos del domingo, cada uno con su ícono
 * en un círculo durazno y su número; se elevan al pasar el mouse.
 */
export function QueEsperar({ momentos }: { momentos: Valor[] }) {
  return (
    <div className="@container">
      <div className="grid gap-[clamp(1rem,2.5cqi,2rem)] @4xl:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <Foto
          src="/disenos/calida/mesa.webp"
          alt="Familias de la iglesia comparten la mesa y ríen después del culto"
          sizes="(min-width: 64rem) 40vw, 100vw"
          paralaje
          encuadre="object-[40%_center]"
          className="calida-aparece relative aspect-[16/10] rounded-[0.875rem] @4xl:aspect-auto @4xl:min-h-full"
        />
        <ol className="calida-escalonado grid gap-[clamp(0.75rem,2cqi,1.25rem)] @xl:grid-cols-2">
          {momentos.map((m, i) => (
            <li
              key={m.titulo}
              className="calida-elevar flex flex-col gap-3 rounded-[0.875rem] bg-surface p-[clamp(1.25rem,3.5cqi,1.75rem)] ring-1 ring-line"
            >
              <span className="flex items-center justify-between gap-3">
                <span className="grid size-12 place-items-center rounded-full bg-(--d-durazno-fuerte) text-accent-strong">
                  <Icon
                    name={ICONOS_ESPERAR[i % ICONOS_ESPERAR.length] ?? 'sparkle'}
                    className="size-6"
                  />
                </span>
                <span
                  aria-hidden="true"
                  className="font-script text-[2rem] leading-none text-accent-strong/70 italic"
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
              </span>
              <h3 className="font-display text-[clamp(1.375rem,1.2rem+0.7vw,1.75rem)] leading-tight text-ink">
                {m.titulo}
              </h3>
              <p className="text-[clamp(1rem,0.96rem+0.2vw,1.0625rem)] leading-normal text-ink-soft">
                {m.texto}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

/**
 * Ministerios para niños y adolescentes (los reales, menores de 18): foto, color, edades, cuándo
 * se reúnen y el enlace a su sección en Ministerios.
 */
export function NinosVisita({
  ministerios,
  reuniones,
}: {
  ministerios: {
    id: number;
    slug: string;
    nombre: string;
    nombre_ministerio: string | null;
    edad_min: number | null;
    edad_max: number | null;
    color: string | null;
    imagen_url: string | null;
  }[];
  reuniones: Reunion[];
}) {
  return (
    <ul className="calida-escalonado grid gap-[clamp(1rem,2.5vw,2rem)] md:grid-cols-2">
      {ministerios.map((m) => {
        const suyas = reuniones.filter((r) => r.rango_edad_id === m.id);
        const nombre = ministerioName(m);
        return (
          <li
            key={m.id}
            style={toneVar(m.color, 'var(--color-accent)')}
            className="group calida-elevar @container flex flex-col overflow-clip rounded-[0.875rem] bg-surface ring-1 ring-line"
          >
            <Foto
              src={m.imagen_url ?? '/disenos/calida/ninos.webp'}
              alt={`Actividad del ministerio ${nombre}`}
              sizes="(min-width: 48rem) 45vw, 100vw"
              zoom
              className="relative aspect-[16/9]"
            >
              <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1.5 bg-(--tone)" />
            </Foto>
            <div className="flex flex-1 flex-col items-start gap-2 p-[clamp(1.25rem,5cqi,2rem)]">
              {edadText(m) && (
                <span className="text-[0.75rem] font-bold tracking-[0.2em] text-accent-strong uppercase">
                  {edadText(m)}
                </span>
              )}
              <h3 className="font-display text-[clamp(1.75rem,1.4rem+1.2vw,2.5rem)] leading-none text-ink">
                {nombre}
              </h3>
              {suyas.length > 0 && (
                <ul className="flex flex-wrap gap-2 pt-1">
                  {suyas.map((r) => (
                    <li
                      key={r.id}
                      className="inline-flex items-center gap-2 rounded-full bg-canvas px-3 py-1 text-[0.9rem] font-semibold text-ink ring-1 ring-line"
                    >
                      <Icon name="clock" className="size-4 text-accent-strong" />
                      {DAY_NAMES[r.dia_semana]} {formatTime(r.hora_inicio)}
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-auto pt-3">
                <EnlaceFlecha href={rutaCalida(`/ministerios#${m.slug}`)}>
                  Conoce {nombre}
                </EnlaceFlecha>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/**
 * «Cómo llegar» (solo si la iglesia cargó su ubicación): banda azul noche con la dirección o una
 * invitación y el botón a Google Maps, junto a la foto del auditorio.
 */
export function ComoLlegarBanda({
  href,
  direccion,
  id,
}: {
  href: string;
  direccion: string | null;
  id: string;
}) {
  return (
    <div className="@container">
      <div
        data-luz=""
        className="calida-aparece calida-luz relative isolate grid overflow-clip rounded-[0.875rem] bg-(--d-noche) text-cream on-dark @3xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]"
      >
        <div className="flex flex-col items-start justify-center gap-4 p-[clamp(1.5rem,6cqi,4rem)]">
          <Etiqueta className="text-peach">Cómo llegar</Etiqueta>
          <Titulo
            id={id}
            tamano="libre"
            className="text-[clamp(2.25rem,6cqi,3.75rem)] leading-[0.98]"
          >
            Nos vemos en <em className="text-peach">Riobamba</em>
          </Titulo>
          <Texto className="max-w-[30rem] text-cream/85">
            {direccion ?? 'Abre el mapa y Google Maps te lleva hasta la puerta del auditorio.'}
          </Texto>
          <AMapa href={href} className={botonCalida('naranja', 'normal', 'mt-1')}>
            Abrir en Google Maps
          </AMapa>
        </div>
        <Foto
          src="/disenos/calida/auditorio.webp"
          alt="El auditorio lleno durante la alabanza del domingo"
          sizes="(min-width: 48rem) 40vw, 100vw"
          paralaje
          className="relative min-h-[clamp(13rem,50cqi,18rem)] @3xl:min-h-full"
        />
      </div>
    </div>
  );
}

/** «¿Tienes otra pregunta?» junto al acordeón de preguntas frecuentes. */
export function OtraPregunta() {
  return (
    <div className="calida-aparece flex flex-col items-start gap-3 rounded-[0.875rem] bg-(--d-durazno-panel) p-[clamp(1.25rem,3vw,1.75rem)]">
      <p className="font-display text-[clamp(1.375rem,1.2rem+0.7vw,1.75rem)] leading-tight text-ink">
        ¿Tienes otra pregunta?
      </p>
      <p className="text-ink-soft">Escríbenos y te respondemos con gusto antes de tu visita.</p>
      <Link href="/contacto#mensaje" className={botonCalida('contorno', 'normal')}>
        Escríbenos
        <Icon name="arrowRight" className="size-4" />
      </Link>
    </div>
  );
}
