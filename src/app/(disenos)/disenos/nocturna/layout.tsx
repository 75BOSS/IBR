import { Figtree, Playfair_Display, Poppins } from 'next/font/google';
import { datosMarco } from '@/disenos/datos';
import { BarraLlegar } from '@/disenos/nocturna/BarraLlegar';
import { Encabezado } from '@/disenos/nocturna/Encabezado';
import { Pie } from '@/disenos/nocturna/Pie';
import { RUTAS } from '@/disenos/nocturna/ui';
import '@/disenos/nocturna/tema.css';

// Propuesta C · Nocturna: titulares en Poppins gruesa (la letra del logo), la palabra destacada
// en Playfair Display itálica (como «familia.» de la imagen 7) y el texto en Figtree.
const titulo = Poppins({
  variable: '--font-nocturna-titulo',
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  display: 'swap',
});

const manuscrita = Playfair_Display({
  variable: '--font-nocturna-manuscrita',
  subsets: ['latin'],
  weight: ['500'],
  style: ['italic'],
  display: 'swap',
});

const texto = Figtree({
  variable: '--font-nocturna-texto',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  display: 'swap',
});

export default async function NocturnaLayout({ children }: { children: React.ReactNode }) {
  const { nombre, nav, redes, config, comoLlegar } = await datosMarco();
  // La página «Comunidad» de esta propuesta entra al grupo Conéctate del menú.
  const menu = nav.menu.map((grupo) =>
    grupo.title === 'Conéctate'
      ? {
          ...grupo,
          items: [
            {
              href: RUTAS.comunidad,
              label: 'Comunidad',
              description: 'Grupos en casa, familias y servir juntos',
            },
            ...grupo.items,
          ],
        }
      : grupo,
  );

  return (
    <div
      className={`diseno-nocturna ${titulo.variable} ${manuscrita.variable} ${texto.variable} flex min-h-dvh flex-col antialiased`}
    >
      <a
        href="#contenido"
        className="sr-only z-50 rounded-full bg-(--d-durazno) px-5 py-3 font-semibold text-ink focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Saltar al contenido
      </a>
      <Encabezado nombre={nombre} menu={menu} links={nav.links} />
      <main id="contenido" className="flex-1">
        {children}
      </main>
      <Pie
        nombre={nombre}
        vision={config.vision}
        menu={menu}
        legal={nav.legal}
        redes={redes}
        conBarra={comoLlegar !== null}
      />
      {comoLlegar && <BarraLlegar href={comoLlegar} />}
    </div>
  );
}
