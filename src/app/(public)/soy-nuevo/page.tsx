import Link from 'next/link';
import { Card } from '@/components/Card';
import { Icon, type IconName } from '@/components/Icon';
import { PageHeader } from '@/components/PageHeader';
import { rangoOptions } from '@/lib/catalogs';
import { query } from '@/lib/db';
import { SoyNuevoForm } from './SoyNuevoForm';
import { pageMetadata } from '@/lib/seo';

export const revalidate = 300;

export const metadata = pageMetadata({
  title: 'Soy nuevo',
  description:
    '¿Es tu primera vez en la Iglesia Bíblica Riobamba? Te contamos qué esperar y cómo conectar.',
  path: '/soy-nuevo',
});

const EXPECT: { icon: IconName; title: string; text: string }[] = [
  {
    icon: 'handHeart',
    title: 'Te recibimos',
    text: 'Alguien del equipo te dará la bienvenida en la puerta. Ven tal como eres.',
  },
  {
    icon: 'clock',
    title: 'Cerca de dos horas',
    text: 'Cantamos, oramos y escuchamos una prédica de la Biblia aplicada a la vida diaria.',
  },
  {
    icon: 'users',
    title: 'Hay lugar para tu familia',
    text: 'Los niños tienen su propio espacio con maestros mientras los adultos están en el culto.',
  },
];

export default async function SoyNuevoPage() {
  const [rangos, ministerios] = await Promise.all([
    rangoOptions(),
    query<{
      id: number;
      nombre: string;
      nombre_ministerio: string | null;
      descripcion: string | null;
      color: string | null;
      edad_min: number | null;
      edad_max: number | null;
    }>(
      'SELECT id, nombre, nombre_ministerio, descripcion, color, edad_min, edad_max FROM rangos_edad WHERE activo = 1 ORDER BY orden',
    ),
  ]);
  return (
    <div className="container-page flex flex-col gap-[clamp(1.5rem,4vw,3rem)] py-[clamp(2rem,6vw,4.5rem)]">
      <PageHeader
        eyebrow="Bienvenido"
        title="¿Es tu primera vez?"
        intro="Nos alegra que estés aquí. Esto es lo que puedes esperar, y abajo puedes dejarnos tus datos para acompañarte."
      />

      <section
        aria-labelledby="que-esperar"
        className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]"
      >
        <h2 id="que-esperar" className="sr-only">
          Qué esperar
        </h2>
        <Card tone="brand" emphasis="featured">
          <p className="font-display text-h2 leading-snug font-semibold">
            «Nadie tiene mayor amor que este, que uno ponga su vida por sus amigos.»
          </p>
          <p className="mt-3 text-surface/80">Juan 15:13</p>
          <Link
            href="/reuniones"
            className="mt-6 inline-flex items-center gap-1.5 font-semibold underline decoration-accent-soft underline-offset-4"
          >
            Ver horarios y cómo llegar <Icon name="arrowRight" className="size-4" />
          </Link>
        </Card>
        <ul className="flex flex-col gap-3">
          {EXPECT.map((item) => (
            <li
              key={item.title}
              className="flex gap-4 rounded-2xl bg-surface p-4 ring-1 ring-line/70"
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent-strong">
                <Icon name={item.icon} />
              </span>
              <span>
                <span className="block font-semibold text-ink">{item.title}</span>
                <span className="text-ink-soft">{item.text}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {ministerios.length > 0 && (
        <section aria-labelledby="ministerios" className="flex flex-col gap-4">
          <h2 id="ministerios" className="text-h2 font-semibold text-ink">
            Un lugar para cada edad
          </h2>
          <ul className="grid gap-3 xs:grid-cols-2 lg:grid-cols-5">
            {ministerios.map((m) => (
              <li key={m.id}>
                <Link
                  href={`/grupos?edad=${m.id}`}
                  className="flex h-full flex-col gap-1 rounded-2xl border-t-4 bg-surface p-4 ring-1 ring-line/70 hover:shadow-card"
                  style={{ borderTopColor: m.color ?? 'var(--color-brand)' }}
                >
                  <span className="font-display text-h3 font-semibold text-ink">
                    {m.nombre_ministerio ?? m.nombre}
                  </span>
                  <span className="text-sm text-ink-soft">
                    {m.edad_min !== null
                      ? `${m.edad_min}${m.edad_max !== null ? `–${m.edad_max}` : '+'} años`
                      : ''}
                  </span>
                  {m.descripcion && <span className="text-sm text-ink-soft">{m.descripcion}</span>}
                  <span className="mt-auto pt-2 text-sm font-semibold text-brand-strong">
                    Ver grupos →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section
        aria-labelledby="dejanos-tus-datos"
        className="grid gap-[clamp(1.25rem,3vw,2rem)] lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]"
      >
        <div>
          <h2 id="dejanos-tus-datos" className="text-h2 font-semibold text-ink">
            Queremos conocerte
          </h2>
          <p className="mt-2 max-w-prose text-ink-soft">
            Déjanos tus datos y alguien de la iglesia te escribirá para darte la bienvenida,
            resolver tus dudas y ayudarte a encontrar un grupo. No te enviaremos publicidad.
          </p>
        </div>
        <Card emphasis="featured">
          <SoyNuevoForm rangos={rangos} />
        </Card>
      </section>
    </div>
  );
}
