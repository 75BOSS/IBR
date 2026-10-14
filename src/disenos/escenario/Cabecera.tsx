import { TituloSeccion } from './TituloSeccion';

/**
 * Cabecera de una sección: etiqueta roja con raya, el título (un <em> sale en la serifa roja),
 * una frase opcional y una acción opcional (`children`). `tono` oscuro para las bandas azul
 * marino; `centrada` para las secciones que van al centro.
 */
export function Cabecera({
  id,
  etiqueta,
  titulo,
  texto,
  tono = 'claro',
  centrada = false,
  children,
}: {
  id: string;
  etiqueta?: string;
  titulo: React.ReactNode;
  texto?: React.ReactNode;
  tono?: 'claro' | 'oscuro';
  centrada?: boolean;
  children?: React.ReactNode;
}) {
  const oscuro = tono === 'oscuro';
  return (
    <div
      className={`flex flex-col gap-[clamp(0.625rem,1.5vw,1rem)] ${
        centrada ? 'items-center text-center' : 'items-start'
      }`}
    >
      {etiqueta && <p className={`eyebrow ${oscuro ? 'text-peach' : 'text-accent'}`}>{etiqueta}</p>}
      <TituloSeccion id={id} className={`text-balance ${oscuro ? 'text-cream' : 'text-ink'}`}>
        {titulo}
      </TituloSeccion>
      {texto && (
        <p
          className={`max-w-[40rem] text-[clamp(1.0625rem,1rem+0.25vw,1.1875rem)] ${
            oscuro ? 'text-cream/85' : 'text-ink-soft'
          } ${centrada ? 'text-balance' : ''}`}
        >
          {texto}
        </p>
      )}
      {children}
    </div>
  );
}
