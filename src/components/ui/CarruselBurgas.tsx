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
/** Cuánto se achica cada tarjeta por cada paso de distancia a la activa. */
const ESCALA_POR_PASO = 0.28
/** Cuánto se corre de lado cada vecina, en % del ancho de la tarjeta. */
const CORRIMIENTO = 46
/** Opacidad del velo negro a un paso de distancia. */
const VELO_POR_PASO = 0.55

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

        const escala = Math.max(0.35, 1 - dist * ESCALA_POR_PASO)
        // El corrimiento crece con la raíz de la distancia: si fuera lineal,
        // las lejanas se irían tan afuera que dejarían un hueco en el medio.
        const x = Math.sign(d) * Math.sqrt(dist) * CORRIMIENTO
        li.style.transform = `translateX(${x}%) scale(${escala})`
        // Las de adelante tapan a las de atrás; la activa siempre arriba.
        li.style.zIndex = String(100 - Math.round(dist * 10))

        const velo = li.querySelector<HTMLElement>('[data-velo]')
        if (velo) velo.style.opacity = String(Math.min(dist * VELO_POR_PASO, 0.8))
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
      {/* El escenario. `aspect-square` reserva el alto antes de que cargue
          nada; el ancho extra a los costados deja lugar para las vecinas
          corridas sin que la sección tenga scroll horizontal. */}
      <div className="relative mx-auto aspect-square w-[64%]">
        <ul className="absolute inset-0">
          {items.map((b, i) => (
            <li
              key={b.id}
              ref={(el) => {
                tarjetas.current[i] = el
              }}
              className={`absolute inset-0 origin-center ${
                sinMovimiento ? '' : 'transition-transform duration-200 ease-out'
              }`}
            >
              <button
                type="button"
                onClick={() => irA(i)}
                aria-label={`Ver ${b.nombre}`}
                aria-current={i === activa}
                /* Solo las de atrás son tocables: sobre la activa, un botón a
                   pantalla completa se comería el gesto de deslizar. */
                className={`relative block h-full w-full overflow-hidden border-y-2 border-primary bg-black ${
                  i === activa ? 'pointer-events-none' : ''
                }`}
              >
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
              </button>
            </li>
          ))}
        </ul>

        {/* EL CARRIL INVISIBLE que capta el dedo. Va por ENCIMA de todo
            (`z-[10]`), es transparente y cada hijo es un slot vacío con
            `snap-center`. `overscroll-x-contain` evita que el gesto en los
            extremos dispare el "volver atrás" del navegador. */}
        <div
          ref={carril}
          className="absolute inset-0 z-[10] flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((b) => (
            <div key={b.id} aria-hidden className="w-full shrink-0 snap-center" />
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
