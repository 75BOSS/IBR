import { Letras } from './Letras';

/**
 * Encabezado de las páginas interiores (imagen 11, «Tu primera visita, paso a paso.»): una
 * etiqueta, el titular en la sans gruesa con la palabra destacada debajo en la serifa roja
 * cursiva (entra letra a letra), una frase y, si hace falta, acciones. Todo centrado.
 */
export function TituloPagina({
  id,
  etiqueta,
  antes,
  destacado,
  texto,
  children,
}: {
  id: string;
  etiqueta?: string;
  antes: React.ReactNode;
  destacado: string;
  texto: string;
  children?: React.ReactNode;
}) {
  return (
    <section
      aria-labelledby={id}
      className="container-page flex flex-col items-center gap-[clamp(0.75rem,2vw,1.25rem)] pt-[clamp(2.25rem,5vw,3.25rem)] text-center"
    >
      {etiqueta && <p className="eyebrow text-accent">{etiqueta}</p>}
      <h1
        id={id}
        className="font-headline text-[clamp(2.25rem,1.2rem+3.9vw,4.25rem)] leading-[0.98] font-extrabold tracking-[-0.05em] text-balance text-ink"
      >
        {antes}{' '}
        <em className="block font-medium tracking-[-0.02em] italic">
          <Letras texto={destacado} />
        </em>
      </h1>
      <p className="max-w-[38rem] text-[clamp(1.0625rem,1rem+0.2vw,1.125rem)] text-balance text-ink-soft">
        {texto}
      </p>
      {children}
    </section>
  );
}
