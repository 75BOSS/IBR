import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { Icon } from '@/components/Icon';

/*
 * Piezas visuales de la propuesta C · Nocturna. Todo lo que se repite (contenedor, botones
 * píldora, etiquetas, aros de íconos) sale de aquí para no copiar cadenas de clases.
 */

/** Ancho de página: 16 px de margen en 360 y 56 px en 1536 (la barra y el collage de la imagen 7). */
export const CONTENEDOR = 'mx-auto w-full max-w-[96rem] px-[clamp(1rem,3.65vw,3.5rem)]';

/**
 * La itálica con serifa de la propuesta para frases cortas fuera de un título (la visión del pie,
 * la serie de una prédica). No es la utilidad `font-script` del tema: esa la deja derecha.
 */
export const CURSIVA = 'font-[family-name:var(--font-script)] font-medium italic';

type TonoPildora =
  'durazno' | 'naranja' | 'marino' | 'contornoClaro' | 'contornoOscuro' | 'contornoMixto';
type TamanoPildora = 'sm' | 'md' | 'lg';

const TONOS: Record<TonoPildora, string> = {
  durazno: 'bg-(--d-durazno) text-ink hover:bg-(--d-durazno-fuerte)',
  naranja: 'bg-accent text-cream hover:bg-accent-strong',
  marino: 'bg-brand text-cream hover:bg-brand-strong',
  contornoClaro: 'border-2 border-peach/80 text-cream hover:bg-cream/10',
  contornoOscuro: 'border-[1.5px] border-ink text-ink hover:bg-ink/5',
  /** Sección azul en celular y crema en escritorio («Personas como tú»). */
  contornoMixto:
    'border-2 border-peach/80 text-cream hover:bg-cream/10 lg:border-[1.5px] lg:border-ink lg:text-ink lg:hover:bg-ink/5',
};

// Alto mínimo de 44 px en táctil; texto y relleno crecen con la pantalla.
const TAMANOS: Record<TamanoPildora, string> = {
  sm: 'min-h-10 px-[clamp(1rem,0.6rem+1vw,1.875rem)] text-[0.9375rem]',
  md: 'min-h-12 px-[clamp(1.25rem,0.9rem+1vw,2.125rem)] text-[clamp(0.9375rem,0.88rem+0.2vw,1rem)]',
  lg: 'min-h-[clamp(3rem,2.5rem+1.1vw,3.625rem)] px-[clamp(1.375rem,0.9rem+1.3vw,2.375rem)] text-[clamp(1rem,0.92rem+0.32vw,1.1875rem)]',
};

/** Botón píldora de la propuesta (enlaces con forma de botón: todas las llamadas a la acción). */
export function pildora({
  tono,
  tamano = 'md',
  className = '',
}: {
  tono: TonoPildora;
  tamano?: TamanoPildora;
  className?: string;
}): string {
  return [
    'inline-flex items-center justify-center gap-3 rounded-full font-display font-semibold leading-none transition-colors motion-safe:duration-150',
    TONOS[tono],
    TAMANOS[tamano],
    className,
  ].join(' ');
}

/** Versalitas espaciadas con una raya delante («— UNA COMUNIDAD REAL»). El color lo da quien la usa. */
export function Etiqueta({
  children,
  raya = true,
  className = '',
}: {
  children: ReactNode;
  raya?: boolean;
  className?: string;
}) {
  return (
    <p
      className={`flex items-center gap-[0.9rem] font-display text-[0.6875rem] font-semibold tracking-[0.24em] uppercase ${
        raya ? 'before:h-px before:w-[clamp(1.75rem,1.2rem+1.2vw,2.5rem)] before:bg-current' : ''
      } ${className}`}
    >
      {children}
    </p>
  );
}

/** Aro de contorno con un ícono dentro (barra de la portada, «Ver mensaje», redes del pie). */
export function Aro({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`grid shrink-0 place-items-center rounded-full border-[1.5px] border-current ${className}`}
    >
      {children}
    </span>
  );
}

/**
 * Frase distinta en celular y en escritorio (la propuesta usa textos distintos en la imagen 9 y
 * en la 7). Solo se muestra —y se lee— una: la otra queda con display: none.
 */
export function Alterna({ movil, escritorio }: { movil: ReactNode; escritorio: ReactNode }) {
  return (
    <>
      <span className="lg:hidden">{movil}</span>
      <span className="hidden lg:inline">{escritorio}</span>
    </>
  );
}

/** Aviso para lectores de pantalla en los enlaces que abren otra pestaña. */
export function PestanaNueva({ que = 'se abre' }: { que?: string }) {
  return <span className="sr-only"> ({que} en una pestaña nueva)</span>;
}

/**
 * Foto que llena su caja: el tamaño y la forma los da `className`; `sizes` dice qué ancho ocupa
 * para no bajar una foto de más. Un nombre suelto («abrazo.webp») es un recorte provisional de la
 * propuesta (public/disenos/nocturna); una ruta o URL completa es una foto de la BD o de
 * /fotos-ejemplo.
 */
