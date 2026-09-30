import type { Metadata } from 'next';
import Link from 'next/link';
import { salirMiembro } from '@/actions/miembro';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { PageHeader } from '@/components/PageHeader';
import { Tag } from '@/components/Tag';
import { formatDateTime } from '@/lib/dates';
import { getMemberOverview, getMemberPhone } from '@/lib/miembro';
import { SOLICITUD_ESTADOS } from '@/lib/validators/grupos';
import { VOLUNTARIO_ESTADOS } from '@/lib/validators/servir';
import { formatPhoneEc } from '@/lib/whatsapp';
import { MemberLogin } from './MemberLogin';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Mi cuenta',
  description: 'Tus inscripciones, tus grupos y dónde sirves en la Iglesia Bíblica Riobamba.',
  robots: { index: false, follow: false },
};

const solicitudLabel = new Map<string, string>(SOLICITUD_ESTADOS.map((e) => [e.value, e.label]));
const voluntarioLabel = new Map<string, string>(VOLUNTARIO_ESTADOS.map((e) => [e.value, e.label]));
const INSCRIPCION = {
  confirmada: <Tag tone="success">Confirmada</Tag>,
  asistio: <Tag tone="brand">Asististe</Tag>,
  cancelada: <Tag tone="danger">Cancelada</Tag>,
};

export default async function MiCuentaPage() {
  const telefono = await getMemberPhone();

  if (!telefono) {
    return (
      <div className="container-page flex flex-col gap-[clamp(1.5rem,4vw,3rem)] py-[clamp(2rem,6vw,4.5rem)]">
        <PageHeader
          eyebrow="Mi cuenta"
          title="Entra con tu WhatsApp"
          intro="Consulta tus inscripciones a eventos, los grupos a los que pediste unirte y dónde sirves. Sin contraseñas: te enviamos un código."
        />
        <Card emphasis="featured" className="max-w-xl">
          <MemberLogin />
        </Card>
      </div>
    );
  }

  const { inscripciones, grupos, servicio } = await getMemberOverview(telefono);
  const now = Date.now();
  const proximas = inscripciones.filter((i) => i.fecha_inicio.getTime() >= now);
  const pasadas = inscripciones.filter((i) => i.fecha_inicio.getTime() < now);

  return (
    <div className="container-page flex flex-col gap-[clamp(1.5rem,4vw,3rem)] py-[clamp(2rem,6vw,4.5rem)]">
      <PageHeader
        eyebrow="Mi cuenta"
        title="Lo tuyo en la iglesia"
        intro={`Entraste con ${formatPhoneEc(telefono)}.`}
        actions={
          <form action={salirMiembro}>
            <Button type="submit" variant="secondary" pendingLabel="Saliendo…">
              Salir
            </Button>
          </form>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-start">
        <Card title="Mis inscripciones" as="section">
          {inscripciones.length === 0 ? (
            <p className="text-ink-soft">
              Todavía no te inscribes a ningún evento.{' '}
              <Link href="/eventos" className="font-semibold text-brand-strong underline">
                Ver eventos
              </Link>
            </p>
          ) : (
            <ul className="flex flex-col divide-y divide-line/60">
              {[...proximas, ...pasadas].map((i) => (
                <li
                  key={i.codigo}
                  className="flex flex-wrap items-start justify-between gap-2 py-3 first:pt-0 last:pb-0"
                >
                  <span className="flex min-w-0 flex-col">
                    <Link
                      href={`/inscripcion/${i.codigo}`}
                      className="font-semibold text-brand-strong hover:underline"
                    >
                      {i.titulo}
                    </Link>
                    <span className="text-sm text-ink-soft first-letter:uppercase">
                      {formatDateTime(
                        i.fecha_inicio,
                        i.todo_el_dia
                          ? { weekday: 'long', day: 'numeric', month: 'long' }
                          : {
                              weekday: 'long',
                              day: 'numeric',
                              month: 'long',
                              hour: 'numeric',
                              minute: '2-digit',
                            },
                      )}
                      {i.personas > 1 ? ` · ${i.personas} personas` : ''}
                    </span>
                  </span>
                  {INSCRIPCION[i.estado]}
                </li>
              ))}
            </ul>
          )}
        </Card>

        <div className="flex flex-col gap-4">
          <Card title="Mis grupos" as="section" tone="sunken">
            {grupos.length === 0 ? (
              <p className="text-ink-soft">
                Aún no pides unirte a un grupo.{' '}
                <Link href="/grupos" className="font-semibold text-brand-strong underline">
                  Buscar un grupo
                </Link>
              </p>
            ) : (
              <ul className="flex flex-col gap-2">
                {grupos.map((g) => (
                  <li
                    key={`${g.grupo_id}-${g.creado_en.toISOString()}`}
                    className="flex flex-wrap items-center justify-between gap-2"
                  >
                    {g.publico ? (
                      <Link
                        href={`/grupos/${g.grupo_id}`}
                        className="font-semibold text-brand-strong hover:underline"
                      >
                        {g.grupo}
                      </Link>
                    ) : (
                      <span className="font-semibold">{g.grupo}</span>
                    )}
                    <Tag>{solicitudLabel.get(g.estado) ?? g.estado}</Tag>
                  </li>
                ))}
              </ul>
            )}
          </Card>
          <Card title="Donde sirvo" as="section" tone="sunken">
            {servicio.length === 0 ? (
              <p className="text-ink-soft">
                ¿Quieres servir?{' '}
                <Link href="/servir" className="font-semibold text-brand-strong underline">
                  Mira las áreas
                </Link>
              </p>
            ) : (
              <ul className="flex flex-col gap-2">
                {servicio.map((s) => (
                  <li
                    key={`${s.area}-${s.creado_en.toISOString()}`}
                    className="flex flex-wrap items-center justify-between gap-2"
                  >
                    <span className="font-semibold">{s.area}</span>
                    <Tag>{voluntarioLabel.get(s.estado) ?? s.estado}</Tag>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
