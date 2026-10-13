/**
 * Contenido de EJEMPLO para las propuestas de diseño (2026-10-13), inspirado en lo que muestran
 * caminodevida.com, masvida.org, supresencia.com y ciem.casadedios.org, pero pensado para la
 * Iglesia Bíblica Riobamba. Todas las propuestas usan este mismo texto para que la comparación
 * sea justa. Nada de esto es información confirmada: la iglesia debe revisarlo y reemplazarlo
 * (historia, valores, cursos, fechas y testimonios). Sin teléfonos, direcciones ni apellidos
 * reales.
 */

export type Valor = { titulo: string; texto: string };
export type Hito = { anio: string; titulo: string; texto: string };
export type Paso = { numero: string; titulo: string; texto: string; href: string; accion: string };
export type Curso = { titulo: string; duracion: string; texto: string };
export type Pregunta = { pregunta: string; respuesta: string };
export type MinisterioExtra = { slug: string; nombre: string; para: string; texto: string };
export type Serie = { titulo: string; mensajes: number; texto: string };
export type Devocional = { dia: string; pasaje: string; titulo: string; texto: string };
export type Testimonio = { nombre: string; barrio: string; texto: string };

/** «Nuestro ADN»: lo que nos define (como el ADN de caminodevida o el de Su Presencia). */
export const ADN: Valor[] = [
  {
    titulo: 'La Biblia al centro',
    texto: 'Todo lo que hacemos nace de la Palabra de Dios: la leemos, la enseñamos y la vivimos.',
  },
  {
    titulo: 'Somos familia',
    texto: 'Nadie camina solo. Nos cuidamos, nos animamos y compartimos la vida como hermanos.',
  },
  {
    titulo: 'Gracia que transforma',
    texto: 'Recibimos a todos tal como son, porque Jesús nos recibió así y nos sigue cambiando.',
  },
  {
    titulo: 'Pasión por servir',
    texto: 'Usamos nuestros dones para bendecir a la iglesia y a nuestra ciudad, sin esperar nada.',
  },
  {
    titulo: 'Generosidad',
    texto:
      'Damos con alegría nuestro tiempo, talentos y recursos, porque Dios fue generoso primero.',
  },
  {
    titulo: 'Riobamba en el corazón',
    texto: 'Oramos por nuestra ciudad, sus barrios y sus familias, y salimos a servirla.',
  },
];

/** Línea de tiempo de ejemplo para «Conócenos». */
export const HISTORIA: Hito[] = [
  {
    anio: '2008',
    titulo: 'Una casa, una Biblia abierta',
    texto: 'Un grupo pequeño empieza a reunirse para estudiar la Palabra y orar por Riobamba.',
  },
  {
    anio: '2012',
    titulo: 'Nuestro primer auditorio',
    texto: 'La familia crece y los domingos pasan a un local propio para recibir a más personas.',
  },
  {
    anio: '2016',
    titulo: 'Grupos en toda la ciudad',
    texto: 'Abren grupos en casas de distintos barrios: la iglesia también sucede entre semana.',
  },
  {
    anio: '2020',
    titulo: 'Iglesia en línea',
    texto: 'Empezamos a transmitir cada culto para acompañar a quienes no podían venir.',
  },
  {
    anio: '2026',
    titulo: 'Somos Familia',
    texto:
      'Seguimos creyendo lo mismo que al principio: la Palabra cambia vidas y nadie camina solo.',
  },
];

/** «Tu siguiente paso»: la ruta de crecimiento (como Crecer de caminodevida). */
export const RUTA_CRECER: Paso[] = [
  {
    numero: '01',
    titulo: 'Conoce a Jesús',
    texto: 'Todo empieza con una decisión: recibir el regalo de la salvación por la fe en Jesús.',
    href: '#salvacion',
    accion: 'Quiero saber más',
  },
  {
    numero: '02',
    titulo: 'Bautízate',
    texto: 'Dile al mundo que ahora sigues a Jesús. Te preparamos en una clase antes del bautismo.',
    href: '#bautismo',
    accion: 'Sobre el bautismo',
  },
  {
    numero: '03',
    titulo: 'Únete a un grupo',
    texto: 'Un grupo en casa cerca de ti para crecer en la Palabra y hacer amigos de verdad.',
    href: '/grupos',
    accion: 'Buscar un grupo',
  },
  {
    numero: '04',
    titulo: 'Fórmate',
    texto: 'La Escuela de Discipulado te da bases firmes en la fe, paso a paso y en comunidad.',
    href: '#formacion',
    accion: 'Ver los cursos',
  },
  {
    numero: '05',
    titulo: 'Sirve',
    texto: 'Descubre tus dones y úsalos en un equipo: alabanza, niños, bienvenida y más.',
    href: '/servir',
    accion: 'Quiero servir',
  },
];

