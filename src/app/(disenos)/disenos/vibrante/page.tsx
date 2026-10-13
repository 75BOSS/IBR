import type { Metadata } from 'next';
import { datosPortada } from '@/disenos/datos';
import { horarioPrincipal } from '@/disenos/vibrante/horarios';
import { FranjaVisita } from '@/disenos/vibrante/inicio/FranjaVisita';
import { LugarParaTi } from '@/disenos/vibrante/inicio/LugarParaTi';
import { PersonasJuntas } from '@/disenos/vibrante/inicio/PersonasJuntas';
import { Portada } from '@/disenos/vibrante/inicio/Portada';
import { ProximosEventos } from '@/disenos/vibrante/inicio/ProximosEventos';
import type { Destacado } from '@/disenos/vibrante/inicio/TarjetaDestacada';
import { formatDateTime } from '@/lib/dates';

export const revalidate = 300;

export const metadata: Metadata = { title: 'B · Vibrante · Inicio' };

/** Inicio de la propuesta B · Vibrante (imágenes 4 y 6), con los datos reales del sitio. */
export default async function VibranteInicio() {
  const { config, content, comoLlegar, reuniones, eventos, ultimaPredica, ministerios, nombre } =
    await datosPortada();

  // Tarjeta negra: la última prédica; si aún no hay, Prédicas (videos del canal) o el próximo
  // evento. Nada inventado: sin ninguno de los tres, la fila se queda con texto y collage.
  const [proximo] = eventos;
  const destacado: Destacado | null = ultimaPredica
    ? {
        etiqueta: 'Última predicación',
        titulo: ultimaPredica.titulo,
        enfasis: ultimaPredica.serie,
        meta: ultimaPredica.meta || null,
        accion: content.predicas ? { href: '/predicas', texto: 'Ver mensaje' } : null,
      }
    : content.predicas
      ? {
          etiqueta: 'Escucha la Palabra',
          titulo: 'Prédicas',
          enfasis: 'de cada domingo',
          meta: null,
          accion: { href: '/predicas', texto: 'Ver prédicas' },
        }
      : proximo
        ? {
            etiqueta: 'Próximo evento',
            titulo: proximo.titulo,
            enfasis: formatDateTime(proximo.fecha_inicio, { day: 'numeric', month: 'long' }),
            meta: proximo.ubicacion,
            accion: { href: `/eventos/${proximo.slug}`, texto: 'Ver evento' },
          }
        : null;

  return (
    <>
      <Portada
        etiqueta={config.anio_fundacion ? `${nombre} · desde ${config.anio_fundacion}` : nombre}
        subtitulo={config.home_hero_sub ?? 'Conocemos a Dios y compartimos la vida.'}
        verPredicas={content.predicas}
      />
      <FranjaVisita
        principal={horarioPrincipal(reuniones)}
        verHorarios={content.horarios}
        direccion={config.direccion}
        comoLlegar={comoLlegar}
      />
      <PersonasJuntas destacado={destacado} />
      <LugarParaTi ministerios={ministerios} />
      {/* Si el próximo evento ya va en la tarjeta negra, la agenda empieza en el siguiente. */}
      <ProximosEventos
        eventos={!ultimaPredica && !content.predicas ? eventos.slice(1) : eventos}
        verTodos={content.eventos}
      />
    </>
  );
}
