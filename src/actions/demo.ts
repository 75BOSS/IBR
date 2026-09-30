'use server';

import { requireAdmin } from '@/lib/auth';
import type { FormState } from '@/lib/form-state';

/** Acción de muestra para el catálogo /admin/componentes (no toca datos). */
export async function confirmDemo(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const id = String(formData.get('id') ?? '');
  if (id === 'falla') {
    return {
      status: 'error',
      message: 'Así se ve un error: no se pudo eliminar. Intenta de nuevo o avisa a Pixelia.',
    };
  }
  return { status: 'success', message: `Listo: elemento ${id} eliminado (demostración).` };
}
