import { notFound } from 'next/navigation';

/** Ruta del panel inexistente (o módulo aún no construido): 404 dentro del panel. */
export default function UnknownAdminRoute() {
  notFound();
}
