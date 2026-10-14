import type { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { datosComunidad } from '@/disenos/datos';
import { CabeceraPagina } from '@/disenos/calida/CabeceraPagina';
import { Contenedor } from '@/disenos/calida/Contenedor';
import { EncabezadoSeccion } from '@/disenos/calida/EncabezadoSeccion';
import { EnlaceFlecha } from '@/disenos/calida/EnlaceFlecha';
import { Ficha } from '@/disenos/calida/Ficha';
import { GruposCasa } from '@/disenos/calida/GruposCasa';
import { SiguientePaso } from '@/disenos/calida/SiguientePaso';
import {
  DatoConIcono,
  type TarjetaComunidad,
  TarjetasComunidad,
} from '@/disenos/calida/TarjetasComunidad';
import { botonCalida } from '@/disenos/calida/botones';
import { listaNatural, rutaCalida } from '@/disenos/calida/textos';
import { ministerioName } from '@/lib/ministerios';

export const revalidate = 300;

export const metadata: Metadata = { title: 'A · Cálida · Comunidad' };

/** Fichas de un dato real (máximo 5 para no llenar la tarjeta). */
function Fichas({ items }: { items: { clave: number; nombre: string; tono?: string | null }[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {items.slice(0, 5).map((it) => (
        <li key={it.clave}>
          <Ficha tono={it.tono}>{it.nombre}</Ficha>
        </li>
      ))}
    </ul>
  );
}

/**
 * Comunidad de la propuesta A · Cálida (imagen 2): «La vida se comparte.», las tres puertas
 * (grupos, niños y familias, servir) con sus datos reales, los grupos en casa de esta semana
 * (#grupos, como «Grupos de conexión» de supresencia) y la banda «Tu siguiente paso». Cada
 * puerta aparece solo si su página tiene contenido.
 */
export default async function CalidaComunidad() {
  const { content, grupos, ministerios, areas } = await datosComunidad();
  const zonas = [...new Set(grupos.map((g) => g.zona).filter((z): z is string => Boolean(z)))];

  const tarjetas: TarjetaComunidad[] = [
    ...(content.grupos
      ? [
          {
            href: '/grupos',
            titulo: 'Grupos en casa',
            texto:
              'Espacios más pequeños para crecer en la Palabra, orar y construir amistades reales.',
            enlace: 'Encuentra un grupo',
            foto: '/disenos/calida/grupos.webp',
            alt: 'Un grupo conversa en una casa con la Biblia abierta',
            dato: grupos.length > 0 && (
              <DatoConIcono>
                {grupos.length} {grupos.length === 1 ? 'grupo' : 'grupos'}
                {zonas.length > 0 ? ` en ${listaNatural(zonas.slice(0, 3))}` : ''}
              </DatoConIcono>
            ),
          },
        ]
      : []),
    ...(content.ministerios
      ? [
          {
            href: rutaCalida('/ministerios'),
            titulo: 'Niños y familias',
            texto:
              'Acompañamos a cada generación con enseñanza bíblica y un ambiente seguro y alegre.',
            enlace: 'Conoce nuestros ministerios',
            foto: '/disenos/calida/ninos.webp',
            alt: 'Niños sonríen durante una actividad de la iglesia',
            dato: ministerios.length > 0 && (
              <Fichas
                items={ministerios.map((m) => ({
                  clave: m.id,
                  nombre: ministerioName(m),
                  tono: m.color,
                }))}
              />
            ),
          },
        ]
      : []),
    ...(content.servir
      ? [
          {
            href: '/servir',
            titulo: 'Servir juntos',
            texto: 'Usamos nuestros dones para bendecir a otros dentro y fuera de la iglesia.',
            enlace: 'Descubre oportunidades',
            foto: '/disenos/calida/servir.webp',
            alt: 'Jóvenes voluntarios arman cajas de ayuda',
            dato: areas.length > 0 && (
              <Fichas items={areas.map((a) => ({ clave: a.id, nombre: a.nombre }))} />
            ),
          },
        ]
      : []),
  ];

  return (
    <div className="flex flex-col gap-[clamp(2.5rem,5vw,4rem)] pt-[clamp(1.25rem,2.2vw,2rem)]">
      <CabeceraPagina
        id="calida-comunidad"
        etiqueta="Comunidad"
        titulo={
          <>
            La vida se <em className="-mt-[0.08em] block">comparte.</em>
          </>
        }
        texto="En IBR creemos que la fe se vive mejor en comunidad. Caminamos juntos, nos animamos, servimos y crecemos en todas las etapas de la vida."
        acciones={
          <Link href={rutaCalida('/conocenos')} className={botonCalida('naranja', 'normal')}>
            Conoce más sobre nosotros
            <Icon name="arrowRight" className="size-4" />
          </Link>
        }
        foto={{
          src: '/disenos/calida/comunidad.webp',
          alt: 'Amigos de la iglesia conversan y ríen alrededor de una mesa',
          encuadre: 'object-[55%_center]',
        }}
      />

      {tarjetas.length > 0 && (
        <section aria-label="Formas de vivir la comunidad">
          <Contenedor>
            <TarjetasComunidad tarjetas={tarjetas} />
          </Contenedor>
        </section>
      )}

      {grupos.length > 0 && (
        <section
          id="grupos"
          aria-labelledby="calida-grupos"
          className="pt-[clamp(1rem,3vw,2.5rem)]"
        >
          <Contenedor className="flex flex-col gap-[clamp(1.5rem,3vw,2.5rem)]">
            <EncabezadoSeccion
              id="calida-grupos"
              etiqueta="Grupos en casa"
              titulo={
                <>
                  Esta semana en <em>Riobamba</em>
                </>
              }
              texto={`${grupos.length} ${grupos.length === 1 ? 'grupo se reúne' : 'grupos se reúnen'} en casas${
                zonas.length > 0 ? ` de ${listaNatural(zonas.slice(0, 4))}` : ''
              }. Elige el que te quede cerca y visítalo cuando quieras.`}
              accion={
                content.grupos && <EnlaceFlecha href="/grupos">Buscar por zona y día</EnlaceFlecha>
              }
            />
            <GruposCasa grupos={grupos} />
          </Contenedor>
        </section>
      )}

      <SiguientePaso />
    </div>
  );
}
