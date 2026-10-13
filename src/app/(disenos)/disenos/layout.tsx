import { notFound } from 'next/navigation';
import { SelectorDiseno } from '@/disenos/SelectorDiseno';
import { isIndexable } from '@/lib/site';

/**
 * Propuestas de diseño (2026-10-13): solo existen en las copias de prueba. En ibriglesia.com
 * dan 404, así nadie llega a una versión que la iglesia no eligió. Cada propuesta pone su propio
 * encabezado y pie en `disenos/<slug>/layout.tsx`.
 */
export default function DisenosLayout({ children }: { children: React.ReactNode }) {
  if (isIndexable()) notFound();
  return (
    <>
      {children}
      <SelectorDiseno />
    </>
  );
}
