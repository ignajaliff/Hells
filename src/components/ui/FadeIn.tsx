'use client'

import { type ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'

type FadeInProps = {
  children: ReactNode
  /** Retardo en segundos — se usa para escalonar la entrada del hero. */
  delay?: number
  /** Desplazamiento inicial en píxeles (siempre chico: 20-40). */
  y?: number
  /** Por defecto anima al entrar en viewport. En el hero conviene `false`. */
  alEntrarEnPantalla?: boolean
  className?: string
}

/**
 * Wrapper de animación genérico (ai-pmp/design-rules.txt §6).
 * Es el ÚNICO Client Component del árbol del hero: las secciones siguen
 * siendo Server Components y solo envuelven sus hijos con esto.
 * Anima únicamente opacity y transform. Respeta prefers-reduced-motion.
 */
export function FadeIn({
  children,
  delay = 0,
  y = 24,
  alEntrarEnPantalla = true,
  className,
}: FadeInProps) {
  const sinMovimiento = useReducedMotion()

  const desde = { opacity: 0, y: sinMovimiento ? 0 : y }
  const hasta = { opacity: 1, y: 0 }
  const transicion = { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const }

  if (alEntrarEnPantalla) {
    return (
      <motion.div
        className={className}
        initial={desde}
        whileInView={hasta}
        viewport={{ once: true, amount: 0.3 }}
        transition={transicion}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <motion.div className={className} initial={desde} animate={hasta} transition={transicion}>
      {children}
    </motion.div>
  )
}
