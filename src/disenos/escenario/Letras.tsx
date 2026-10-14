import { Fragment } from 'react';
import { cssVars } from '@/lib/css-vars';

/**
 * La palabra destacada de un titular entra letra a letra (clase `d-letra` de tema.css, solo con
 * movimiento permitido; sin él, o sin CSS de animación, se ve quieta desde el principio). Las
 * letras van ocultas para los lectores de pantalla, que leen el texto entero una sola vez. Cada
 * palabra no se parte al cambiar de línea. Componente de servidor: no necesita JavaScript.
 */
export function Letras({
  texto,
  desde = 0,
}: {
  texto: string;
  /** Letras que entran antes (otra parte del mismo titular): esta parte espera su turno. */
  desde?: number;
}) {
  let posicion = desde;
  return (
    <>
      <span className="sr-only">{texto}</span>
      <span aria-hidden="true">
        {texto.split(' ').map((palabra, p) => (
          <Fragment key={`${palabra}-${p}`}>
            {p > 0 && ' '}
            <span className="inline-block whitespace-nowrap">
              {Array.from(palabra, (letra, l) => (
                <span
                  key={l}
                  style={cssVars({ '--i': String(posicion++) })}
                  className="d-letra inline-block"
                >
                  {letra}
                </span>
              ))}
            </span>
          </Fragment>
        ))}
      </span>
    </>
  );
}
