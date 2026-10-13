import { Lema, Titulo } from '../piezas';

/**
 * «SOMOS FAMILIA» del póster. Página ancha (imagen 13): una sola línea azul marino, muy
 * condensada, a todo lo ancho, y el lema completo. Angosta (imagen 15): «SOMOS» azul y «FAMILIA»
 * roja apiladas, más anchas, cada una casi del ancho de la pantalla, y solo el nombre de la
 * iglesia. El tamaño sale del ancho de la página (cqi), así llena el renglón en cualquier
 * pantalla (medido: «SOMOS FAMILIA» en Archivo negra al 62 % mide 5,6 em).
 */
export function Titular({ nombre }: { nombre: string }) {
  return (
    <header className="flex flex-col items-center gap-[clamp(0.75rem,2.6cqi,1.25rem)] border-x-2 border-b-2 border-ink px-[3cqi] pt-[clamp(1.5rem,7cqi,2.5rem)] pb-[clamp(1rem,5cqi,1.5rem)] lg:-mx-1.5 @2xl/pagina:border-x-0 @2xl/pagina:px-[2.5cqi] @2xl/pagina:pt-[1cqi] @2xl/pagina:pb-[1.6cqi]">
      <Titulo
        as="h1"
        estilo="negro"
        className="flex flex-col items-center text-center text-[25.6cqi] font-stretch-[78%] @2xl/pagina:flex-row @2xl/pagina:gap-[0.2em] @2xl/pagina:text-[16.5cqi] @2xl/pagina:font-stretch-[62%]"
      >
        <span>Somos</span> <span className="text-accent @2xl/pagina:text-ink">Familia</span>
      </Titulo>
      <Lema className="text-center">
        {nombre}
        <span className="hidden @4xl/pagina:inline"> · Una comunidad para compartir la vida</span>
      </Lema>
    </header>
  );
}
