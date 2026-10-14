import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { IconoPoster, type IconoPosterNombre } from './IconoPoster';
import { Titulo } from './piezas';

/**
 * Banda durazno del final de una página (imagen 14): una pregunta grande y su acción en rojo
 * («¿No sabes por dónde empezar? Te orientamos →»). Por defecto lleva al formulario de contacto,
 * que siempre existe. Toda la banda es el enlace; al pasar el cursor la flecha avanza y una raya
 * roja se dibuja bajo la acción.
 */
export function BandaCierre({
  titulo = '¿No sabes por dónde empezar?',
  accion = 'Te orientamos',
  href = '/contacto#mensaje',
  icono = 'mensajes',
}: {
  titulo?: string;
  accion?: string;
  href?: string;
  icono?: IconoPosterNombre;
}) {
  return (
    <Link href={href} className="group @container block bg-(--d-durazno) text-ink">
      <div className="flex flex-wrap items-center gap-x-[3.2cqi] gap-y-3 px-[clamp(1rem,4.5cqi,3.75rem)] py-[clamp(1.25rem,3cqi,1.75rem)] @3xl:flex-nowrap">
        <IconoPoster nombre={icono} className="size-[clamp(2.25rem,4.4cqi,3.25rem)]" />
        <Titulo
          estilo="grueso"
          className="min-w-0 grow basis-[60%] text-[clamp(1.5rem,6.5cqi,3.25rem)] text-balance font-stretch-[78%] @3xl:text-[clamp(1.75rem,4.1cqi,3.25rem)]"
        >
          {titulo}
        </Titulo>
        <span className="d-fila inline-flex shrink-0 items-center gap-[0.45em] font-display text-[clamp(1.125rem,0.95rem+0.8vw,1.75rem)] font-bold text-accent-strong font-stretch-[92%] @3xl:border-l-2 @3xl:border-ink @3xl:py-[1.2cqi] @3xl:pl-[3.2cqi]">
          {accion}
          <Icon name="arrowRight" className="d-flecha size-[1.1em]" />
        </span>
      </div>
    </Link>
  );
}
