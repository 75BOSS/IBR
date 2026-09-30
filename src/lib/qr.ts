import 'server-only';
import QRCode from 'qrcode';

/** Código QR como SVG (se inserta en la página; sin imágenes externas). Colores del tema. */
export function qrSvg(text: string): Promise<string> {
  return QRCode.toString(text, {
    type: 'svg',
    margin: 1,
    errorCorrectionLevel: 'M',
    color: { dark: '#1e2a2f', light: '#fbf7f0' },
  });
}
