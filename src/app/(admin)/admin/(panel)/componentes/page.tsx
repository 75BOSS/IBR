import type { Metadata } from 'next';
import { confirmDemo } from '@/actions/demo';
import { Button, ButtonLink } from '@/components/Button';
import { Card } from '@/components/Card';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { Field } from '@/components/Field';
import { Icon } from '@/components/Icon';
import { MapEmbed } from '@/components/MapEmbed';
import { Tag } from '@/components/Tag';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { YouTubeEmbed } from '@/components/YouTubeEmbed';
import { requireAdmin } from '@/lib/auth';
import { ToastDemo } from './Demos';

export const metadata: Metadata = { title: 'Componentes' };

/**
 * Catálogo de componentes base (referencia de diseño para Pixelia). No aparece en el menú.
 * Todo lo nuevo del sitio y del panel se arma con estas piezas.
 */
export default async function ComponentsPage() {
  await requireAdmin();
  return (
    <div className="flex flex-col gap-[clamp(1.25rem,3vw,2rem)] px-[clamp(1rem,4vw,2.5rem)] py-[clamp(1.5rem,5vw,3rem)]">
      <header>
        <p className="text-sm font-semibold tracking-widest text-accent uppercase">Guía</p>
        <h1 className="mt-2 text-h1 font-semibold text-brand-strong">Componentes base</h1>
        <p className="mt-2 max-w-prose text-ink-soft">
          Un componente por concepto. Si algo no encaja, se extiende el componente con una opción
          nueva; no se estiliza a mano en la página.
        </p>
      </header>

      <Card title="Botones" actions={<Tag tone="brand">Button · ButtonLink</Tag>}>
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            <Button>Primario</Button>
            <Button variant="accent">Acento</Button>
            <Button variant="secondary">Secundario</Button>
            <Button variant="ghost">Fantasma</Button>
            <Button variant="danger">Peligro</Button>
            <Button variant="dangerGhost" icon={<Icon name="trash" className="size-4" />}>
              Eliminar
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm">Pequeño</Button>
            <Button>Mediano</Button>
            <Button size="lg">Grande</Button>
            <Button pending pendingLabel="Guardando…">
              Guardar
            </Button>
            <Button disabled>Deshabilitado</Button>
            <ButtonLink
              href="/admin"
              variant="secondary"
              icon={<Icon name="arrowRight" className="size-4" />}
            >
              Enlace con forma de botón
            </ButtonLink>
          </div>
          <div className="flex flex-wrap gap-2 rounded-xl bg-sidebar p-3">
            <Button variant="inverse" icon={<Icon name="logOut" className="size-4" />}>
              Inverso (sobre fondo oscuro)
            </Button>
            <Tag tone="inverse">Pronto</Tag>
          </div>
        </div>
      </Card>

      <div className="grid gap-[clamp(1.25rem,3vw,2rem)] lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <Card title="Campos" actions={<Tag tone="brand">Field</Tag>}>
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Nombres" name="demo-nombres" placeholder="ej. María José" required />
            <Field
              label="Teléfono"
              name="demo-telefono"
              type="tel"
              inputMode="tel"
              defaultValue="09912"
              error="El teléfono debe tener 10 dígitos, ej. 0991234567."
              required
            />
            <Field
              as="select"
              label="Rango de edad"
              name="demo-rango"
              emptyOption="Elige una opción"
              options={[
                { value: 'jovenes', label: 'Jóvenes (18–30)' },
                { value: 'adultos', label: 'Adultos (31–64)' },
              ]}
              hint="Nos ayuda a sugerirte un grupo."
            />
            <Field label="Correo" name="demo-correo" type="email" hint="Solo para confirmarte." />
            <Field
              as="textarea"
              label="Petición de oración"
              name="demo-peticion"
              className="md:col-span-2"
              hint="Solo la leen los pastores."
            />
          </div>
        </Card>

        <div className="flex flex-col gap-[clamp(1.25rem,3vw,2rem)]">
          <Card title="Etiquetas" actions={<Tag tone="brand">Tag</Tag>}>
            <div className="flex flex-wrap gap-2">
              <Tag>Neutral</Tag>
              <Tag tone="brand">Nuevo</Tag>
              <Tag tone="accent">Destacado</Tag>
              <Tag tone="success">Integrado</Tag>
              <Tag tone="warning">Pendiente</Tag>
              <Tag tone="danger">Sin respuesta</Tag>
              <Tag color="#0E5E6F">Jóvenes</Tag>
              <Tag color="#C8702A">Kids</Tag>
            </div>
          </Card>
          <Card
            title="Avisos y confirmación"
            actions={<Tag tone="brand">Toast · ConfirmDialog</Tag>}
          >
            <div className="flex flex-col gap-4">
              <ToastDemo />
              <div className="flex flex-wrap gap-2">
                <ConfirmDialog
                  action={confirmDemo}
                  fields={{ id: '12' }}
                  title="¿Eliminar este evento?"
                  description="Se borrará «Retiro de jóvenes». Esta acción no se puede deshacer."
                  triggerLabel="Eliminar (éxito)"
                />
                <ConfirmDialog
                  action={confirmDemo}
                  fields={{ id: 'falla' }}
                  title="¿Eliminar este grupo?"
                  description="Se borrará el grupo y sus solicitudes pendientes."
                  triggerLabel="Eliminar (error)"
                />
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="grid gap-[clamp(1.25rem,3vw,2rem)] lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Card tone="brand" emphasis="featured">
          <p className="text-sm font-semibold tracking-widest text-accent-soft uppercase">
            Tarjeta destacada
          </p>
          <p className="mt-2 font-display text-h2 font-semibold">Culto dominical · 10:00</p>
          <p className="mt-2 text-surface/85">
            Una destacada y varias secundarias: nunca una grilla de tarjetas idénticas.
          </p>
        </Card>
        <div className="flex flex-col gap-3">
          <Card accentColor="#0E5E6F">
            <p className="font-semibold">Con franja de color</p>
            <p className="text-sm text-ink-soft">Color del ministerio (rangos_edad.color).</p>
          </Card>
          <Card tone="sunken">
            <p className="font-semibold">Tono hundido</p>
            <p className="text-sm text-ink-soft">Para información secundaria.</p>
          </Card>
        </div>
      </div>

      <div className="grid gap-[clamp(1.25rem,3vw,2rem)] lg:grid-cols-2">
        <Card title="Video" actions={<Tag tone="brand">YouTubeEmbed</Tag>}>
          <YouTubeEmbed videoId="M7lc1UVf-VE" title="Video de muestra de YouTube" />
        </Card>
        <Card title="Mapa y WhatsApp" actions={<Tag tone="brand">MapEmbed · WhatsAppButton</Tag>}>
          <div className="flex flex-col gap-4">
            <MapEmbed embedUrl={null} address="Riobamba, Ecuador" />
            <WhatsAppButton number="593990000000" message="Hola, quiero información." />
          </div>
        </Card>
      </div>
    </div>
  );
}
