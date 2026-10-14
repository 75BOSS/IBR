import { Icon } from '@/components/Icon';
import { Contenedor } from './Contenedor';

/**
 * «En esta página»: fichas que saltan a cada sección (anclas que existen en la misma página).
 * Se acomodan en varias filas en el celular, sin deslizar de lado.
 */
export function IndicePagina({ enlaces }: { enlaces: { href: string; label: string }[] }) {
  if (enlaces.length === 0) return null;
  return (
    <nav aria-label="En esta página">
      <Contenedor>
        <ul className="calida-escalonado flex flex-wrap gap-2 xl:pl-[clamp(0rem,6vw,6rem)]">
          {enlaces.map((e) => (
            <li key={e.href}>
              <a
                href={e.href}
                className="calida-magnetico inline-flex min-h-11 items-center gap-2 rounded-full bg-surface px-4 text-[clamp(0.875rem,0.85rem+0.12vw,0.95rem)] font-semibold text-ink ring-1 ring-line hover:bg-accent-soft hover:text-accent-strong"
              >
                {e.label}
                <Icon name="chevronDown" className="size-4 text-accent-strong" />
              </a>
            </li>
          ))}
        </ul>
      </Contenedor>
    </nav>
  );
}
