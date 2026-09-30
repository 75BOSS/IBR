import type { Metadata } from 'next';
import { PageHeader } from '@/components/PageHeader';
import { requireAdmin } from '@/lib/auth';
import { isCloudinaryConfigured } from '@/lib/cloudinary';
import { loadSiteConfigFromDb } from '@/lib/config';
import { CONFIG_SECTIONS } from '@/lib/config-fields';
import { ConfigSectionForm } from './ConfigSectionForm';

export const metadata: Metadata = { title: 'Configuración' };

export default async function ConfigPage() {
  await requireAdmin({ role: 'admin' });
  const config = await loadSiteConfigFromDb();
  const uploadsEnabled = isCloudinaryConfigured();

  return (
    <div className="flex flex-col gap-6 container-panel">
      <PageHeader
        eyebrow="Panel"
        title="Configuración del sitio"
        intro="Datos que aparecen en todo el sitio. Cada sección se guarda por separado y el sitio se actualiza al instante."
      />
      <div className="grid max-w-4xl gap-6">
        {CONFIG_SECTIONS.map((section) => (
          <ConfigSectionForm
            key={section.group}
            section={section}
            config={config}
            uploadsEnabled={uploadsEnabled}
          />
        ))}
      </div>
    </div>
  );
}
