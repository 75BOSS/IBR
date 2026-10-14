import type { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { ADN, RUTA_CRECER, TESTIMONIOS } from '@/disenos/contenido';
import { datosPortada } from '@/disenos/datos';
import { Marquesina } from '@/disenos/vibrante/animacion/Marquesina';
import { botonClases } from '@/disenos/vibrante/boton';
import { FlechaEnlace } from '@/disenos/vibrante/FlechaEnlace';
import { horarioPrincipal } from '@/disenos/vibrante/horarios';
import { FranjaVisita } from '@/disenos/vibrante/inicio/FranjaVisita';
import { LugarParaTi } from '@/disenos/vibrante/inicio/LugarParaTi';
import { PersonasJuntas } from '@/disenos/vibrante/inicio/PersonasJuntas';
import { Portada } from '@/disenos/vibrante/inicio/Portada';
import { ProximosEventos } from '@/disenos/vibrante/inicio/ProximosEventos';
import type { Destacado } from '@/disenos/vibrante/inicio/TarjetaDestacada';
import { RUTAS } from '@/disenos/vibrante/menu';
import { CabeceraSeccion, Seccion } from '@/disenos/vibrante/Seccion';
import { destinoPaso } from '@/disenos/vibrante/secciones/destinoPaso';
import { Ruta } from '@/disenos/vibrante/secciones/Ruta';
import { Testimonios } from '@/disenos/vibrante/secciones/Testimonios';
import { ValoresAdn } from '@/disenos/vibrante/secciones/ValoresAdn';
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

  // La ruta resumida lleva a las secciones de Crecer (y a Grupos o Servir si tienen contenido).
  const pasos = RUTA_CRECER.map((p) => ({
    ...p,
    href: destinoPaso(p.href, { pagina: RUTAS.crecer, content }),
  }));

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
      <Marquesina
        tono="rojo"
        etiqueta="Somos familia en Riobamba"
        palabras={['Somos familia', 'Riobamba', 'La Biblia al centro', 'Nadie camina solo']}
      />
      <LugarParaTi ministerios={ministerios} />

      <Seccion tono="negro" tituloId="ruta-titulo">
        <div className="grid gap-[clamp(2rem,5vw,3.5rem)]">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <CabeceraSeccion
              oscuro
              etiqueta="Crecer"
              id="ruta-titulo"
              lineas={['Tu siguiente', <em key="paso">paso.</em>]}
              texto="Cinco pasos sencillos para conocer a Jesús, crecer en comunidad y usar tus dones."
              className="max-w-[40rem] min-w-[min(100%,18rem)] flex-1"
            />
            <Link href={RUTAS.crecer} className={botonClases({ tamano: 'lg' })}>
              Ver la ruta completa <Icon name="arrowRight" className="size-5" />
            </Link>
          </div>
          <Ruta pasos={pasos} oscuro />
        </div>
      </Seccion>

      <Seccion tituloId="adn-titulo">
        <ValoresAdn
          valores={ADN.slice(0, 3)}
          cabecera={
            <CabeceraSeccion
              etiqueta="Nuestro ADN"
              id="adn-titulo"
              tamano="columna"
              lineas={['Lo que nos', <em key="define">define.</em>]}
              texto="La Palabra, la familia y la gracia: así vivimos la fe en Riobamba."
            >
              <FlechaEnlace href={`${RUTAS.conocenos}#adn`}>Conoce nuestro ADN</FlechaEnlace>
            </CabeceraSeccion>
          }
          cierre={
            <Link
              href={RUTAS.conocenos}
              className="group flex flex-col justify-between gap-6 rounded-[0.5rem] bg-(--d-negro) p-[clamp(1.25rem,3vw,2rem)] text-canvas on-dark"
            >
              <span className="eyebrow">Conócenos</span>
              <span className="font-display text-[clamp(1.75rem,1.4rem+1.4vw,2.5rem)] leading-[1] font-black tracking-[-0.04em] text-balance">
                Nuestra historia, visión y quiénes nos guían.
              </span>
              <span className="inline-flex items-center gap-2 font-bold text-(--d-rojo-vivo)">
                Conócenos
                <Icon
                  name="arrowRight"
                  className="size-5 transition-transform motion-safe:group-hover:translate-x-1"
                />
              </span>
            </Link>
          }
        />
      </Seccion>

      {/* Si el próximo evento ya va en la tarjeta negra, la agenda empieza en el siguiente. */}
      <ProximosEventos
        eventos={!ultimaPredica && !content.predicas ? eventos.slice(1) : eventos}
        verTodos={content.eventos}
      />

      <Seccion tituloId="testimonios-titulo">
        <Testimonios
          testimonios={TESTIMONIOS}
          cabecera={
            <div className="flex flex-wrap items-end justify-between gap-4">
              <CabeceraSeccion
                etiqueta="Testimonios"
                id="testimonios-titulo"
                lineas={['Historias', <em key="reales">reales.</em>]}
                className="min-w-[min(100%,18rem)] flex-1"
              />
              <FlechaEnlace href="/contacto#mensaje">Cuéntanos tu historia</FlechaEnlace>
            </div>
          }
        />
      </Seccion>
    </>
  );
}
