import type { CSSProperties } from 'react';

/**
 * Un dato que el diseño necesita pero que no se conoce al escribir las clases (el color de un
 * ministerio guardado en la BD, un porcentaje calculado) se pasa como variable CSS y el estilo
 * queda en clases: `style={cssVars({ '--progress': '40%' })}` + `w-(--progress)`. Nunca
 * `style={{ backgroundColor }}` ni medidas sueltas en línea.
 */
export function cssVars(vars: Record<`--${string}`, string>): CSSProperties {
  return vars as CSSProperties;
}

/** Color propio (rangos_edad.color) como `--tone`, o un token de la marca si no tiene. */
export function toneVar(
  color: string | null | undefined,
  fallback = 'var(--color-brand)',
): CSSProperties {
  return cssVars({ '--tone': color ?? fallback });
}
