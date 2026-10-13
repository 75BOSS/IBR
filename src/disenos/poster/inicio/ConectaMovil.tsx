import type { SiteContent } from '@/lib/nav';
import { FilaFoto } from '../FilaFoto';
import { Lema, Titulo } from '../piezas';

/**
 * «Conecta» del celular (imagen 15): caja con el titular, el lema a la derecha y filas con foto.
 * Reúne lo que en escritorio va en la fila de abajo (Grupos, Prédicas, Niños y familias, Servir);
 * cada fila solo si su destino tiene contenido. Sin ninguna, la caja no se dibuja.
 */
export function ConectaMovil({
  content,
  className = '',
}: {
  content: SiteContent;
  className?: string;
}) {
  const filas = [
    content.grupos && {
      foto: '/disenos/poster/grupos.webp',
      titulo: 'Grupos en casa',
      texto: 'Comparte, crece y haz amigos.',
      href: '/grupos',
      accion: 'Explorar',
    },
    content.predicas && {
      foto: '/disenos/poster/predicas.webp',
      titulo: 'Prédicas',
      texto: 'Mensajes que inspiran.',
      href: '/predicas',
      accion: 'Ver',
    },
    content.ministerios && {
      foto: '/disenos/poster/ninos.webp',
      titulo: 'Niños y familias',
      texto: 'Un espacio para crecer juntos.',
      href: '/ministerios',
      accion: 'Conocer',
    },
    content.servir && {
      foto: '/disenos/poster/servir.webp',
      titulo: 'Servir juntos',
      texto: 'Pon tus dones al servicio de otros.',
      href: '/servir',
      accion: 'Participar',
    },
  ].filter((f) => f !== false);
  if (filas.length === 0) return null;

  return (
    <section
      aria-labelledby="conecta-movil"
      className={`@container border-2 border-ink ${className}`}
    >
      <div className="flex items-center justify-between gap-4 border-b-2 border-ink px-[4cqi] py-[2.6cqi]">
        <Titulo id="conecta-movil" estilo="grueso" className="text-[clamp(2.25rem,12.6cqi,4rem)]">
          Conecta
        </Titulo>
        <Lema as="span" tamano="text-[clamp(0.625rem,2.5cqi,0.875rem)]" className="max-w-[14em]">
          Personas reales, una sola familia
        </Lema>
      </div>
      <ul className="flex flex-col divide-y-2 divide-ink">
        {filas.map((f) => (
          <li key={f.href}>
            <FilaFoto {...f} />
          </li>
        ))}
      </ul>
    </section>
  );
}
