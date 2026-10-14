import type { Metadata } from 'next';
import { MINISTERIOS_EXTRA } from '@/disenos/contenido';
import { datosMinisterios } from '@/disenos/datos';
import { BandaCierre } from '@/disenos/poster/BandaCierre';
import { agruparHorarios } from '@/disenos/poster/horarios';
import { BloqueMinisterio } from '@/disenos/poster/ministerios/BloqueMinisterio';
import { IndiceAnclas } from '@/disenos/poster/ministerios/IndiceAnclas';
import { MasEspacios } from '@/disenos/poster/ministerios/MasEspacios';
import { A_LOS_BORDES, PaginaPoster, PortadaPagina } from '@/disenos/poster/PortadaPagina';
import { DAY_NAMES, formatTime } from '@/lib/dates';
import { edadText, ministerioName } from '@/lib/ministerios';

export const revalidate = 300;

export const metadata: Metadata = { title: 'E · Póster · Ministerios' };

/**
 * Ministerios de la propuesta Póster (como «Iglesia» de masvida.org y Kids de supresencia.com):
 * un índice de anclas y cada ministerio real (BD) como una página de periódico con su foto,
 * edades, color, cuándo se reúne y sus grupos; luego Mujeres, Matrimonios y Hombres (ejemplo).
 */
export default async function MinisteriosPoster() {
  const { ministerios, reuniones, grupos } = await datosMinisterios();
  const bloques = ministerios.map((m) => ({
    slug: m.slug,
    nombre: ministerioName(m),
    edad: edadText(m),
    descripcion: m.descripcion,
    imagen: m.imagen_url,
    color: m.color,
    horarios: agruparHorarios(reuniones.filter((r) => r.rango_edad_id === m.id)),
    grupos: grupos
      .filter((g) => g.rango_edad_id === m.id)
      .map((g) => ({
        id: g.id,
        nombre: g.nombre,
        cuando:
          [
            g.zona,
            g.dia_semana !== null ? `${DAY_NAMES[g.dia_semana]} ${formatTime(g.hora)}` : null,
          ]
            .filter(Boolean)
            .join(' · ') || null,
      })),
  }));

  return (
    <PaginaPoster>
      <div className="flex flex-col gap-[clamp(1.25rem,4vw,2rem)]">
        <PortadaPagina
          lema="Ministerios · Toda la familia"
          titulo={
            <>
              <span className="block">Para cada</span>
              <span className="block">
                <em>edad</em>
              </span>
            </>
          }
          frase="De los más pequeños a los abuelos, todos tienen un lugar."
          entrada="Clases, reuniones y grupos pensados para cada etapa de la vida, y espacios para mujeres, matrimonios y hombres."
        />
        <IndiceAnclas
          anclas={[
            ...bloques.map((b) => ({ href: `#${b.slug}`, nombre: b.nombre, nota: b.edad })),
            ...MINISTERIOS_EXTRA.map((m) => ({ href: `#${m.slug}`, nombre: m.nombre, nota: null })),
          ]}
        />
      </div>
      {bloques.map((b, n) => (
        <BloqueMinisterio key={b.slug} m={b} indice={n} />
      ))}
      <MasEspacios />
      <div className={A_LOS_BORDES}>
        <BandaCierre titulo="¿No sabes cuál es para ti?" />
      </div>
    </PaginaPoster>
  );
}
