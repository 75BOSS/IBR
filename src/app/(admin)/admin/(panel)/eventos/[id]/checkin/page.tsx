import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Icon } from '@/components/Icon';
import { PageHeader } from '@/components/PageHeader';
import { eventWhen } from '@/components/site/EventCard';
import { requireAdmin } from '@/lib/auth';
import { getCheckinStats } from '@/lib/checkin';
import { getEvento } from '@/lib/eventos';
import { id as idSchema } from '@/lib/validators/common';
import { CheckinBoard } from './CheckinBoard';

export const metadata: Metadata = { title: 'Check-in' };

export default async function CheckinPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const parsed = idSchema.safeParse((await params).id);
  if (!parsed.success) notFound();
  const [event, stats] = await Promise.all([
    getEvento({ id: parsed.data }),
    getCheckinStats(parsed.data),
  ]);
  if (!event) notFound();
  return (
    <div className="flex flex-col gap-6 container-panel">
      <Link
        href={`/admin/eventos/${event.id}/inscritos`}
        className="inline-flex items-center gap-1 self-start font-semibold text-brand-strong hover:underline"
      >
        <Icon name="chevronLeft" className="size-4" /> Inscritos
      </Link>
      <PageHeader eyebrow={`Check-in · ${eventWhen(event)}`} title={event.titulo} />
      <CheckinBoard eventoId={event.id} initial={stats} />
    </div>
  );
}
