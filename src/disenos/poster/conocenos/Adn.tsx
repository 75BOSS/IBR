import { ADN } from '@/disenos/contenido';
import { TitularDesliza } from '../movimiento/TitularDesliza';
import { A_LOS_BORDES } from '../PortadaPagina';
import { CabeceraSeccion, Numero, Titulo } from '../piezas';

/** Las palabras clave del ADN, para el titular que corre con el scroll. */
const PALABRAS = 'Biblia ✶ Familia ✶ Gracia ✶ Servicio ✶ Generosidad ✶ Riobamba ✶ ';

/**
 * «Nuestro ADN» (contenido de EJEMPLO): dos titulares gigantes que corren en sentidos opuestos
 * con el scroll (uno relleno, otro hueco) y los seis valores en una grilla de periódico: el
 * primero en rojo, los demás en cajas que se invierten al pasar el cursor.
 */
export function Adn() {
  return (
    <section id="adn" aria-labelledby="adn-titulo" className="flex flex-col gap-1">
      <CabeceraSeccion
        id="adn-titulo"
        lema="Lo que nos define"
        titulo={
          <>
            Nuestro <em>ADN</em>
          </>
        }
      />
      <div className={`${A_LOS_BORDES} flex flex-col py-[clamp(0.5rem,2cqi,1rem)]`}>
        <TitularDesliza texto={PALABRAS.repeat(2)} />
        <TitularDesliza texto={PALABRAS.repeat(2)} alReves hueco />
      </div>
      <ul className="grid gap-1 @2xl/pagina:grid-cols-2 @5xl/pagina:grid-cols-3">
        {ADN.map((v, n) => (
          <li key={v.titulo} className="flex reveal">
            <article
              className={`@container flex flex-1 flex-col gap-[clamp(0.75rem,5cqi,1.25rem)] p-[clamp(1.125rem,7cqi,2rem)] ${
                n === 0
                  ? 'bg-accent text-canvas on-dark'
                  : 'd-invierte border-2 border-(--inv-borde)'
              }`}
            >
              <Numero
                className={`text-[clamp(3rem,22cqi,5rem)] ${n === 0 ? 'text-canvas' : 'text-(--inv-acento)'}`}
              >
                {String(n + 1).padStart(2, '0')}
              </Numero>
              <Titulo as="h3" estilo="condensado" className="text-[clamp(1.5rem,11cqi,2.5rem)]">
                {v.titulo}
              </Titulo>
              <p
                className={`text-[clamp(1rem,0.95rem+0.25vw,1.125rem)] leading-snug ${
                  n === 0 ? 'text-canvas/90' : 'text-(--inv-suave)'
                }`}
              >
                {v.texto}
              </p>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
