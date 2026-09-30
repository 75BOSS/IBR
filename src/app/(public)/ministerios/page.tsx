import Image from 'next/image';
import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { PageHeader } from '@/components/PageHeader';
import { edadText, listMinisterios, ministerioName } from '@/lib/ministerios';
import { pageMetadata } from '@/lib/seo';

export const revalidate = 300;

export const metadata = pageMetadata({
  title: 'Ministerios',
  description:
    'Un lugar para cada edad en la Iglesia Bíblica Riobamba: niños, adolescentes, jóvenes, adultos y adultos mayores.',
  path: '/ministerios',
});

export default async function MinisteriosPage() {
  const ministerios = await listMinisterios({ soloActivos: true });
  return (
    <div className="container-page flex flex-col gap-[clamp(1.5rem,4vw,3rem)] py-[clamp(2rem,6vw,4.5rem)]">
      <PageHeader
        eyebrow="Ministerios"
        title="Un lugar para cada edad"
        intro="Desde los más pequeños hasta los abuelos: cada ministerio tiene sus reuniones y grupos para crecer junto a otros de su edad."
      />
      <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        {ministerios.map((m, i) => {
          const edad = edadText(m);
          return (
            <li key={m.id} className={i < 2 ? 'lg:col-span-3' : 'lg:col-span-2'}>
              <Link
                href={`/ministerios/${m.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl bg-surface ring-1 ring-line/70 transition-shadow hover:shadow-card"
                style={{ borderTop: `6px solid ${m.color ?? 'var(--color-brand)'}` }}
              >
                {m.imagen_url && (
                  <span className="relative block aspect-[16/9] bg-sunken">
                    <Image
                      src={m.imagen_url}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 50vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </span>
                )}
                <span className="flex flex-1 flex-col gap-1.5 p-[clamp(1rem,3vw,1.5rem)]">
                  <span className="font-display text-h3 font-semibold text-ink group-hover:text-brand-strong group-hover:underline">
                    {ministerioName(m)}
                  </span>
                  <span className="text-sm font-semibold text-accent-strong">
                    {[m.nombre_ministerio ? m.nombre : null, edad].filter(Boolean).join(' · ')}
                  </span>
                  {m.descripcion && (
                    <span className="line-clamp-3 text-ink-soft">{m.descripcion}</span>
                  )}
                  <span className="mt-auto flex flex-wrap gap-x-4 gap-y-1 pt-3 text-sm text-ink-soft">
                    {m.reuniones > 0 && (
                      <span className="inline-flex items-center gap-1.5">
                        <Icon name="clock" className="size-4" />
                        {m.reuniones} {m.reuniones === 1 ? 'reunión' : 'reuniones'}
                      </span>
                    )}
                    {m.grupos > 0 && (
                      <span className="inline-flex items-center gap-1.5">
                        <Icon name="users" className="size-4" />
                        {m.grupos} {m.grupos === 1 ? 'grupo' : 'grupos'}
                      </span>
                    )}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
