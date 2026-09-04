'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useReducedMotion } from 'motion/react'

/**
 * CarruselBurgasV2 — el "tocadiscos" (2026-09-01, pedido del cliente).
 *
 * La foto de la burga activa se ve ENTERA y a todo el ancho, tal cual la
 * original. Sobre esa misma foto, a los costados, asoman las hamburguesas
 * vecinas sin fondo: más chicas, oscurecidas, como esperando su turno. Al
 * deslizar, la de al lado gira hacia el centro creciendo, y cuando llega
 * queda a tamaño real, sobre su propia foto. Sin cortes, sin fondo rojo
 * apareciendo, sin que se note ningún cambio de imagen.
 *
 * ── POR QUÉ NO SE NOTA EL CAMBIO ──
 * Cada foto está partida en DOS CAPAS (`escena` en content/home.ts):
 *   * `fondo`: la foto sin la hamburguesa (el hueco relleno con su degradé).
 *   * `silueta`: la hamburguesa sola, y una `caja` que dice dónde y a qué
 *     tamaño va sobre el fondo para que las dos juntas reconstruyan
 *     EXACTAMENTE la foto original.
 * Así la activa no es "una foto": es su fondo + su silueta clavada en su
 * caja. Cuando el visitante desliza, la silueta se va girando hacia el
 * costado y el fondo se funde con el de la siguiente (son degradés casi
 * iguales, el fundido es invisible). Nunca hay que cambiar una imagen por
 * otra: la burger que ves llegar al centro es la misma que después queda
 * quieta. Por eso no hay salto ni flash.
 *
 * ── EL GIRO ──
 * Cada silueta se mueve sobre un arco: `x` sigue el seno del ángulo (sale
 * rápido del centro y frena en el costado, como en una bandeja que gira) y
 * sube un poco al alejarse (lo que está atrás se ve más alto). La escala y
 * el oscurecido bajan con la distancia. Todo se calcula por frame de scroll
 * (`requestAnimationFrame`) a partir de la posición continua del carril,
 * pintado por `style` directo sobre refs — un setState por frame
 * re-renderizaría las doce.
 *
 * ── EL GESTO ──
 * El carril invisible con `scroll-snap` (`proximity`, no `mandatory`: el
 * mandatory prohíbe las posiciones intermedias y no habría nada que animar)
 * es el mismo mecanismo de la v1: el dedo mueve un scroll real del sistema,
 * con su inercia y su imán al centro, y de su `scrollLeft` sale todo.
 *
 * ── EL VIGÍA: NUNCA QUEDARSE A MITAD DE GIRO (2026-09-01) ──
 * La contracara de `proximity` es que su imán solo actúa CERCA de un punto
 * de enganche: si el dedo suelta lejos de todos, el carril queda quieto en
 * una posición intermedia y el giro se ve congelado — dos burgas a medio
 * camino (pasaba en el celular real). Un vigía lo hace imposible: cada vez
 * que el scroll se aquieta (160ms sin eventos) y no hay un dedo apoyado, si
 * la posición no es la de una burga se la lleva a la más cercana con un
 * `scrollTo` suave — que dispara los mismos eventos de scroll, así que el
 * giro termina de completarse con la misma animación del gesto.
 * Mientras el dedo está apoyado no interviene (sería pelearle el control).
 *
 * SOLO MÓVIL. `prefers-reduced-motion`: sin fundido en la ficha; el giro
 * sigue al dedo, que es scroll, no animación.
 *
 * `relative z-0` EN EL WRAPPER RAÍZ (2026-09-03) — sin él, el nav sticky
 * (z-50, en `NavHero.tsx`) se veía TAPADO por este carrusel al scrollear.
 * El carril (z-[200]) y la ficha (z-[300]) necesitan ganarle al escenario
 * (que va sin z-index propio), pero `position: relative` SIN `z-index` no
 * crea contexto de apilamiento — así que esos números competían, en el
 * contexto RAÍZ de la página, contra el z-50 del nav, que es hermano de
 * esta sección y no un ancestro. Con `z-0` acá, el wrapper pasa a competir
 * él solo (con su 0) en la raíz, y el 200/300 de adentro quedan encerrados
 * sin poder escapar. **Cualquier z-index nuevo que se agregue en este
 * componente por encima de ~50 necesita este contenedor, o vuelve a tapar
 * el nav.**
 */

