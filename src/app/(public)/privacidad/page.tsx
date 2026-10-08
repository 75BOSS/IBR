import Link from 'next/link';
import type { ReactNode } from 'react';
import { Card } from '@/components/Card';
import { PageHeader } from '@/components/PageHeader';
import { getSiteConfig } from '@/lib/config';
import { formatPhoneEc } from '@/lib/whatsapp';
import { pageMetadata } from '@/lib/seo';

export const revalidate = 300;

export const metadata = pageMetadata({
  title: 'Política de privacidad',
  description:
    'Cómo la Iglesia Bíblica Riobamba cuida los datos que dejas en esta página: para qué los usamos, quién los ve y cómo pedir que los borremos.',
  path: '/privacidad',
});

const UPDATED = '30 de septiembre de 2026';

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="flex flex-col gap-3">
      <h2 id={id} className="font-headline text-h1 text-brand-strong">
        {title}
      </h2>
      <div className="flex flex-col gap-3 text-ink [&_li]:ml-5 [&_li]:list-disc [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-1.5">
        {children}
      </div>
    </section>
  );
}

export default async function PrivacidadPage() {
  const config = await getSiteConfig();
  const contact = [
    config.email && `al correo ${config.email}`,
    config.whatsapp && `por WhatsApp al ${formatPhoneEc(config.whatsapp)}`,
  ]
    .filter(Boolean)
    .join(' o ');

  return (
    <div className="container-page page-flow">
      <PageHeader
        size="display"
        eyebrow="Tus datos"
        title={
          <>
            Política de <em>privacidad</em>
          </>
        }
        intro={`Última actualización: ${UPDATED}. La escribimos en palabras sencillas: si algo no queda claro, pregúntanos.`}
      />
      <div className="grid gap-[clamp(1.5rem,4vw,3rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:items-start">
        <Card tone="brand" emphasis="featured" as="aside" className="lg:sticky lg:top-24">
          <p className="font-display text-h3 leading-snug font-semibold">En resumen</p>
          <ul className="mt-3 flex flex-col gap-2 text-surface/90">
            <li>Solo pedimos lo necesario para acompañarte.</li>
            <li>Nunca vendemos ni prestamos tus datos.</li>
            <li>Las peticiones de oración privadas solo las leen los pastores.</li>
            <li>Puedes pedir que borremos tus datos cuando quieras.</li>
          </ul>
        </Card>

        <div className="flex max-w-prose flex-col gap-[clamp(1.5rem,4vw,2.5rem)]">
          <Section id="responsable" title="Quién cuida tus datos">
            <p>
              {config.nombre_iglesia}
              {config.direccion ? `, ${config.direccion}` : ''}, es responsable de los datos que
              dejas en este sitio.
              {contact ? ` Para cualquier tema de privacidad escríbenos ${contact}.` : ''}
            </p>
          </Section>

          <Section id="que-datos" title="Qué datos recogemos">
            <ul>
              <li>
                <strong>Soy nuevo:</strong> nombre, WhatsApp, correo (opcional), rango de edad,
                sector donde vives, cómo nos conociste y, si quieres, una petición de oración.
              </li>
              <li>
                <strong>Quiero unirme a un grupo:</strong> nombre, WhatsApp y un mensaje opcional.
              </li>
              <li>
                <strong>Pedir oración:</strong> tu petición y, solo si quieres, nombre, WhatsApp y
                correo. Puedes enviarla sin identificarte.
              </li>
              <li>
                <strong>Contacto:</strong> nombre, WhatsApp o correo y tu mensaje.
              </li>
              <li>
                <strong>Inscripción a eventos:</strong> nombre, WhatsApp, correo (opcional) y
                cuántas personas vienen. Te damos un código para ver o cancelar tu inscripción.
              </li>
              <li>
                <strong>Servir:</strong> nombre, WhatsApp, correo (opcional), el área que te
                interesa, cuándo puedes y lo que quieras contarnos.
              </li>
              <li>
                <strong>Agenda semanal:</strong> tu correo y, si quieres, tu nombre. Solo te
                escribimos después de que confirmes, y cada correo trae el enlace para darte de
                baja.
              </li>
              <li>
                Junto con cada envío guardamos la fecha y la dirección IP desde donde se hizo, para
                registrar tu consentimiento y frenar mensajes automáticos (spam).
              </li>
            </ul>
          </Section>

          <Section id="para-que" title="Para qué los usamos">
            <ul>
              <li>Darte la bienvenida y responder tus preguntas.</li>
              <li>Ponerte en contacto con el líder del grupo que elegiste.</li>
              <li>Orar por ti y, si nos dejaste cómo, acompañarte.</li>
            </ul>
            <p>
              No usamos tus datos para publicidad ni te agregamos a listas de difusión sin
              preguntarte.
            </p>
          </Section>

          <Section id="consentimiento" title="Tu permiso">
            <p>
              Guardamos tus datos porque nos das permiso al marcar la casilla de cada formulario.
              Guardamos también cuándo lo diste. Puedes retirarlo en cualquier momento.
            </p>
          </Section>

          <Section id="quien-ve" title="Quién los ve">
            <ul>
              <li>
                Los pastores y las personas del equipo de la iglesia que dan seguimiento, con
                usuario y contraseña propios.
              </li>
              <li>El líder del grupo al que pediste unirte (solo tu solicitud).</li>
              <li>
                Proveedores que hacen funcionar el sitio y guardan la información por nosotros: el
                servidor y la base de datos (Hostinger) y el correo de avisos. No pueden usarla para
                nada más.
              </li>
            </ul>
          </Section>

          <Section id="cuanto-tiempo" title="Cuánto tiempo los guardamos">
            <p>
              Mientras te acompañamos o participas en la iglesia, o hasta que nos pidas borrarlos.
            </p>
          </Section>

          <Section id="derechos" title="Tus derechos">
            <p>
              Según la Ley Orgánica de Protección de Datos Personales del Ecuador, puedes pedirnos
              ver los datos que tenemos de ti, corregirlos, borrarlos, oponerte a que los usemos o
              recibir una copia. Escríbenos
              {contact ? ` ${contact}` : ' desde la página de contacto'} y te responderemos en un
              máximo de 15 días.
            </p>
            <p>
              <Link href="/contacto" className="link">
                Ir a Contacto
              </Link>
            </p>
          </Section>

          <Section id="cookies" title="Cookies y contenido de otros sitios">
            <p>
              Este sitio no usa cookies de publicidad ni de seguimiento. Solo el panel del equipo
              usa una cookie para mantener la sesión abierta, y «Mi cuenta» otra para recordar que
              ya confirmaste tu número con el código que te enviamos por WhatsApp (el código vence
              en 10 minutos y no lo guardamos).
            </p>
            <p>
              Los videos de YouTube se cargan únicamente cuando pulsas «reproducir» y el mapa lo
              muestra Google Maps; esos servicios tienen sus propias políticas.
            </p>
          </Section>
        </div>
      </div>
    </div>
  );
}
