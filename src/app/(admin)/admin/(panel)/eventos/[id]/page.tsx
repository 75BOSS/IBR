import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Icon } from '@/components/Icon';
import { PageHeader } from '@/components/PageHeader';
import { requireAdmin } from '@/lib/auth';
import { rangoOptions, ubicacionOptions } from '@/lib/catalogs';
import { isCloudinaryConfigured } from '@/lib/cloudinary';
import { getEvento } from '@/lib/eventos';
import { id as idSchema } from '@/lib/validators/common';
import { EventoForm } from '../EventoForm';

export const metadata: Metadata = { title: 'Editar evento' };

export default async function EditarEventoPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const parsed = idSchema.safeParse((await params).id);
  if (!parsed.success) notFound();
  const [event, ubicaciones, rangos] = await Promise.all([
    getEvento({ id: parsed.data }),
    ubicacionOptions(),
    rangoOptions(),
  ]);
  if (!event) notFound();
  return (
    <div className="flex flex-col gap-6 container-panel">
      <PageHeader
        eyebrow="Eventos"
        title={`Editar: ${event.titulo}`}
        intro={
          event.publicado ? (
            <Link
              href={`/eventos/${event.slug}`}
              className="inline-flex items-center gap-1.5 font-semibold text-brand-strong underline"
            >
              Ver en el sitio <Icon name="external" className="size-4" />
            </Link>
          ) : (
            'Borrador: aún no se ve en el sitio.'
          )
        }
      />
      <EventoForm
        event={event}
        ubicaciones={ubicaciones}
        rangos={rangos}
        uploadsEnabled={isCloudinaryConfigured()}
      />
    </div>
  );
}
