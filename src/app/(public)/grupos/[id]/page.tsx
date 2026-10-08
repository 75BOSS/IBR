import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { BackLink } from '@/components/BackLink';
import { Card } from '@/components/Card';
import { DetailList } from '@/components/DetailList';
import { PageHeader } from '@/components/PageHeader';
import { FormDialog } from '@/components/site/FormDialog';
import { FormPanel } from '@/components/site/FormPanel';
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
    <div className="container-page page-flow">
      <BackLink href="/grupos">Todos los grupos</BackLink>
      <PageHeader size="display" eyebrow={group.rango_edad ?? 'Grupo'} title={group.nombre} />
      <div className="grid gap-[clamp(1.25rem,3vw,2rem)] lg:grid-cols-main-aside">
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
            <DetailList
              items={[
                { label: 'Cuándo', value: groupWhen(group) },
                {
                  label: 'Dónde',
                  value: (
                    <>
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
                    </>
                  ),
                },
                group.lider_nombre && { label: 'Líder', value: group.lider_nombre },
                group.tipo && { label: 'Tipo', value: <Tag tone="brand">{group.tipo}</Tag> },
              ]}
            />
          </Card>
        </div>
        <div className="lg:sticky lg:top-28 lg:self-start">
          <FormPanel
            titleId="quiero-unirme-titulo"
            eyebrow="Quiero unirme"
            title={
              <>
                Te <em>esperamos</em>
              </>
            }
            text={
              group.lider_nombre
                ? `Déjanos tu WhatsApp y ${group.lider_nombre} te escribirá para darte la dirección y contarte cómo es.`
                : 'Déjanos tu WhatsApp y el líder te escribirá para darte la dirección y contarte cómo es.'
            }
          >
            <FormDialog
              id="unirme"
              eyebrow={group.nombre}
              title={
                <>
                  Quiero <em>unirme</em>
                </>
              }
              triggerLabel="Quiero unirme"
              triggerIcon="users"
              triggerVariant="primary"
            >
              <JoinGroupForm groupId={group.id} leader={group.lider_nombre} />
            </FormDialog>
          </FormPanel>
        </div>
      </div>
    </div>
  );
}
