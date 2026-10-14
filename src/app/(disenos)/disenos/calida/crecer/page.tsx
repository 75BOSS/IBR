import type { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { datosCrecer } from '@/disenos/datos';
import { BAUTISMO, CURSOS, RUTA_CRECER, SALVACION } from '@/disenos/contenido';
import { Acordeon } from '@/disenos/calida/Acordeon';
import { CabeceraPagina } from '@/disenos/calida/CabeceraPagina';
import { Contenedor } from '@/disenos/calida/Contenedor';
import { AreasMosaico, CursosEscalera, SalvacionBanda } from '@/disenos/calida/Crecer';
import { EncabezadoSeccion } from '@/disenos/calida/EncabezadoSeccion';
import { EnlaceFlecha } from '@/disenos/calida/EnlaceFlecha';
import { Foto } from '@/disenos/calida/Foto';
import { RitmoPagina } from '@/disenos/calida/RitmoPagina';
import { RutaCrecer } from '@/disenos/calida/RutaCrecer';
import { SiguientePaso } from '@/disenos/calida/SiguientePaso';
import { Texto } from '@/disenos/calida/Texto';
import { botonCalida } from '@/disenos/calida/botones';
import { destinoPaso } from '@/disenos/calida/textos';

export const revalidate = 300;

export const metadata: Metadata = { title: 'A · Cálida · Crecer' };

/**
 * Crecer de la propuesta A · Cálida (como «Siguiente paso» de caminodevida y el proceso de
 * formación de Su Presencia): la ruta en cinco pasos, salvación (#salvacion) con la oración,
 * bautismo (#bautismo) con sus preguntas, la Escuela de Discipulado (#formacion), servir con las
 * áreas reales (#servir) y el cierre «Quiero dar mi siguiente paso».
 */
export default async function CalidaCrecer() {
  const { content, areas } = await datosCrecer();
  const pasos = RUTA_CRECER.map((p) => ({ ...p, href: destinoPaso(p.href, content, true) }));
  const aServir = content.servir ? '/servir' : '/contacto#mensaje';

  return (
    <RitmoPagina>
      <CabeceraPagina
        id="calida-crecer"
        etiqueta="Siguiente paso"
        titulo={
          <>
            Crecer <em className="-mt-[0.08em] block">juntos.</em>
          </>
        }
        texto="La vida con Jesús es un camino y nadie tiene que recorrerlo solo. Estos son los pasos que damos como familia."
        acciones={
          <Link href="/contacto#mensaje" className={botonCalida('naranja', 'normal')}>
            Quiero dar mi siguiente paso
            <Icon name="arrowRight" className="size-4" />
          </Link>
        }
        foto={{
          src: '/disenos/calida/conversacion.webp',
          alt: 'Una joven ríe mientras conversa con sus amigos de la iglesia',
          encuadre: 'object-[45%_center]',
        }}
        indice={[
          { href: '#ruta', label: 'La ruta' },
          { href: '#salvacion', label: 'Salvación' },
          { href: '#bautismo', label: 'Bautismo' },
          { href: '#formacion', label: 'Formación' },
          { href: '#servir', label: 'Servir' },
        ]}
      />

      <section id="ruta" aria-labelledby="calida-ruta">
        <Contenedor className="flex flex-col gap-[clamp(2rem,4vw,3.5rem)]">
          <EncabezadoSeccion
            id="calida-ruta"
            etiqueta="La ruta"
            titulo={
              <>
                Cinco pasos, un <em>camino</em>
              </>
            }
            texto="No importa dónde estés hoy: hay un siguiente paso para ti. Empieza por el que te toca."
          />
          <RutaCrecer pasos={pasos} acciones />
        </Contenedor>
      </section>

      <section id="salvacion" aria-labelledby="calida-salvacion">
        <Contenedor ancho="amplio">
          <SalvacionBanda id="calida-salvacion" {...SALVACION} />
        </Contenedor>
      </section>

      <section id="bautismo" aria-labelledby="calida-bautismo">
        <Contenedor className="grid gap-[clamp(2rem,5vw,5rem)] lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
          <div className="flex flex-col gap-[clamp(1.25rem,2.5vw,2rem)] lg:sticky lg:top-28 lg:self-start">
            <Foto
              src="/fotos-ejemplo/evento-bautismos.webp"
              alt="Dos hermanas se abrazan emocionadas el día del bautismo"
              sizes="(min-width: 64rem) 40vw, 100vw"
              paralaje
              className="calida-aparece relative aspect-[4/3] rounded-[0.875rem] lg:aspect-[5/6]"
            />
          </div>
          <div className="flex flex-col gap-[clamp(1.25rem,2.5vw,2rem)]">
            <EncabezadoSeccion
              id="calida-bautismo"
              etiqueta="Paso 02 · Bautismo"
              titulo={
                <>
                  El <em>bautismo</em>
                </>
              }
              texto={BAUTISMO.texto}
            />
            <p className="calida-aparece inline-flex items-start gap-3 self-start rounded-[0.875rem] bg-accent-soft px-4 py-3 font-semibold text-ink">
              <Icon name="calendar" className="mt-0.5 size-5 shrink-0 text-accent-strong" />
              {BAUTISMO.proximo}
            </p>
            <div className="calida-aparece">
              <Acordeon preguntas={BAUTISMO.preguntas} />
            </div>
            <Link
              href="/contacto#mensaje"
              className={botonCalida('naranja', 'normal', 'calida-aparece self-start')}
            >
              Quiero bautizarme
              <Icon name="arrowRight" className="size-4" />
            </Link>
          </div>
        </Contenedor>
      </section>

      <section id="formacion" aria-labelledby="calida-formacion">
        <Contenedor className="flex flex-col gap-[clamp(2rem,4vw,3rem)]">
          <EncabezadoSeccion
            id="calida-formacion"
            etiqueta="Paso 04 · Formación"
            titulo={
              <>
                Escuela de <em>Discipulado</em>
              </>
            }
            texto="Bases firmes en la fe, paso a paso y en comunidad. Cada módulo te prepara para el siguiente."
            accion={<EnlaceFlecha href="/contacto#mensaje">Quiero inscribirme</EnlaceFlecha>}
          />
          <CursosEscalera cursos={CURSOS} />
        </Contenedor>
      </section>

      <section id="servir" aria-labelledby="calida-servir">
        <Contenedor className="flex flex-col gap-[clamp(2rem,4vw,3rem)]">
          <EncabezadoSeccion
            id="calida-servir"
            etiqueta="Paso 05 · Servir"
            titulo={
              <>
                Sirve con tus <em>dones</em>
              </>
            }
            texto="Hay un lugar para tus talentos en un equipo. Servir es una de las mejores formas de crecer y hacer amigos."
            accion={
              <EnlaceFlecha href={aServir}>
                {content.servir ? 'Ver oportunidades' : 'Quiero servir'}
              </EnlaceFlecha>
            }
          />
          {areas.length > 0 ? (
            <AreasMosaico areas={areas} href={aServir} />
          ) : (
            <Texto className="calida-aparece text-ink-soft">
              Escríbenos y te contamos en qué equipo puedes empezar.
            </Texto>
          )}
        </Contenedor>
      </section>

      <SiguientePaso
        id="calida-crecer-cierre"
        etiqueta="Tu siguiente paso"
        titulo={
          <>
            ¿Listo para dar el <em>siguiente?</em>
          </>
        }
        texto="Cuéntanos en qué paso estás y alguien del equipo pastoral te acompaña en el que sigue."
        boton={{ href: '/contacto#mensaje', label: 'Quiero dar mi siguiente paso' }}
        foto={{
          src: '/disenos/calida/sonrisa.webp',
          alt: 'Un joven sonríe mientras conversa con sus amigos después del culto',
          encuadre: 'object-[45%_center]',
        }}
      />
    </RitmoPagina>
  );
}
