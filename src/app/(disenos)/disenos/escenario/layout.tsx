import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import { datosMarco } from '@/disenos/datos';
import { Encabezado } from '@/disenos/escenario/Encabezado';
import { Pie } from '@/disenos/escenario/Pie';
import '@/disenos/escenario/tema.css';

// Propuesta D · Escenario: titulares en una sans geométrica muy gruesa (Plus Jakarta Sans
// ExtraBold) y la palabra destacada en serifa negra o cursiva (Playfair Display). El texto usa
// Figtree, que ya carga la raíz del sitio.
const titulo = Plus_Jakarta_Sans({
  variable: '--font-escenario-titulo',
  subsets: ['latin'],
  display: 'swap',
});

const serifa = Playfair_Display({
  variable: '--font-escenario-serifa',
  subsets: ['latin'],
  style: ['normal', 'italic'],
  display: 'swap',
});

export default async function EscenarioLayout({ children }: { children: React.ReactNode }) {
  const { nav, redes, nombre } = await datosMarco();
  return (
    <div
      className={`diseno-escenario ${titulo.variable} ${serifa.variable} relative flex min-h-dvh flex-col`}
    >
      <a
        href="#contenido"
        className="sr-only z-50 rounded-lg bg-accent px-4 py-2 font-semibold text-cream focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Saltar al contenido
      </a>
      <Encabezado menu={nav.menu} links={nav.links} redes={redes} nombre={nombre} />
      <main id="contenido" tabIndex={-1} className="flex-1 focus:outline-none">
        {children}
      </main>
      <Pie menu={nav.menu} links={nav.links} legal={nav.legal} redes={redes} nombre={nombre} />
    </div>
  );
}