/** Escuela de Discipulado (como los módulos de CIEM o el proceso de formación de Su Presencia). */
export const CURSOS: Curso[] = [
  {
    titulo: 'Fundamentos de la fe',
    duracion: '8 semanas',
    texto: 'Quién es Dios, la salvación, la Biblia y la oración. Ideal si estás empezando.',
  },
  {
    titulo: 'Vida en el Espíritu',
    duracion: '6 semanas',
    texto: 'Cómo crecer cada día: carácter, decisiones y una relación viva con Dios.',
  },
  {
    titulo: 'Discipulado',
    duracion: '10 semanas',
    texto: 'Aprende a acompañar a otros en la fe, como Jesús lo hizo con sus discípulos.',
  },
  {
    titulo: 'Escuela de líderes',
    duracion: '12 semanas',
    texto: 'Para quienes guían un grupo o un equipo: servir, enseñar y cuidar a otros.',
  },
];

export const BAUTISMO = {
  titulo: 'El bautismo',
  texto:
    'Bautizarse es una declaración pública de que has decidido seguir a Jesús. No te salva: es la señal de lo que Dios ya hizo en tu vida. Antes de cada bautismo tenemos una clase corta para conversar y resolver tus preguntas.',
  proximo: 'El próximo bautismo es en noviembre (fecha de ejemplo).',
  preguntas: [
    {
      pregunta: '¿Quién puede bautizarse?',
      respuesta:
        'Toda persona que ha recibido a Jesús y quiere seguirlo. Los niños, cuando entienden la decisión y con el acompañamiento de sus papás.',
    },
    {
      pregunta: '¿Me bauticé de niño, debo hacerlo otra vez?',
      respuesta:
        'Creemos en el bautismo como una decisión personal de fe. Conversemos en la clase: te ayudamos a decidir.',
    },
    {
      pregunta: '¿Qué llevo ese día?',
      respuesta: 'Ropa cómoda oscura, una toalla y una muda de ropa. ¡E invita a tu familia!',
    },
    {
      pregunta: '¿Cómo me inscribo?',
      respuesta: 'Escríbenos desde Contacto y te avisamos la fecha de la próxima clase.',
    },
  ] satisfies Pregunta[],
};

export const SALVACION = {
  titulo: 'Un nuevo comienzo',
  texto:
    'Dios te ama y quiere tener una relación contigo. Todos fallamos y nos alejamos de Él, pero Jesús murió y resucitó para darnos perdón y vida nueva. No es por lo que hacemos: es un regalo que se recibe por la fe.',
  oracion:
    'Jesús, creo que moriste por mí y resucitaste. Te pido perdón y te recibo en mi vida. Quiero seguirte. Gracias por tu amor.',
  siguiente: 'Si hiciste esta oración, cuéntanos: queremos acompañarte en tus primeros pasos.',
};

/** Primera visita: qué esperar y preguntas frecuentes (como «Soy nuevo» de caminodevida). */
export const QUE_ESPERAR: Valor[] = [
  {
    titulo: 'Una bienvenida de verdad',
    texto: 'El equipo de bienvenida te recibe en la entrada y te ayuda a encontrar un lugar.',
  },
  { titulo: 'Alabanza', texto: 'Cantamos juntos unos 25 minutos, con música actual y en vivo.' },
  {
    titulo: 'Una prédica para la vida',
    texto: 'Un mensaje de la Biblia, claro y práctico, de unos 40 minutos.',
  },
  {
    titulo: 'Café y amigos',
    texto: 'Al terminar compartimos un café: es el mejor momento para conocernos.',
  },
];

