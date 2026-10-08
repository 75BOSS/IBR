import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/PageHeader';
import { requireAdmin } from '@/lib/auth';
import { UBICACION_TIPOS } from '@/lib/catalogs';
import { queryOne } from '@/lib/db';
import { id as idSchema } from '@/lib/validators/common';
import { UbicacionForm, type UbicacionRow } from '../UbicacionForm';

export const metadata: Metadata = { title: 'Editar lugar' };

export default async function EditarUbicacionPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const parsed = idSchema.safeParse((await params).id);
  if (!parsed.success) notFound();
  const place = await queryOne<UbicacionRow>(
    'SELECT id, nombre, tipo, direccion, referencia, zona, maps_url, publica, activo FROM ubicaciones WHERE id = ?',
    [parsed.data],
  );
  if (!place) notFound();
  return (
    <div className="container-panel">
      <PageHeader eyebrow="Lugares" title={`Editar: ${place.nombre}`} />
      <UbicacionForm place={place} tipos={UBICACION_TIPOS} />
    </div>
  );
}
