'use client'

import { burgasContent } from '@/content/home'
import { SECCIONES } from '@/lib/constants'
import { CarruselBurgasV2 } from '@/components/ui/CarruselBurgasV2'

/**
 * Las Burgas — la carta oficial (2026-09-01: el cliente eligió esta versión,
 * el "tocadiscos", y la anterior se borró junto con su carrusel).
 *
 * EL TOCADISCOS EN LAS DOS PANTALLAS (2026-09-04, pedido del cliente): la foto
 * de la burga activa entera, las vecinas sin fondo girando a los costados, el
 * sticker con el nombre montado al pie y los ingredientes debajo. Antes de
 * `sm` para arriba iba una grilla de 12 tarjetas (`GrillaBurgas`), que el
 * cliente había pedido dejar para más adelante.
 *
 * **Móvil no cambió en nada**: el mismo componente, de borde a borde. Lo único
 * propio de escritorio es la caja que lo acota (el escenario es cuadrado y a
 * ancho completo no entraría en la pantalla) y que sus medidas internas pasan
 * a referirse a esa caja — ver `@container` en `CarruselBurgasV2`.
 *
 * YA NO HACE FALTA ELEGIR EN JS con `useEsMovil`: se montaba una sola de las
 * dos ramas porque la grilla traía doce `<video>` que existían en el DOM y
 * descargaban aunque estuvieran ocultos (medido: 13 videos en un celular en
 * vez de 1). Con una sola rama el problema desaparece solo.
 *
 * FONDO NEGRO PURO (2026-09-03, pedido del cliente). Durante unas horas del
 * mismo día se probó una variante ROJA con un bloque negro tapando de la
 * mitad de la foto hacia abajo; se descartó y quedó en el historial de git.
 * Al volver al negro vuelven también los colores de texto de siempre: el
 * título en rojo de marca (es texto grande, 3.79:1 alcanza) y la bajada en
 * `--foreground`, que sobre negro da 15.96:1. Los del rojo (título en negro
 * puro, bajada en `--primary-foreground`) existían solo por contraste y
 * sobre negro no se leerían.
 */
export function LasBurgasV2() {
  const { titulo, bajada, items } = burgasContent

  return (
    <section
      id={SECCIONES.carta}
      className="relative scroll-mt-[var(--nav)] overflow-hidden bg-black px-4 pb-20 pt-12 sm:px-8 sm:pb-28 sm:pt-16 lg:px-14"
    >
      {/* Encabezado. El título se sale un poco por la izquierda (`-ml-[2%]`)
          para que la sección no se lea como una caja centrada y prolija.

          MÁS ARRIBA Y MÁS PEGADO AL CATÁLOGO (2026-09-06, pedido del cliente).
          Dos medidas distintas, las dos medidas antes de tocarlas:
          * el aire de ARRIBA era el `py` de la sección (112px en escritorio,
            80 en móvil). Ahora el padding se parte: abajo sigue igual —cierra
            la sección contra la siguiente— y arriba baja a 64/48px. Sube el
            título sin mover el pie.
          * la separación hasta el tocadiscos era el `mb` del header (64px en
            escritorio, 48 en móvil) y bajó a 32/24 — la mitad.
          El h2 va con `leading-[0.85]`, así que su caja ya recorta algo por
          arriba: el aire óptico es un poco mayor que estos números.
          Ojo: en móvil ese `mb` es solo una PARTE del hueco real, porque el
          escenario sube 72px sobre él (ver el comentario de la caja).

          Por eso la sección necesitó `scroll-mt-[var(--nav)]`: el nav es
          STICKY y tapa los primeros 66px (92 en escritorio) de lo que sea que
          quede arriba de todo. El `py` grande alcanzaba para disimularlo, pero
          al recortarlo el CTA "Las burgers" del hero aterrizaba con el título
          cortado por la mitad. El `scroll-mt` corre el punto de aterrizaje
          justo lo que mide el nav, sin devolver el aire que se sacó. */}
      <header className="relative z-[1] mb-6 sm:mb-8">
        <h2 className="-ml-[2%] font-display text-[clamp(56px,16vw,190px)] uppercase leading-[0.85] tracking-[-0.02em] text-primary sm:text-[12vw] lg:text-[9vw]">
          {titulo}
        </h2>
        <p className="mt-3 max-w-[36ch] font-body text-[clamp(15px,4vw,19px)] font-medium text-foreground">
          {bajada}
        </p>
      </header>

      {/* EL MISMO TOCADISCOS EN LAS DOS PANTALLAS (2026-09-04, pedido del
          cliente: "lo mismo pero en formato PC").

          En MÓVIL va de borde a borde (`-mx-4` para salirse del padding de la
          sección), tal cual estaba — no se tocó nada de su comportamiento.

          En ESCRITORIO se acota a una caja centrada: el escenario es CUADRADO
          y a ancho completo en 1440px mediría 1440 de alto, o sea más que la
          pantalla, y no se vería entero. Lo ata la ALTURA disponible, que es
          la restricción real acá — el mismo criterio que usa el hero.
          La ficha se dimensiona contra esta caja vía `@container` (ver
          `CarruselBurgasV2`), así la proporción sticker/foto es idéntica a la
          del celular.

          DE LADO A LADO (2026-09-04, pedido del cliente: "que se vaya de lado
          a lado o que quede muy poco espacio; la hamburguesa a la izquierda y
          el texto a la derecha"). Se llegó acá en dos pasos:
          1. Primero se agrandó el cuadrado con la ficha DEBAJO. Quedó a mitad
             de camino: el vacío bajó del 57-68% al 28-46% y ahí se clavó,
             porque foto y ficha competían por la ALTURA de la pantalla —
             agrandar más obligaba a scrollear para saber qué burga era.
          2. Con la ficha AL COSTADO ese techo desaparece y la foto puede
             ocupar el ancho de verdad. El reparto lo hace `CarruselBurgasV2`
             (foto 64-68%, texto el resto).
          Por eso acá ya no hay `max-w` atado a `vh`: la sección usa su ancho
          completo y el único límite es el padding lateral. */}
      {/* EL ESCENARIO SUBE, SOLO EN MÓVIL (2026-09-06, 3er pedido del cliente:
          "en celu disminuí el espacio, en PC alejalo y dejalo como estaba").

          El margen del header no es lo que hace el hueco: medido, la caja ya
          arrancaba a 24px de la bajada en móvil. **El vacío lo hace la FOTO**:
          su 27% superior es degradé oscuro antes de que aparezca el pan (138px
          de 505), así que el hueco visible era de ~162px aunque el margen
          dijera 24. Recortar el margen no lo arreglaba.
          Por eso el escenario se sube con un margen NEGATIVO: ese vacío queda
          detrás del bloque del texto —que va en `z-[1]`, por encima— en vez de
          empujarlo hacia abajo. Sube 72px de los 138 disponibles; el resto se
          deja como aire real, si no el pan tocaría la bajada.

          EN ESCRITORIO NO VA (`sm:mt-0`): se probó ahí primero (subía 96px) y
          el cliente lo pidió de vuelta como estaba, o sea con el hueco. */}
      <div className="-mt-[72px] w-full max-sm:-mx-4 max-sm:w-auto sm:mt-0">
        <CarruselBurgasV2 items={items} />
      </div>
    </section>
  )
}
