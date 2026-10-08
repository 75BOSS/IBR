import Image from 'next/image';
import type { EquipoRow } from '@/lib/equipo';

/** Inicial para el avatar sin foto: «Pastor Juan» → J. */
function initial(name: string): string {
  return name.replace(/^(Pastora?|Ps\.)\s+/i, '').charAt(0);
}

/**
 * Persona del equipo (inicio y /nosotros). `featured` (pastores): foto grande, rol como etiqueta
 * y la biografía; en celular la foto va arriba para que el nombre no se apriete y desde tablet al
 * lado. Sin `featured` (líderes): compacta, de a dos por fila en celular.
 */
export function PersonCard({
  person,
  featured = false,
}: {
  person: Pick<EquipoRow, 'nombre' | 'rol' | 'bio' | 'foto_url'>;
  featured?: boolean;
}) {
  return (
    <li
      className={`flex reveal gap-4 rounded-(--radius-frame) bg-surface ring-1 ring-line/70 ${
        featured
          ? 'flex-col p-[clamp(1.25rem,3vw,2rem)] md:flex-row md:items-center md:gap-5'
          : 'flex-col items-center p-3 text-center md:flex-row md:pr-4 md:text-left'
      }`}
    >
      <span
        className={`relative shrink-0 overflow-hidden rounded-full bg-electric-soft ${
          featured ? 'size-[clamp(4.5rem,12vw,7rem)]' : 'size-16'
        }`}
      >
        {person.foto_url ? (
          <Image
            src={person.foto_url}
            alt=""
            fill
            sizes={featured ? '112px' : '64px'}
            className="object-cover"
          />
        ) : (
          <span
            className={`grid size-full place-items-center font-script text-electric-strong ${
              featured ? 'text-[clamp(2.75rem,2.2rem+2.2vw,4.25rem)]' : 'text-4xl'
            }`}
          >
            {initial(person.nombre)}
          </span>
        )}
      </span>
      <span className="flex min-w-0 flex-col gap-1">
        {featured && <span className="eyebrow text-accent-strong">{person.rol}</span>}
        <span className={`font-headline text-ink ${featured ? 'text-h2' : 'text-lg'}`}>
          {person.nombre}
        </span>
        {!featured && <span className="text-sm text-accent-strong">{person.rol}</span>}
        {featured && person.bio && <span className="line-clamp-4 text-ink-soft">{person.bio}</span>}
      </span>
    </li>
  );
}
