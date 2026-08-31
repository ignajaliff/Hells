'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

/**
 * CarruselBurgas — la carta en móvil: las burgas apiladas en profundidad
 * (2026-08-31, pedido del cliente). La activa va al frente y centrada; las
 * vecinas asoman detrás y a los costados, más chicas y oscurecidas. Al
 * deslizar —o al tocar una de atrás— la siguiente se acerca hacia adelante.
 * Abajo, una ficha única con el nombre y los ingredientes de la activa.
 *
 * SOLO MÓVIL: de `sm` para arriba sigue la grilla (`LasBurgas`).
 *
 * ── POR QUÉ `snap-proximity` Y NO `mandatory` ──
 * Con `mandatory` el navegador PROHÍBE las posiciones intermedias: medido,
 * `scrollLeft = 150` se corregía solo a 0 y solo aceptaba múltiplos exactos
 * del paso. Como toda la profundidad se calcula a partir de esa posición, no
 * existían estados a medio camino que dibujar y las tarjetas saltaban de una
 * escala a la otra — nunca se veía crecer a la que entra.
 * `proximity` deja recorrer el trayecto y engancha igual al soltar, que es lo
 * que hace falta para que el crecimiento se vea DURANTE el gesto.
 *
 * ── EL GESTO: UN CARRIL INVISIBLE ──
 * Las tarjetas están todas SUPERPUESTAS en el mismo punto (`absolute`), así
 * que no pueden ser lo que se scrollea. El dedo mueve un carril transparente
 * puesto encima, con `scroll-snap`: de ahí salen la inercia y el imán al
 * centro que pone el sistema operativo. Su posición de scroll es la ÚNICA
 * fuente de verdad; lo visible se dibuja a partir de ella.
 * Es lo que evita reimplementar la física del arrastre a mano, que es donde
 * estos carruseles se sienten mal.
 *
 * ── LA PROFUNDIDAD ──
 * La ACTIVA va a tamaño completo y a todo el ancho de la pantalla; las
 * vecinas, al 62% y corridas a los costados (2026-08-31, pedido del cliente:
 * la hamburguesa del centro tiene que verse entera, no achicada).
 * Por frame de scroll (vía `requestAnimationFrame`) se calcula la distancia
 * de cada tarjeta a la activa y de ahí salen escala, desplazamiento lateral,
 * velo y `z-index`. Como la distancia es continua, el acercamiento ocurre
 * DURANTE el arrastre y no salta al soltar.
 * Se pinta por `style` directo sobre refs, sin estado de React: un setState
 * por frame re-renderizaría las doce tarjetas.
 *
 * Solo se dibujan las tarjetas a menos de `VECINAS_VISIBLES` de distancia; el
 * resto va con `visibility: hidden` para que el navegador no las componga.
 *
 * ── SIN VIDEO POR AHORA (2026-08-31, pedido del cliente) ──
 * Todas las tarjetas —incluida la activa— muestran la FOTO de producto. Antes
 * la del centro reproducía su video una vez (`VideoActivo`, que sigue en el
 * archivo sin usarse); el cliente lo sacó para ver primero cómo se lee el
 * carrusel en producción. **Para volver a activarlo**: en el `<button>`,
 * reponer la rama `i === activa && !sinMovimiento ? <VideoActivo …/> : <Image …/>`.
 * Los mp4 siguen en `public/burgas/`, pero mientras dure la prueba no los
 * referencia nadie: la grilla de escritorio también pasó a foto.
 *
 * `prefers-reduced-motion`: sin video, sin fundido en la ficha y sin
 * transiciones en las tarjetas. El carril sigue funcionando: es scroll.
 */

type Burga = {
  id: string
  nombre: string
  video: { src: string; poster: string; foto: string; alt: string }
  ingredientes?: string
}

/** Cuántas vecinas se dibujan a cada lado. Más allá, `visibility: hidden`. */
const VECINAS_VISIBLES = 2
/**
 * Escala de la vecina inmediata. La ACTIVA va siempre en 1 —a su tamaño
 * completo, sin achicar (2026-08-31, pedido del cliente)— y de acá sale
 * cuánto se encoge la de al lado; el resto se interpola de forma continua, que
 * es lo que hace que crezca mientras arrastrás en vez de saltar al soltar.
 */
