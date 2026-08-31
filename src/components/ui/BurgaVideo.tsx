'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useReducedMotion } from 'motion/react'

/**
 * BurgaVideo — el video de una burga: se reproduce UNA vez y queda en la foto.
 *
 * Arranca solo cuando la tarjeta entra en pantalla, corre de principio a fin
 * sin controles, y al terminar aparece la FOTO de producto por encima
 * (2026-08-27, pedido del cliente). No se queda en el último frame del video:
 * la foto está mejor iluminada y es la que da hambre, así que es la que
 * conviene dejar puesta.
 *
 * ANTES SE MOVÍA CON EL SCROLL. Ese enfoque obligaba a codificar el mp4 con
 * TODOS los frames como keyframe (`-g 1`) para poder saltar a cualquier punto,
 * y eso multiplicaba el peso por ~5 (765KB por video). Al reproducirse de
 * corrido alcanza un GOP normal: los mismos videos pesan ~200KB. Con doce en
 * la carta, esa diferencia es la que hace que la página no se trabe.
 *
 * VAN A DOBLE VELOCIDAD (2026-08-31, pedido del cliente): 2.02s en vez de los
 * 4.04s del original. La aceleración está HORNEADA en el archivo
 * (`setpts=0.5*PTS` al codificar), no puesta con `playbackRate` desde JS: así
 * el video pesa la mitad de frames —131KB contra 214KB— y no depende de que
 * el navegador del celular respete la velocidad pedida.
 *
 * SE REPRODUCE UNA SOLA VEZ. En bucle, doce videos corriendo a la vez
 * pelearían por la atención y por la batería; además el observer se
 * desconecta al arrancar, así que volver a pasar por la tarjeta no lo
 * reinicia.
 *
 * `prefers-reduced-motion`: se muestra la foto directamente y el video ni se
 * descarga.
 */

/** Cuánto de la tarjeta tiene que verse para que el video arranque. */
const VISIBLE_PARA_ARRANCAR = 0.5

export function BurgaVideo({
  src,
  poster,
  foto,
  alt,
}: {
  src: string
  /**
   * Primer frame del video. Se ve mientras el archivo baja, así la tarjeta
   * nunca queda en negro. Tiene que ser el PRIMER frame: con cualquier otro
   * habría un salto en el momento de arrancar.
   */
  poster: string
  /** La foto de producto: queda fija cuando el video termina. */
  foto: string
  alt: string
}) {
  const sinMovimiento = useReducedMotion()
  const video = useRef<HTMLVideoElement>(null)
  const [terminado, setTerminado] = useState(false)

  useEffect(() => {
    if (sinMovimiento) return
    const v = video.current
    if (!v) return

    const alTerminar = () => setTerminado(true)
    v.addEventListener('ended', alTerminar)

    /* PRECARGA: el archivo empieza a bajar bastante ANTES de que la tarjeta se
       vea, así llega entero para cuando hay que reproducirlo. Sin esto el
       video arrancaría recién al pedir `play()` y se vería el poster unos
       segundos — que es justo el tirón que había que sacar.
       Es en cascada y no un `preload="auto"` en el HTML: con doce videos,
       precargarlos todos al abrir la página los haría competir entre sí y con
       el JS de la página. */
    const precarga = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) return
        precarga.disconnect()
        v.preload = 'auto'
        v.load()
      },
      /* Un solo valor: aplica a los CUATRO lados. El margen horizontal hace
         falta desde que en móvil las tarjetas viven en un carril que se
         desliza a lo ancho (`CarruselBurgas`). */
      { rootMargin: '200%' },
    )
    precarga.observe(v)

    /* ARRANQUE: cuando la tarjeta ya se ve de verdad. */
    const arranque = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) return
        // Una sola vez: en cuanto arranca deja de escuchar.
        arranque.disconnect()
        /* `play()` puede ser rechazado (ahorro de datos, políticas del
           navegador). Si pasa, se muestra la foto en vez de dejar la tarjeta
           colgada en el poster para siempre. */
        v.play().catch(() => setTerminado(true))
      },
      { threshold: VISIBLE_PARA_ARRANCAR },
    )
    arranque.observe(v)

    return () => {
      precarga.disconnect()
      arranque.disconnect()
      v.removeEventListener('ended', alTerminar)
    }
  }, [sinMovimiento])

  /* Con movimiento reducido no hay video: solo la foto. */
  if (sinMovimiento) {
    return (
      <Image
        src={foto}
        alt={alt}
        fill
        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 100vw"
        className="object-cover"
      />
    )
  }

  return (
    <>
      <video
        ref={video}
        src={src}
        poster={poster}
        muted
        playsInline
        /* La descarga la dispara la cercanía (ver `BurgaCard`), no el boot de
           la página: con doce videos, precargarlos todos al entrar los haría
           competir entre sí y con el JS. */
        preload="none"
        disablePictureInPicture
        aria-label={alt}
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* La foto, ENCIMA del video y no en su lugar: montada desde el arranque
          con opacidad 0, entra con un fundido cuando el video termina. Si se
          intercambiaran los elementos habría un parpadeo mientras la imagen
          se decodifica. */}
      <Image
        src={foto}
        alt={alt}
        fill
        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 100vw"
        className={`object-cover transition-opacity duration-500 ${
          terminado ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </>
  )
}
