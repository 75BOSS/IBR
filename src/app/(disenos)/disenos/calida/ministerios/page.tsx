import type { Metadata } from 'next';
import { datosMinisterios } from '@/disenos/datos';
import { MINISTERIOS_EXTRA } from '@/disenos/contenido';
import { CabeceraPagina } from '@/disenos/calida/CabeceraPagina';
import { Contenedor } from '@/disenos/calida/Contenedor';
import { EncabezadoSeccion } from '@/disenos/calida/EncabezadoSeccion';
import { MinisterioFila, MinisteriosExtra } from '@/disenos/calida/Ministerios';
import { RitmoPagina } from '@/disenos/calida/RitmoPagina';
import { SiguientePaso } from '@/disenos/calida/SiguientePaso';
import { rutaCalida } from '@/disenos/calida/textos';
import { ministerioName } from '@/lib/ministerios';

export const revalidate = 300;

export const metadata: Metadata = { title: 'A · Cálida · Ministerios' };

/**
 * Ministerios de la propuesta A · Cálida (como «Iglesia» de masvida: niños, jóvenes, mujeres):
 * los ministerios reales de la BD, cada uno con su ancla (#kids, #jovenes…), sus reuniones y
 * grupos y el enlace a su página; después los de ejemplo (Mujeres, Matrimonios, Hombres).
 */
export default async function CalidaMinisterios() {
  const { ministerios, reuniones, grupos } = await datosMinisterios();
  // Si la iglesia ya cargó uno de los de ejemplo como ministerio real, se muestra solo el real.
  const extras = MINISTERIOS_EXTRA.filter((x) => !ministerios.some((m) => m.slug === x.slug));

  const indice = [
    ...ministerios.map((m) => ({ href: `#${m.slug}`, label: ministerioName(m) })),
    ...extras.map((x) => ({ href: `#${x.slug}`, label: x.nombre })),
  ];

  return (
    <RitmoPagina>
      <CabeceraPagina
        id="calida-ministerios"
        etiqueta="Ministerios"
        titulo={
          <>
            Para cada <em className="-mt-[0.08em] block">edad.</em>
          </>
        }
        texto="Desde los más pequeños hasta los abuelos: en IBR cada generación tiene un espacio para conocer a Dios, hacer amigos y crecer."
        foto={{
          src: '/disenos/calida/mesa.webp',
          alt: 'Abuelos, padres y niños comparten la mesa y ríen en la iglesia',
          encuadre: 'object-[55%_center]',
        }}
        indice={indice}
      />

      {ministerios.length > 0 && (
        <section aria-labelledby="calida-por-edades">
          <Contenedor className="flex flex-col gap-[clamp(3rem,7vw,6rem)]">
            <EncabezadoSeccion
              id="calida-por-edades"
              etiqueta="Por edades"
              titulo={
                <>
                  Crecemos <em>juntos</em>
                </>
              }
              texto="Cada ministerio tiene su reunión, sus grupos en casa y un equipo que lo acompaña."
            />
            {ministerios.map((m, i) => (
              <MinisterioFila
                key={m.id}
                m={m}
                i={i}
                reuniones={reuniones.filter((r) => r.rango_edad_id === m.id)}
                grupos={grupos.filter((g) => g.rango_edad_id === m.id)}
              />
            ))}
          </Contenedor>
        </section>
      )}

      {extras.length > 0 && (
        <section aria-labelledby="calida-conectar">
          <Contenedor className="flex flex-col gap-[clamp(1.5rem,3vw,2.5rem)]">
            <EncabezadoSeccion
              id="calida-conectar"
              etiqueta="Más formas de conectar"
              titulo={
                <>
                  Para cada etapa de la <em>vida</em>
                </>
              }
              texto="Encuentros para mujeres, matrimonios y hombres, con amistad y la Biblia abierta."
            />
            <MinisteriosExtra extras={extras} />
          </Contenedor>
        </section>
      )}

      <SiguientePaso
        id="calida-ministerios-visita"
        etiqueta="Ven en familia"
        titulo={
          <>
            Trae a toda tu <em>familia</em>
          </>
        }
        texto="Mientras tú estás en el culto, tus hijos aprenden de Jesús en su propia clase. Hay un lugar para cada uno."
        boton={{ href: rutaCalida('/primera-visita'), label: 'Planifica tu visita' }}
        foto={{
          src: '/disenos/calida/ninos.webp',
          alt: 'Niños sonríen durante una actividad de la iglesia',
          encuadre: 'object-[40%_center]',
        }}
      />
    </RitmoPagina>
  );
}
