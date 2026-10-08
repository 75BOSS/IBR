/**
 * Datos de ejemplo para ver el sitio «lleno» (horarios, grupos, eventos, ministerios, equipo,
 * áreas de servicio, «Nosotros» y algunos mensajes en el panel) antes de que la iglesia cargue
 * los reales. Pensado para la copia de prueba; no para producción.
 *
 *   npm run db:ejemplo -- --cargar    agrega lo que falte (se puede correr dos veces sin duplicar)
 *   npm run db:ejemplo -- --quitar    borra solo lo de ejemplo
 *
 * Reglas:
 * - Nunca pisa lo que ya cargó la iglesia: la configuración y los ministerios solo se llenan si
 *   están vacíos, y al quitar se vacían solo si siguen con el texto de ejemplo.
 * - Todo lo de ejemplo se reconoce por una marca fija (slug que termina en «-ejemplo», correo
 *   @ejemplo.com o el texto exacto de este archivo): si alguien lo edita desde el panel, deja de
 *   ser «de ejemplo» y `--quitar` no lo toca.
 * - Sin teléfonos ni WhatsApp inventados (serían de alguien real) y sin cuentas bancarias que
 *   parezcan reales.
 * - Las fechas de los eventos se calculan desde hoy, para que siempre haya «próximos».
 */
