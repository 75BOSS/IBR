import { ButtonLink } from '@/components/Button';
import { PageHeader } from '@/components/PageHeader';

export default function AdminNotFound() {
  return (
    <section className="container-panel">
      <PageHeader
        eyebrow="Error 404"
        title="Esta sección no existe todavía"
        intro="Los módulos marcados como «Pronto» en el menú se irán habilitando en la fase 1. Mientras tanto puedes volver al resumen."
      />
      <ButtonLink href="/admin" className="mt-6">
        Volver al resumen
      </ButtonLink>
    </section>
  );
}