const ESCALA_VECINA = 0.62
/**
 * Cuánto se corre de lado la vecina inmediata, en % del ancho de la tarjeta.
 * Calibrado junto con el 84% del escenario: más corrimiento y la vecina se va
 * fuera de la pantalla, menos y se mete debajo de la activa.
 */
const CORRIMIENTO = 56
/** Opacidad del velo negro sobre la vecina inmediata. */
const VELO_VECINA = 0.62

export function CarruselBurgas({
  items,
  className = '',
}: {
  items: readonly Burga[]
  className?: string
}) {
  const carril = useRef<HTMLDivElement>(null)
  const tarjetas = useRef<(HTMLLIElement | null)[]>([])
  const activaRef = useRef(0)
  const [activa, setActiva] = useState(0)
  const sinMovimiento = useReducedMotion()

  useEffect(() => {
    const rail = carril.current
    if (!rail) return

    let raf = 0

    const pintar = () => {
      raf = 0
      // Paso = ancho de un "slot" del carril invisible. La posición de scroll
      // dividida por el paso da la posición continua dentro de la carta:
      // 0 = Lucifer centrada, 1.5 = a mitad de camino entre la 2ª y la 3ª.
      const paso = rail.scrollWidth / items.length
      const posicion = rail.scrollLeft / paso

      tarjetas.current.forEach((li, i) => {
        if (!li) return
        const d = i - posicion // negativo a la izquierda, positivo a la derecha
        const dist = Math.abs(d)

        if (dist > VECINAS_VISIBLES + 0.5) {
          li.style.visibility = 'hidden'
          return
        }
        li.style.visibility = 'visible'

        /* `cerca` va de 1 (clavada en el centro) a 0 (a un paso o más). Al
           ser continuo, el crecimiento de la que entra y el encogimiento de la
           que sale ocurren DURANTE el arrastre — que es la animación pedida.
           Se eleva al cuadrado para que la activa conserve su tamaño completo
           hasta bien entrado el gesto y el cambio se sienta al final, en vez
           de empezar a achicarse apenas tocás. */
        const cerca = Math.max(0, 1 - dist) ** 2
        const escala = ESCALA_VECINA + (1 - ESCALA_VECINA) * cerca
        // El corrimiento crece con la raíz de la distancia: si fuera lineal,
        // las lejanas se irían tan afuera que dejarían un hueco en el medio.
        const x = Math.sign(d) * Math.sqrt(dist) * CORRIMIENTO
        li.style.transform = `translateX(${x}%) scale(${escala})`
        /* Las de adelante tapan a las de atrás. Se queda por DEBAJO de 100:
           el carril invisible vive en 200 y tiene que recibir el dedo — con
           `z-index` mayores acá, las tarjetas se lo comían y el arrastre no
           movía nada. */
        li.style.zIndex = String(99 - Math.round(dist * 10))

        const velo = li.querySelector<HTMLElement>('[data-velo]')
        if (velo) velo.style.opacity = String(Math.min((1 - cerca) * VELO_VECINA, 0.72))
      })

      const cerca = Math.round(posicion)
      if (cerca !== activaRef.current && cerca >= 0 && cerca < items.length) {
        activaRef.current = cerca
        setActiva(cerca)
      }
    }

    const pedirFrame = () => {
      if (!raf) raf = requestAnimationFrame(pintar)
    }

    pintar() // estado inicial, antes del primer gesto
    rail.addEventListener('scroll', pedirFrame, { passive: true })
    window.addEventListener('resize', pedirFrame)
    return () => {
      rail.removeEventListener('scroll', pedirFrame)
      window.removeEventListener('resize', pedirFrame)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [items.length])

  /** Tocar una tarjeta de atrás la trae al frente. */
  const irA = (i: number) => {
    const rail = carril.current
    if (!rail) return
    const paso = rail.scrollWidth / items.length
    rail.scrollTo({ left: i * paso, behavior: sinMovimiento ? 'auto' : 'smooth' })
  }

  const burga = items[activa]

  return (
    <div className={className}>
      {/* El escenario. La activa ocupa el 84% del ancho (2026-08-31, pedido
          del cliente: antes iba al 64% y la hamburguesa se veía chica).
          **No va al 100%**: probado, con la activa a ancho completo la vecina
          arranca justo en el borde de la pantalla y no se ve nada de ella —y
          el punto del carrusel es que se asome la siguiente—. Con 84% asoma
          una franja de la de al lado a cada lado.
          `aspect-square` reserva el alto antes de que carguen las fotos. */}
      <div className="relative mx-auto aspect-square w-[84%]">
        <ul className="absolute inset-0">
          {items.map((b, i) => (
            <li
              key={b.id}
              ref={(el) => {
                tarjetas.current[i] = el
              }}
              /* SIN `transition` en el transform: el arrastre ya lo actualiza
                 por frame, y una transición encima lo haría ir por detrás del
                 dedo. El movimiento suave al TOCAR una tarjeta lo da el
                 `behavior: 'smooth'` del scroll, que repinta frame a frame
                 igual que el gesto. */
              className="absolute inset-0 origin-center will-change-transform" 
            >
              {/* No es interactivo: el dedo lo recibe SIEMPRE el carril
                  invisible de arriba, que es quien mueve el carrusel. El
                  "tocar para traer al frente" se resuelve allá (ver los
                  botones dentro del carril), no acá — un botón sobre la
                  tarjeta se comía el arrastre. */}
              <div className="relative block h-full w-full overflow-hidden border-y-2 border-primary bg-black">
                <Image
                  src={b.video.foto}
                  alt={b.video.alt}
                  fill
                  sizes="70vw"
                  /* Las dos primeras entran con la página; el resto a demanda
                     al acercarse en el carril. */
                  priority={i < 2}
                  className="object-cover"
                />

                {/* El velo que oscurece a las de atrás. */}
                <span
                  data-velo
                  aria-hidden
                  className={`pointer-events-none absolute inset-0 bg-black opacity-0 ${
                    sinMovimiento ? '' : 'transition-opacity duration-200'
                  }`}
                />
              </div>
            </li>
          ))}
        </ul>

        {/* EL CARRIL INVISIBLE que capta el dedo. Va por ENCIMA de todo
            (`z-[200]`, por encima del `z-index` de cualquier tarjeta), es
            transparente y cada hijo es un slot vacío con
            `snap-center`. `overscroll-x-contain` evita que el gesto en los
            extremos dispare el "volver atrás" del navegador. */}
        <div
          ref={carril}
          className="absolute inset-0 z-[200] flex snap-x snap-proximity overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((b, i) => (
            /* Cada slot es un botón: tocarlo trae esa burga al frente. Van
               acá y no sobre las tarjetas porque este carril es el que recibe
               el dedo; el navegador distingue solo el toque del arrastre. */
            <button
              key={b.id}
              type="button"
              onClick={() => irA(i)}
              aria-label={`Ver ${b.nombre}`}
              aria-current={i === activa}
              className="w-full shrink-0 snap-center"
            />
          ))}
        </div>
      </div>

      {/* LA FICHA de la activa. Mismos estilos y regla de contraste que la
          grilla: rojo sobre negro da 4.50:1, justo AA — no achicar.
          `min-h` reservada para el ingrediente más largo (Asmodeo, 3 líneas):
          sin eso la página saltaría en cada pasada. */}
      <div className="relative min-h-[122px] px-6 pt-6 text-center">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={burga.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: sinMovimiento ? 0 : 0.16 }}
          >
            <h3 className="font-display text-[clamp(26px,7vw,34px)] uppercase leading-none tracking-[0.01em] text-primary">
              {burga.nombre}
            </h3>
            {burga.ingredientes ? (
              <p className="mt-2 font-body text-[clamp(13px,3.4vw,15px)] font-semibold uppercase leading-snug tracking-[0.08em] text-primary">
                {burga.ingredientes}
              </p>
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

/*
 * NOTA (2026-08-31): acá vivía `VideoActivo`, que reproducía el video de la
 * burga del centro una vez y lo dejaba en su foto. Se quitó cuando el cliente
 * sacó los videos de la sección. Está en el historial de este archivo; para
 * reponerlo hace falta él y la rama del `<button>` descrita arriba.
 */
