'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { useReducedMotion } from 'motion/react'

/**
 * BurgaVideo — un video que NO se reproduce solo: lo mueve el scroll.
 *
 * El visitante controla el tiempo con el dedo. El video se queda en su primer
 * frame hasta que entró un `ARRANQUE` de su alto por abajo de la pantalla, y
 * llega al 100% justo cuando el bloque queda CENTRADO en el viewport (pedido
 * del cliente, 2026-08-26). A partir de ahí queda en el frame final mientras
 * sigue subiendo; si el visitante vuelve para atrás, se rebobina con él.
 *
 * Primero arrancaba apenas asomaba el borde, y el cliente lo vio "empezar sin
 * que se esté viendo": con el bloque entrando un 10% ya iba por el 0.5s. Con
 * `ARRANQUE` los primeros centímetros de scroll no mueven nada.
 *
 * Progreso = (entrado − arranque) / (recorrido − arranque), donde `entrado` es
 * cuánto del bloque asomó (vh − top), `recorrido` cuánto tiene que asomar para
 * quedar centrado (vh/2 + alto/2) y `arranque` = ARRANQUE × alto.
 *
 * REQUISITO DEL ARCHIVO: el mp4 tiene que estar codificado con TODOS los
 * frames como keyframe (`-g 1`). Con un GOP normal cada `currentTime` obliga
 * a decodificar desde el último keyframe y el scrub se traba. El original
 * del cliente traía 1 keyframe en 121 frames; `public/belsebu.mp4` está
 * re-codificado. Si se reemplaza el video, volver a hacerlo.
 *
 * PESO — LA RECETA (2026-08-26, medida sobre Belcebú): all-intra multiplica
 * el peso por ~5 contra un video normal, y la carta va a tener OCHO.
 *
 *   ffmpeg -i <origen> -vf "scale=720:720,fps=12" -an -c:v libx264  *     -g 1 -keyint_min 1 -crf 25 -preset veryslow -pix_fmt yuv420p  *     -movflags +faststart public/<burga>.mp4
 *
 * Da 765KB contra los 1.37MB de la primera versión (720px/24fps): **-44%**.
 * Lo que se recorta son los FRAMES, no la resolución. A 12 fps el scrub se
 * ve igual de fluido porque el frame lo elige el dedo del visitante y no un
 * reloj — la mitad de los frames no se nota.
 *
 * **No bajar de 720px**: se probó 540 (509KB, -33% más) y en pantallas 3x la
 * cebolla crocante pierde las hebras y se ve pastosa. Como la carga en
 * cascada evita que se bajen los ocho juntos, el límite real es el peso de
 * UNO —765KB entran de sobra en el margen de anticipación— y no el total.
 *
 * CARGA EN CASCADA: `preload="none"` + `rootMargin` amplio. El video no se
 * descarga con la página —competía con el JS y llegaba tarde, que era el
 * tirón de la primera visita— sino cuando el visitante se le acerca. Con
 * ocho videos esto es lo que evita que se peleen ocho descargas a la vez.
 *
 * POSTER: mientras el video no tiene datos se ve `poster`, el primer frame
 * como imagen (3KB). Sin él la tarjeta queda negra sobre fondo negro y se
 * lee como un hueco roto. Es lo que más cambia la percepción de fluidez: el
 * video sigue tardando lo mismo, pero nunca hay nada vacío a la vista.
 *
 * Solo escucha el scroll mientras el bloque está cerca de la pantalla
 * (`IntersectionObserver`), y encola una sola actualización por frame con
 * `requestAnimationFrame`: sin eso se dispararían decenas de seeks por
 * evento de scroll.
 *
 * `prefers-reduced-motion`: se muestra directamente el frame final como
 * imagen fija y el video ni se descarga.
 */
/** Fracción del alto del bloque que tiene que haber entrado para que arranque. */
const ARRANQUE = 0.45

