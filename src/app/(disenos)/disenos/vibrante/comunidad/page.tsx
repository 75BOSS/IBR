import type { Metadata } from 'next';
import { datosComunidad } from '@/disenos/datos';
import { Marquesina } from '@/disenos/vibrante/animacion/Marquesina';
import { BandaCierre } from '@/disenos/vibrante/BandaCierre';
import { GruposSemana } from '@/disenos/vibrante/comunidad/GruposSemana';
import {
  type TarjetaComunidad,
  TarjetasComunidad,
} from '@/disenos/vibrante/comunidad/TarjetasComunidad';
import { FOTOS } from '@/disenos/vibrante/fotos';
import { RUTAS } from '@/disenos/vibrante/menu';
import { PortadaPagina } from '@/disenos/vibrante/PortadaPagina';
import { edadText, ministerioName } from '@/lib/ministerios';

export const revalidate = 300;

export const metadata: Metadata = { title: 'B · Vibrante · Comunidad' };

/** «Bellavista, Centro, La Politécnica y 2 más». */
function resumen(nombres: string[], maximo: number): string[] {
  if (nombres.length <= maximo) return nombres;
  return [...nombres.slice(0, maximo), `y ${nombres.length - maximo} más`];
}

/** Comunidad de la propuesta B · Vibrante (imagen 5): grupos, ministerios y servir, de la BD. */
export default async function VibranteComunidad() {
  const { content, grupos, ministerios, areas } = await datosComunidad();

  const zonas = [...new Set(grupos.map((g) => g.zona).filter((z): z is string => Boolean(z)))];
  // Cada tarjeta solo aparece si su página tiene contenido (los mismos `content` que el menú).
  const tarjetas: TarjetaComunidad[] = [
    ...(content.grupos
      ? [
          {
            clave: 'grupos',
            foto: FOTOS.gruposCasa,
            titulo: 'Grupos en casa',
            texto:
              'Conversaciones reales, amistad genuina y un espacio para crecer juntos en la Palabra.',
            datos: [
              grupos.length === 1 ? '1 grupo' : `${grupos.length} grupos`,
              ...resumen(zonas, 3),
            ],
            href: '/grupos',
          },
        ]
      : []),
    ...(content.ministerios && ministerios.length > 0
      ? [
          {
            clave: 'ministerios',
            foto: FOTOS.ninos,
            titulo: 'Niños y familias',
            texto:
              'Un lugar seguro y divertido donde las nuevas generaciones conocen y aman a Jesús.',
            datos: resumen(
              ministerios.map((m) => {
                const edad = edadText(m);
                return edad ? `${ministerioName(m)} · ${edad}` : ministerioName(m);
              }),
              3,
            ),
            href: RUTAS.ministerios,
          },
        ]
      : []),
    ...(content.servir
      ? [
          {
            clave: 'servir',
            foto: FOTOS.servir,
            titulo: 'Servir juntos',
            texto:
              'Usa tus talentos para bendecir a otros y ser parte de lo que Dios está haciendo.',
            datos: resumen(
              areas.map((a) => a.nombre),
              4,
            ),
            href: '/servir',
          },
        ]
      : []),
  ];

  return (
    <>
      <PortadaPagina
        id="comunidad-titulo"
        lineas={['La vida se']}
        enfasis="comparte."
        texto="En IBR creemos que la fe se vive mejor en comunidad. Aquí encuentras personas reales, para caminar juntos, crecer y hacer la diferencia."
        fotos={[FOTOS.vidaAbrazo, FOTOS.vidaAlabanza, FOTOS.vidaAmigas]}
      />
      <TarjetasComunidad tarjetas={tarjetas} />
      <GruposSemana grupos={grupos} />
      <Marquesina
        tono="rojo"
        etiqueta="Nadie camina solo"
        palabras={['Nadie camina solo', 'Grupos en casa', 'Riobamba', 'Servir juntos']}
      />
      <BandaCierre
        id="siguiente-titulo"
        linea="Siempre hay un"
        destacada="lugar para ti."
        texto="Conoce más sobre nuestra iglesia, resuelve tus dudas y da tu primer paso. Queremos conocerte."
        accion={{ href: RUTAS.primeraVisita, texto: 'Planifica tu visita' }}
        foto={FOTOS.siguientePaso}
      />
    </>
  );
}
