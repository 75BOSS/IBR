import { notFound } from 'next/navigation';

/** Toda ruta pública desconocida muestra el 404 del sitio (con encabezado y pie). */
export default function UnknownPublicRoute() {
  notFound();
}
