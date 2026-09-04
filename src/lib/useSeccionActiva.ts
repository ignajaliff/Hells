'use client'

import { useEffect, useState } from 'react'

/**
 * Cuál de las secciones del nav está mirando el visitante (2026-09-04, pedido
 * del cliente: "que el circulito no sea estético nomás, que se mueva a la
 * sección en la que estás").
 *
 * Devuelve el `id` de la sección activa, para que `NavHero` le dibuje el óvalo
 * al link que corresponde. Antes el activo estaba escrito a mano en
 * `content/home.ts` (`activo: true` en Inicio) y no se movía nunca.
 *
 * ── POR QUÉ NO ALCANZA EL `isIntersecting` DEL OBSERVER ──
 * Varias secciones son más altas que la pantalla, así que casi siempre hay
 * DOS visibles a la vez y "la que está entrando" no es necesariamente la que
 * el visitante está leyendo. Lo que se elige acá es la que más cerca está de
 * la LÍNEA DE LECTURA: un punto fijo por debajo del nav. El observer se usa
 * solo para saber cuáles hay que medir; la decisión es por distancia.
 *
 * Se recalcula en cada scroll con `requestAnimationFrame` —un `setState` por
 * evento de scroll re-renderizaría el nav decenas de veces por segundo— y
 * solo se actualiza el estado cuando la sección REALMENTE cambia.
 *
 * ARRANCA EN LA PRIMERA de la lista, igual en servidor y en cliente: si
 * midiera la pantalla en el primer render, el HTML del servidor —que no tiene
 * ventana que medir— diría otra cosa y React tiraría un error de hidratación.
 */
export function useSeccionActiva(ids: readonly string[]) {
  const [activa, setActiva] = useState(ids[0])

  useEffect(() => {
    const secciones = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)
    if (secciones.length === 0) return

    let raf = 0

    const elegir = () => {
      raf = 0
      /* La línea de lectura: el alto del nav más un margen. Lo que la cruza
         es lo que el visitante tiene delante de los ojos, no lo que asoma
         por abajo. */
      const nav = parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue('--nav'),
      )
      const linea = (Number.isFinite(nav) ? nav : 92) + window.innerHeight * 0.28

      let elegida = secciones[0].id
      let mejor = Infinity
      for (const sec of secciones) {
        const { top, bottom } = sec.getBoundingClientRect()
        // Si la línea cae DENTRO de la sección, es esa y no hay más que ver.
        if (top <= linea && bottom >= linea) {
          elegida = sec.id
          mejor = 0
          break
        }
        const dist = Math.min(Math.abs(top - linea), Math.abs(bottom - linea))
        if (dist < mejor) {
          mejor = dist
          elegida = sec.id
        }
      }

      /* AL FINAL DE LA PÁGINA gana la última sección aunque su línea no se
         cruce: con el scroll al fondo, las últimas secciones ya no pueden
         subir más y sin esto el óvalo se quedaba trabado en la anterior. */
      const fondo =
        window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4
      if (fondo) elegida = secciones[secciones.length - 1].id

      setActiva((previa) => (previa === elegida ? previa : elegida))
    }

    const pedirFrame = () => {
      if (!raf) raf = requestAnimationFrame(elegir)
    }

    elegir()
    window.addEventListener('scroll', pedirFrame, { passive: true })
    window.addEventListener('resize', pedirFrame)
    return () => {
      window.removeEventListener('scroll', pedirFrame)
      window.removeEventListener('resize', pedirFrame)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [ids])

  return activa
}
