import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cancelarInscripcion } from '@/actions/inscripciones';
import { Card } from '@/components/Card';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { Icon } from '@/components/Icon';
import { PageHeader } from '@/components/PageHeader';
import { Tag } from '@/components/Tag';
import { formatDateTime } from '@/lib/dates';
import { normalizeCode } from '@/lib/inscripcion-code';
import { getInscripcionByCode } from '@/lib/inscripciones';
import { qrSvg } from '@/lib/qr';
import { siteUrl } from '@/lib/site';

export const dynamic = 'force-dynamic';

// Página personal (el código funciona como llave): no se indexa ni se comparte.
export const metadata: Metadata = {
  title: 'Mi inscripción',
  robots: { index: false, follow: false },
};

const ESTADO = {
  confirmada: { label: 'Confirmada', tone: 'success' },
  asistio: { label: 'Asististe', tone: 'brand' },
  cancelada: { label: 'Cancelada', tone: 'danger' },
} as const;

export default async function InscripcionPage({ params }: { params: Promise<{ codigo: string }> }) {
  const codigo = normalizeCode((await params).codigo);
  const insc = codigo ? await getInscripcionByCode(codigo) : null;
  if (!insc) notFound();
  const started = insc.fecha_inicio.getTime() <= Date.now();
  const estado = ESTADO[insc.estado];
  const qr =
    insc.estado === 'confirmada' ? await qrSvg(`${siteUrl()}/inscripcion/${insc.codigo}`) : null;

  return (
    <div className="container-page page-flow">
      <PageHeader size="display" eyebrow="Mi inscripción" title={insc.evento_titulo} />
      <Card emphasis="featured" className="max-w-2xl">
        <dl className="grid gap-x-6 gap-y-3 xs:grid-cols-[auto_1fr]">
          <dt className="text-ink-soft">Estado</dt>
          <dd>
            <Tag tone={estado.tone}>{estado.label}</Tag>
          </dd>
          <dt className="text-ink-soft">A nombre de</dt>
          <dd className="font-semibold">{insc.nombre}</dd>
          <dt className="text-ink-soft">Personas</dt>
          <dd className="font-semibold">{insc.personas}</dd>
          <dt className="text-ink-soft">Cuándo</dt>
          <dd className="font-semibold first-letter:uppercase">
            {formatDateTime(
              insc.fecha_inicio,
              insc.todo_el_dia
                ? { weekday: 'long', day: 'numeric', month: 'long' }
                : {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    hour: 'numeric',
                    minute: '2-digit',
                  },
            )}
          </dd>
          {insc.ubicacion && (
            <>
              <dt className="text-ink-soft">Dónde</dt>
              <dd className="font-semibold">{insc.ubicacion}</dd>
            </>
          )}
          <dt className="text-ink-soft">Código</dt>
          <dd className="font-mono text-lg font-semibold tracking-widest">{insc.codigo}</dd>
        </dl>
        {qr && (
          <div className="mt-6 flex flex-col items-center gap-2 rounded-2xl bg-sunken p-4 text-center">
            <div
              className="size-[clamp(11rem,55vw,14rem)] [&_svg]:size-full"
              role="img"
              aria-label={`Código QR de tu inscripción ${insc.codigo}`}
              // SVG generado en el servidor por la librería qrcode a partir del código (no hay texto del usuario).
              dangerouslySetInnerHTML={{ __html: qr }}
            />
            <p className="text-sm text-ink-soft">
              Muéstralo en la entrada para registrar tu llegada. También sirve decir tu código.
            </p>
          </div>
        )}
        <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-line/60 pt-4 empty:hidden">
          {insc.evento_publicado && (
            <Link
              href={`/eventos/${insc.evento_slug}`}
              className="inline-flex items-center gap-1.5 link-quiet"
            >
              Ver el evento <Icon name="arrowRight" className="size-4" />
            </Link>
          )}
          {insc.estado === 'confirmada' && !started && (
            <ConfirmDialog
              action={cancelarInscripcion}
              fields={{ codigo: insc.codigo }}
              title="¿Cancelar tu inscripción?"
              description="Tu lugar queda libre para otra persona. Si luego quieres ir, tendrás que inscribirte de nuevo (si todavía hay cupo)."
              triggerLabel="Cancelar mi inscripción"
              triggerIcon="close"
              confirmLabel="Sí, cancelar"
              pendingLabel="Cancelando…"
            />
          )}
        </div>
      </Card>
    </div>
  );
}
