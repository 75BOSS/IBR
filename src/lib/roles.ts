/** Roles del panel (módulo sin dependencias de servidor: lo usan formularios del cliente). */
export const ROLES = [
  {
    value: 'admin',
    label: 'Administrador',
    help: 'Pastores: ve todo, incluidas las peticiones privadas, la configuración y los usuarios.',
  },
  {
    value: 'editor',
    label: 'Editor',
    help: 'Voluntarios: carga prédicas, eventos, grupos y registros. No ve peticiones privadas.',
  },
] as const;
