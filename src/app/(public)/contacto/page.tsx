import { buttonClasses } from '@/components/button-styles';
import { Card } from '@/components/Card';
import { EmailText } from '@/components/EmailText';
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
    <div className="container-page page-flow">
      <PageHeader
        size="display"
        eyebrow="Contacto"
        title={
          <>
            Queremos <em>escucharte</em>
          </>
        }
        intro="¿Tienes una pregunta, quieres visitarnos o necesitas hablar con un pastor? Escríbenos por donde prefieras."
      />
      {/* El formulario a lo ancho y debajo las otras vías: en dos columnas junto al panel, este se
          estiraba al alto de la columna vecina y quedaba un bloque vacío. */}
      <FormPanel
        titleId="envianos-un-mensaje"
        eyebrow="Mensaje"
        title={
          <>
            Envíanos un <em>mensaje</em>
          </>
        }
        text="Te respondemos al correo o al WhatsApp que nos dejes, normalmente en uno o dos días."
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-aside-main">
        <Card tone="brand" emphasis="featured" as="section">
          <h2 className="font-display text-h3 font-medium">
            {config.whatsapp ? 'La forma más rápida' : 'Otras formas de escribirnos'}
          </h2>
          <p className="mt-1 text-surface/80 empty:hidden">
            {config.whatsapp
              ? 'Te respondemos por WhatsApp lo antes posible.'
              : `También nos encuentras ${[
                  config.telefono && 'por teléfono',
                  config.email && 'por correo',
                  socials.length > 0 && 'en redes sociales',
                ]
                  .filter(Boolean)
                  .join(', ')
                  .replace(/, ([^,]*)$/, ' y $1')}.`}
          </p>
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
                  className="inline-flex items-center gap-2 link-quiet"
                >
                  <Icon name="phone" className="size-5" /> {formatPhoneEc(config.telefono)}
                </a>
              </li>
            )}
            {config.email && (
              <li>
                <a
                  href={`mailto:${config.email}`}
                  className="inline-flex items-center gap-2 link-quiet"
                >
                  <Icon name="mail" className="size-5 shrink-0" />
                  <EmailText email={config.email} />
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
                    className={buttonClasses({ variant: 'inverse' })}
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
  );
}
