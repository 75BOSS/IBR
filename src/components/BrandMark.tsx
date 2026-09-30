/** Sello «IBR» (login, header, footer, panel). Decorativo: el nombre va en texto al lado. */
export function BrandMark({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'size-9 text-sm rounded-lg',
    md: 'size-10 text-base rounded-xl md:size-11 md:text-lg',
    lg: 'size-12 text-lg rounded-xl md:size-14 md:text-xl',
  };
  return (
    <span
      aria-hidden="true"
      className={`grid shrink-0 place-items-center bg-accent font-display font-bold text-surface ${sizes[size]}`}
    >
      IBR
    </span>
  );
}