export function Foto({
  src,
  alt = '',
  sizes,
  className = '',
  encuadre = 'object-center',
  prioridad = false,
  capa = false,
  efecto = '',
}: {
  src: string;
  alt?: string;
  sizes: string;
  className?: string;
  /** Qué parte de la foto se ve cuando se recorta (object-position). */
  encuadre?: string;
  prioridad?: boolean;
  /** Capa de fondo posicionada por quien la usa (absolute) en vez de una caja en el flujo. */
  capa?: boolean;
  /** Clases de movimiento de la foto dentro de su marco (Ken Burns, zoom al pasar el mouse). */
  efecto?: string;
}) {
  const ruta = /^(\/|https?:)/.test(src) ? src : `/disenos/nocturna/${src}`;
  return (
    <div className={`${capa ? 'absolute' : 'relative'} overflow-hidden ${className}`}>
      <Image
        src={ruta}
        alt={alt}
        fill
        sizes={sizes}
        priority={prioridad}
        className={`object-cover ${encuadre} ${efecto}`}
      />
    </div>
  );
}

/** Titular de sección (Poppins extragruesa con la palabra en itálica): «Lo que *viene.*». */
export const TITULAR =
  'font-display text-[clamp(2.125rem,1.3rem+3.3vw,3.875rem)] leading-[0.98] font-extrabold tracking-[-0.035em] break-words';

/** Titular de tarjeta o de bloque dentro de una sección. */
export const SUBTITULAR =
  'font-display text-[clamp(1.375rem,1.15rem+0.9vw,1.875rem)] leading-[1.08] font-bold tracking-[-0.025em] break-words';

/** Párrafo de entrada bajo un titular. */
export const ENTRADA = 'text-[clamp(1rem,0.93rem+0.3vw,1.125rem)] leading-[1.45]';

/**
 * Cabecera de sección: etiqueta con raya, titular (h2) e introducción opcional. `oscuro` = sobre
 * azul (etiqueta en arena; la palabra en itálica la pasa a durazno la clase on-dark de la sección).
 */
export function TituloSeccion({
  id,
  etiqueta,
  children,
  intro,
  oscuro = false,
  className = '',
}: {
  id: string;
  etiqueta: string;
  children: ReactNode;
  intro?: ReactNode;
  oscuro?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`d-aparece flex flex-col items-start gap-[clamp(0.75rem,1.4vw,1rem)] ${className}`}
    >
      <Etiqueta className={oscuro ? 'text-(--d-arena)' : 'text-accent-strong'}>{etiqueta}</Etiqueta>
      <h2 id={id} className={TITULAR}>
        {children}
      </h2>
      {intro && (
        <p className={`max-w-[38rem] ${ENTRADA} ${oscuro ? 'text-cream/85' : 'text-ink-soft'}`}>
          {intro}
        </p>
      )}
    </div>
  );
}

/**
 * Enlace de texto con flecha que avanza al pasar el mouse («Ver todos →»). El color lo da quien
 * lo usa; `externo` abre otra pestaña y lo avisa a los lectores de pantalla.
 */
export function EnlaceFlecha({
  href,
  children,
  externo = false,
  className = '',
}: {
  href: string;
  children: ReactNode;
  externo?: boolean;
  className?: string;
}) {
  const clases = `group inline-flex min-h-11 items-center gap-2 font-display font-semibold transition-colors ${className}`;
  const contenido = (
    <>
      {children}
      <Icon
        name="arrowRight"
        className="size-5 shrink-0 transition-transform motion-safe:group-hover:translate-x-1"
      />
    </>
  );
  return externo ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={clases}>
      {contenido}
      <PestanaNueva />
    </a>
  ) : (
    <Link href={href} className={clases}>
      {contenido}
    </Link>
  );
}

/**
 * Preguntas en acordeón con <details>/<summary> (accesible y abre sin JavaScript). `oscuro` =
 * sobre azul. Se abre una a la vez gracias al atributo `name` compartido.
 */
export function Acordeon({
  nombre,
  preguntas,
  oscuro = false,
}: {
  nombre: string;
  preguntas: { pregunta: string; respuesta: string }[];
  oscuro?: boolean;
}) {
  return (
    <div className={`border-t ${oscuro ? 'border-cream/15' : 'border-line'}`}>
      {preguntas.map((p) => (
        <details
          key={p.pregunta}
          name={nombre}
          className={`group border-b ${oscuro ? 'border-cream/15' : 'border-line'}`}
        >
          <summary
            className={`flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 font-display text-[clamp(1.0625rem,0.98rem+0.35vw,1.25rem)] leading-snug font-semibold transition-colors [&::-webkit-details-marker]:hidden ${
              oscuro ? 'hover:text-peach' : 'hover:text-accent-strong'
            }`}
          >
            <span className="min-w-0 break-words">{p.pregunta}</span>
            <span
              aria-hidden="true"
              className={`grid size-9 shrink-0 place-items-center rounded-full border-[1.5px] transition-transform group-open:rotate-45 motion-safe:duration-300 ${
                oscuro ? 'border-peach/60 text-peach' : 'border-accent/60 text-accent-strong'
              }`}
            >
              <Icon name="plus" className="size-4" />
            </span>
          </summary>
          <p
            className={`max-w-[44rem] pr-12 pb-5 leading-relaxed motion-safe:animate-toast-in ${
              oscuro ? 'text-cream/85' : 'text-ink-soft'
            }`}
          >
            {p.respuesta}
          </p>
        </details>
      ))}
    </div>
  );
}

/** Iniciales de un nombre para el retrato de quien aún no tiene foto («Juan Carlos» → «JC»). */
export function iniciales(nombre: string): string {
  const palabras = nombre
    .replace(/^(Pastora?|Pstr\.?|Hno\.?|Hna\.?)\s+/i, '')
    .split(/\s+/)
    .filter(Boolean);
  return palabras
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');
}
