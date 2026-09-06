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
 * LLEVA TÍTULO "NOSOTROS" (2026-09-06, pedido del cliente: "un título como el
 * de Las Burgas"), con el mismo tratamiento que el de la carta. Hasta ahora la
 * sección arrancaba directo con el cliché y el remate "Ufff, aburrido." hacía
 * de titular — eso venía de un pedido anterior del cliente (2026-09-02) de que
 * el texto fuera lo principal. El remate sigue donde estaba: pasó a rematar el
 * cliché en vez de encabezar la sección.
 * El cliché va en itálica y atenuado, entre comillas: se tiene que leer como
 * "lo que NO vamos a decir".
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
 *
 * LAS LLAMAS DEL TECHO (2026-09-04, pedido del cliente): una banda dentada
 * colgando del borde superior con los picos hacia abajo, en el hueco negro
 * que quedaba entre la carta y esta sección. Es el TERCER lugar donde la web
 * hace este gesto —el hero al pie, el footer al techo— y el detalle de por
 * qué va como va está en el div, más abajo.
 */
export function Resenas() {
  const { titulo, cliche, remate, esqueletoDurmiendo, parrafo1, parrafo2, verTodas } =
    resenasContent
  // ~7s por tarjeta: legible sin ser lento. Si cambia la cantidad de
  // reseñas, la velocidad se mantiene sola.
  const duracion = `${Math.max(resenas.length, 4) * 7}s`

  return (
    <section
      id={SECCIONES.resenas}
      className="relative overflow-hidden bg-background pb-20 pt-[calc(var(--llamas)_+_88px)] [--llamas:min(max(52px,11svh),96px)] sm:pb-28 sm:pt-[calc(var(--llamas)_+_128px)] lg:[--llamas:min(10svh,110px)]"
    >
      {/* LAS LLAMAS, colgando del techo y apuntando hacia abajo.

          SON LAS DEL HERO (`zocalo-llamas.webp`), como pidió el cliente — no
          las rojas del footer. Mismo mecanismo que las otras dos bandas:
          mosaico (`repeat-x` + `background-size: auto 100%`) para que el
          dibujo conserve su forma en cualquier ancho, y altura fija porque
          con ratio 6:1 a ancho completo quedaría en un hilito.

          SE VE EL CONTORNO ROJO, NO EL RELLENO: el dibujo es 81% negro y 19%
          filo rojo (medido), y acá el fondo es #000 puro, así que el relleno
          se funde del todo y lo que dibuja la silueta es el filo. Es el mismo
          efecto que en el hero, donde el fondo es #1a1a1a y ya casi se fundía
          —ahí está documentado como deliberado—. Por eso el footer, que tiene
          este mismo fondo, usa OTRO dibujo (picos macizos rojos): ahí abajo la
          banda tiene que empalmar con el rojo de Work, y un filo suelto no
          alcanzaba. Acá arriba y abajo es todo negro, así que no hay nada con
          qué empalmar y el filo solo funciona.

          NO DEJA COSTURA con la carta: la base del dibujo es 100% opaca
          (medido, 366 de 366 muestras), o sea negra maciza, y dada vuelta ese
          borde es el que toca el negro de arriba — se funden.

          `-scale-y-100` y no `rotate-180`: el giro de 180° espejaría también
          en horizontal y acá solo hay que darlo vuelta de arriba a abajo. El
          mosaico se arma ANTES de la transformación, así que sigue empalmando
          consigo mismo igual que en el hero.

          La ALTURA vive en `--llamas`, con los MISMOS valores que el footer:
          las tres bandas de la web comparten un solo lenguaje de tamaño. El
          padding de arriba la reutiliza (`calc(var(--llamas) + N)`) para que
          el contenido arranque siempre por debajo de los picos; si se cambia
          el alto de la banda, el aire acompaña solo.
          MÁS AIRE (2026-09-06, pedido del cliente: "más margen entre el
          título de Nosotros y las llamas, en PC y móvil"): ese N pasó de
          44→88px en móvil y de 64→128px en escritorio. Los valores viejos
          estaban calculados cuando la sección arrancaba con el cliché en
          texto chico; ahora arranca con el título en display gigante y
          quedaba comiéndose los picos. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[var(--llamas)] -scale-y-100 select-none bg-[url('/zocalo-llamas.webp')] bg-[length:auto_100%] bg-repeat-x"
      />

      <div className="relative px-4 sm:px-8 lg:px-14">
        {/* EL TÍTULO DE LA SECCIÓN (2026-09-06, pedido del cliente: "un título
            como el de Las Burgas pero que diga Nosotros").

            Es EL MISMO TRATAMIENTO que el de la carta —display, `--primary`,
            `leading-[0.85]`, el mismo `clamp` y el `-ml-[2%]` que lo saca un
            poco por la izquierda para que no se lea como una caja prolija—,
            así las dos secciones grandes de la página se encabezan igual.
            Rojo sobre negro da 3.79:1: alcanza porque es texto GRANDE, la
            misma regla que en la carta.

            VA PEGADO A LA IZQUIERDA aunque el resto de la intro esté centrado:
            es lo que lo hace leerse como el título de la sección y no como una
            línea más del bloque de texto. Por eso tampoco entra en el `mx-auto
            max-w-[58ch]` de los párrafos.

            OJO CON `#nosotros`: el ancla de ese nombre vive en `TiraFotos`, no
            acá, y el link del nav apunta a `#resenas` (2026-09-04). Este
            título es el rótulo visible de esa idea; el ancla no se movió. */}
        <h2 className="-ml-[2%] font-display text-[clamp(56px,16vw,190px)] uppercase leading-[0.85] tracking-[-0.02em] text-primary sm:text-[12vw] lg:text-[9vw]">
          {titulo}
        </h2>

        <p className="mx-auto mt-8 max-w-[58ch] text-center font-body text-[clamp(15px,4vw,18px)] italic leading-relaxed text-foreground/55 sm:mt-10">
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
