/**
 * Sello «ibr» (login, header, footer, panel), como el de las redes de la iglesia: minúsculas
 * en un círculo azul marino. Decorativo: el nombre va en texto al lado.
 */
export function BrandMark({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'size-9 text-[0.95rem]',
    md: 'size-10 text-base md:size-11 md:text-lg',
    lg: 'size-12 text-lg md:size-14 md:text-xl',
  };
  return (
    <span
      aria-hidden="true"
      className={`grid shrink-0 place-items-center rounded-full bg-brand-strong pb-[0.08em] font-sans leading-none font-extrabold tracking-tight text-surface lowercase ring-2 ring-peach ${sizes[size]}`}
    >
      ibr
    </span>
  );
}
