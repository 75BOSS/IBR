import type { ReactNode } from 'react';
import { Etiqueta } from './Etiqueta';
import { Titulo } from './Titulo';
import { Texto } from './Texto';

/**
 * Encabezado de una sección: etiqueta con raya, titular en serifa (con su `<em>` en itálica) y una
 * frase; a la derecha, opcional, un «ver más» (`accion`). `claro`: sobre azul noche. Aparece al
 * entrar en pantalla.
 */
export function EncabezadoSeccion({
  id,
  etiqueta,
  titulo,
  texto,
  accion,
  claro = false,
  className = '',
}: {
  id: string;
  etiqueta: string;
  titulo: ReactNode;
  texto?: ReactNode;
  accion?: ReactNode;
  claro?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`calida-aparece flex flex-wrap items-end justify-between gap-x-8 gap-y-4 ${className}`}
    >
      <div className="flex max-w-[44rem] min-w-0 flex-col gap-3">
        <Etiqueta className={claro ? 'text-peach' : 'text-accent-strong'}>{etiqueta}</Etiqueta>
        <Titulo id={id} tamano="seccion" className={claro ? 'text-cream' : 'text-ink'}>
          {titulo}
        </Titulo>
        {texto && (
          <Texto className={`max-w-[36rem] ${claro ? 'text-cream/85' : 'text-ink-soft'}`}>
            {texto}
          </Texto>
        )}
      </div>
      {accion}
    </div>
  );
}
