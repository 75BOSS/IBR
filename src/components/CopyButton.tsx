'use client';

import { Button } from '@/components/Button';
import type { ButtonVariant } from '@/components/button-styles';
import { Icon } from '@/components/Icon';
import { useToast } from '@/components/Toast';

/** Copia un texto (ej. número de cuenta) y lo confirma con un aviso. */
export function CopyButton({
  text,
  label = 'Copiar',
  copiedMessage = 'Copiado',
  variant = 'secondary',
}: {
  text: string;
  label?: string;
  copiedMessage?: string;
  variant?: ButtonVariant;
}) {
  const toast = useToast();
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      toast({ message: copiedMessage });
    } catch {
      // El navegador no dejó copiar (permiso o conexión sin https): se explica qué hacer.
      toast({
        tone: 'error',
        message: `No se pudo copiar. Mantén presionado el número para copiarlo: ${text}`,
      });
    }
  };
  return (
    <Button
      type="button"
      size="sm"
      variant={variant}
      onClick={copy}
      icon={<Icon name="copy" className="size-4" />}
    >
      {label}
    </Button>
  );
}
