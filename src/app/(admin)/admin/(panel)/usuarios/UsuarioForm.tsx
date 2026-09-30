'use client';

import { saveUsuario } from '@/actions/usuarios';
import { Checkbox } from '@/components/Checkbox';
import { Field } from '@/components/Field';
import { CrudForm } from '@/components/admin/CrudForm';
import type { Usuario } from '@/lib/usuarios';
import { ROLES } from '@/lib/roles';

export function UsuarioForm({ user, isSelf = false }: { user?: Usuario; isSelf?: boolean }) {
  return (
    <CrudForm
      action={saveUsuario}
      id={user?.id}
      cancelHref="/admin/usuarios"
      submitLabel={user ? 'Guardar cambios' : 'Crear usuario'}
    >
      {({ v, e, state }) => (
        <>
          {!user && (
            <p className="text-ink-soft">
              Al crearlo te mostramos una contraseña generada, una sola vez, para que se la pases.
            </p>
          )}
          <div className="grid gap-5 md:grid-cols-2">
            <Field
              label="Nombre"
              name="nombre"
              autoComplete="off"
              defaultValue={v('nombre', user?.nombre)}
              error={e.nombre}
              required
            />
            <Field
              label="Correo"
              name="email"
              type="email"
              autoComplete="off"
              defaultValue={v('email', user?.email)}
              hint="Con este correo entra al panel."
              error={e.email}
              required
            />
          </div>
          <Field
            as="select"
            label="Rol"
            name="rol"
            options={ROLES.map((r) => ({ value: r.value, label: r.label }))}
            defaultValue={v('rol', user?.rol ?? 'editor')}
            hint={
              <ul className="flex flex-col gap-1">
                {ROLES.map((r) => (
                  <li key={r.value}>
                    <strong className="text-ink">{r.label}:</strong> {r.help}
                  </li>
                ))}
              </ul>
            }
            error={e.rol}
            disabled={isSelf}
            required
          />
          {isSelf && <input type="hidden" name="rol" value={user?.rol} />}
          {user && !isSelf && (
            <Checkbox
              name="activo"
              label="Cuenta activa"
              hint="Si la desactivas, la persona no puede entrar y se cierran sus sesiones abiertas."
              defaultChecked={state.values ? state.values.activo === '1' : user.activo}
            />
          )}
          {isSelf && <input type="hidden" name="activo" value="1" />}
        </>
      )}
    </CrudForm>
  );
}