type Burga = {
  id: string
  nombre: string
  ingredientes?: string
  video: { alt: string }
  escena: {
    fondo: string
    silueta: string
    caja: { x: number; y: number; w: number; h: number }
    /** El sello con el nombre. Sin él, el nombre va en texto. */
    sticker?: string
  }
}

/** Ángulo de giro por cada paso de distancia a la activa, en radianes. */
const ANGULO_PASO = Math.PI / 3 // 60°
/** Radio del arco, en fracción del ancho del escenario. */
const RADIO = 0.44
/** Cuánto sube la silueta al alejarse un paso, en fracción del alto. */
const SUBIDA = 0.07
/** Escala de la vecina inmediata (la activa va en 1). */
const ESCALA_VECINA = 0.5
/** Escala mínima, para las que están dos pasos atrás. */
const ESCALA_MINIMA = 0.3
/** Brillo de la vecina inmediata (1 = tal cual, 0 = negro). */
const BRILLO_VECINA = 0.42
/** Más allá de esta distancia la silueta ni se compone. */
const VISIBLES = 2.3

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))

export function CarruselBurgasV2({
  items,
  className = '',
}: {
  items: readonly Burga[]
  className?: string
}) {
  const carril = useRef<HTMLDivElement>(null)
  const siluetas = useRef<(HTMLDivElement | null)[]>([])
  const fondos = useRef<(HTMLDivElement | null)[]>([])
  const activaRef = useRef(0)
  const [activa, setActiva] = useState(0)
  const sinMovimiento = useReducedMotion()

  useEffect(() => {
    const rail = carril.current
    if (!rail) return
    let raf = 0

    const pintar = () => {
      raf = 0
      const paso = rail.scrollWidth / items.length
      const posicion = rail.scrollLeft / paso

      items.forEach((b, i) => {
        const d = i - posicion
        const dist = Math.abs(d)

        // El fondo: solo el de la activa y el de la que viene, fundidos.
        const fondo = fondos.current[i]
        if (fondo) {
          const op = clamp(1 - dist, 0, 1)
          fondo.style.opacity = String(op)
          fondo.style.visibility = op > 0 ? 'visible' : 'hidden'
        }

        const el = siluetas.current[i]
        if (!el) return
        if (dist > VISIBLES) {
          el.style.visibility = 'hidden'
          return
        }
        el.style.visibility = 'visible'

        const { x, y, w, h } = b.escena.caja
        const cx = x + w / 2
        const cy = y + h / 2
        const ang = clamp(d, -2, 2) * ANGULO_PASO
        // Escala: 1 en el centro, ESCALA_VECINA a un paso, ESCALA_MINIMA a dos.
        const esc =
          dist <= 1
            ? 1 - (1 - ESCALA_VECINA) * dist
            : ESCALA_VECINA - (ESCALA_VECINA - ESCALA_MINIMA) * clamp(dist - 1, 0, 1)
        const ncx = cx + Math.sin(ang) * RADIO
        const ncy = cy - SUBIDA * clamp(dist, 0, 1.6)
        const nw = w * esc
        const nh = h * esc
        el.style.left = `${(ncx - nw / 2) * 100}%`
        el.style.top = `${(ncy - nh / 2) * 100}%`
        el.style.width = `${nw * 100}%`
        el.style.height = `${nh * 100}%`
        el.style.zIndex = String(99 - Math.round(dist * 10))
        const brillo = dist <= 1 ? 1 - (1 - BRILLO_VECINA) * dist : BRILLO_VECINA * (1 - 0.35 * clamp(dist - 1, 0, 1))
        el.style.filter = `brightness(${brillo.toFixed(3)})`
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

    /* EL VIGÍA (ver doc de arriba): si el carril se aquieta entre dos burgas
       y no hay un dedo apoyado, lo asienta en la más cercana. */
    let timer: ReturnType<typeof setTimeout> | undefined
    let tocando = false
    const asentar = () => {
      const paso = rail.scrollWidth / items.length
      const pos = rail.scrollLeft / paso
      const destino = clamp(Math.round(pos), 0, items.length - 1)
      // El umbral evita re-disparar mientras el propio asentado suave corre.
      if (Math.abs(pos - destino) > 0.02) {
        rail.scrollTo({ left: destino * paso, behavior: sinMovimiento ? 'auto' : 'smooth' })
      }
    }
    const programarAsentado = () => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        if (!tocando) asentar()
      }, 160)
    }
    const alScroll = () => {
      pedirFrame()
      programarAsentado()
    }
    const alTocar = () => {
      tocando = true
      clearTimeout(timer)
    }
    const alSoltar = () => {
      tocando = false
      programarAsentado()
    }

    pintar()
    rail.addEventListener('scroll', alScroll, { passive: true })
    rail.addEventListener('touchstart', alTocar, { passive: true })
    rail.addEventListener('touchend', alSoltar, { passive: true })
    rail.addEventListener('touchcancel', alSoltar, { passive: true })
    window.addEventListener('resize', pedirFrame)
    return () => {
      rail.removeEventListener('scroll', alScroll)
      rail.removeEventListener('touchstart', alTocar)
      rail.removeEventListener('touchend', alSoltar)
      rail.removeEventListener('touchcancel', alSoltar)
      window.removeEventListener('resize', pedirFrame)
      clearTimeout(timer)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [items, sinMovimiento])

  /** Tocar una burga del costado la trae girando al frente. */
  const irA = (i: number) => {
    const rail = carril.current
    if (!rail) return
    rail.scrollTo({
      left: i * (rail.scrollWidth / items.length),
      behavior: sinMovimiento ? 'auto' : 'smooth',
    })
  }


  return (
    <div className={`relative z-0 ${className}`}>
      {/* EL ESCENARIO: cuadrado a todo el ancho. Es la foto activa entera —
          su fondo abajo, su silueta encima— y sobre ella las vecinas girando.
          `overflow-hidden` recorta las siluetas que salen por los costados sin
          generar scroll horizontal. */}
      <div className="relative aspect-square w-full overflow-hidden bg-black">
        {/* LOS FONDOS: uno por burga, apilados. Solo se ven el de la activa y
            el de la que viene, fundiéndose según el scroll. */}
        {items.map((b, i) => (
          <div
            key={b.id}
            ref={(el) => {
              fondos.current[i] = el
            }}
            aria-hidden
            className="absolute inset-0"
            style={{ opacity: i === 0 ? 1 : 0, visibility: i === 0 ? 'visible' : 'hidden' }}
          >
            <Image
              src={b.escena.fondo}
              alt=""
              fill
              sizes="100vw"
              priority={i < 2}
              className="object-cover"
            />
          </div>
        ))}

        {/* LAS SILUETAS: cada hamburguesa sola, posicionada por su `caja`.
            En reposo la activa cae exactamente donde está en su foto; el
            resto gira a los costados. `left/top/width/height` los escribe
            `pintar` por frame. Sin `transition`: el arrastre ya actualiza por
            frame y una transición encima iría por detrás del dedo. */}
        {items.map((b, i) => (
          <div
            key={b.id}
            ref={(el) => {
              siluetas.current[i] = el
            }}
            className="absolute will-change-[transform,filter]"
            style={{
              left: `${b.escena.caja.x * 100}%`,
              top: `${b.escena.caja.y * 100}%`,
              width: `${b.escena.caja.w * 100}%`,
              height: `${b.escena.caja.h * 100}%`,
              visibility: i <= VISIBLES ? 'visible' : 'hidden',
            }}
          >
            <Image
              src={b.escena.silueta}
              alt={i === activa ? b.video.alt : ''}
              fill
              sizes="60vw"
              priority={i < 2}
              className="object-contain"
            />
          </div>
        ))}

        {/* EL CARRIL INVISIBLE que capta el dedo, por encima de todo. Cada
            slot es un botón: tocarlo trae esa burga al frente. */}
        <div
          ref={carril}
          className="absolute inset-0 z-[200] flex snap-x snap-proximity overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((b, i) => (
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

      {/* LA FICHA de la activa: el STICKER con el nombre (2026-09-01, pedido
          del cliente) montado sobre el borde inferior de la foto —mitad sobre
          la imagen, mitad afuera— y debajo los ingredientes.

          LAS DOCE FICHAS VAN MONTADAS Y APILADAS en una grilla (todas en la
          celda 1/1) y solo la activa se ve (2026-09-01, pedido del cliente):
          así el contenedor mide SIEMPRE la ficha más alta y la sección no
          cambia de alto al pasar de burga. Antes se montaba solo la activa
          con un `min-h` calculado a mano, y no alcanzaba: un sticker más
          petiso o un ingrediente de una línea encogían la página entera en
          cada pasada. Con el apilado la altura es un hecho del layout, vale
          en cualquier ancho y no hay número que mantener. El costo es montar
          los 12 stickers (~250KB) — coherente con el escenario, que ya monta
          los 12 fondos y siluetas. El fundido pasó de AnimatePresence a un
          crossfade de opacidad: mismo efecto, sin desmontar nada.

          El sticker va en una caja de ALTO fijo (`h-[15vw]`) y no de ancho:
          los sellos tienen proporciones muy distintas entre sí (de 1.7:1 a
          3.8:1) y con el ancho fijo Lucifer saldría el doble de alto que
          Asmodeo. Con el alto fijo todos pesan igual a la vista.
          `-mt-[7.5vw]` es la mitad de ese alto: lo que se monta sobre la foto.
          `pointer-events-none` en TODA la ficha, no solo en el sticker: el
          margen negativo se propaga (margin collapse) y la caja de la ficha
          entera sube sobre el escenario — medido, el toque en la franja de
          abajo caía en la ficha y no en el carril, y ahí no se podía
          arrastrar. La ficha es solo imagen y texto, no pierde nada.
          `z-[300]`: el carril del escenario vive en 200 y si no lo tapa.

          Sin sticker (hoy solo Balak, que no vino) queda el nombre en texto.
          CONTRASTE del texto: rojo sobre negro da 4.50:1, justo AA — no achicar. */}
      <div className="pointer-events-none relative z-[300] grid px-6 text-center">
        {items.map((b, i) => (
          <div
            key={b.id}
            aria-hidden={i !== activa}
            className={`col-start-1 row-start-1 ${i === activa ? 'opacity-100' : 'opacity-0'} ${sinMovimiento ? '' : 'transition-opacity duration-150'}`}
          >
            {b.escena.sticker ? (
              <div className="pointer-events-none relative mx-auto -mt-[7.5vw] h-[15vw] w-[64vw]">
                <Image
                  src={b.escena.sticker}
                  alt={b.nombre}
                  fill
                  sizes="64vw"
                  className="object-contain drop-shadow-[0_6px_14px_rgba(0,0,0,.6)]"
                />
              </div>
            ) : (
              <h3 className="pt-6 font-display text-[clamp(26px,7vw,34px)] uppercase leading-none tracking-[0.01em] text-primary">
                {b.nombre}
              </h3>
            )}
            {b.ingredientes ? (
              <p className="mt-2 font-body text-[clamp(13px,3.4vw,15px)] font-semibold uppercase leading-snug tracking-[0.08em] text-primary">
                {b.ingredientes}
              </p>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )
}
