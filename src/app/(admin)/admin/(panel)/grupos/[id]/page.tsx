import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/PageHeader';
import { requireAdmin } from '@/lib/auth';
import { rangoOptions, ubicacionOptions } from '@/lib/catalogs';
import { isCloudinaryConfigured } from '@/lib/cloudinary';
import { FRECUENCIAS, getGrupo } from '@/lib/grupos';
import { id as idSchema } from '@/lib/validators/common';
import { GrupoForm } from '../GrupoForm';

export const metadata: Metadata = { title: 'Editar grupo' };

export default async function EditarGrupoPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const parsed = idSchema.safeParse((await params).id);
  if (!parsed.success) notFound();
  const [group, ubicaciones, rangos] = await Promise.all([
    getGrupo(parsed.data),
    ubicacionOptions(),
    rangoOptions(),
  ]);
  if (!group) notFound();
  return (
    <div className="flex flex-col gap-6 container-panel">
      <PageHeader eyebrow="Grupos" title={`Editar: ${group.nombre}`} />
      <GrupoForm
        group={group}
        ubicaciones={ubicaciones}
        rangos={rangos}
        frecuencias={FRECUENCIAS}
        uploadsEnabled={isCloudinaryConfigured()}
      />
    </div>
  );
}
