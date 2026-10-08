import type { Metadata } from 'next';
import Link from 'next/link';
import { ButtonLink } from '@/components/Button';
import { Card } from '@/components/Card';
import { FormAlert } from '@/components/FormAlert';
import { Icon, type IconName } from '@/components/Icon';
import { PageHeader } from '@/components/PageHeader';
import { ContactLinks } from '@/components/admin/ContactLinks';
import { eventWhen } from '@/components/site/EventCard';
import { requireAdmin } from '@/lib/auth';
import { getDashboardCounts } from '@/lib/dashboard';
import { formatDateTime } from '@/lib/dates';
import { listNotStartedEventos } from '@/lib/eventos';
import { listRegistros } from '@/lib/registros';

export const metadata: Metadata = { title: 'Resumen' };

const notices = new Map([
  [
    'sin-permiso',
    'Esa sección es solo para administradores. Si la necesitas, pídele acceso a un administrador.',
  ],
]);

/** Pendiente del panel: resalta si hay algo que atender y dice «al día» si no. */
function Pending({
  href,
  icon,
  count,
  label,
  done,
  informative = false,
}: {
  href: string;
  icon: IconName;
  count: number;
  label: string;
  done: string;
  /** Solo informa (ej. eventos próximos): no se resalta como algo por atender. */
  informative?: boolean;
}) {
  const waiting = count > 0 && !informative;
  return (
    <li>
      <Link
        href={href}
        className={`group flex h-full items-center gap-3 rounded-2xl p-4 ring-1 transition-shadow hover:shadow-card ${
          waiting ? 'bg-accent-soft ring-accent/30' : 'bg-surface ring-line/70'
        }`}
      >
        <span
          className={`grid size-11 shrink-0 place-items-center rounded-xl ${
            waiting ? 'bg-accent text-surface' : 'bg-sunken text-ink-soft'
          }`}
        >
          <Icon name={icon} className="size-5" />
        </span>
        <span className="flex min-w-0 flex-col">
          <span
            className={`font-display text-h2 leading-none font-semibold ${waiting ? 'text-accent-strong' : 'text-ink-soft'}`}
          >
            {count}
          </span>
          <span className="text-sm font-semibold text-ink group-hover:underline">
            {waiting ? label : done}
          </span>
        </span>
      </Link>
    </li>
  );
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ aviso?: string }>;
}) {
  const admin = await requireAdmin();
  const { aviso } = await searchParams;
  const notice = aviso ? notices.get(aviso) : undefined;
  const firstName = admin.nombre.split(/\s+/)[0];
  const [counts, nuevos, eventos] = await Promise.all([
    getDashboardCounts(),
    listRegistros({ estado: 'nuevo', limit: 5 }),
    listNotStartedEventos(4),
  ]);

  return (
    <section className="container-panel">
      {notice && <FormAlert tone="warning">{notice}</FormAlert>}
      <PageHeader
        eyebrow="Resumen"
        title={`Hola, ${firstName}`}
        intro="Lo que está esperando respuesta y lo que viene en la iglesia."
        actions={
          <>
            <ButtonLink
              href="/admin/registros/nuevo"
              variant="secondary"
              icon={<Icon name="userPlus" className="size-4" />}
            >
              Agregar persona
            </ButtonLink>
            <ButtonLink href="/admin/eventos/nuevo" icon={<Icon name="plus" className="size-4" />}>
              Nuevo evento
            </ButtonLink>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-aside-main">
        <Card tone="brand" emphasis="featured">
          <p className="eyebrow text-accent-soft">Personas nuevas</p>
          <p className="mt-2 font-display text-display leading-none font-semibold">
            {counts.registros_semana}
          </p>
          <p className="mt-1 text-surface/85">
            {counts.registros_semana === 1
              ? 'llegó en los últimos 7 días'
              : 'llegaron en los últimos 7 días'}
          </p>
          <p className="mt-4 font-semibold">
            {counts.registros_sin_contactar > 0
              ? `${counts.registros_sin_contactar} ${counts.registros_sin_contactar === 1 ? 'espera' : 'esperan'} que les escribamos.`
              : 'Todas ya fueron contactadas.'}
          </p>
          <Link href="/admin/registros" className="mt-4 inline-flex items-center gap-1.5 link">
            Ver registros <Icon name="arrowRight" className="size-4" />
          </Link>
        </Card>

        <ul className="grid content-start gap-3 md:grid-cols-2">
          <Pending
            href="/admin/peticiones"
            icon="handHeart"
            count={counts.peticiones_sin_atender}
            label="Peticiones sin atender"
            done="Peticiones al día"
          />
          <Pending
            href="/admin/grupos/solicitudes"
            icon="users"
            count={counts.solicitudes_pendientes}
            label="Quieren unirse a un grupo"
            done="Solicitudes al día"
          />
          <Pending
            href="/admin/mensajes"
            icon="mail"
            count={counts.contactos_sin_leer}
            label="Mensajes sin leer"
            done="Mensajes al día"
          />
          <Pending
            href="/admin/eventos"
            icon="calendar"
            count={counts.eventos_proximos}
            label="Eventos próximos"
            done={counts.eventos_proximos > 0 ? 'Eventos próximos' : 'Sin eventos próximos'}
            informative
          />
        </ul>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
        <Card
          title="Por contactar"
          as="section"
          actions={
            <Link href="/admin/registros" className="text-sm link">
              Ver todos
            </Link>
          }
        >
          {nuevos.length > 0 ? (
            <ul className="flex flex-col divide-y divide-line/60">
              {nuevos.map((r) => (
                <li
                  key={r.id}
                  className="flex flex-wrap items-start justify-between gap-2 py-3 first:pt-0 last:pb-0"
                >
                  <ContactLinks
                    nombre={`${r.nombres} ${r.apellidos ?? ''}`.trim()}
                    telefono={r.telefono}
                    saludo={`Hola ${r.nombres}, te saludamos de la Iglesia Bíblica Riobamba.`}
                  />
                  <span className="text-sm text-ink-soft">
                    {formatDateTime(r.creado_en, { dateStyle: 'medium' })}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-ink-soft">¡Al día! No hay personas nuevas sin contactar.</p>
          )}
        </Card>

        <Card
          title="Lo que viene"
          as="section"
          tone="sunken"
          actions={
            <Link href="/admin/eventos" className="text-sm link">
              Eventos
            </Link>
          }
        >
          {eventos.length > 0 ? (
            <ul className="flex flex-col divide-y divide-line/60">
              {eventos.map((e) => (
                <li key={e.id} className="flex flex-col gap-0.5 py-3 first:pt-0 last:pb-0">
                  <Link
                    href={`/admin/eventos/${e.id}`}
                    className="font-semibold text-ink hover:text-brand-strong hover:underline"
                  >
                    {e.titulo}
                  </Link>
                  <span className="text-sm text-ink-soft first-letter:uppercase">
                    {eventWhen(e)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-ink-soft">
              No hay eventos publicados por venir.{' '}
              <Link href="/admin/eventos/nuevo" className="link">
                Crear uno
              </Link>
            </p>
          )}
        </Card>
      </div>
    </section>
  );
}
