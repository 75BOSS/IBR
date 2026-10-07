import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Card } from '@/components/Card';
import { Icon } from '@/components/Icon';
import { PageHeader } from '@/components/PageHeader';
import { Tag } from '@/components/Tag';
import { groupWhen } from '@/components/site/GroupCard';
import { getGrupoPublico } from '@/lib/grupos';
import { JoinGroupForm } from './JoinGroupForm';

export const revalidate = 300;

type Props = { params: Promise<{ id: string }> };

async function load(params: Props['params']) {
  const id = Number((await params).id);
  return Number.isInteger(id) && id > 0 ? getGrupoPublico(id) : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const group = await load(params);
  if (!group) return { title: 'Grupo no encontrado' };
  const description =
    group.descripcion?.slice(0, 160) ??
    `${groupWhen(group)}${group.zona ? ` · ${group.zona}` : ''}`;
  return pageMetadata({
    title: group.nombre,
    description,
    path: `/grupos/${group.id}`,
    image: group.imagen_url,
  });
}

export default async function GrupoPage({ params }: Props) {
  const group = await load(params);
  if (!group) notFound();
  return (
    <div className="container-page flex flex-col gap-[clamp(1.25rem,3vw,2rem)] py-[clamp(2rem,6vw,4.5rem)]">
      <Link
        href="/grupos"
        className="inline-flex items-center gap-1 self-start font-semibold text-brand-strong hover:underline"
      >
        <Icon name="chevronLeft" className="size-4" /> Todos los grupos
      </Link>
      <PageHeader size="display" eyebrow={group.rango_edad ?? 'Grupo'} title={group.nombre} />
      <div className="grid gap-[clamp(1.25rem,3vw,2rem)] lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div className="flex flex-col gap-5">
          {group.imagen_url && (
            <div className="relative aspect-video overflow-hidden rounded-2xl bg-sunken">
              <Image
                src={group.imagen_url}
                alt=""
                fill
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="object-cover"
              />
            </div>
          )}
          {group.descripcion && (
            <p className="max-w-prose text-lg leading-relaxed whitespace-pre-line">
              {group.descripcion}
            </p>
          )}
          <Card tone="sunken">
            <dl className="grid gap-4 md:grid-cols-2">
              <div>
                <dt className="text-sm font-semibold text-ink-soft">Cuándo</dt>
                <dd>{groupWhen(group)}</dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-ink-soft">Dónde</dt>
                <dd>
                  {group.zona ?? group.ubicacion ?? 'Por confirmar'}
                  {group.direccion ? (
                    <span className="block text-ink-soft">{group.direccion}</span>
                  ) : (
                    group.ubicacion_tipo === 'casa' && (
                      <span className="block text-sm text-ink-soft">
                        Es en una casa: te damos la dirección al unirte.
                      </span>
                    )
                  )}
                </dd>
              </div>
              {group.lider_nombre && (
                <div>
                  <dt className="text-sm font-semibold text-ink-soft">Líder</dt>
                  <dd>{group.lider_nombre}</dd>
                </div>
              )}
              {group.tipo && (
                <div>
                  <dt className="text-sm font-semibold text-ink-soft">Tipo</dt>
                  <dd>
                    <Tag tone="brand">{group.tipo}</Tag>
                  </dd>
                </div>
              )}
            </dl>
          </Card>
        </div>
        <Card title="Quiero unirme" as="section" emphasis="featured">
          <JoinGroupForm groupId={group.id} leader={group.lider_nombre} />
        </Card>
      </div>
    </div>
  );
}