export const PREGUNTAS_VISITA: Pregunta[] = [
  {
    pregunta: '¿Cómo me visto?',
    respuesta: 'Como te sientas cómodo. Vas a ver jeans, ropa casual y también ropa formal.',
  },
  { pregunta: '¿Cuánto dura el culto?', respuesta: 'Alrededor de una hora y media.' },
  {
    pregunta: '¿Qué hago con mis hijos?',
    respuesta:
      'Los niños de 3 a 11 años tienen su propia clase bíblica mientras los papás están en el culto, con maestros preparados.',
  },
  {
    pregunta: '¿Tengo que dar dinero?',
    respuesta:
      'No. La ofrenda es para quienes ya son parte de la familia; tú eres nuestro invitado.',
  },
  {
    pregunta: '¿Y si no conozco a nadie?',
    respuesta: 'Pasa por el punto de bienvenida y te presentamos a alguien. Nadie se queda solo.',
  },
];

/** Ministerios que aún no son rangos de edad en la BD (ejemplo, como Ellas cdv o Unidas). */
export const MINISTERIOS_EXTRA: MinisterioExtra[] = [
  {
    slug: 'mujeres',
    nombre: 'Mujeres',
    para: 'Para todas las edades',
    texto: 'Encuentros mensuales, grupos de estudio y amistad para crecer juntas en la fe.',
  },
  {
    slug: 'matrimonios',
    nombre: 'Matrimonios',
    para: 'Parejas casadas o por casarse',
    texto: 'Talleres, cenas y grupos para fortalecer el matrimonio con principios bíblicos.',
  },
  {
    slug: 'hombres',
    nombre: 'Hombres',
    para: 'Desde los 18 años',
    texto:
      'Desayunos, estudio y rendición de cuentas para ser hombres conforme al corazón de Dios.',
  },
];

/** Recursos: series de prédicas, devocionales de la semana y testimonios (ejemplo). */
export const SERIES: Serie[] = [
  {
    titulo: 'Somos Familia',
    mensajes: 6,
    texto: 'Qué significa ser iglesia, cuidarnos unos a otros y caminar juntos.',
  },
  {
    titulo: 'Toda autoridad',
    mensajes: 4,
    texto: 'Jesús tiene la última palabra sobre nuestra vida, nuestros miedos y nuestro futuro.',
  },
  {
    titulo: 'Salmos para la semana',
    mensajes: 8,
    texto: 'Oraciones antiguas para los días buenos, los difíciles y los de todos los días.',
  },
];

export const DEVOCIONALES: Devocional[] = [
  {
    dia: 'Lunes',
    pasaje: 'Salmo 23',
    titulo: 'Nada me faltará',
    texto: 'Dios es tu pastor también en esta semana.',
  },
  {
    dia: 'Martes',
    pasaje: 'Juan 15:1-11',
    titulo: 'Permanecer',
    texto: 'El fruto viene de estar unidos a Jesús.',
  },
  {
    dia: 'Miércoles',
    pasaje: 'Filipenses 4:4-9',
    titulo: 'La paz que cuida',
    texto: 'Cambia la ansiedad por oración y gratitud.',
  },
  {
    dia: 'Jueves',
    pasaje: 'Mateo 11:28-30',
    titulo: 'Descanso',
    texto: 'Jesús te invita a dejar tu carga.',
  },
  {
    dia: 'Viernes',
    pasaje: 'Romanos 12:9-18',
    titulo: 'Amor sincero',
    texto: 'Cómo se ve el amor de Dios entre nosotros.',
  },
];

export const TESTIMONIOS: Testimonio[] = [
  {
    nombre: 'Andrea',
    barrio: 'La Politécnica',
    texto:
      'Llegué sin conocer a nadie y en mi grupo encontré una familia. Hoy sirvo en bienvenida.',
  },
  {
    nombre: 'Diego',
    barrio: 'Centro',
    texto: 'Vine por mis hijos y me quedé por mí. Las prédicas me ayudaron a entender la Biblia.',
  },
  {
    nombre: 'Mónica',
    barrio: 'Licán',
    texto: 'En la Escuela de Discipulado aprendí a orar de verdad. Mi vida cambió.',
  },
  {
    nombre: 'Esteban',
    barrio: 'Bellavista',
    texto: 'El equipo de jóvenes me recibió como un hermano. Aquí siempre hay un lugar para ti.',
  },
];
