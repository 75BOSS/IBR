import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/PageHeader';
import { requireAdmin } from '@/lib/auth';
import { isCloudinaryConfigured } from '@/lib/cloudinary';
import { listEquipo } from '@/lib/equipo';
import { getArea } from '@/lib/servir';
import { id as idSchema } from '@/lib/validators/common';
import { AreaForm } from '../AreaForm';

export const metadata: Metadata = { title: 'Editar área de servicio' };

export default async function EditarAreaPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const parsed = idSchema.safeParse((await params).id);
  if (!parsed.success) notFound();
  const [area, equipo] = await Promise.all([getArea(parsed.data), listEquipo()]);
  if (!area) notFound();
  return (
    <div className="container-panel">
      <PageHeader eyebrow="Servir" title={`Editar: ${area.nombre}`} />
      <AreaForm
        area={area}
        equipo={equipo.map((p) => ({ value: String(p.id), label: `${p.nombre} · ${p.rol}` }))}
        uploadsEnabled={isCloudinaryConfigured()}
      />
    </div>
  );
}
