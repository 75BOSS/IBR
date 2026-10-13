/**
 * Fotos provisionales de la propuesta B · Vibrante: recortadas de sus imágenes (IBRWEB/Propuesta
 * 4, 5 y 6) hasta que la iglesia entregue fotos propias. Cada una en public/disenos/vibrante/.
 */
export type FotoVibrante = {
  src: string;
  alt: string;
  /** Punto de la foto que se conserva al recortarla (clase object-position). */
  encuadre?: string;
};

const ruta = (nombre: string) => `/disenos/vibrante/${nombre}.webp`;

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
} satisfies Record<string, FotoVibrante>;
