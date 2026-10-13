import Image from 'next/image';
import Link from 'next/link';
import { Icon } from '@/components/Icon';
import type { SiteContent } from '@/lib/nav';
import { IconoPoster, type IconoPosterNombre } from '../IconoPoster';
import { Lema, Raya, Titulo } from '../piezas';

type UltimaPredica = { titulo: string } | null;

/** Accesos de «Conecta»: solo los que tienen contenido; sin ninguno, «Escríbenos». */
export function accesosConecta(content: SiteContent) {
  const accesos: { href: string; etiqueta: string; icono: IconoPosterNombre }[] = [
    ...(content.grupos
      ? [{ href: '/grupos', etiqueta: 'Grupos en casa', icono: 'users' as const }]
      : []),
    ...(content.ministerios
      ? [{ href: '/ministerios', etiqueta: 'Niños y familias', icono: 'familia' as const }]
      : []),
  ];
  return accesos.length > 0
    ? accesos
    : [{ href: '/contacto#mensaje', etiqueta: 'Escríbenos', icono: 'message' as const }];
}

/**
 * Fila de abajo de la grilla de escritorio (imagen 13): tarjeta oscura de Prédicas, la lista
 * «Conecta» y la foto «Servir juntos», con las proporciones de la imagen (página ≥ 56rem). En
 * una página más angosta (tablet, o escritorio de 1024 px con el menú lateral) las dos fotos van
 * lado a lado y «Conecta» debajo a todo lo ancho. Las que no tienen destino no se dibujan y las
 * otras se estiran (flex), sin huecos.
 */
const ALTO_FOTO = 'min-h-[clamp(13rem,21cqi,18rem)]';
export function FilaInferior({
  content,
  ultimaPredica,
  className = '',
}: {
  content: SiteContent;
  ultimaPredica: UltimaPredica;
  className?: string;
}) {
  return (
    <div className={`flex-wrap gap-1 ${className}`}>
      {content.predicas && (
        <TarjetaPredicas
          ultimaPredica={ultimaPredica}
          className={`${ALTO_FOTO} grow basis-[calc(50%-0.125rem)] @4xl/pagina:grow-[37] @4xl/pagina:basis-0`}
        />
      )}
      <ListaConecta
        content={content}
        className="order-last basis-full @4xl/pagina:order-none @4xl/pagina:grow-[24] @4xl/pagina:basis-0"
      />
      {content.servir && (
        <TarjetaServir
          className={`${ALTO_FOTO} grow basis-[calc(50%-0.125rem)] @4xl/pagina:grow-[38] @4xl/pagina:basis-0`}
        />
      )}
    </div>
  );
}

function TarjetaPredicas({
  ultimaPredica,
  className,
}: {
  ultimaPredica: UltimaPredica;
  className: string;
}) {
  return (
    <Link
      href="/predicas"
      className={`group @container flex min-w-0 border-2 border-ink p-1 ${className}`}
    >
      <div className="relative isolate flex flex-1 flex-col justify-between gap-[5cqi] overflow-hidden bg-(--d-noche) p-[6.4cqi] text-canvas on-dark">
        <div aria-hidden="true" className="absolute inset-y-0 right-0 -z-10 w-[58%]">
          <Image
            src="/disenos/poster/predicas.webp"
            alt=""
            fill
            sizes="(min-width: 64rem) 20vw, 30vw"
            className="object-cover object-[70%_center] motion-safe:transition-transform motion-safe:duration-700 motion-safe:group-hover:scale-105"
          />
          <span className="absolute inset-y-0 left-0 w-1/3 bg-linear-to-r from-(--d-noche) to-transparent" />
        </div>
        <div className="flex max-w-[50%] flex-col gap-[3.6cqi]">
          <Titulo estilo="grueso" className="text-[clamp(1.75rem,10.6cqi,3.5rem)]">
            Prédicas
          </Titulo>
          <Lema tamano="text-[clamp(0.625rem,2.75cqi,0.875rem)]">Mensajes para la vida diaria</Lema>
        </div>
        <div className="flex max-w-[52%] items-center gap-[3cqi]">
          <span className="grid size-[clamp(2.75rem,13.8cqi,4.5rem)] shrink-0 place-items-center rounded-full bg-accent motion-safe:transition-transform motion-safe:group-hover:scale-110">
            <Icon name="play" className="size-[42%] translate-x-[8%] fill-current" />
          </span>
          {ultimaPredica && (
            <span className="flex min-w-0 flex-col text-[clamp(0.75rem,2.9cqi,0.9375rem)] leading-snug">
              <span className="text-canvas/75">Último mensaje</span>
              <span className="line-clamp-2 font-semibold">{ultimaPredica.titulo}</span>
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

function ListaConecta({ content, className }: { content: SiteContent; className: string }) {
  return (
    <section
      aria-labelledby="conecta-grilla"
      className={`@container flex min-w-0 flex-col border-2 border-ink ${className}`}
    >
      {/* A todo lo ancho (página angosta) el titular va a la izquierda y la lista a la derecha. */}
      <div className="flex flex-1 flex-col gap-[clamp(1rem,6cqi,1.5rem)] px-[clamp(1.25rem,11cqi,2.25rem)] pt-[clamp(1.25rem,8cqi,2rem)] pb-[clamp(1rem,6cqi,1.5rem)] @xl:flex-row @xl:items-center @xl:gap-[6cqi]">
        <div className="flex flex-col gap-[clamp(0.75rem,6cqi,1.25rem)] @xl:shrink-0">
          <Titulo
            id="conecta-grilla"
            estilo="grueso"
            className="text-[clamp(1.75rem,15.4cqi,3.5rem)]"
          >
            Conecta
          </Titulo>
          <Raya />
        </div>
        <ul className="grid @xl:flex-1 @xl:grid-cols-2 @xl:gap-x-[5cqi]">
          {accesosConecta(content).map((a) => (
            <li key={a.href} className="border-b border-ink">
              <Link
                href={a.href}
                className="group flex min-h-[clamp(2.75rem,21cqi,4.25rem)] items-center gap-[clamp(0.75rem,5cqi,1.25rem)] text-[clamp(0.9375rem,5.9cqi,1.1875rem)] hover:text-accent"
              >
                <IconoPoster nombre={a.icono} className="size-[1.35em]" />
                <span className="flex-1">{a.etiqueta}</span>
                <Icon
                  name="arrowRight"
                  className="size-[1.25em] motion-safe:transition-transform motion-safe:group-hover:translate-x-1"
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function TarjetaServir({ className }: { className: string }) {
  return (
    <Link
      href="/servir"
      className={`group @container flex min-w-0 border-2 border-ink p-1 ${className}`}
    >
      <div className="relative isolate flex flex-1 flex-col justify-end gap-[3.4cqi] overflow-hidden p-[6cqi] text-canvas on-dark">
        <Image
          src="/disenos/poster/servir.webp"
          alt="Voluntarios de la iglesia entregan cajas con víveres a una vecina"
          fill
          sizes="(min-width: 64rem) 30vw, 40vw"
          className="-z-20 object-cover motion-safe:transition-transform motion-safe:duration-700 motion-safe:group-hover:scale-105"
        />
        <span
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-linear-to-tr from-(--d-sombra-foto) via-transparent via-55% to-transparent"
        />
        <Titulo estilo="grueso" className="text-[clamp(1.75rem,10cqi,3.5rem)]">
          Servir
          <br />
          juntos
        </Titulo>
        <Raya />
      </div>
    </Link>
  );
}
