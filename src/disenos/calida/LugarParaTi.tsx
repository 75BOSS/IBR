import { edadText, ministerioName } from '@/lib/ministerios';
import { Contenedor } from './Contenedor';
import { EnlaceFlecha } from './EnlaceFlecha';
import { Ficha } from './Ficha';
import { Foto } from './Foto';
import { Titulo } from './Titulo';
import { Texto } from './Texto';

/**
 * «Un lugar para ti.» (imagen 3): titular y foto lado a lado también en el celular. Debajo, los
 * ministerios reales (uno por edad, con su color) que llevan a su página; sin ministerios con
 * contenido, el enlace invita a la primera visita.
 */
export function LugarParaTi({
  ministerios,
  verMinisterios,
}: {
  ministerios: {
    id: number;
    slug: string;
    nombre: string;
    nombre_ministerio: string | null;
    edad_min: number | null;
    edad_max: number | null;
    color: string | null;
  }[];
  verMinisterios: boolean;
}) {
  const conFichas = verMinisterios && ministerios.length > 0;
  return (
    <section aria-labelledby="calida-lugar" className="@container py-[clamp(0.25rem,5vw,4.5rem)]">
      <Contenedor>
        {/* Angosto: titular y foto lado a lado, las fichas debajo a todo el ancho. Ancho: texto y
            fichas en una columna centrada junto a la foto. */}
        <div className="grid grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-center gap-x-[clamp(1rem,5cqi,5rem)] gap-y-6 [grid-template-areas:'texto_foto'_'fichas_fichas'] @4xl:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] @4xl:grid-rows-[1fr_auto_auto_1fr] @4xl:[grid-template-areas:'._foto'_'texto_foto'_'fichas_foto'_'._foto']">
          <div className="flex flex-col gap-[clamp(0.875rem,2.2cqi,1.5rem)] [grid-area:texto]">
            <Titulo
              id="calida-lugar"
              tamano="libre"
              className="text-[clamp(2.25rem,11.5cqi,3.75rem)] leading-[0.98] text-ink"
            >
              Un lugar
              <br /> para <em>ti.</em>
            </Titulo>
            <Texto className="max-w-[28rem]">
              No importa en qué etapa de la vida estés, hay un lugar para ti en IBR Somos Familia.
            </Texto>
          </div>
          <Foto
            src="/disenos/calida/lugar.webp"
            alt="Dos amigas se abrazan al encontrarse en la iglesia"
            sizes="(min-width: 48rem) 45vw, 42vw"
            encuadre="object-[60%_center]"
            className="relative aspect-[306/268] rounded-[0.875rem] [grid-area:foto] @4xl:aspect-[16/11]"
          />
          <div className="flex flex-col items-start gap-5 [grid-area:fichas]">
            {conFichas && (
              <ul className="flex flex-wrap gap-2">
                {ministerios.map((m) => (
                  <li key={m.id}>
                    <Ficha href={`/ministerios/${m.slug}`} tono={m.color} detalle={edadText(m)}>
                      {ministerioName(m)}
                    </Ficha>
                  </li>
                ))}
              </ul>
            )}
            {conFichas ? (
              <EnlaceFlecha href="/ministerios">Conoce los ministerios</EnlaceFlecha>
            ) : (
              <EnlaceFlecha href="/soy-nuevo">Planifica tu visita</EnlaceFlecha>
            )}
          </div>
        </div>
      </Contenedor>
    </section>
  );
}
