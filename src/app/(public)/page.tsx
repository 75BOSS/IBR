import { getSiteConfig } from '@/lib/config';

export const revalidate = 300;

export default async function HomePage() {
  const config = await getSiteConfig();
  return (
    <section className="container-page py-[clamp(3rem,10vw,7rem)]">
      <p className="text-sm font-semibold tracking-widest text-accent uppercase">
        {config.nombre_iglesia}
      </p>
      <h1 className="mt-3 max-w-3xl text-display font-semibold text-brand-strong">
        {config.home_hero_titulo}
      </h1>
      <p className="mt-4 max-w-prose text-lg text-ink-soft">
        Estamos preparando el nuevo sitio. Muy pronto encontrarás aquí horarios, grupos y prédicas.
      </p>
    </section>
  );
}
