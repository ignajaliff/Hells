import Image from 'next/image'
import { resenas, resenasContent } from '@/content/resenas'
import { TarjetaResena } from '@/components/ui/TarjetaResena'
import { LINK_RESENAS, SECCIONES } from '@/lib/constants'

/**
 * Reseñas (2026-09-02, pedido del cliente): debajo de la carta. La intro es
 * el texto del cliente —el cliché de "somos dos amigos..." cortado con un
 * "Ufff, aburrido"— y debajo una fila de reseñas de Google que se desplaza
 * sola, en loop.
 *
 * LA INTRO NO LLEVA TÍTULO: el cliente pidió que el texto fuera lo principal,
 * y el remate "Ufff, aburrido" en display hace de titular. El cliché va
 * en itálica y atenuado, entre comillas: se tiene que leer como "lo que NO
 * vamos a decir".
 *
 * LA INTRO SE REORDENÓ EN TRES BLOQUES (2026-09-03, pedido del cliente):
 * 1. El cliché, CENTRADO — antes iba pegado a la izquierda junto con todo
 *    lo demás.
 * 2. Una fila con el remate a la izquierda y el ESQUELETO DORMIDO de la
 *    marca tirado a la derecha (`esqueletoDurmiendo`, reemplaza al 🥱 que
 *    llevaba el remate: el dibujo ya cuenta el chiste solo).
 * 3. Los dos párrafos, otra vez CENTRADOS. Se sacó el 👇 del segundo: sin
 *    el remate emoji arriba, señalar hacia abajo con un emoji suelto ya no
 *    acompañaba a nada.
 *
 * LAS TARJETAS SON CLONES DE LAS DE GOOGLE en oscuro (2026-09-02, pedido del
 * cliente), APAISADAS y con la "G" arriba a la derecha desde el 2026-09-03.
 * Toda la anatomía y el detalle de qué se copió y qué no viven en
 * `ui/TarjetaResena.tsx`.
 *
 * EL CARRUSEL ES EL MISMO MECANISMO QUE LA BARRA PROMO: las tarjetas van
 * DUPLICADAS y la pista se desplaza exactamente -50% (`@keyframes marquee`,
 * en globals.css); cuando la primera copia terminó de salir, la segunda
 * está donde arrancó la primera, así que el reinicio es invisible. La
 * segunda copia va `aria-hidden`: un lector de pantalla no tiene por qué
 * leer diez reseñas dos veces.
 * Se PAUSA al pasar el mouse (para poder leer) y con `prefers-reduced-motion`
 * la pista se queda quieta (`.marquee-pista`, globals.css) y se vuelve
 * scrolleable a mano — y la copia duplicada se oculta, porque sin
 * movimiento no sirve para nada.
 * `items-stretch`: todas las tarjetas toman el alto de la más alta, así el
 * "Más" queda alineado al pie en toda la fila.
 * El degradé de los bordes (`mask-image`) hace que las tarjetas entren y
 * salgan fundidas en vez de cortadas por el borde de la sección.
 *
 * FONDO NEGRO PURO (#000, 2026-09-02, pedido del cliente): antes era carbón,
 * para separarse tonalmente de la carta y de nosotros, que son negras. Al
 * unificarlo, LAS TARJETAS PASARON A CARBÓN (`--background`): eran negras y
 * sobre un fondo del mismo color se les perdía el cuerpo. Ahora la sección
 * es el fondo y las tarjetas la superficie elevada, igual que en Google.
 */
export function Resenas() {
  const { cliche, remate, esqueletoDurmiendo, parrafo1, parrafo2, verTodas } = resenasContent
  // ~7s por tarjeta: legible sin ser lento. Si cambia la cantidad de
  // reseñas, la velocidad se mantiene sola.
  const duracion = `${Math.max(resenas.length, 4) * 7}s`

  return (
    <section id={SECCIONES.resenas} className="relative overflow-hidden bg-black py-20 sm:py-28">
      <div className="px-4 sm:px-8 lg:px-14">
        <p className="mx-auto max-w-[58ch] text-center font-body text-[clamp(15px,4vw,18px)] italic leading-relaxed text-foreground/55">
          “{cliche}”
        </p>

        {/* Remate a la izquierda, esqueleto dormido tirado a la derecha. */}
        <div className="mt-5 flex items-center justify-center gap-3 sm:mt-7 sm:gap-6">
          <p className="shrink-0 font-display text-[clamp(28px,7vw,64px)] uppercase leading-none tracking-[-0.01em] text-primary">
            {remate}
          </p>
          <Image
            src={esqueletoDurmiendo.src}
            alt={esqueletoDurmiendo.alt}
            width={esqueletoDurmiendo.ancho}
            height={esqueletoDurmiendo.alto}
            className="h-auto w-[46%] max-w-[380px] shrink object-contain sm:w-[38%] lg:w-[30%]"
          />
        </div>

        <div className="mx-auto mt-7 max-w-[58ch] text-center sm:mt-10">
          <p className="font-body text-[clamp(15px,4vw,18px)] leading-relaxed text-foreground/90">
            {parrafo1}
          </p>
          <p className="mt-4 font-body text-[clamp(15px,4vw,18px)] leading-relaxed text-foreground/90">
            {parrafo2}
          </p>
        </div>
      </div>

      {/* La pista. Sin padding lateral a propósito: las tarjetas tienen que
          llegar hasta los bordes de la pantalla para que el degradé las
          funda. */}
      <div className="mt-10 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)] motion-reduce:overflow-x-auto motion-reduce:[mask-image:none] sm:mt-14">
        <div
          className="marquee-pista flex w-max items-stretch gap-4 pl-4 hover:[animation-play-state:paused] sm:gap-5 sm:pl-8 lg:pl-14"
          style={{ animation: `marquee ${duracion} linear infinite` }}
        >
          <ul className="flex items-stretch gap-4 sm:gap-5">
            {resenas.map((r) => (
              <TarjetaResena key={r.autor + r.texto.slice(0, 12)} resena={r} />
            ))}
          </ul>
          <ul className="flex items-stretch gap-4 motion-reduce:hidden sm:gap-5" aria-hidden>
            {resenas.map((r) => (
              <TarjetaResena key={'bis' + r.autor + r.texto.slice(0, 12)} resena={r} />
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-10 px-4 sm:px-8 lg:px-14">
        <a
          href={LINK_RESENAS}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-display text-[15px] uppercase tracking-[0.06em] text-foreground transition-colors hover:text-accent"
        >
          {verTodas} <span className="font-body font-extrabold">→</span>
        </a>
      </div>
    </section>
  )
}
