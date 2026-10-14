/**
 * Fotos provisionales de la propuesta B · Vibrante: recortadas de sus imágenes (IBRWEB/Propuesta
 * 4, 5 y 6; el auditorio y la adoración, de la 7 y la 10) hasta que la iglesia entregue fotos
 * propias, en public/disenos/vibrante/. Las de `ejemplo()` son las fotos de ejemplo compartidas
 * del sitio (public/fotos-ejemplo/).
 */
export type FotoVibrante = {
  src: string;
  alt: string;
  /** Punto de la foto que se conserva al recortarla (clase object-position). */
  encuadre?: string;
};

const ruta = (nombre: string) => `/disenos/vibrante/${nombre}.webp`;
const ejemplo = (nombre: string) => `/fotos-ejemplo/${nombre}.webp`;

export const FOTOS = {
  adoracion: {
    src: ruta('portada-adoracion'),
    alt: 'Un joven adora con los ojos cerrados y la mano en alto',
    encuadre: 'object-[55%_30%]',
  },
  abrazo: { src: ruta('portada-abrazo'), alt: 'Dos amigas se abrazan durante la reunión' },
  guitarra: {
    src: ruta('portada-guitarra'),
    alt: 'Un joven toca la guitarra en el grupo de alabanza',
    encuadre: 'object-[60%_40%]',
  },
  sonrisa: { src: ruta('comunidad-sonrisa'), alt: 'Una joven sonríe conversando con amigos' },
  gorra: {
    src: ruta('comunidad-gorra'),
    alt: 'Un joven con gorra levanta la mano en la adoración',
    encuadre: 'object-[50%_30%]',
  },
  risas: { src: ruta('comunidad-risas'), alt: 'Un grupo de mujeres ríe junto' },
  predicador: {
    src: ruta('predicador'),
    alt: 'El predicador habla con el micrófono en la mano',
    encuadre: 'object-[60%_30%]',
  },
  lugar: { src: ruta('lugar-amigos'), alt: 'Jóvenes conversan y ríen alrededor de una mesa' },
  vidaAbrazo: {
    src: ruta('vida-abrazo'),
    alt: 'Amigos se abrazan riendo al terminar la reunión',
    encuadre: 'object-[60%_40%]',
  },
  vidaAlabanza: {
    src: ruta('vida-alabanza'),
    alt: 'Un joven adora con la mano levantada',
    encuadre: 'object-[50%_30%]',
  },
  vidaAmigas: { src: ruta('vida-amigas'), alt: 'Dos amigas conversan sonriendo' },
  gruposCasa: {
    src: ruta('grupos-casa'),
    alt: 'Un grupo conversa y ríe en una casa',
    encuadre: 'object-[40%_40%]',
  },
  ninos: { src: ruta('ninos-familias'), alt: 'Un niño ríe junto a otros niños' },
  servir: {
    src: ruta('servir-juntos'),
    alt: 'Un voluntario prepara el equipo de sonido',
    encuadre: 'object-[70%_40%]',
  },
  siguientePaso: {
    src: ruta('siguiente-paso'),
    alt: 'Una joven sonríe conversando con amigos',
    encuadre: 'object-[60%_40%]',
  },
  auditorio: {
    src: ruta('auditorio-balcon'),
    alt: 'El auditorio lleno durante el culto del domingo',
  },
  escenario: {
    src: ruta('auditorio-escenario'),
    alt: 'La congregación adora frente al escenario con las manos en alto',
  },
  adoracionJuntos: {
    src: ruta('adoracion-juntos'),
    alt: 'Jóvenes adoran con los ojos cerrados y las manos abiertas',
    encuadre: 'object-[60%_40%]',
  },
  nosotros: { src: ejemplo('nosotros'), alt: 'La iglesia canta reunida en el auditorio' },
  bautismo: {
    src: ejemplo('evento-bautismos'),
    alt: 'Dos hermanas se abrazan después de un bautismo',
    encuadre: 'object-[50%_35%]',
  },
  estudio: { src: ejemplo('grupo-estudio'), alt: 'Un joven explica la Biblia a su grupo' },
  oracionCafe: {
    src: ejemplo('grupo-oracion-cafe'),
    alt: 'Dos amigos conversan con la Biblia abierta y un café',
  },
  familias: { src: ejemplo('grupo-familias'), alt: 'Un grupo de familias conversa en una sala' },
  mujeres: { src: ejemplo('grupo-mujeres'), alt: 'Dos mujeres conversan y ríen' },
  matrimonios: {
    src: ejemplo('grupo-matrimonios'),
    alt: 'Parejas comparten alrededor de una mesa',
  },
  hombres: {
    src: ejemplo('evento-retiro'),
    alt: 'Hombres ríen juntos en un retiro',
    encuadre: 'object-[40%_40%]',
  },
  domingo: { src: ejemplo('evento-domingo'), alt: 'Amigos conversan antes del culto' },
  bienvenida: {
    src: ejemplo('area-bienvenida'),
    alt: 'Una voluntaria de bienvenida recibe a una visita en la entrada',
    encuadre: 'object-[70%_40%]',
  },
  kids: { src: ejemplo('ministerio-kids'), alt: 'Niños sonríen en su clase bíblica' },
  vigilia: {
    src: ejemplo('evento-vigilia'),
    alt: 'Una joven adora con la mano levantada',
    encuadre: 'object-[50%_25%]',
  },
} satisfies Record<string, FotoVibrante>;
