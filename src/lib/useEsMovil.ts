'use client'

import { useEffect, useState } from 'react'

/** El breakpoint `sm` de Tailwind. Si se cambia allá, cambiarlo acá. */
const SM = 640

/**
 * `true` en pantallas menores al breakpoint `sm`.
 *
 * Existe para elegir en JS entre el carrusel y la grilla de la carta, en vez
 * de montar los dos y ocultar uno con `hidden`/`sm:block` (2026-08-31): las
 * doce tarjetas de la grilla traen un `<video>` cada una, y ocultas por CSS
 * igual existen en el DOM y empiezan a descargar. Medido: 13 videos en un
 * celular en vez de 1.
 *
 * ARRANCA EN `false` (o sea, escritorio) tanto en el servidor como en el
 * primer render del cliente, y se corrige en el efecto. Si arrancara midiendo
 * la pantalla, el HTML del servidor —que no tiene ventana que medir— diría
 * otra cosa que el primer render del cliente y React tiraría un error de
 * hidratación.
 */
export function useEsMovil() {
  const [esMovil, setEsMovil] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${SM - 0.02}px)`)
    const aplicar = () => setEsMovil(mq.matches)
    aplicar()
    mq.addEventListener('change', aplicar)
    return () => mq.removeEventListener('change', aplicar)
  }, [])

  return esMovil
}
