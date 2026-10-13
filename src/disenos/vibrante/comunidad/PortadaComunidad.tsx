import { Foto } from '@/disenos/vibrante/Foto';
import { FOTOS } from '@/disenos/vibrante/fotos';

/**
 * Portada de Comunidad (imagen 5): «La vida se comparte.» en negro con la itálica roja, una raya
 * roja y la frase; a la derecha, el mosaico (una foto grande y dos apiladas) de borde a borde.
 * En celular y tablet el mosaico va debajo del texto.
 */
export function PortadaComunidad() {
  return (
    <section
      aria-labelledby="comunidad-titulo"
      className="grid lg:min-h-[clamp(24rem,25.4vw,34rem)] lg:grid-cols-[minmax(0,39fr)_minmax(0,61fr)]"
    >
      <div className="@container flex flex-col justify-center gap-[clamp(1.25rem,4cqi,1.75rem)] py-[clamp(2.5rem,8vw,3.5rem)] pr-[clamp(1rem,3.9vw,2rem)] pl-[clamp(1rem,3.9vw,3.75rem)] lg:py-8">
        <h1
          id="comunidad-titulo"
          className="font-display text-[clamp(3rem,21cqi,7.5rem)] leading-[0.9] font-black tracking-[-0.04em] [--em-escala:1.08em] lg:text-[23cqi] lg:[--em-escala:1.06em]"
        >
          <span className="block">La vida se</span>{' '}
          <em className="-ml-[0.04em] block">comparte.</em>
        </h1>
        <span aria-hidden="true" className="h-[3px] w-[clamp(2rem,8cqi,2.75rem)] bg-accent" />
        <p className="max-w-[44ch] text-[clamp(1.0625rem,0.95rem+0.4vw,1.25rem)] leading-snug">
          En IBR creemos que la fe se vive mejor en comunidad. Aquí encuentras personas reales, para
          caminar juntos, crecer y hacer la diferencia.
        </p>
      </div>
      <div className="grid aspect-[16/10] grid-cols-[minmax(0,645fr)_minmax(0,284fr)] grid-rows-[225fr_156fr] gap-1.5 lg:aspect-auto">
        <Foto
          foto={FOTOS.vidaAbrazo}
          prioridad
          sizes="(min-width: 64rem) 42vw, 68vw"
          className="row-span-2"
        />
        <Foto foto={FOTOS.vidaAlabanza} prioridad sizes="(min-width: 64rem) 19vw, 31vw" />
        <Foto foto={FOTOS.vidaAmigas} sizes="(min-width: 64rem) 19vw, 31vw" />
      </div>
    </section>
  );
}
