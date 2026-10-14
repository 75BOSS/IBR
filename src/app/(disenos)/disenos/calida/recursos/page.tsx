import type { Metadata } from 'next';
import { datosRecursos } from '@/disenos/datos';
import { DEVOCIONALES, SERIES, TESTIMONIOS } from '@/disenos/contenido';
import { CabeceraPagina } from '@/disenos/calida/CabeceraPagina';
import { Contenedor } from '@/disenos/calida/Contenedor';
import { EncabezadoSeccion } from '@/disenos/calida/EncabezadoSeccion';
import { EnlaceFlecha } from '@/disenos/calida/EnlaceFlecha';
import {
  Canales,
  PlanDevocional,
  PredicasRecientes,
  SeriesPortadas,
  type VideoCalida,
} from '@/disenos/calida/Recursos';
import { RitmoPagina } from '@/disenos/calida/RitmoPagina';
import { SiguientePaso } from '@/disenos/calida/SiguientePaso';
import { TestimoniosEditorial } from '@/disenos/calida/Testimonios';
import { formatDateOnly, formatDateTime } from '@/lib/dates';

export const revalidate = 300;

export const metadata: Metadata = { title: 'A · Cálida · Recursos' };

/**
 * Recursos de la propuesta A · Cálida: prédicas reales (las del panel o los últimos cultos del
 * canal de YouTube), series, el devocional de la semana, testimonios (contenido de ejemplo) y
 * los canales reales de la iglesia.
 */
export default async function CalidaRecursos() {
  const { content, predicas, videos, redes } = await datosRecursos();
  const lista: VideoCalida[] =
    predicas.length > 0
      ? predicas.map((p) => ({
          videoId: p.youtube_id,
          titulo: p.titulo,
          serie: p.serie,
          meta: [p.predicador, p.pasaje, formatDateOnly(p.fecha)].filter(Boolean).join(' · '),
        }))
      : videos.map((v) => ({
          videoId: v.videoId,
          titulo: v.titulo,
          serie: null,
          meta: `Publicado el ${formatDateTime(new Date(v.publicado), { dateStyle: 'long' })}`,
        }));
  const canal = redes.find((r) => r.icon === 'youtube')?.href ?? null;

  const indice = [
    { href: '#predicas', label: 'Prédicas' },
    { href: '#series', label: 'Series' },
    { href: '#devocionales', label: 'Devocionales' },
    { href: '#testimonios', label: 'Testimonios' },
    ...(redes.length > 0 ? [{ href: '#canales', label: 'Síguenos' }] : []),
  ];

  return (
    <RitmoPagina>
      <CabeceraPagina
        id="calida-recursos"
        etiqueta="Recursos"
        titulo={
          <>
            Para tu <em className="-mt-[0.08em] block">semana.</em>
          </>
        }
        texto="Prédicas, devocionales y historias de nuestra familia para seguir creciendo de lunes a sábado, estés donde estés."
        foto={{
          src: '/disenos/calida/adoracion.webp',
          alt: 'Jóvenes adoran con los ojos cerrados y las manos abiertas durante el culto',
          encuadre: 'object-[40%_center]',
        }}
        indice={indice}
      />

      <section id="predicas" aria-labelledby="calida-predicas">
        <Contenedor className="flex flex-col gap-[clamp(1.5rem,3vw,2.5rem)]">
          <EncabezadoSeccion
            id="calida-predicas"
            etiqueta="Cada domingo"
            titulo={
              <>
                Prédicas <em>recientes</em>
              </>
            }
            texto="Un mensaje de la Biblia, claro y práctico. Si te perdiste el domingo, aquí lo encuentras."
            accion={
              content.predicas && (
                <EnlaceFlecha href="/predicas">Ver todas las prédicas</EnlaceFlecha>
              )
            }
          />
          <PredicasRecientes videos={lista} verPredicas={content.predicas} canal={canal} />
        </Contenedor>
      </section>

      <section id="series" aria-labelledby="calida-series">
        <Contenedor className="flex flex-col gap-[clamp(1.5rem,3vw,2.5rem)]">
          <EncabezadoSeccion
            id="calida-series"
            etiqueta="Series"
            titulo={
              <>
                Un tema, varios <em>domingos</em>
              </>
            }
            texto="Recorremos la Biblia por series para entender un tema a fondo, paso a paso."
          />
          <SeriesPortadas series={SERIES} />
        </Contenedor>
      </section>

      <section id="devocionales" aria-labelledby="calida-devocionales">
        <Contenedor className="flex flex-col gap-[clamp(1.5rem,3vw,2.5rem)]">
          <EncabezadoSeccion
            id="calida-devocionales"
            etiqueta="Devocionales"
            titulo={
              <>
                Plan de la <em>semana</em>
              </>
            }
          />
          <PlanDevocional dias={DEVOCIONALES} />
        </Contenedor>
      </section>

      <section id="testimonios" aria-labelledby="calida-testimonios">
        <Contenedor className="flex flex-col gap-[clamp(1.5rem,3vw,2.5rem)]">
          <EncabezadoSeccion
            id="calida-testimonios"
            etiqueta="Testimonios"
            titulo={
              <>
                Vidas que <em>cambian</em>
              </>
            }
            texto="Historias de hermanos de distintos barrios de Riobamba que encontraron una familia."
          />
          <TestimoniosEditorial testimonios={TESTIMONIOS} />
        </Contenedor>
      </section>

      {redes.length > 0 && (
        <section id="canales" aria-labelledby="calida-canales">
          <Contenedor className="flex flex-col gap-[clamp(1.5rem,3vw,2.5rem)]">
            <EncabezadoSeccion
              id="calida-canales"
              etiqueta="Síguenos"
              titulo={
                <>
                  También en tus <em>redes</em>
                </>
              }
              texto="Cultos en vivo, avisos de la semana y momentos de nuestra familia."
            />
            <Canales redes={redes} />
          </Contenedor>
        </section>
      )}

      <SiguientePaso
        id="calida-recursos-oracion"
        etiqueta="Oración"
        titulo={
          <>
            ¿Podemos orar <em>por ti?</em>
          </>
        }
        texto="Cuéntanos por qué quieres que oremos. Los pastores oran por cada petición que llega."
        boton={{ href: '/oracion', label: 'Pedir oración' }}
        foto={{
          src: '/disenos/calida/lugar.webp',
          alt: 'Dos amigas se abrazan al encontrarse en la iglesia',
          encuadre: 'object-[60%_center]',
        }}
      />
    </RitmoPagina>
  );
}
