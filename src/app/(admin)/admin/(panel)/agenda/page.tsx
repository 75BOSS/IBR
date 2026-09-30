import type { Metadata } from 'next';
import { deleteSuscriptor, reintentarEnvio } from '@/actions/agenda';
import { Card } from '@/components/Card';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { type Column, DataTable } from '@/components/DataTable';
import { PageHeader } from '@/components/PageHeader';
import { Tag } from '@/components/Tag';
import { type Suscriptor, buildAgendaText, listEnvios, listSuscriptores } from '@/lib/agenda';
import { requireAdmin } from '@/lib/auth';
import { getSiteConfig } from '@/lib/config';
import { formatDateTime } from '@/lib/dates';
import { EnvioForm } from './EnvioForm';

export const metadata: Metadata = { title: 'Agenda semanal' };

export default async function AgendaAdminPage() {
  const admin = await requireAdmin();
  const [subs, envios, preview, config] = await Promise.all([
    listSuscriptores(),
    listEnvios(),
    buildAgendaText(null),
    getSiteConfig(),
  ]);
  const activos = subs.filter((s) => s.activo).length;
  const pendientes = subs.filter((s) => !s.activo && !s.baja_en).length;
  const bajas = subs.filter((s) => s.baja_en).length;

  const columns: Column<Suscriptor>[] = [
    {
      key: 'email',
      header: 'Correo',
      primary: true,
      cell: (s) => (
        <span className="flex min-w-0 flex-col">
          <span className="font-semibold break-all">{s.email}</span>
          {s.nombre && <span className="text-sm text-ink-soft">{s.nombre}</span>}
        </span>
      ),
    },
    {
      key: 'estado',
      header: 'Estado',
      className: 'md:w-36',
      cell: (s) =>
        s.activo ? (
          <Tag tone="success">Suscrito</Tag>
        ) : s.baja_en ? (
          <Tag>Dado de baja</Tag>
        ) : (
          <Tag tone="warning">Sin confirmar</Tag>
        ),
    },
    {
      key: 'desde',
      header: 'Desde',
      className: 'md:w-36',
      cell: (s) => formatDateTime(s.confirmado_en ?? s.creado_en, { dateStyle: 'medium' }),
    },
    {
      key: 'acciones',
      header: 'Acciones',
      hideLabelOnMobile: true,
      className: 'md:w-40',
      cell: (s) =>
        admin.rol === 'admin' && (
          <ConfirmDialog
            action={deleteSuscriptor}
            fields={{ id: String(s.id) }}
            title={`¿Borrar ${s.email}?`}
            description="Úsalo cuando la persona pida que borremos su correo. Se elimina por completo."
            triggerLabel="Borrar"
          />
        ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 container-panel">
      <PageHeader
        eyebrow="Panel"
        title="Agenda semanal"
        intro="Correo con los eventos de los próximos 7 días y las reuniones de la semana. Las personas se suscriben en /agenda y confirman desde su correo."
      />
      <div className="grid gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-start">
        <EnvioForm
          preview={preview}
          activos={activos}
          defaultAsunto={`Agenda de la semana · ${config.nombre_corto ?? 'IBR'}`}
        />
        <div className="flex flex-col gap-4">
          <Card tone="brand" emphasis="featured">
            <p className="font-display text-display leading-none font-semibold">{activos}</p>
            <p className="mt-1 text-surface/85">
              {activos === 1 ? 'persona recibe la agenda' : 'personas reciben la agenda'}
            </p>
            <p className="mt-3 text-sm text-surface/75">
              {pendientes} sin confirmar · {bajas} {bajas === 1 ? 'se dio' : 'se dieron'} de baja
            </p>
          </Card>
          <Card title="Últimos envíos" as="section" tone="sunken">
            {envios.length > 0 ? (
              <ul className="flex flex-col divide-y divide-line/60">
                {envios.map((e) => (
                  <li key={e.id} className="flex flex-col gap-0.5 py-2.5 first:pt-0 last:pb-0">
                    <span className="font-semibold">{e.asunto}</span>
                    <span className="text-sm text-ink-soft">
                      {formatDateTime(e.creado_en, { dateStyle: 'medium', timeStyle: 'short' })} ·{' '}
                      {e.enviados} enviados
                      {e.fallidos > 0 ? ` · ${e.fallidos} fallidos` : ''}
                      {e.enviado_por ? ` · por ${e.enviado_por}` : ''}
                    </span>
                    {e.fallidos > 0 && (
                      <span className="pt-1">
                        <ConfirmDialog
                          action={reintentarEnvio}
                          fields={{ id: String(e.id) }}
                          title="¿Reintentar este envío?"
                          description="Se envía el mismo correo solo a los suscriptores que todavía no lo recibieron. A quienes ya les llegó no se les repite."
                          triggerLabel="Reintentar con los que faltan"
                          triggerIcon="mail"
                          triggerVariant="secondary"
                          confirmLabel="Sí, reintentar"
                          pendingLabel="Enviando…"
                          tone="primary"
                        />
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-ink-soft">Todavía no se ha enviado ninguna agenda.</p>
            )}
          </Card>
        </div>
      </div>
      <DataTable
        caption="Suscriptores"
        columns={columns}
        rows={subs}
        rowKey={(s) => s.id}
        empty="Todavía nadie se suscribió. Comparte el enlace de /agenda en los anuncios."
      />
    </div>
  );
}
