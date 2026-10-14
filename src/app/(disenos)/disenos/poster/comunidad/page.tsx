import type { Metadata } from 'next';
import { datosComunidad } from '@/disenos/datos';
import { BandaCierre } from '@/disenos/poster/BandaCierre';
import { RUTA_MINISTERIOS } from '@/disenos/poster/enlaces';
import { Etiquetas } from '@/disenos/poster/comunidad/Etiquetas';
import { GruposBarrio } from '@/disenos/poster/comunidad/GruposBarrio';
import { FilaFoto } from '@/disenos/poster/FilaFoto';
import { type Pestana, Pestanas } from '@/disenos/poster/movimiento/Pestanas';
import { A_LOS_BORDES, PaginaPoster, PortadaPagina } from '@/disenos/poster/PortadaPagina';
import { SiguientePaso } from '@/disenos/poster/SiguientePaso';
import { DAY_NAMES, formatTime } from '@/lib/dates';
import { edadText, ministerioName } from '@/lib/ministerios';

export const revalidate = 300;

export const metadata: Metadata = { title: 'E · Póster · Comunidad' };

/**
 * Comunidad de la propuesta Póster (imagen 14): «ENCUENTRA TU LUGAR», pestañas que filtran (con
 * el bloque rojo que se desliza) y una fila por cada forma de conectarse (grupos en casa,
 * ministerios por edad, servir), cada una con sus grupos, ministerios o áreas reales. Debajo,
 * todos los grupos por barrio, «Tu siguiente paso» y la banda para pedir orientación (siempre).
 * Solo aparecen las filas y secciones que tienen contenido.
 */
export default async function ComunidadPoster() {
  const { grupos, ministerios, areas, content } = await datosComunidad();

  const categorias: Pestana[] = [
    ...(grupos.length > 0
      ? [
          {
            clave: 'grupos',
            etiqueta: 'Grupos',
            contenido: (
              <FilaFoto
                nivel="h2"
                foto="/disenos/poster/grupos.webp"
                alt="Un grupo en casa conversa con la Biblia abierta"
                titulo="Grupos en casa"
                texto="Comparte la vida durante la semana."
                href="#barrios"
                accion="Explorar"
                detalle={
                  <Etiquetas
                    items={grupos.map((g) => ({
                      href: `/grupos/${g.id}`,
                      nombre: g.nombre,
                      nota:
                        g.dia_semana !== null
                          ? `${DAY_NAMES[g.dia_semana]} ${formatTime(g.hora)}`.trim()
                          : g.zona,
                    }))}
                    verTodos={{ href: '/grupos', texto: 'grupos más' }}
                    maximo={4}
                  />
                }
              />
            ),
          },
        ]
      : []),
    ...(ministerios.length > 0
      ? [
          {
            clave: 'familias',
            etiqueta: 'Familias',
            contenido: (
              <FilaFoto
                nivel="h2"
                foto="/disenos/poster/ninos.webp"
                alt="Niños y una maestra ríen mientras hacen una manualidad"
                titulo="Niños y familias"
                texto="Un espacio para crecer juntos."
                href={RUTA_MINISTERIOS}
                accion="Conocer"
                detalle={
                  <Etiquetas
                    items={ministerios.map((m) => ({
                      href: `${RUTA_MINISTERIOS}#${m.slug}`,
                      nombre: ministerioName(m),
                      nota: edadText(m),
                    }))}
                    verTodos={{ href: RUTA_MINISTERIOS, texto: 'ministerios más' }}
                  />
                }
              />
            ),
          },
        ]
      : []),
    ...(areas.length > 0
      ? [
          {
            clave: 'servicio',
            etiqueta: 'Servicio',
            contenido: (
              <FilaFoto
                nivel="h2"
                foto="/disenos/poster/servir.webp"
                alt="Voluntarios de la iglesia entregan cajas con víveres a una vecina"
                titulo="Servir juntos"
                texto="Pon tus dones al servicio de otros."
                href="/servir"
                accion="Participar"
                detalle={
                  <Etiquetas
                    items={areas.map((a) => ({
                      href: `/servir?area=${a.slug}#quiero-servir`,
                      nombre: a.nombre,
                    }))}
                    verTodos={{ href: '/servir', texto: 'áreas más' }}
                    maximo={6}
                  />
                }
              />
            ),
          },
        ]
      : []),
  ];

  return (
    <PaginaPoster>
      <div className="flex flex-col gap-[clamp(1rem,3vw,1.5rem)]">
        <PortadaPagina
          lema="Comunidad · Riobamba"
          titulo={
            <>
              <span className="block">Encuentra</span>
              <span className="block">
                <em>Tu</em> lugar
              </span>
            </>
          }
          frase="Personas de todas las edades, una misma familia."
          entrada="Grupos, familias y oportunidades para servir. Hay un lugar para ti en esta casa."
        />
        {categorias.length > 0 && <Pestanas opciones={categorias} etiqueta="Ver por tipo" />}
      </div>
      <GruposBarrio grupos={grupos} />
      <SiguientePaso content={content} />
      <div className={A_LOS_BORDES}>
        <BandaCierre />
      </div>
    </PaginaPoster>
  );
}