import { parseArgs } from 'node:util';
import type { Connection, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { describeTarget, fail, openScriptConnection } from './lib/script-db';

const MARK = '-ejemplo';
const EMAIL_DOMAIN = '@ejemplo.com';

// ---------------------------------------------------------------------------------------------
// Contenido
// ---------------------------------------------------------------------------------------------

const CONFIG: Record<string, string> = {
  nosotros_historia: [
    'La Iglesia Bíblica Riobamba empezó como un grupo pequeño que se reunía en una casa para estudiar la Biblia y orar por la ciudad. Con los años, Dios fue sumando familias, jóvenes y niños.',
    'Hoy nos reunimos cada domingo en nuestro auditorio y durante la semana en grupos en casas por todo Riobamba. Seguimos creyendo lo mismo que al principio: que la Palabra de Dios cambia vidas y que la iglesia es una familia donde nadie camina solo. Por eso decimos «Somos Familia».',
  ].join('\n\n'),
  nosotros_mision:
    'Acompañar a cada persona a conocer a Jesús, crecer en su Palabra y servir a otros con amor, en Riobamba y más allá.',
  nosotros_creencias: [
    'La Biblia\nEs la Palabra de Dios, verdadera y suficiente: nuestra guía para la fe y para la vida.',
    'Un solo Dios\nCreemos en un solo Dios, eterno, que existe en tres personas: Padre, Hijo y Espíritu Santo.',
    'Jesucristo\nEs Dios hecho hombre. Murió en la cruz por nuestros pecados, resucitó y volverá.',
    'La salvación\nEs un regalo de Dios por gracia, por medio de la fe en Jesucristo, no por nuestras obras.',
    'La iglesia\nEs la familia de quienes siguen a Jesús: nos reunimos para adorar, aprender, orar y servir juntos.',
  ].join('\n\n'),
  dar_cuentas: JSON.stringify([
    {
      banco: 'Banco de ejemplo',
      tipo: 'Ahorros',
      numero: '0000000000',
      titular: 'Iglesia Bíblica Riobamba',
      ruc_ci: '0000000000001',
    },
  ]),
};

/** Descripción de cada ministerio (por slug de rangos_edad). */
const MINISTERIOS: Record<string, string> = {
  kids: 'Clases bíblicas, canciones y juegos para niños de 3 a 11 años, cada domingo mientras los papás están en el culto.',
  adolescentes:
    'Un espacio para preguntas difíciles, amistad y la Biblia abierta, para chicos y chicas de 12 a 17 años.',
  jovenes:
    'Jóvenes de 18 a 30 años que se reúnen cada sábado para adorar, estudiar la Palabra y servir a la ciudad.',
  adultos: 'Grupos en casas, estudios bíblicos y acompañamiento para matrimonios y familias.',
  'adultos-mayores':
    'Encuentros de oración, café y compañerismo para quienes tienen 65 años o más.',
};

const CASAS: { nombre: string; zona: string }[] = [
  { nombre: 'Casa en La Politécnica', zona: 'La Politécnica' },
  { nombre: 'Casa en el Centro', zona: 'Centro' },
  { nombre: 'Casa en Bellavista', zona: 'Bellavista' },
  { nombre: 'Casa en La Primavera', zona: 'La Primavera' },
  { nombre: 'Casa en Licán', zona: 'Licán' },
];

type Grupo = {
  nombre: string;
  descripcion: string;
  tipo: string;
  rango: string;
  lugar: string;
  dia: number;
  hora: string;
  frecuencia?: 'semanal' | 'quincenal' | 'mensual';
  lider: string;
};

const GRUPOS: Grupo[] = [
  {
    nombre: 'Familias La Politécnica',
    descripcion:
      'Una noche a la semana para leer la Biblia, orar y compartir la cena en familia. Los niños tienen su propio momento.',
    tipo: 'Familias',
    rango: 'adultos',
    lugar: 'Casa en La Politécnica',
    dia: 3,
    hora: '19:30',
    lider: 'Andrés y Paula',
  },
  {
    nombre: 'Jóvenes Centro',
    descripcion: 'Estudio bíblico, preguntas sinceras y pizza. Trae a un amigo.',
    tipo: 'Jóvenes',
    rango: 'jovenes',
    lugar: 'Casa en el Centro',
    dia: 5,
    hora: '19:00',
    lider: 'Mateo',
  },
  {
    nombre: 'Adolescentes Bellavista',
    descripcion: 'Juegos, preguntas difíciles y la Biblia abierta, con líderes que te acompañan.',
    tipo: 'Adolescentes',
    rango: 'adolescentes',
    lugar: 'Casa en Bellavista',
    dia: 6,
    hora: '16:00',
    lider: 'María José',
  },
  {
    nombre: 'Matrimonios La Primavera',
    descripcion: 'Parejas que quieren cuidar su matrimonio con la Palabra de Dios y amigos cerca.',
    tipo: 'Matrimonios',
    rango: 'adultos',
    lugar: 'Casa en La Primavera',
    dia: 6,
    hora: '19:30',
    frecuencia: 'quincenal',
    lider: 'Daniel y Sofía',
  },
  {
    nombre: 'Estudio bíblico en línea',
    descripcion:
      'Para quienes no pueden salir de casa: estudiamos un libro de la Biblia por videollamada.',
    tipo: 'Estudio bíblico',
    rango: 'adultos',
    lugar: 'En línea (YouTube)',
    dia: 2,
    hora: '20:00',
    lider: 'Carlos',
  },
  {
    nombre: 'Mujeres de la Palabra',
    descripcion: 'Mujeres que se reúnen a estudiar la Biblia, orar unas por otras y tomar un café.',
    tipo: 'Mujeres',
    rango: 'adultos',
    lugar: 'Casa en el Centro',
    dia: 1,
    hora: '19:00',
    lider: 'Gabriela',
  },
  {
    nombre: 'Oración y café Licán',
    descripcion: 'Una mañana tranquila para orar por la familia y la ciudad, con café y pan.',
    tipo: 'Oración',
    rango: 'adultos-mayores',
    lugar: 'Casa en Licán',
    dia: 4,
    hora: '10:00',
    lider: 'Rosa',
  },
];

type Reunion = {
  nombre: string;
  descripcion: string;
  dia: number;
  inicio: string;
  fin: string;
  rango: string | null;
  enLinea: boolean;
};

const REUNIONES: Reunion[] = [
  {
    nombre: 'Culto dominical',
    descripcion: 'Alabanza, prédica de la Biblia y Kids en paralelo.',
    dia: 7,
    inicio: '10:00',
    fin: '12:00',
    rango: null,
    enLinea: true,
  },
  {
    nombre: 'Kids',
    descripcion: 'Clases para niños mientras los papás están en el culto.',
    dia: 7,
    inicio: '10:00',
    fin: '12:00',
    rango: 'kids',
    enLinea: false,
  },
  {
    nombre: 'Reunión de oración',
    descripcion: 'Oramos juntos por la iglesia, las familias y la ciudad.',
    dia: 3,
    inicio: '19:00',
    fin: '20:30',
    rango: null,
    enLinea: false,
  },
  {
    nombre: 'Adolescentes',
    descripcion: 'Juegos, amistad y la Palabra para chicos de 12 a 17 años.',
    dia: 6,
    inicio: '15:00',
    fin: '17:00',
    rango: 'adolescentes',
    enLinea: false,
  },
  {
    nombre: 'Jóvenes',
    descripcion: 'Adoración, Palabra y amistad.',
    dia: 6,
    inicio: '17:30',
    fin: '19:30',
    rango: 'jovenes',
    enLinea: false,
  },
];

type Persona = { nombre: string; rol: string; bio: string | null; pastor: boolean };

const EQUIPO: Persona[] = [
  {
    nombre: 'Pastor Juan Carlos Mena',
    rol: 'Pastor principal',
    bio: 'Le apasiona enseñar la Biblia de forma sencilla y acompañar a las familias.',
    pastor: true,
  },
  {
    nombre: 'Pastora Lucía Mena',
    rol: 'Pastora de familias',
    bio: 'Acompaña a los matrimonios y al ministerio de mujeres.',
    pastor: true,
  },
  { nombre: 'Mateo Guamán', rol: 'Líder de jóvenes', bio: null, pastor: false },
  { nombre: 'Gabriela Yépez', rol: 'Ministerio de niños', bio: null, pastor: false },
  { nombre: 'David Cáceres', rol: 'Alabanza', bio: null, pastor: false },
  { nombre: 'Rosa Chávez', rol: 'Bienvenida', bio: null, pastor: false },
];

const AREAS: { nombre: string; slug: string; descripcion: string; responsable: string | null }[] = [
  {
    nombre: 'Alabanza',
    slug: `alabanza${MARK}`,
    descripcion: 'Música y canto para los cultos del domingo y las noches de alabanza.',
    responsable: 'David Cáceres',
  },
  {
    nombre: 'Niños',
    slug: `ninos${MARK}`,
    descripcion: 'Clases bíblicas para niños durante el culto. Te capacitamos y te acompañamos.',
    responsable: 'Gabriela Yépez',
  },
  {
    nombre: 'Bienvenida',
    slug: `bienvenida${MARK}`,
    descripcion: 'Recibir con una sonrisa a quienes llegan, sobre todo por primera vez.',
    responsable: 'Rosa Chávez',
  },
  {
    nombre: 'Medios',
    slug: `medios${MARK}`,
    descripcion: 'Transmisión en vivo, sonido, fotos y redes sociales.',
    responsable: null,
  },
  {
    nombre: 'Intercesión',
    slug: `intercesion${MARK}`,
    descripcion: 'Orar cada semana por las peticiones que llegan a la iglesia.',
    responsable: null,
  },
  {
    nombre: 'Logística',
    slug: `logistica${MARK}`,
    descripcion: 'Preparar el auditorio, el café y los eventos especiales.',
    responsable: null,
  },
];

type Evento = {
  slug: string;
  titulo: string;
  resumen: string;
  cuerpo: string;
  categoria: 'evento' | 'noticia' | 'oracion' | 'comunidad' | 'musica' | 'capacitacion';
  /** Días desde hoy (negativo = ya pasó) hasta el día de la semana indicado. */
  dentroDe: number;
  /** 1 = lunes … 7 = domingo: se usa el primero que cae desde `dentroDe`. */
  dia: number;
  inicio: string;
  fin?: { dias: number; hora: string };
  rango?: string;
  enAuditorio?: boolean;
  cupo?: number;
  destacado?: boolean;
};

const EVENTOS: Evento[] = [
  {
    slug: `domingo-en-familia${MARK}`,
    titulo: 'Domingo en familia',
    resumen:
      'Un culto especial para venir con toda la familia: alabanza, prédica y un almuerzo juntos al terminar.',
    cuerpo:
      'Este domingo celebramos ser familia. Habrá alabanza, una prédica para grandes y chicos, y al terminar compartimos un almuerzo en el auditorio.\n\nInvita a alguien que quieras que conozca la iglesia.',
    categoria: 'evento',
    dentroDe: 1,
    dia: 7,
    inicio: '10:00',
    fin: { dias: 0, hora: '13:00' },
    enAuditorio: true,
    destacado: true,
  },
  {
    slug: `vigilia-de-oracion${MARK}`,
    titulo: 'Vigilia de oración',
    resumen: 'Una noche para orar juntos por la ciudad, las familias y la iglesia.',
    cuerpo:
      'Nos reunimos a orar por turnos, con momentos de alabanza y lectura de la Biblia. Puedes quedarte el tiempo que puedas.',
    categoria: 'oracion',
    dentroDe: 6,
    dia: 5,
    inicio: '20:00',
    fin: { dias: 0, hora: '23:00' },
    enAuditorio: true,
  },
  {
    slug: `noche-de-alabanza${MARK}`,
    titulo: 'Noche de alabanza',
    resumen: 'Cantamos juntos con el equipo de alabanza y los jóvenes. Entrada libre.',
    cuerpo: 'Una noche para adorar a Dios cantando. Trae a tus amigos: la entrada es libre.',
    categoria: 'musica',
    dentroDe: 12,
    dia: 5,
    inicio: '19:00',
    fin: { dias: 0, hora: '21:00' },
    enAuditorio: true,
  },
  {
    slug: `retiro-de-jovenes${MARK}`,
    titulo: 'Retiro de jóvenes',
    resumen:
      'Un fin de semana fuera de la ciudad para descansar, orar y estudiar juntos la Palabra.',
    cuerpo:
      'Salimos el sábado temprano desde el auditorio y volvemos el domingo por la tarde. Lleva ropa abrigada y tu Biblia.\n\nLos cupos son limitados: inscríbete para reservar tu lugar.',
    categoria: 'evento',
    dentroDe: 18,
    dia: 6,
    inicio: '08:00',
    fin: { dias: 1, hora: '16:00' },
    rango: 'jovenes',
    cupo: 60,
  },
  {
    slug: `taller-para-matrimonios${MARK}`,
    titulo: 'Taller para matrimonios',
    resumen: 'Una tarde para fortalecer tu matrimonio a la luz de la Biblia, con café incluido.',
    cuerpo:
      'Hablaremos de comunicación, perdón y cómo orar juntos. Hay cuidado para los niños durante el taller.',
    categoria: 'capacitacion',
    dentroDe: 25,
    dia: 6,
    inicio: '16:00',
    fin: { dias: 0, hora: '19:00' },
    enAuditorio: true,
    cupo: 30,
  },
  {
    slug: `jornada-de-servicio${MARK}`,
    titulo: 'Jornada de servicio en Licán',
    resumen: 'Pintamos y limpiamos juntos un espacio del barrio. Ven con ropa de trabajo.',
    cuerpo:
      'Servir a la ciudad también es parte de seguir a Jesús. Nos encontramos en el auditorio y vamos juntos.',
    categoria: 'comunidad',
    dentroDe: 32,
    dia: 6,
    inicio: '09:00',
    fin: { dias: 0, hora: '13:00' },
  },
  {
    slug: `bautismos${MARK}`,
    titulo: 'Doce hermanos se bautizaron',
    resumen: 'Doce personas dieron testimonio público de su fe. ¡Gloria a Dios!',
    cuerpo:
      'Fue un domingo de fiesta: doce hermanos se bautizaron y compartieron cómo Jesús cambió su vida. Gracias a todos los que los acompañaron.',
    categoria: 'noticia',
    dentroDe: -12,
    dia: 7,
    inicio: '11:00',
    enAuditorio: true,
  },
];

const REGISTROS = [
  {
    nombres: 'Ana',
    apellidos: 'Torres',
    email: `ana.torres${EMAIL_DOMAIN}`,
    sector: 'Centro',
    situacion: 'primera_visita',
    como_llego: 'redes',
    estado: 'nuevo',
    peticion: 'Por la salud de mi mamá.',
  },
  {
    nombres: 'Luis',
    apellidos: 'Paredes',
    email: `luis.paredes${EMAIL_DOMAIN}`,
    sector: 'La Politécnica',
    situacion: 'decidio_seguir',
    como_llego: 'amigo',
    estado: 'contactado',
    peticion: null,
  },
  {
    nombres: 'Carmen',
    apellidos: 'Ortiz',
    email: `carmen.ortiz${EMAIL_DOMAIN}`,
    sector: 'Bellavista',
    situacion: 'primera_visita',
    como_llego: 'youtube',
    estado: 'nuevo',
    peticion: null,
  },
] as const;

const PETICIONES = [
  {
    nombre: 'Ana Torres',
    email: `ana.torres${EMAIL_DOMAIN}`,
    texto: 'Por la salud de mi mamá, que tiene una operación la próxima semana.',
    privada: 1,
  },
  {
    nombre: 'Jorge',
    email: `jorge${EMAIL_DOMAIN}`,
    texto: 'Por trabajo para mi familia. Gracias por orar.',
    privada: 0,
  },
];

const CONTACTOS = [
  {
    nombre: 'Pedro Salazar',
    email: `pedro.salazar${EMAIL_DOMAIN}`,
    mensaje: 'Hola, quisiera saber si hay parqueadero cerca del auditorio. ¡Gracias!',
  },
];

// ---------------------------------------------------------------------------------------------
// Ayudas
// ---------------------------------------------------------------------------------------------

type Row = RowDataPacket & { id: number };

async function idOf(
  c: Connection,
  sql: string,
  params: (string | number | null)[],
): Promise<number | null> {
  const [rows] = await c.query<Row[]>(sql, params);
  return rows[0]?.id ?? null;
}

/**
 * Fecha y hora de Ecuador (UTC−5, sin horario de verano) a texto UTC para DATETIME: el primer
 * `dia` de la semana desde hoy + `dentroDe` días.
 */
function churchDate(dentroDe: number, dia: number, hora: string, extraDias = 0): string {
  const nowEc = new Date(Date.now() - 5 * 3600 * 1000);
  const base = new Date(
    Date.UTC(nowEc.getUTCFullYear(), nowEc.getUTCMonth(), nowEc.getUTCDate() + dentroDe),
  );
  const isoDay = ((base.getUTCDay() + 6) % 7) + 1; // 1 = lunes … 7 = domingo
  base.setUTCDate(base.getUTCDate() + ((dia - isoDay + 7) % 7) + extraDias);
  const [h = '0', m = '0'] = hora.split(':');
  base.setUTCHours(Number(h) + 5, Number(m), 0, 0); // hora de Ecuador → UTC
  return base.toISOString().slice(0, 19).replace('T', ' ');
}

// ---------------------------------------------------------------------------------------------
// Cargar
// ---------------------------------------------------------------------------------------------

async function cargar(c: Connection) {
  let added = 0;
  const count = (r: ResultSetHeader) => (added += r.affectedRows);

  for (const [clave, valor] of Object.entries(CONFIG)) {
    const [r] = await c.execute<ResultSetHeader>(
      "UPDATE config SET valor = ? WHERE clave = ? AND (valor IS NULL OR valor = '' OR valor = '[]')",
      [valor, clave],
    );
    count(r);
  }

  for (const [slug, descripcion] of Object.entries(MINISTERIOS)) {
    const [r] = await c.execute<ResultSetHeader>(
      "UPDATE rangos_edad SET descripcion = ? WHERE slug = ? AND COALESCE(descripcion, '') = ''",
      [descripcion, slug],
    );
    count(r);
  }

  const rango = (slug: string) => idOf(c, 'SELECT id FROM rangos_edad WHERE slug = ?', [slug]);
  const lugar = (nombre: string) =>
    idOf(c, 'SELECT id FROM ubicaciones WHERE nombre = ?', [nombre]);
  const auditorio = await idOf(c, "SELECT id FROM ubicaciones WHERE tipo = 'sede' ORDER BY id", []);

  for (const casa of CASAS) {
    if (await lugar(casa.nombre)) continue;
    const [r] = await c.execute<ResultSetHeader>(
      "INSERT INTO ubicaciones (nombre, tipo, zona, publica, activo) VALUES (?, 'casa', ?, 0, 1)",
      [casa.nombre, casa.zona],
    );
    count(r);
  }

  for (const g of GRUPOS) {
    const exists = await idOf(c, 'SELECT id FROM grupos WHERE nombre = ? AND descripcion = ?', [
      g.nombre,
      g.descripcion,
    ]);
    if (exists) continue;
    const [r] = await c.execute<ResultSetHeader>(
      `INSERT INTO grupos (nombre, descripcion, tipo, rango_edad_id, ubicacion_id, dia_semana, hora,
                           frecuencia, lider_nombre, publico, activo)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 1)`,
      [
        g.nombre,
        g.descripcion,
        g.tipo,
        await rango(g.rango),
        await lugar(g.lugar),
        g.dia,
        g.hora,
        g.frecuencia ?? 'semanal',
        g.lider,
      ],
    );
    count(r);
  }

  for (const [i, m] of REUNIONES.entries()) {
    const exists = await idOf(
      c,
      'SELECT id FROM reuniones WHERE nombre = ? AND descripcion = ? AND dia_semana = ?',
      [m.nombre, m.descripcion, m.dia],
    );
    if (exists) continue;
    const [r] = await c.execute<ResultSetHeader>(
      `INSERT INTO reuniones (nombre, descripcion, dia_semana, hora_inicio, hora_fin, ubicacion_id,
                              rango_edad_id, en_linea, orden, activo)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [
        m.nombre,
        m.descripcion,
        m.dia,
        m.inicio,
        m.fin,
        auditorio,
        m.rango ? await rango(m.rango) : null,
        m.enLinea ? 1 : 0,
        i + 1,
      ],
    );
    count(r);
  }

  for (const [i, p] of EQUIPO.entries()) {
    const exists = await idOf(c, 'SELECT id FROM equipo WHERE nombre = ? AND rol = ?', [
      p.nombre,
      p.rol,
    ]);
    if (exists) continue;
    const [r] = await c.execute<ResultSetHeader>(
      'INSERT INTO equipo (nombre, rol, bio, es_pastor, orden, visible) VALUES (?, ?, ?, ?, ?, 1)',
      [p.nombre, p.rol, p.bio, p.pastor ? 1 : 0, i + 1],
    );
    count(r);
  }

  for (const [i, a] of AREAS.entries()) {
    if (await idOf(c, 'SELECT id FROM areas_servicio WHERE slug = ?', [a.slug])) continue;
    const responsable = a.responsable
      ? await idOf(c, 'SELECT id FROM equipo WHERE nombre = ?', [a.responsable])
      : null;
    const [r] = await c.execute<ResultSetHeader>(
      `INSERT INTO areas_servicio (nombre, slug, descripcion, responsable_id, activo, orden)
       VALUES (?, ?, ?, ?, 1, ?)`,
      [a.nombre, a.slug, a.descripcion, responsable, i + 1],
    );
    count(r);
  }

  for (const e of EVENTOS) {
    if (await idOf(c, 'SELECT id FROM eventos WHERE slug = ?', [e.slug])) continue;
    const [r] = await c.execute<ResultSetHeader>(
      `INSERT INTO eventos (slug, titulo, resumen, cuerpo, categoria, fecha_inicio, fecha_fin,
                            ubicacion_id, rango_edad_id, requiere_inscripcion, cupo, destacado,
                            publicado)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [
        e.slug,
        e.titulo,
        e.resumen,
        e.cuerpo,
        e.categoria,
        churchDate(e.dentroDe, e.dia, e.inicio),
        e.fin ? churchDate(e.dentroDe, e.dia, e.fin.hora, e.fin.dias) : null,
        e.enAuditorio ? auditorio : null,
        e.rango ? await rango(e.rango) : null,
        e.cupo ? 1 : 0,
        e.cupo ?? null,
        e.destacado ? 1 : 0,
      ],
    );
    count(r);
  }

  for (const reg of REGISTROS) {
    if (await idOf(c, 'SELECT id FROM registros WHERE email = ?', [reg.email])) continue;
    const [r] = await c.execute<ResultSetHeader>(
      `INSERT INTO registros (nombres, apellidos, email, sector, origen, como_llego, situacion,
                              peticion, acepta_datos, acepta_datos_en, estado)
       VALUES (?, ?, ?, ?, 'web', ?, ?, ?, 1, NOW(), ?)`,
      [
        reg.nombres,
        reg.apellidos,
        reg.email,
        reg.sector,
        reg.como_llego,
        reg.situacion,
        reg.peticion,
        reg.estado,
      ],
    );
    count(r);
  }

  for (const p of PETICIONES) {
    if (await idOf(c, 'SELECT id FROM peticiones WHERE email = ?', [p.email])) continue;
    const [r] = await c.execute<ResultSetHeader>(
      'INSERT INTO peticiones (nombre, email, texto, es_privada, acepta_datos) VALUES (?, ?, ?, ?, 1)',
      [p.nombre, p.email, p.texto, p.privada],
    );
    count(r);
  }

  for (const m of CONTACTOS) {
    if (await idOf(c, 'SELECT id FROM contactos WHERE email = ?', [m.email])) continue;
    const [r] = await c.execute<ResultSetHeader>(
      'INSERT INTO contactos (nombre, email, mensaje, acepta_datos) VALUES (?, ?, ?, 1)',
      [m.nombre, m.email, m.mensaje],
    );
    count(r);
  }

  return added;
}

// ---------------------------------------------------------------------------------------------
// Quitar
// ---------------------------------------------------------------------------------------------

async function quitar(c: Connection) {
  let removed = 0;
  const run = async (sql: string, params: (string | number | null)[]) => {
    const [r] = await c.execute<ResultSetHeader>(sql, params);
    removed += r.affectedRows;
  };

  // Las inscripciones y solicitudes de lo de ejemplo se borran en cascada con su evento/grupo.
  await run(`DELETE FROM eventos WHERE slug LIKE ?`, [`%${MARK}`]);
  // Un área con voluntarios no se borra (RESTRICT): primero sus voluntarios de prueba.
  await run(
    `DELETE v FROM voluntarios v JOIN areas_servicio a ON a.id = v.area_id WHERE a.slug LIKE ?`,
    [`%${MARK}`],
  );
  await run(`DELETE FROM areas_servicio WHERE slug LIKE ?`, [`%${MARK}`]);
  for (const g of GRUPOS) {
    await run('DELETE FROM grupos WHERE nombre = ? AND descripcion = ?', [g.nombre, g.descripcion]);
  }
  for (const m of REUNIONES) {
    await run('DELETE FROM reuniones WHERE nombre = ? AND descripcion = ? AND dia_semana = ?', [
      m.nombre,
      m.descripcion,
      m.dia,
    ]);
  }
  for (const p of EQUIPO) {
    await run('DELETE FROM equipo WHERE nombre = ? AND rol = ?', [p.nombre, p.rol]);
  }
  // Una casa de ejemplo solo se borra si ya nadie la usa (un grupo real pudo quedarse en ella).
  for (const casa of CASAS) {
    await run(
      `DELETE FROM ubicaciones WHERE nombre = ? AND zona = ?
          AND NOT EXISTS (SELECT 1 FROM grupos g WHERE g.ubicacion_id = ubicaciones.id)
          AND NOT EXISTS (SELECT 1 FROM reuniones r WHERE r.ubicacion_id = ubicaciones.id)
          AND NOT EXISTS (SELECT 1 FROM eventos e WHERE e.ubicacion_id = ubicaciones.id)`,
      [casa.nombre, casa.zona],
    );
  }
  for (const [clave, valor] of Object.entries(CONFIG)) {
    const empty = clave === 'dar_cuentas' ? '[]' : null;
    await run('UPDATE config SET valor = ? WHERE clave = ? AND valor = ?', [empty, clave, valor]);
  }
  for (const [slug, descripcion] of Object.entries(MINISTERIOS)) {
    await run('UPDATE rangos_edad SET descripcion = NULL WHERE slug = ? AND descripcion = ?', [
      slug,
      descripcion,
    ]);
  }
  const like = `%${EMAIL_DOMAIN}`;
  await run('DELETE FROM peticiones WHERE email LIKE ?', [like]);
  await run('DELETE FROM contactos WHERE email LIKE ?', [like]);
  await run('DELETE FROM registros WHERE email LIKE ?', [like]);
  return removed;
}

// ---------------------------------------------------------------------------------------------

async function main() {
  const { values } = parseArgs({
    options: { cargar: { type: 'boolean' }, quitar: { type: 'boolean' } },
  });
  if (values.cargar === values.quitar) {
    fail('Indica qué hacer: npm run db:ejemplo -- --cargar   o   npm run db:ejemplo -- --quitar');
  }
  const connection = await openScriptConnection();
  const target = describeTarget(connection);
  try {
    await connection.beginTransaction();
    const changed = values.cargar ? await cargar(connection) : await quitar(connection);
    await connection.commit();
    console.log(
      values.cargar
        ? `✓ Datos de ejemplo cargados en ${target} (${changed} cambios).\n` +
            '  Las páginas se actualizan solas en unos 5 minutos (caché del sitio).\n' +
            '  Para quitarlos: npm run db:ejemplo -- --quitar'
        : `✓ Datos de ejemplo quitados de ${target} (${changed} cambios).`,
    );
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    await connection.end();
  }
}

main().catch((error: unknown) => {
  fail(
    `No se pudieron ${process.argv.includes('--quitar') ? 'quitar' : 'cargar'} los datos de ejemplo: ${error instanceof Error ? error.message : String(error)}`,
  );
});