export function BurgaVideo({
  src,
  poster,
  final,
  alt,
  className = '',
}: {
  src: string
  /**
   * Primer frame como imagen. Se ve mientras el video no tiene datos, así la
   * tarjeta nunca queda vacía. Tiene que ser el PRIMER frame y no cualquiera:
   * si no, al llegar el video habría un salto visible.
   */
  poster: string
  /** Imagen del último frame: se usa con movimiento reducido. */
  final: string
  alt: string
  className?: string
}) {
  const sinMovimiento = useReducedMotion()
  const video = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (sinMovimiento) return
    const v = video.current
    if (!v) return

    let raf = 0
    let duracion = 0

    const actualizar = () => {
      raf = 0
      if (!duracion) return
      const r = v.getBoundingClientRect()
      const vh = window.innerHeight
      const entrado = vh - r.top
      const arranque = r.height * ARRANQUE
      const recorrido = vh / 2 + r.height / 2
      const progreso = Math.min(1, Math.max(0, (entrado - arranque) / (recorrido - arranque)))
      // Un pelo antes del final: en `duration` exacta algunos navegadores
      // disparan `ended` y muestran un frame negro.
      const t = Math.min(progreso * duracion, duracion - 0.02)
      if (Math.abs(v.currentTime - t) > 1 / 48) v.currentTime = t
    }

    const pedirFrame = () => {
      if (!raf) raf = requestAnimationFrame(actualizar)
    }

    const alCargarMetadata = () => {
      duracion = v.duration
      pedirFrame()
    }

    if (v.readyState >= 1) alCargarMetadata()
    else v.addEventListener('loadedmetadata', alCargarMetadata, { once: true })
    // Cuando llega el primer frame decodificado hay que volver a pedir uno:
    // el seek hecho antes de tener datos no dibuja nada.
    v.addEventListener('loadeddata', pedirFrame, { once: true })

    /**
     * DESTRABE PARA MÓVIL (2026-08-26): iOS Safari y Chrome con ahorro de
     * datos IGNORAN `preload="auto"` y no bajan ni un byte del video hasta
     * que alguien lo reproduce. Sin datos el `<video>` no dibuja ningún
     * frame, y sobre el bloque negro eso se ve como "no hay video" — en
     * producción se veía la tarjeta vacía en el celular mientras en el
     * escritorio andaba. Un `play()` seguido de `pause()` obliga a cargar;
     * está permitido sin gesto del usuario porque es muted + playsInline.
     * Se hace una sola vez, la primera vez que el bloque se acerca.
     */
    let destrabado = false
    const destrabar = () => {
      if (destrabado) return
      destrabado = true
      // `load()` reinicia el elemento: solo si todavía no bajó nada.
      if (v.readyState === 0) v.load()
      const intento = v.play()
      if (intento) {
        intento
          .then(() => {
            v.pause()
            pedirFrame()
          })
          .catch(() => {
            /* Si el navegador lo rechaza, el `load()` ya pidió los datos. */
          })
      }
    }

    const observer = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          destrabar()
          window.addEventListener('scroll', pedirFrame, { passive: true })
          window.addEventListener('resize', pedirFrame)
          pedirFrame()
        } else {
          window.removeEventListener('scroll', pedirFrame)
          window.removeEventListener('resize', pedirFrame)
        }
      },
      /* Un margen GRANDE: es lo que dispara la descarga (`destrabar`), así
         que tiene que empezar bastante antes de que el bloque se vea. Con
         25% el video llegaba justo cuando ya había que reproducirlo. */
      { rootMargin: '150% 0px' },
    )
    observer.observe(v)

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', pedirFrame)
      window.removeEventListener('resize', pedirFrame)
      v.removeEventListener('loadedmetadata', alCargarMetadata)
      v.removeEventListener('loadeddata', pedirFrame)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [sinMovimiento])

  if (sinMovimiento) {
    return (
      <Image
        src={final}
        alt={alt}
        fill
        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 100vw"
        className={`object-cover ${className}`}
      />
    )
  }

  return (
    <video
      ref={video}
      src={src}
      poster={poster}
      muted
      playsInline
      /* `none` y no `auto`: la descarga la dispara el observer cuando el
         bloque se acerca, no el boot de la página. */
      preload="none"
      disablePictureInPicture
      aria-label={alt}
      className={`absolute inset-0 h-full w-full object-cover ${className}`}
    />
  )
}
