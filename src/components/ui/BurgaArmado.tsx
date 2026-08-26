'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useReducedMotion } from 'motion/react'

/**
 * BurgaArmado — la secuencia de la burga armándose sola.
 *
 * Tres fotos de la misma hamburguesa: desarmada con los ingredientes flotando,
 * a medio juntar, y terminada. Se encadenan con un crossfade, así que se lee
 * como el sándwich construyéndose.
 *
 * ARRANCA AL ENTRAR EN PANTALLA, no al cargar la página: la carta está abajo
 * del hero y si la animación corriera al montar, el visitante se la perdería
 * entera. Un `IntersectionObserver` la dispara cuando la tarjeta se ve.
 *
 * SE REPRODUCE UNA SOLA VEZ y queda en la foto final. En bucle competiría con
 * el resto de la grilla —y la última fase es la que da hambre, que es la que
 * conviene dejar puesta—. El observer se desconecta al terminar.
 *
 * `prefers-reduced-motion`: se saltea la animación y se muestra directamente la
 * burga terminada. La información no se pierde, solo el movimiento.
 *
 * Las tres imágenes se precargan (`priority` en la primera, las otras montadas
 * desde el arranque con opacidad 0): si entraran a demanda, el cambio de fase
 * mostraría un hueco mientras baja el archivo.
 */

/** Cuánto dura cada fase en pantalla antes de pasar a la siguiente. */
const PASO_MS = 620

const FASES = [
  { src: '/burga-fase-1.webp', alt: 'Los ingredientes de la hamburguesa, separados' },
  { src: '/burga-fase-2.webp', alt: 'La hamburguesa a medio armar' },
  { src: '/burga-destacada.webp', alt: 'La hamburguesa terminada' },
] as const

export function BurgaArmado({ className = '' }: { className?: string }) {
  const sinMovimiento = useReducedMotion()
  const [fase, setFase] = useState(0)
  const contenedor = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Con movimiento reducido se muestra el resultado y no se anima nada.
    if (sinMovimiento) {
      setFase(FASES.length - 1)
      return
    }

    const nodo = contenedor.current
    if (!nodo) return

    let temporizadores: ReturnType<typeof setTimeout>[] = []

    const observer = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) return
        observer.disconnect()
        // Una fase por paso. La última queda fija.
        temporizadores = FASES.slice(1).map((_, i) =>
          setTimeout(() => setFase(i + 1), PASO_MS * (i + 1)),
        )
      },
      { threshold: 0.45 },
    )

    observer.observe(nodo)

    return () => {
      observer.disconnect()
      temporizadores.forEach(clearTimeout)
    }
  }, [sinMovimiento])

  return (
    /* `absolute inset-0` y no `relative`: este componente se monta dentro de la
       caja `aspect-square` de la tarjeta, que ya es la que define el tamaño. Con
       `relative` el div no tiene alto propio —sus hijos son todos `fill`, o sea
       absolutos— y colapsaba a 6px. */
    <div ref={contenedor} className={`absolute inset-0 ${className}`}>
      {FASES.map((f, i) => (
        <Image
          key={f.src}
          src={f.src}
          alt={i === FASES.length - 1 ? f.alt : ''}
          aria-hidden={i !== FASES.length - 1}
          fill
          priority={i === 0}
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 100vw"
          className={`translate-y-[7%] scale-[0.94] object-contain drop-shadow-[0_14px_20px_rgba(0,0,0,.45)] transition-opacity duration-300 ${
            i === fase ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
    </div>
  )
}
