import { DM_Serif_Display, Playfair_Display } from 'next/font/google';
import { datosPrimeraVisita } from '@/disenos/datos';
import { BarraComoLlegar } from '@/disenos/calida/BarraComoLlegar';
import { EfectosCursor } from '@/disenos/calida/EfectosCursor';
import { Encabezado } from '@/disenos/calida/Encabezado';
import { Pie } from '@/disenos/calida/Pie';
import { menuCalida } from '@/disenos/calida/textos';
import '@/disenos/calida/tema.css';

// Propuesta A · Cálida: titulares en DM Serif Display (serifa de alto contraste, un solo peso) y
// la palabra destacada en la itálica de Playfair Display. El texto sigue en Figtree (layout raíz).
const titulo = DM_Serif_Display({
  variable: '--font-calida-titulo',
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
});

const enfasis = Playfair_Display({
  variable: '--font-calida-enfasis',
  subsets: ['latin'],
  style: 'italic',
  display: 'swap',
});

/**
 * Marco de la propuesta A · Cálida (imágenes 1 · 2 · 3): encabezado claro con el menú
 * desplegable, pie azul noche con los horarios y, en el celular, la barra fija «Cómo llegar».
 * Lee los ministerios para saber si Kids y Jóvenes existen (anclas del menú). `EfectosCursor`
 * pone en marcha los efectos que siguen al mouse. El selector de diseños y el 404 en producción
 * los pone el layout padre (`disenos/layout.tsx`).
 */
export default async function CalidaLayout({ children }: { children: React.ReactNode }) {
  const { config, content, nav, redes, nombre, comoLlegar, horarios, ministerios } =
    await datosPrimeraVisita();
  const menu = menuCalida({ content, ministerios });
  return (
    <div className={`diseno-calida ${titulo.variable} ${enfasis.variable} flex min-h-dvh flex-col`}>
      <a
        href="#contenido"
        className="sr-only z-50 rounded-full bg-ink px-5 py-3 font-semibold text-cream focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Saltar al contenido
      </a>
      <EfectosCursor />
      <Encabezado nombre={nombre} menu={menu} />
      <main id="contenido" tabIndex={-1} className="flex-1 focus:outline-none">
        {children}
      </main>
      <Pie
        nombre={nombre}
        vision={config.vision}
        direccion={config.direccion}
        email={config.email}
        comoLlegar={comoLlegar}
        horarios={horarios}
        menu={menu}
        legal={nav.legal}
        redes={redes}
      />
      {comoLlegar && <BarraComoLlegar href={comoLlegar} />}
    </div>
  );
}
