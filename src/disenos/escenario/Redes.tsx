import { Icon, type IconName } from '@/components/Icon';

/** Redes de la iglesia (configuradas en /admin/config): círculos con el ícono. Sobre fondo oscuro. */
export function Redes({ redes }: { redes: { label: string; icon: IconName; href: string }[] }) {
  if (redes.length === 0) return null;
  return (
    <ul className="flex flex-wrap gap-2">
      {redes.map((red) => (
        <li key={red.href}>
          <a
            href={red.href}
            target="_blank"
            rel="noopener noreferrer"
            className="grid size-11 place-items-center rounded-full ring-1 ring-cream/30 transition-colors hover:bg-cream/10"
          >
            <Icon name={red.icon} className="size-5" />
            <span className="sr-only">{red.label} (abre en una pestaña nueva)</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
