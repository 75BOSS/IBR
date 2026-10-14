import { Figtree, Playfair_Display } from 'next/font/google';
import { Cursor } from '@/disenos/vibrante/animacion/Cursor';
import { BarraComoLlegar } from '@/disenos/vibrante/BarraComoLlegar';
import { Encabezado } from '@/disenos/vibrante/Encabezado';
import { menuVibrante } from '@/disenos/vibrante/menu';
import { Pie } from '@/disenos/vibrante/Pie';
import { datosPrimeraVisita } from '@/disenos/datos';
import { ministerioName } from '@/lib/ministerios';
import '@/disenos/vibrante/tema.css';

// Propuesta B · Vibrante: Figtree para todo (titulares en su peso 900, muy grueso y apretado
// como en la propuesta; texto en su peso normal) y la palabra destacada en itálica caligráfica
// (Playfair Display). Figtree es el mismo archivo variable que carga el layout raíz: el navegador
// lo descarga una sola vez.
const sans = Figtree({
  variable: '--font-vibrante-sans',
  subsets: ['latin'],
  display: 'swap',
});

const manuscrita = Playfair_Display({
  variable: '--font-vibrante-manuscrita',
  subsets: ['latin'],
  weight: '400',
  style: 'italic',
  display: 'swap',
});

export default async function VibranteLayout({ children }: { children: React.ReactNode }) {
  // El marco y los ministerios (Kids y Jóvenes del menú solo si existen): `datosPrimeraVisita`
  // es el cargador compartido que trae los dos sin consultas de más.
  const { config, content, nav, redes, nombre, comoLlegar, ministerios } =
    await datosPrimeraVisita();
  const menu = menuVibrante({
    content,
    ministerios: ministerios.map((m) => ({ slug: m.slug, nombre: ministerioName(m) })),
  });
  return (
    <div
      className={`diseno-vibrante ${sans.variable} ${manuscrita.variable} flex min-h-dvh flex-col`}
    >
      <a
        href="#contenido"
        className="sr-only z-50 rounded-[0.3rem] bg-ink px-4 py-2 font-semibold text-canvas focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Saltar al contenido
      </a>
      <Encabezado nombre={nombre} menu={menu} />
      <main id="contenido" tabIndex={-1} className="flex-1 focus:outline-none">
        {children}
      </main>
      <Pie
        nombre={nombre}
        nombreCorto={config.nombre_corto ?? 'IBR'}
        vision={config.vision}
        direccion={config.direccion}
        email={config.email}
        comoLlegar={comoLlegar}
        redes={redes}
        menu={menu}
        legal={nav.legal}
      />
      {comoLlegar && <BarraComoLlegar href={comoLlegar} />}
      <Cursor />
    </div>
  );
}
