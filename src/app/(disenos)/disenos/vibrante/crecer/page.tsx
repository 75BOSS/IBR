import type { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { BAUTISMO, CURSOS, RUTA_CRECER, SALVACION } from '@/disenos/contenido';
import { datosCrecer } from '@/disenos/datos';
import { BandaCierre } from '@/disenos/vibrante/BandaCierre';
import { botonClases } from '@/disenos/vibrante/boton';
import {
  Bautismo,
  Formacion,
  Salvacion,
  ServirAreas,
} from '@/disenos/vibrante/crecer/SeccionesCrecer';
import { FlechaEnlace } from '@/disenos/vibrante/FlechaEnlace';
import { FOTOS } from '@/disenos/vibrante/fotos';
import { PortadaPagina } from '@/disenos/vibrante/PortadaPagina';
import { CabeceraSeccion, Seccion } from '@/disenos/vibrante/Seccion';
import { destinoPaso } from '@/disenos/vibrante/secciones/destinoPaso';
import { Ruta } from '@/disenos/vibrante/secciones/Ruta';

export const revalidate = 300;

export const metadata: Metadata = { title: 'B · Vibrante · Crecer' };

/**
 * Crecer de la propuesta B · Vibrante (como Crecer de caminodevida): la ruta de cinco pasos,
 * salvación, bautismo, la Escuela de Discipulado y servir (áreas reales), con cierre hacia
 * Contacto.
 */
export default async function VibranteCrecer() {
  const { content, areas } = await datosCrecer();

  // En esta página, las anclas de la ruta son sus propias secciones.
  const pasos = RUTA_CRECER.map((p) => ({
    ...p,
    href: destinoPaso(p.href, { pagina: '', content }),
  }));

  return (
    <>
      <PortadaPagina
        id="crecer-titulo"
        etiqueta="Crecer"
        lineas={['Tu siguiente']}
        enfasis="paso."
        texto="Crecer en la fe es un camino que se recorre acompañado. Estos son los pasos que te proponemos en IBR."
        fotos={[FOTOS.adoracionJuntos, FOTOS.guitarra, FOTOS.gruposCasa]}
        acciones={
          <>
            <Link href="/contacto#mensaje" className={botonClases({ tamano: 'lg' })}>
              Quiero dar mi siguiente paso <Icon name="arrowRight" className="size-5" />
            </Link>
            <FlechaEnlace href="#ruta" className="px-1">
              Ver la ruta
            </FlechaEnlace>
          </>
        }
      />
      <Seccion tono="hundido" id="ruta" tituloId="ruta-titulo">
        <div className="grid gap-[clamp(2rem,5vw,3.5rem)]">
          <CabeceraSeccion
            etiqueta="La ruta"
            id="ruta-titulo"
            lineas={['Cinco pasos,', <em key="camino">un camino.</em>]}
            texto="No hay que hacerlo todo a la vez: empieza por donde estás hoy."
          />
          <Ruta pasos={pasos} />
        </div>
      </Seccion>
      <Salvacion salvacion={SALVACION} />
      <Bautismo bautismo={BAUTISMO} />
      <Formacion cursos={CURSOS} />
      <ServirAreas areas={areas} verServir={content.servir} />
      <BandaCierre
        id="crecer-cierre"
        fondo="rojo"
        linea="¿Listo para"
        destacada="crecer?"
        texto="Cuéntanos en qué paso estás y te acompañamos a dar el siguiente."
        accion={{ href: '/contacto#mensaje', texto: 'Quiero dar mi siguiente paso' }}
        foto={FOTOS.vidaAbrazo}
      />
    </>
  );
}
