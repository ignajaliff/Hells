'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { motion, useReducedMotion } from 'motion/react'
import { diabloContent } from '@/content/home'

/**
 * DiabloHero — la mascota asomando en el hero.
 *
 * Solo se ve mientras el hero está en pantalla: al scrollear a las secciones
 * siguientes se desvanece. Eso se resuelve con IntersectionObserver sobre la
 * propia sección padre (no con scroll listeners: el observer no corre en cada
 * frame de scroll y no obliga a recalcular layout).
 *
 * Guiña cada tanto, no en loop continuo: un guiño constante cansa y compite
 * con el h1, que es lo que tiene que leerse.
 */

/** Cada cuánto guiña, en ms. */
const INTERVALO_GUINO = 4200

export function DiabloHero({ className }: { className?: string }) {
  const sinMovimiento = useReducedMotion()
  const contenedor = useRef<HTMLDivElement>(null)
  const [enPantalla, setEnPantalla] = useState(true)
  const [guiñando, setGuiñando] = useState(false)

  // Visible solo mientras el hero está a la vista.
  useEffect(() => {
    const nodo = contenedor.current
    if (!nodo) return

    const observador = new IntersectionObserver(
      ([entrada]) => setEnPantalla(entrada.isIntersecting),
      { threshold: 0.1 }
    )
    observador.observe(nodo)
    return () => observador.disconnect()
  }, [])

  // Guiño periódico. Se apaga si el hero no está en pantalla o si pidieron
  // no ver movimiento — así no queda un timer corriendo de fondo para siempre.
  useEffect(() => {
    if (sinMovimiento || !enPantalla) return

    // El timeout que reabre el ojo se guarda aparte: si el hero se va de
    // pantalla justo con el ojo cerrado, hay que cancelarlo también o el
    // diablo queda guiñando para siempre.
    let reabrir: ReturnType<typeof setTimeout>

    const intervalo = setInterval(() => {
      setGuiñando(true)
      reabrir = setTimeout(() => setGuiñando(false), 320)
    }, INTERVALO_GUINO)

    return () => {
      clearInterval(intervalo)
      clearTimeout(reabrir)
      setGuiñando(false)
    }
  }, [sinMovimiento, enPantalla])

  return (
    <motion.div
      ref={contenedor}
      aria-hidden
      className={className}
      initial={false}
      animate={{ opacity: enPantalla ? 1 : 0, y: enPantalla ? 0 : 16 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative">
        <Image
          src={diabloContent.abierto}
          alt=""
          width={620}
          height={699}
          className="h-auto w-full"
        />
        <Image
          src={diabloContent.guino}
          alt=""
          width={620}
          height={699}
          className="absolute inset-0 h-auto w-full transition-opacity duration-150"
          style={{ opacity: guiñando ? 1 : 0 }}
        />
      </div>
    </motion.div>
  )
}
