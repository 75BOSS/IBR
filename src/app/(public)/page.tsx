import { PageHeader } from '@/components/PageHeader';
import { getSiteConfig } from '@/lib/config';

export const revalidate = 300;

export default async function HomePage() {
  const config = await getSiteConfig();
  return (
    <section className="container-page py-[clamp(3rem,10vw,7rem)]">
      <PageHeader
        size="display"
        eyebrow={config.nombre_iglesia}
        title={config.home_hero_titulo}
        intro="Estamos preparando el nuevo sitio. Muy pronto encontrarás aquí horarios, grupos y prédicas."
      />
    </section>
  );
}
