import type { Metadata } from 'next';
import { datosComunidad } from '@/disenos/datos';
import { BandaOrientacion } from '@/disenos/poster/comunidad/BandaOrientacion';
import { Etiquetas } from '@/disenos/poster/comunidad/Etiquetas';
import {
  type CategoriaComunidad,
  FiltroComunidad,
} from '@/disenos/poster/comunidad/FiltroComunidad';
import { FilaFoto } from '@/disenos/poster/FilaFoto';
import { Raya, Titulo } from '@/disenos/poster/piezas';
import { DAY_NAMES, formatTime } from '@/lib/dates';
import { edadText, ministerioName } from '@/lib/ministerios';

export const revalidate = 300;

export const metadata: Metadata = { title: 'E · Póster · Comunidad' };

/**
 * Comunidad de la propuesta Póster (imagen 14): «ENCUENTRA TU LUGAR», pestañas que filtran y una
 * fila por cada forma de conectarse (grupos en casa, ministerios por edad, servir), cada una con
 * sus grupos, ministerios o áreas reales. Solo aparecen las filas que tienen contenido; la banda
 * para pedir orientación está siempre.
 */
export default async function ComunidadPoster() {
  const { grupos, ministerios, areas } = await datosComunidad();

  const categorias: CategoriaComunidad[] = [
    ...(grupos.length > 0
      ? [
          {
            clave: 'grupos',
            etiqueta: 'Grupos',
            fila: (
              <FilaFoto
                nivel="h2"
                foto="/disenos/poster/grupos.webp"
                alt="Un grupo en casa conversa con la Biblia abierta"
                titulo="Grupos en casa"
                texto="Comparte la vida durante la semana."
                href="/grupos"
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
            fila: (
              <FilaFoto
                nivel="h2"
                foto="/disenos/poster/ninos.webp"
                alt="Niños y una maestra ríen mientras hacen una manualidad"
                titulo="Niños y familias"
                texto="Un espacio para crecer juntos."
                href="/ministerios"
                accion="Conocer"
                detalle={
                  <Etiquetas
                    items={ministerios.map((m) => ({
                      href: `/ministerios/${m.slug}`,
                      nombre: ministerioName(m),
                      nota: edadText(m),
                    }))}
                    verTodos={{ href: '/ministerios', texto: 'ministerios más' }}
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
            fila: (
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
    <div className="@container/pagina flex flex-col gap-[clamp(1rem,3vw,1.5rem)] px-(--d-margen) pt-[clamp(1.25rem,4vw,2rem)] lg:gap-[clamp(0.75rem,1.2vw,1rem)] lg:px-[clamp(1rem,1.6vw,1.5rem)] lg:pt-[clamp(1rem,2vw,1.75rem)]">
      <header className="grid gap-x-[3cqi] gap-y-[clamp(1rem,4cqi,1.5rem)] @4xl/pagina:grid-cols-[minmax(0,1fr)_minmax(0,24cqi)] @4xl/pagina:items-start">
        <Titulo
          as="h1"
          estilo="negro"
          className="text-[17cqi] font-stretch-[78%] @4xl/pagina:text-[14.2cqi] @4xl/pagina:font-stretch-[72%]"
        >
          <span className="block">Encuentra</span>
          <span className="block">
            <em>Tu</em> lugar
          </span>
        </Titulo>
        <div className="flex max-w-xl flex-col gap-[clamp(0.75rem,1.6cqi,1.25rem)] @4xl/pagina:pt-[2.6cqi]">
          <p className="font-display text-[clamp(1.25rem,1rem+0.9vw,1.75rem)] leading-[1.1] font-extrabold tracking-[-0.02em]">
            Personas de todas las edades, una misma familia.
          </p>
          <Raya />
          <p className="text-[clamp(1rem,0.92rem+0.35vw,1.1875rem)] leading-snug">
            Grupos, familias y oportunidades para servir. Hay un lugar para ti en esta casa.
          </p>
        </div>
      </header>
      {categorias.length > 0 && <FiltroComunidad categorias={categorias} />}
      <div className="-mx-(--d-margen) lg:-mx-[clamp(1rem,1.6vw,1.5rem)]">
        <BandaOrientacion />
      </div>
    </div>
  );
}
