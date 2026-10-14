import type { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { MINISTERIOS_EXTRA } from '@/disenos/contenido';
import { datosMinisterios } from '@/disenos/datos';
import { BandaFoto } from '@/disenos/escenario/BandaFoto';
import { FLECHA, claseBoton } from '@/disenos/escenario/estilos';
import { FilasMinisterio, type Ministerio } from '@/disenos/escenario/FilaMinisterio';
import { FlechaEnlace } from '@/disenos/escenario/FlechaEnlace';
import { PRIMERA_VISITA } from '@/disenos/escenario/rutas';
import { TituloPagina } from '@/disenos/escenario/TituloPagina';
import { DAY_NAMES, formatTime } from '@/lib/dates';
import { edadText, ministerioName } from '@/lib/ministerios';

export const revalidate = 300;

export const metadata: Metadata = { title: 'D · Escenario · Ministerios' };

/** Fotos de ejemplo para los ministerios que aún no existen en la BD. */
const FOTOS_EXTRA: Record<string, { src: string; alt: string }> = {
  mujeres: {
    src: '/fotos-ejemplo/grupo-mujeres.webp',
    alt: 'Dos mujeres de la iglesia conversan y ríen juntas.',
  },
  matrimonios: {
    src: '/fotos-ejemplo/evento-matrimonios.webp',
    alt: 'Parejas de la iglesia se abrazan en un encuentro de matrimonios.',
  },
  hombres: {
    src: '/fotos-ejemplo/grupo-estudio.webp',
    alt: 'Un hombre con la Biblia abierta comparte en un grupo de estudio.',
  },
};

/** Sin tildes ni mayúsculas, para reconocer «Mujeres» en «Mujeres de la Palabra». */
const normalizar = (texto: string) =>
  texto
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();

/**
 * Ministerios de la propuesta D · Escenario: primero los de la BD (por edad, con sus reuniones,
 * grupos y su página), después los de ejemplo (Mujeres, Matrimonios, Hombres) con el mismo
 * tratamiento. Cada fila tiene su ancla (#kids, #jovenes, #mujeres…) para el menú.
 */
export default async function MinisteriosEscenario() {
  const { content, ministerios, reuniones, grupos } = await datosMinisterios();
  const enlaceGrupo = (id: number) => (content.grupos ? `/grupos/${id}` : undefined);

  const filas: Ministerio[] = [
    ...ministerios.map((m) => ({
      id: m.slug,
      nombre: ministerioName(m),
      para: edadText(m),
      texto: m.descripcion,
      foto: m.imagen_url
        ? { src: m.imagen_url, alt: `Ministerio ${ministerioName(m)} de la iglesia.` }
        : null,
      tono: m.color,
      reuniones: [
        ...new Set(
          reuniones
            .filter((r) => r.rango_edad_id === m.id)
            .map((r) => `${DAY_NAMES[r.dia_semana]} ${formatTime(r.hora_inicio)}`),
        ),
      ].map((texto) => ({ texto })),
      grupos: grupos
        .filter((g) => g.rango_edad_id === m.id)
        .map((g) => ({ texto: g.nombre, href: enlaceGrupo(g.id) })),
      enlace: content.ministerios ? (
        <FlechaEnlace href={`/ministerios/${m.slug}`}>Conoce {ministerioName(m)}</FlechaEnlace>
      ) : null,
    })),
    ...MINISTERIOS_EXTRA.map((m) => ({
      id: m.slug,
      nombre: m.nombre,
      para: m.para,
      texto: m.texto,
      foto: FOTOS_EXTRA[m.slug] ?? null,
      tono: null,
      reuniones: [],
      // Los grupos reales que ya llevan su nombre (ej. «Mujeres de la Palabra»).
      grupos: grupos
        .filter((g) => normalizar(g.nombre).includes(normalizar(m.nombre)))
        .map((g) => ({ texto: g.nombre, href: enlaceGrupo(g.id) })),
      enlace: <FlechaEnlace href="/contacto#mensaje">Quiero participar</FlechaEnlace>,
    })),
  ];

  return (
    <>
      <TituloPagina
        id="ministerios"
        etiqueta="Ministerios"
        antes="Un lugar para"
        destacado="cada edad."
        texto="Niños, adolescentes, jóvenes, adultos y abuelos: cada generación tiene su espacio para conocer a Dios y hacer amigos de verdad."
      >
        <nav aria-label="Ir a un ministerio" className="w-full max-w-[62rem] pt-2">
          <ul className="flex flex-wrap justify-center gap-2">
            {filas.map((f) => (
              <li key={f.id}>
                <a
                  href={`#${f.id}`}
                  className="inline-flex min-h-10 items-center rounded-full bg-surface px-4 font-display text-[0.95rem] font-semibold text-ink ring-1 ring-line transition-colors hover:bg-accent hover:text-cream hover:ring-accent"
                >
                  {f.nombre}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </TituloPagina>

      <div className="container-page py-[clamp(2.5rem,6vw,4.5rem)]">
        <FilasMinisterio ministerios={filas} />
      </div>

      <BandaFoto
        id="ven-en-familia"
        titulo={
          <>
            Ven en <em className="font-semibold italic">familia.</em>
          </>
        }
        texto="El domingo hay un lugar preparado para cada uno de los tuyos."
      >
        <Link href={PRIMERA_VISITA} className={claseBoton('rojo')}>
          Planifica tu visita
          <Icon name="arrowRight" className={FLECHA} />
        </Link>
      </BandaFoto>
    </>
  );
}
