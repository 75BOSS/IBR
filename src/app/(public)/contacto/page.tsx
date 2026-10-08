import { Card } from '@/components/Card';
import { Icon } from '@/components/Icon';
import { MapEmbed } from '@/components/MapEmbed';
import { PageHeader } from '@/components/PageHeader';
import { FormDialog } from '@/components/site/FormDialog';
import { FormPanel } from '@/components/site/FormPanel';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { getSiteConfig } from '@/lib/config';
import { socialLinks } from '@/lib/nav';
import { formatPhoneEc } from '@/lib/whatsapp';
import { ContactoForm } from './ContactoForm';
import { pageMetadata } from '@/lib/seo';

export const revalidate = 300;

export const metadata = pageMetadata({
  title: 'Contacto',
  description:
    'Escríbenos por WhatsApp, correo o desde este formulario. También encuentras la dirección y el mapa del auditorio.',
  path: '/contacto',
});

export default async function ContactoPage() {
  const config = await getSiteConfig();
  const socials = socialLinks(config);
  return (
    <div className="container-page flex flex-col gap-[clamp(1.5rem,4vw,3rem)] py-[clamp(2rem,6vw,4.5rem)]">
      <PageHeader
        size="display"
        eyebrow="Contacto"
        title={
          <>
            <em>Conversemos</em>
          </>
        }
        intro="¿Tienes una pregunta, quieres visitarnos o necesitas hablar con un pastor? Escríbenos por donde prefieras."
      />
      <div className="grid gap-[clamp(1.25rem,3vw,2rem)] lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <FormPanel
          titleId="envianos-un-mensaje"
          eyebrow="Mensaje"
          title={
            <>
              Envíanos un <em>mensaje</em>
            </>
          }
          text="Te respondemos al correo o al WhatsApp que nos dejes, normalmente en uno o dos días."
          stacked
        >
          <FormDialog
            id="mensaje"
            eyebrow="Contacto"
            title={
              <>
                Envíanos un <em>mensaje</em>
              </>
            }
            triggerLabel="Escribir mensaje"
            triggerIcon="mail"
            triggerVariant="primary"
          >
            <ContactoForm />
          </FormDialog>
        </FormPanel>
        <div className="flex flex-col gap-4">
          <Card tone="brand" emphasis="featured" as="section">
            <h2 className="font-display text-h3 font-medium">La forma más rápida</h2>
            <p className="mt-1 text-surface/80">Te respondemos por WhatsApp lo antes posible.</p>
            <ul className="mt-4 flex flex-col gap-3">
              {config.whatsapp && (
                <li>
                  <WhatsAppButton
                    number={config.whatsapp}
                    label="Escríbenos por WhatsApp"
                    message="Hola, les escribo desde la página web."
                  />
                </li>
              )}
              {config.telefono && (
                <li>
                  <a
                    href={`tel:${config.telefono.replace(/\s/g, '')}`}
                    className="inline-flex items-center gap-2 font-semibold hover:underline"
                  >
                    <Icon name="phone" className="size-5" /> {formatPhoneEc(config.telefono)}
                  </a>
                </li>
              )}
              {config.email && (
                <li>
                  <a
                    href={`mailto:${config.email}`}
                    className="inline-flex items-center gap-2 font-semibold break-all hover:underline"
                  >
                    <Icon name="mail" className="size-5 shrink-0" /> {config.email}
                  </a>
                </li>
              )}
              {!config.whatsapp && !config.telefono && !config.email && (
                <li className="text-surface/80">
                  Muy pronto publicaremos nuestro WhatsApp. Mientras tanto, usa el formulario.
                </li>
              )}
            </ul>
            {socials.length > 0 && (
              <ul className="mt-5 flex flex-wrap gap-2 border-t border-surface/20 pt-4">
                {socials.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center gap-2 rounded-xl px-3 hover:bg-surface/10"
                    >
                      <Icon name={s.icon} className="size-5" /> {s.label}
                      <span className="sr-only"> (se abre en una pestaña nueva)</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </Card>
          <Card title="Dónde estamos" as="section" tone="sunken">
            <div className="flex flex-col gap-3">
              {config.direccion && (
                <address className="not-italic">
                  <p className="font-semibold">{config.direccion}</p>
                  {config.referencia_llegada && (
                    <p className="mt-1 text-ink-soft">{config.referencia_llegada}</p>
                  )}
                </address>
              )}
              <MapEmbed
                embedUrl={config.maps_embed_url}
                mapsUrl={config.maps_url}
                address={config.direccion}
                title="Mapa del auditorio"
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
