import Image from 'next/image'
import { tiraFotosContent } from '@/content/home'
import { SECCIONES } from '@/lib/constants'

/**
 * Tira de fotos (2026-09-03, pedido del cliente). REEMPLAZA a la sección
 * «Nuestra historia», que tenía título, dos párrafos y las fotos maquetadas:
 * ahora son SOLO las fotos, pasando solas, a todo el ancho. Son OCHO desde el
 * 2026-09-04 (llegaron seis del cliente y salió una).
 * El archivo se llamaba `Nosotros.tsx` y conserva el ancla `#nosotros`, pero
 * **ya no la usa ningún link**: el "Nosotros" del nav pasó a apuntar a
 * `#resenas`, que es donde la marca se cuenta con palabras (2026-09-04,
 * pedido del cliente). La tira arranca justo debajo de esa sección.
 *
 * VA HACIA LA DERECHA, no hacia la izquierda como los otros dos carruseles
 * de la web: es el mismo `@keyframes marquee` (que termina en `-50%`) pero
 * con `reverse`, así arranca en -50% y vuelve a 0. Un keyframe propio para
 * esto sería el mismo movimiento escrito dos veces.
 *
 * ALTURA FIJA y ancho automático: las fotos tienen proporciones distintas
 * (2:3 las seis nuevas, 4:5 las dos viejas), así que fijando el alto quedan
 * alineadas y de distinto ancho — que es justo lo que hace que se lea como
 * una tira y no como una grilla. Con ancho fijo habría que recortarlas.
 *
 * CASI SIN PADDING: el cliente pidió que no fuera una sección grande, "solo
 * fotos que pasan". Arriba no lleva nada —el aire ya lo pone el `py` de
 * reseñas—, pero ABAJO sí: la sección que sigue (Work) es roja y arrancaba
 * pegada al borde de las fotos, cortándoles las esquinas redondeadas.
 *
 * LAS FOTOS SE REPITEN `REPETICIONES` VECES POR COPIA porque el loop del
 * marquee necesita que UNA copia sea más ancha que la pantalla — si no, se ve
 * el hueco entre copias. Con las ocho fotos (2026-09-04) una vuelta mide
 * ~1760px a 300px de alto: alcanza para un desktop de 1440 pero NO para uno
 * de 1920, así que van dos vueltas (~3530px) y sobra en cualquier pantalla.
 * Eran tres cuando había tres fotos (~1050px la vuelta). **Si se sacan fotos,
 * rehacer esta cuenta.**
 * `next/image` sirve el mismo archivo para todas: son nodos del DOM
 * repetidos, no descargas nuevas.
 *
 * Con `prefers-reduced-motion` la pista se queda quieta (`.marquee-pista`, en
 * globals.css) y la tira se vuelve scrolleable a mano; la copia duplicada se
 * oculta, porque sin movimiento no sirve de nada.
 */

/** Cuántas veces se repite la lista dentro de cada copia del loop. */
const REPETICIONES = 2

export function TiraFotos() {
  const unaCopia = Array.from({ length: REPETICIONES }, () => tiraFotosContent).flat()
  // ~4s por foto: pasa sin apuro y sin quedarse quieta. Si se agregan fotos,
  // la velocidad no cambia porque la duración crece con la cantidad.
  const duracion = `${unaCopia.length * 4}s`

  return (
    <section
      id={SECCIONES.nosotros}
      className="relative overflow-hidden bg-black pb-5 motion-reduce:overflow-x-auto sm:pb-7"
    >
      <div
        className="marquee-pista flex w-max gap-2 sm:gap-3"
        style={{ animation: `marquee ${duracion} linear infinite reverse` }}
      >
        {/* Dos copias idénticas: el `-50%` del keyframe deja la segunda
            exactamente donde arrancó la primera, así el reinicio no se ve. */}
        <Tira fotos={unaCopia} />
        <Tira fotos={unaCopia} duplicada />
      </div>
    </section>
  )
}

/**
 * Una copia de la tira. `duplicada` marca la que existe solo para cerrar el
 * loop: va `aria-hidden` y se oculta sin movimiento.
 *
 * Dentro de una copia las fotos también se repiten, así que solo la PRIMERA
 * vuelta lleva `alt` real; el resto va vacío y oculto para que un lector de
 * pantalla no lea la misma foto nueve veces.
 */
function Tira({
  fotos,
  duplicada = false,
}: {
  fotos: readonly { src: string; alt: string; ancho: number; alto: number }[]
  duplicada?: boolean
}) {
  const porVuelta = tiraFotosContent.length

  return (
    <ul
      className={`flex gap-2 sm:gap-3 ${duplicada ? 'motion-reduce:hidden' : ''}`}
      aria-hidden={duplicada || undefined}
    >
      {fotos.map((foto, i) => {
        const primeraVuelta = !duplicada && i < porVuelta
        return (
          <li key={foto.src + i} aria-hidden={primeraVuelta ? undefined : true}>
            <Image
              src={foto.src}
              alt={primeraVuelta ? foto.alt : ''}
              width={foto.ancho}
              height={foto.alto}
              sizes="(min-width: 1024px) 40vw, 80vw"
              className="h-[180px] w-auto rounded-lg object-cover sm:h-[240px] lg:h-[300px]"
            />
          </li>
        )
      })}
    </ul>
  )
}
