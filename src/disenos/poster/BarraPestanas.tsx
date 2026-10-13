import { EnlacesPrincipales } from './EnlacesPrincipales';
import type { EnlacePrincipal } from './enlaces';

/**
 * Barra de pestañas fija abajo en celular y tablet (imagen 15): Inicio · Comunidad · Prédicas ·
 * Visítanos. El layout deja su alto libre al final de la página para que no tape el pie.
 */
export function BarraPestanas({ enlaces }: { enlaces: EnlacePrincipal[] }) {
  return (
    <nav
      aria-label="Accesos"
      className="fixed inset-x-0 bottom-0 z-40 h-(--d-barra) border-t-2 border-ink bg-canvas lg:hidden"
    >
      <EnlacesPrincipales enlaces={enlaces} variante="barra" />
    </nav>
  );
}
