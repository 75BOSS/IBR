import { ButtonLink } from '@/components/Button';

export default function AdminNotFound() {
  return (
    <section className="px-[clamp(1rem,4vw,2.5rem)] py-[clamp(2rem,6vw,4rem)]">
      <p className="text-sm font-semibold tracking-widest text-accent uppercase">Error 404</p>
      <h1 className="mt-2 text-h1 font-semibold text-brand-strong">
        Esta sección no existe todavía
      </h1>
      <p className="mt-3 max-w-prose text-ink-soft">
        Los módulos marcados como «Pronto» en el menú se irán habilitando en la fase 1. Mientras
        tanto puedes volver al resumen.
      </p>
      <ButtonLink href="/admin" className="mt-6">
        Volver al resumen
      </ButtonLink>
    </section>
  );
}
