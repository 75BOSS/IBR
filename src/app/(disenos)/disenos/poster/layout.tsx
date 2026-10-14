import { Archivo } from 'next/font/google';
import { datosMinisterios } from '@/disenos/datos';
import { BarraPestanas } from '@/disenos/poster/BarraPestanas';
import { EncabezadoMovil } from '@/disenos/poster/EncabezadoMovil';
import { Lateral } from '@/disenos/poster/Lateral';
import { menuPoster } from '@/disenos/poster/menu';
import { Pie } from '@/disenos/poster/Pie';
import '@/disenos/poster/tema.css';

// Archivo variable con eje de ancho: la misma familia da los titulares negros («SOMOS
// FAMILIA»), los gruesos («Este domingo») y los condensados («Grupos en casa»).
const archivo = Archivo({
  variable: '--font-poster-titulo',
  subsets: ['latin'],
  axes: ['wdth'],
  display: 'swap',
});

/**
 * Propuesta E · Póster: menú lateral fijo en escritorio; en celular y tablet, encabezado con
 * hamburguesa y barra de pestañas abajo. El selector de diseños lo pone el layout de /disenos.
 * Lee los ministerios (además del marco) porque el menú enlaza Kids y Jóvenes solo si existen.
 */
export default async function PosterLayout({ children }: { children: React.ReactNode }) {
  const { nombre, nav, content, config, redes, comoLlegar, ministerios } = await datosMinisterios();
  const menu = menuPoster(content, ministerios);
  return (
    <div className={`${archivo.variable} diseno-poster`}>
      <a
        href="#contenido"
        className="sr-only z-50 rounded-md bg-ink px-4 py-2 font-semibold text-canvas focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Saltar al contenido
      </a>
      <div className="min-h-dvh pb-(--d-barra) lg:grid lg:grid-cols-[clamp(13rem,16.6vw,16.5rem)_minmax(0,1fr)] lg:pb-0">
        <Lateral nombre={nombre} menu={menu} />
        <div className="flex min-h-dvh min-w-0 flex-col">
          <EncabezadoMovil nombre={nombre} menu={menu} />
          <main id="contenido" tabIndex={-1} className="flex-1 focus:outline-none">
            {children}
          </main>
          <Pie
            nombre={nombre}
            direccion={config.direccion}
            comoLlegar={comoLlegar}
            redes={redes}
            menu={menu}
            sitio={nav}
            legal={nav.legal}
          />
        </div>
      </div>
      <BarraPestanas />
    </div>
  );
}
