import 'server-only';
import { cache } from 'react';
import { getSiteConfig } from '@/lib/config';
import { parseBankAccounts, parseCreencias } from '@/lib/config-fields';
import { isMailConfigured } from '@/lib/mail';
import type { SiteContent } from '@/lib/nav';
import { getSiteCounts } from '@/lib/stats';
import { isWhatsAppConfigured } from '@/lib/whatsapp-cloud';

/**
 * ¿Qué hay para mostrar en cada destino del sitio? Un botón o enlace solo aparece si a donde
 * lleva tiene contenido (menú, pie, 404, sitemap y botones de la portada usan esto). Así, con la
 * BD recién creada no hay enlaces a páginas vacías, y cada sección aparece sola cuando la iglesia
 * carga su contenido desde el panel.
 */
export const getSiteContent = cache(async (): Promise<SiteContent> => {
  const [config, counts] = await Promise.all([getSiteConfig(), getSiteCounts()]);
  return {
    // Reuniones muestra el mapa y «Cómo llegar» aunque falten los horarios.
    reuniones: counts.reuniones > 0 || Boolean(config.direccion || config.maps_url),
    horarios: counts.reuniones > 0,
    grupos: counts.grupos > 0,
    eventos: counts.eventos > 0,
    servir: counts.areas > 0,
    // Sin prédicas cargadas, Prédicas muestra los últimos videos del canal de YouTube.
    predicas: counts.predicas > 0 || Boolean(config.youtube_channel_id),
    ministerios: counts.ministerios > 0,
    equipo: counts.equipo > 0,
    pastores: counts.pastores > 0,
    creencias: parseCreencias(config.nosotros_creencias).length > 0,
    dar: parseBankAccounts(config.dar_cuentas).length > 0 || Boolean(config.dar_qr_url),
    // Sin correo saliente no se puede confirmar una suscripción.
    agenda: isMailConfigured(),
    // «Mi cuenta» entra con un código por WhatsApp: sin la plantilla, nadie podría entrar.
    cuenta: isWhatsAppConfigured('WHATSAPP_TEMPLATE_CODIGO'),
  };
});
