import { Icon, type IconName } from '@/components/Icon';
import { CabeceraSeccion, PestanaNueva, Titulo } from '../piezas';

/** «https://www.instagram.com/ibr_riobamba/» → «instagram.com/ibr_riobamba». */
function direccionCorta(href: string): string {
  return href.replace(/^https?:\/\/(www\.)?/, '').replace(/\/+$/, '');
}

/**
 * Canales (redes configuradas en el panel): una fila grande por red con su ícono, su nombre en
 * la letra del titular y la dirección; se invierte al pasar el cursor y la flecha avanza. Sin
 * redes, no se dibuja.
 */
export function Canales({ redes }: { redes: { label: string; icon: IconName; href: string }[] }) {
  if (redes.length === 0) return null;
  return (
    <section id="canales" aria-labelledby="canales-titulo" className="flex flex-col gap-1">
      <CabeceraSeccion
        id="canales-titulo"
        lema="Entre semana"
        titulo={
          <>
            Síguenos <em>en línea</em>
          </>
        }
      />
      <ul className="grid gap-1 @3xl/pagina:grid-cols-2">
        {redes.map((r) => (
          <li key={r.href} className="flex">
            <a
              href={r.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group d-invierte @container flex flex-1 items-center gap-[clamp(0.875rem,4cqi,1.5rem)] border-2 border-(--inv-borde) p-[clamp(0.875rem,4cqi,1.5rem)]"
            >
              <span className="grid size-[clamp(3rem,14cqi,4.5rem)] shrink-0 place-items-center bg-accent text-canvas">
                <Icon name={r.icon} className="size-[50%]" />
              </span>
              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <Titulo
                  as="span"
                  estilo="negro"
                  className="text-[clamp(1.75rem,11cqi,3rem)] font-stretch-[80%]"
                >
                  {r.label}
                </Titulo>
                <span className="text-sm [overflow-wrap:anywhere] text-(--inv-suave)">
                  {direccionCorta(r.href)}
                </span>
              </span>
              <Icon name="arrowUpRight" className="d-flecha size-7 shrink-0 text-(--inv-acento)" />
              <PestanaNueva />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
