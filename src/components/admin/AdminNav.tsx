'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRef } from 'react';
import { logout } from '@/actions/auth';
import { BrandMark } from '@/components/BrandMark';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { Tag } from '@/components/Tag';
import { ADMIN_NAV, isActivePath } from '@/lib/nav';

type AdminNavProps = { user: { nombre: string; rol: 'admin' | 'editor' } };

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <ul className="flex flex-col gap-0.5">
      {ADMIN_NAV.map((item) => {
        const active = isActivePath(pathname, item.href);
        if (!item.ready) {
          return (
            <li key={item.href}>
              <span
                aria-disabled="true"
                className="flex min-h-11 cursor-not-allowed items-center gap-3 rounded-xl px-3 text-sidebar-muted"
              >
                <Icon name={item.icon} />
                <span className="flex-1">{item.label}</span>
                <Tag tone="inverse">Pronto</Tag>
              </span>
            </li>
          );
        }
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? 'page' : undefined}
              className={`flex min-h-11 items-center gap-3 rounded-xl px-3 font-semibold transition-colors ${
                active ? 'bg-sidebar-ink text-sidebar' : 'text-sidebar-ink hover:bg-sidebar-ink/10'
              }`}
            >
              <Icon name={item.icon} />
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function UserBlock({ user }: AdminNavProps) {
  const initials = user.nombre
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
  return (
    <div className="flex flex-col gap-3 border-t border-sidebar-ink/15 pt-4">
      <div className="flex items-center gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-brand-soft font-bold text-brand-strong">
          {initials}
        </span>
        <div className="min-w-0">
          <p className="truncate font-semibold">{user.nombre}</p>
          <p className="text-sm text-sidebar-muted">
            {user.rol === 'admin' ? 'Administrador' : 'Editor'}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Link
          href="/"
          className="inline-flex min-h-9 items-center gap-1.5 rounded-lg px-2 text-sm text-sidebar-muted hover:text-sidebar-ink hover:underline"
        >
          <Icon name="external" className="size-4" />
          Ver sitio
        </Link>
        <form action={logout}>
          <Button
            type="submit"
            variant="inverse"
            size="sm"
            pendingLabel="Saliendo…"
            icon={<Icon name="logOut" className="size-4" />}
          >
            Cerrar sesión
          </Button>
        </form>
      </div>
    </div>
  );
}

function Brand() {
  return (
    <Link href="/admin" className="flex items-center gap-3 rounded-lg">
      <BrandMark size="sm" />
      <span className="font-display text-lg font-semibold">Panel IBR</span>
    </Link>
  );
}

/**
 * Menú del panel: barra lateral fija desde 1024 px; en celular/tablet, barra superior con un
 * cajón (<dialog> nativo: atrapa el foco, cierra con Escape y bloquea el fondo).
 */
export function AdminNav({ user }: AdminNavProps) {
  const drawer = useRef<HTMLDialogElement>(null);
  const close = () => drawer.current?.close();

  return (
    <>
      <div className="sticky top-0 z-30 flex h-14 items-center gap-3 bg-sidebar px-3 text-sidebar-ink md:h-16 md:px-5 lg:hidden">
        <button
          type="button"
          onClick={() => drawer.current?.showModal()}
          className="grid size-11 place-items-center rounded-xl hover:bg-sidebar-ink/10"
          aria-haspopup="dialog"
          aria-controls="menu-panel"
        >
          <Icon name="menu" className="size-6" />
          <span className="sr-only">Abrir menú del panel</span>
        </button>
        <Brand />
      </div>

      <dialog
        id="menu-panel"
        ref={drawer}
        aria-label="Menú del panel"
        onClick={(event) => event.target === drawer.current && close()}
        className="m-0 h-dvh max-h-dvh w-[min(20rem,86vw)] max-w-none bg-sidebar p-0 text-sidebar-ink backdrop:bg-ink/50 lg:hidden"
      >
        <div className="flex h-full flex-col gap-6 p-4">
          <div className="flex items-center justify-between">
            <Brand />
            <button
              type="button"
              onClick={close}
              className="grid size-11 place-items-center rounded-xl hover:bg-sidebar-ink/10"
            >
              <Icon name="close" className="size-6" />
              <span className="sr-only">Cerrar menú</span>
            </button>
          </div>
          <nav aria-label="Panel" className="flex-1 overflow-y-auto">
            <NavLinks onNavigate={close} />
          </nav>
          <UserBlock user={user} />
        </div>
      </dialog>

      <aside className="sticky top-0 hidden h-dvh flex-col gap-6 overflow-y-auto bg-sidebar p-4 text-sidebar-ink lg:flex">
        <Brand />
        <nav aria-label="Panel" className="flex-1">
          <NavLinks />
        </nav>
        <UserBlock user={user} />
      </aside>
    </>
  );
}
