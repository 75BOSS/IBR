import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { paragraphs } from '@/lib/text';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BackLink } from '@/components/BackLink';
import { buttonClasses } from '@/components/button-styles';
import { Card } from '@/components/Card';
import { DetailList } from '@/components/DetailList';
import { FormDialog } from '@/components/site/FormDialog';
import { FormPanel } from '@/components/site/FormPanel';
import { Icon } from '@/components/Icon';
import { PageHeader } from '@/components/PageHeader';
import { eventWhen } from '@/components/site/EventCard';
import { formatDateTime, todayInChurchTz } from '@/lib/dates';
import type { Evento } from '@/lib/eventos';
import { getEvento } from '@/lib/eventos';
import { siteUrl } from '@/lib/site';
import { cupoStatus } from '@/lib/cupo';
import { CupoCounter } from '@/components/site/CupoCounter';
import { InscripcionForm } from './InscripcionForm';

export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

/** « hasta …»: solo la hora si termina el mismo día (en Ecuador); si no, la fecha completa. */
function untilText(e: Evento): string {
  if (!e.fecha_fin) return '';
  const sameDay = todayInChurchTz(e.fecha_inicio) === todayInChurchTz(e.fecha_fin);
  if (sameDay)
    return e.todo_el_dia
      ? ''
      : ` hasta ${formatDateTime(e.fecha_fin, { hour: 'numeric', minute: '2-digit' })}`;
  return ` hasta el ${formatDateTime(
    e.fecha_fin,
    e.todo_el_dia
      ? { weekday: 'long', day: 'numeric', month: 'long' }
      : { weekday: 'long', day: 'numeric', month: 'long', hour: 'numeric', minute: '2-digit' },
  )}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const event = await getEvento({ slug: (await params).slug, soloPublicado: true });
  if (!event) return { title: 'Evento no encontrado' };
  const description = event.resumen ?? `${eventWhen(event)} · Iglesia Bíblica Riobamba`;
  return pageMetadata({
    title: event.titulo,
    description,
    path: `/eventos/${event.slug}`,
    image: event.imagen_url,
    type: 'article',
  });
}

export default async function EventoPage({ params }: Props) {
  const event = await getEvento({ slug: (await params).slug, soloPublicado: true });
  if (!event) notFound();
  const url = `${siteUrl()}/eventos/${event.slug}`;
  const share = `https://wa.me/?text=${encodeURIComponent(`${event.titulo} — ${url}`)}`;
  const body = paragraphs(event.cuerpo);
  const cupo = event.requiere_inscripcion ? cupoStatus(event) : null;

  return (
    <article className="container-page page-flow">
      <BackLink href="/eventos">Todos los eventos</BackLink>
      <PageHeader
        size="display"
        eyebrow={eventWhen(event)}
        title={event.titulo}
        intro={event.resumen}
      />
      <div className="grid gap-[clamp(1.25rem,3vw,2rem)] lg:grid-cols-main-aside">
        <div className="flex flex-col gap-5">
          {event.imagen_url && (
            <div className="relative aspect-[1200/630] overflow-hidden rounded-2xl bg-sunken">
              <Image
                src={event.imagen_url}
                alt=""
                fill
                priority
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="object-cover"
              />
            </div>
          )}
          <div className="flex max-w-prose flex-col gap-4 text-lg leading-relaxed text-ink">
            {body.map((p, i) => (
              <p key={i} className="whitespace-pre-line">
                {p}
              </p>
            ))}
          </div>
        </div>
        <Card title="Detalles" tone="sunken" as="aside">
          <DetailList
            items={[
              {
                label: 'Cuándo',
                value: (
                  <span className="block first-letter:uppercase">
                    {eventWhen(event)}
                    {untilText(event)}
                  </span>
                ),
              },
              event.ubicacion && {
                label: 'Dónde',
                value: (
                  <>
                    {event.ubicacion}
                    {event.ubicacion_direccion && (
                      <span className="block text-ink-soft">{event.ubicacion_direccion}</span>
                    )}
                  </>
                ),
              },
              event.rango_edad && { label: 'Para', value: event.rango_edad },
            ]}
          />
          <div className="mt-5 flex flex-col gap-2">
            {/* Atajo solo en escritorio, donde el texto del evento puede dejar la inscripción
                lejos; en celular y tablet el panel de inscripción viene justo debajo. */}
            {cupo?.abierto && (
              <a
                href="#inscripcion"
                className={buttonClasses({
                  variant: 'accent',
                  block: true,
                  className: 'max-lg:hidden',
                })}
              >
                Inscribirme
              </a>
            )}
            {event.link_externo && (
              <a
                href={event.link_externo}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClasses({
                  variant: cupo?.abierto ? 'secondary' : 'accent',
                  block: true,
                })}
              >
                Más información
                <span className="sr-only"> (se abre en una pestaña nueva)</span>
              </a>
            )}
            <a
              href={share}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClasses({ variant: 'whatsapp', block: true })}
            >
              <Icon name="whatsapp" className="size-5" /> Compartir por WhatsApp
              <span className="sr-only"> (se abre en una pestaña nueva)</span>
            </a>
          </div>
        </Card>
      </div>
      {cupo && (
        <FormPanel
          titleId="inscripcion-titulo"
          eyebrow="Inscripción"
          title={
            cupo.abierto ? (
              <>
                Reserva <em>tu lugar</em>
              </>
            ) : (
              <>
                Inscripciones <em>cerradas</em>
              </>
            )
          }
          text={
            cupo.abierto ? (
              'Déjanos tus datos y recibirás un código para ver o cancelar tu inscripción.'
            ) : (
              <>
                {cupo.motivo}{' '}
                <Link href="/contacto#mensaje" className="link">
                  Escríbenos
                </Link>{' '}
                si tienes una pregunta.
              </>
            )
          }
          aside={
            <CupoCounter
              key={`${cupo.inscritos}-${cupo.abierto}`}
              eventoId={event.id}
              initial={cupo}
            />
          }
        >
          {/* Siempre montado: el formulario conserva su éxito aunque el cupo se cierre con ese
              envío; solo el botón desaparece cuando ya no hay lugar. */}
          <FormDialog
            id="inscripcion"
            eyebrow={event.titulo}
            title={
              <>
                Reserva <em>tu lugar</em>
              </>
            }
            triggerLabel="Inscribirme"
            triggerVariant="primary"
            showTrigger={cupo.abierto}
          >
            <InscripcionForm
              eventoId={event.id}
              closedReason={
                cupo.abierto ? null : (cupo.motivo ?? 'Las inscripciones están cerradas.')
              }
            />
          </FormDialog>
        </FormPanel>
      )}
    </article>
  );
}
