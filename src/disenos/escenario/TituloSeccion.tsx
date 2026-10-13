/** Título de sección de la propuesta: sans muy gruesa y apretada; un <em> sale en la serifa roja. */
export function TituloSeccion({
  id,
  children,
  className = 'text-ink',
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      id={id}
      className={`font-headline text-[clamp(1.875rem,1.15rem+3vw,3.5rem)] leading-[1.02] font-extrabold tracking-[-0.045em] ${className}`}
    >
      {children}
    </h2>
  );
}
