import type { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { datosComunidad } from '@/disenos/datos';
import { Contenedor } from '@/disenos/calida/Contenedor';
import { Etiqueta } from '@/disenos/calida/Etiqueta';
import { Ficha } from '@/disenos/calida/Ficha';
import { Foto } from '@/disenos/calida/Foto';
import { SiguientePaso } from '@/disenos/calida/SiguientePaso';
import {
  DatoConIcono,
  type TarjetaComunidad,
  TarjetasComunidad,
} from '@/disenos/calida/TarjetasComunidad';
import { Texto } from '@/disenos/calida/Texto';
import { Titulo } from '@/disenos/calida/Titulo';
import { botonCalida } from '@/disenos/calida/botones';
import { listaNatural } from '@/disenos/calida/textos';
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
 * (grupos, niños y familias, servir) con sus datos reales y la banda «Tu siguiente paso». Cada
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
            href: '/ministerios',
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
    <div className="flex flex-col gap-[clamp(2rem,4vw,2.5rem)] pt-[clamp(1.25rem,2.2vw,2rem)]">
      <section aria-labelledby="calida-comunidad">
        <Contenedor className="grid items-center gap-[clamp(1.5rem,3.4vw,3rem)] lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          <div className="flex flex-col items-start gap-[clamp(0.875rem,1.4vw,1.25rem)] xl:pl-[clamp(0rem,6vw,6rem)]">
            <Etiqueta className="text-accent-strong">Comunidad</Etiqueta>
            <Titulo como="h1" id="calida-comunidad" tamano="pagina" className="text-ink">
              La vida se <em className="-mt-[0.08em] block">comparte.</em>
            </Titulo>
            <Texto className="max-w-[29rem]">
              En IBR creemos que la fe se vive mejor en comunidad. Caminamos juntos, nos animamos,
              servimos y crecemos en todas las etapas de la vida.
            </Texto>
            <Link href="/nosotros" className={botonCalida('naranja', 'normal', 'mt-1')}>
              Conoce más sobre nosotros
              <Icon name="arrowRight" className="size-4" />
            </Link>
          </div>
          <Foto
            src="/disenos/calida/comunidad.webp"
            alt="Amigos de la iglesia conversan y ríen alrededor de una mesa"
            sizes="(min-width: 64rem) 58vw, 100vw"
            prioridad
            encuadre="object-[55%_center]"
            className="relative aspect-[4/3] rounded-[0.875rem] md:aspect-[16/8] lg:aspect-auto lg:min-h-[clamp(20rem,22vw,22rem)] lg:self-stretch"
          />
        </Contenedor>
      </section>

      {tarjetas.length > 0 && (
        <section aria-label="Formas de vivir la comunidad">
          <Contenedor>
            <TarjetasComunidad tarjetas={tarjetas} />
          </Contenedor>
        </section>
      )}

      <SiguientePaso />
    </div>
  );
}
