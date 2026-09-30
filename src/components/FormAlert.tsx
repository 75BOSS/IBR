import type { ReactNode } from 'react';
import { Icon, type IconName } from '@/components/Icon';

export type FormAlertTone = 'error' | 'success' | 'warning';

const tones: Record<FormAlertTone, { box: string; icon: IconName }> = {
  error: { box: 'border-danger/40 bg-danger-soft text-danger-strong', icon: 'error' },
  success: { box: 'border-success/30 bg-success-soft text-success', icon: 'check' },
  warning: { box: 'border-warning/30 bg-warning-soft text-warning', icon: 'warning' },
};

/**
 * Aviso dentro de un formulario o pantalla (error general, éxito, advertencia). Los errores
 * se anuncian de inmediato (role=alert); el resto, de forma cortés (role=status).
 */
export function FormAlert({
  tone = 'error',
  children,
  className = '',
}: {
  tone?: FormAlertTone;
  children: ReactNode;
  className?: string;
}) {
  const style = tones[tone];
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={`flex items-start gap-2.5 rounded-xl border px-4 py-3 text-sm font-medium ${style.box} ${className}`}
    >
      <Icon name={style.icon} className="mt-px size-5" />
      <div>{children}</div>
    </div>
  );
}
