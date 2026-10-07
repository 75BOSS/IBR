import Link from 'next/link';
import { Card } from '@/components/Card';
import { Icon } from '@/components/Icon';
import { Tag } from '@/components/Tag';
import { DAY_NAMES, formatTime } from '@/lib/dates';
import { FRECUENCIAS_LABEL, type GrupoPublico } from '@/lib/grupos-public';

export function groupWhen(g: Pick<GrupoPublico, 'dia_semana' | 'hora' | 'frecuencia'>): string {
  if (!g.dia_semana) return 'Día por confirmar';
  const base = `${DAY_NAMES[g.dia_semana]}${g.hora ? ` · ${formatTime(g.hora)}` : ''}`;
  return g.frecuencia === 'semanal'
    ? `${base} (cada semana)`
    : `${base} (${FRECUENCIAS_LABEL[g.frecuencia].toLowerCase()})`;
}

/** Grupo en el directorio público. La franja de color es la del ministerio (rango de edad). */
export function GroupCard({ group }: { group: GrupoPublico }) {
  return (
    <Card
      as="article"
      accentColor={group.rango_color ?? '#0e5e6f'}
      className="group relative h-full"
    >
      <div className="flex h-full flex-col gap-2">
        <h3 className="font-display text-h3 font-medium text-ink">
          <Link
            href={`/grupos/${group.id}`}
            className="group-hover:text-brand-strong group-hover:underline after:absolute after:inset-0"
          >
            {group.nombre}
          </Link>
        </h3>
        <p className="flex items-center gap-2 text-ink-soft">
          <Icon name="clock" className="size-4 shrink-0" /> {groupWhen(group)}
        </p>
        {group.zona && (
          <p className="flex items-center gap-2 text-ink-soft">
            <Icon name="mapPin" className="size-4 shrink-0" /> {group.zona}
          </p>
        )}
        {group.lider_nombre && (
          <p className="flex items-center gap-2 text-ink-soft">
            <Icon name="users" className="size-4 shrink-0" /> Líder: {group.lider_nombre}
          </p>
        )}
        <p className="mt-auto flex flex-wrap gap-1.5 pt-2">
          {group.tipo && <Tag tone="brand">{group.tipo}</Tag>}
          {group.ubicacion_tipo === 'en_linea' && <Tag tone="accent">En línea</Tag>}
        </p>
      </div>
    </Card>
  );
}
