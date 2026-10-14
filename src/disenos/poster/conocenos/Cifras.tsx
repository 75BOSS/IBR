import type { ChurchStats } from '@/lib/stats';
import { Contador } from '../movimiento/Contador';

/**
 * Cifras reales de la iglesia como titulares de periódico: números enormes que cuentan desde 0
 * al aparecer (`Contador`), separados por rayas. Solo las mayores que 0; los años salen del año
 * de fundación de la configuración. Sin ninguna cifra, no se dibuja.
 */
export function Cifras({
  cifras,
  anioFundacion,
}: {
  cifras: ChurchStats;
  anioFundacion: string | null;
}) {
  const anio = Number(anioFundacion);
  const anos = Number.isInteger(anio) && anio > 1900 ? new Date().getFullYear() - anio : 0;
  const lista = [
    { valor: anos, texto: 'años en Riobamba' },
    { valor: cifras.grupos, texto: 'grupos en casa' },
    { valor: cifras.ministerios, texto: 'ministerios por edad' },
    { valor: cifras.reuniones, texto: 'reuniones cada semana' },
    { valor: cifras.areas, texto: 'áreas de servicio' },
  ].filter((c) => c.valor > 0);
  if (lista.length === 0) return null;
  return (
    <section aria-label="La iglesia en cifras" className="border-y-2 border-ink">
      <dl className="grid grid-cols-2 @3xl/pagina:auto-cols-fr @3xl/pagina:grid-flow-col @3xl/pagina:grid-cols-none">
        {lista.map((c, n) => (
          <div
            key={c.texto}
            className={`@container flex flex-col-reverse justify-end gap-2 border-ink px-[clamp(0.75rem,6cqi,1.5rem)] py-[clamp(1rem,8cqi,2rem)] ${
              n % 2 === 1 ? 'border-l-2' : ''
            } ${n > 1 ? 'border-t-2 @3xl/pagina:border-t-0' : ''} @3xl/pagina:border-l-2 @3xl/pagina:first:border-l-0 ${
              lista.length % 2 === 1 && n === lista.length - 1
                ? 'col-span-2 @3xl/pagina:col-span-1'
                : ''
            }`}
          >
            <dt className="font-display text-[clamp(0.6875rem,6cqi,0.875rem)] leading-snug font-bold tracking-[0.16em] uppercase">
              {c.texto}
            </dt>
            <dd
              className={`font-display text-[clamp(3.5rem,45cqi,8.5rem)] leading-[0.8] font-black tracking-[-0.04em] font-stretch-[72%] tabular-nums ${
                n % 2 === 0 ? 'text-ink' : 'text-accent'
              }`}
            >
              <Contador valor={c.valor} />
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
