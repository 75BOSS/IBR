import { Inclinable } from '@/disenos/vibrante/animacion/Inclinable';
import { FlechaEnlace } from '@/disenos/vibrante/FlechaEnlace';
import { Foto } from '@/disenos/vibrante/Foto';
import type { FotoVibrante } from '@/disenos/vibrante/fotos';
import { Titular } from '@/disenos/vibrante/Titular';

export type TarjetaComunidad = {
  clave: string;
  foto: FotoVibrante;
  titulo: string;
  texto: string;
  /** Lo que hay hoy en ese destino (grupos, ministerios, áreas), leído de la BD. */
  datos: string[];
  href: string;
};

const COLUMNAS: Record<number, string> = {
  1: '',
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
};

/**
 * Las tres puertas de Comunidad (imagen 5): tarjetas de borde a borde con foto, título, frase,
 * lo que hay hoy (de la BD) y «Conoce más →». La página solo pasa las que tienen a dónde llevar;
 * las que quedan se reparten el ancho. Con el mouse, cada tarjeta se inclina un poco hacia él.
 */
export function TarjetasComunidad({ tarjetas }: { tarjetas: TarjetaComunidad[] }) {
  if (tarjetas.length === 0) return null;
  return (
    <section aria-label="Formas de vivir la comunidad" className="pt-1.5">
      <ul className={`grid gap-3 ${COLUMNAS[tarjetas.length]}`}>
        {tarjetas.map((t) => (
          <li key={t.clave} className="flex reveal">
            <Inclinable grados={3} className="group @container flex flex-1 flex-col bg-surface">
              <Foto
                foto={t.foto}
                zoom
                cursor={null}
                sizes={`(min-width: 48rem) ${Math.round(100 / tarjetas.length)}vw, 100vw`}
                className="aspect-[16/7] md:aspect-[513/182]"
              />
              <div className="flex flex-1 flex-col gap-[clamp(0.625rem,2.5cqi,0.875rem)] px-[clamp(1rem,3.9vw,3.5rem)] pt-[clamp(1.25rem,5cqi,1.75rem)] pb-[clamp(1rem,4cqi,1.5rem)]">
                <Titular tamano="tarjeta">{t.titulo}</Titular>
                <p className="max-w-[44ch] text-[clamp(1rem,0.95rem+0.25vw,1.125rem)] leading-snug">
                  {t.texto}
                </p>
                {t.datos.length > 0 && (
                  <ul className="flex flex-wrap gap-1.5 pt-1">
                    {t.datos.map((d) => (
                      <li
                        key={d}
                        className="rounded-[0.25rem] bg-sunken px-2 py-1 text-sm font-semibold text-ink-soft"
                      >
                        {d}
                      </li>
                    ))}
                  </ul>
                )}
                <FlechaEnlace href={t.href} cubre className="mt-auto">
                  Conoce más
                  <span className="sr-only"> sobre {t.titulo.toLowerCase()}</span>
                </FlechaEnlace>
              </div>
            </Inclinable>
          </li>
        ))}
      </ul>
    </section>
  );
}
