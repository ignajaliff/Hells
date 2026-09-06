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
/**
 * Radio del arco, en fracción del ancho del escenario.
 *
 * EN ESCRITORIO ES MÁS CHICO (2026-09-05, pedido del cliente: "que se vean la
 * anterior y la siguiente a los costados, como en el celular").
 * El bloque de escritorio va con `scale-[1.35]` —para que la burger llene la
 * caja apaisada— y esa escala se lleva también el arco, así que las vecinas
 * salían disparadas fuera del escenario: medido en 1440, se veían al 45%
 * contra el 90-100% del celular (una llegaba a 1576px sobre una caja de 1328).
 * Dividirlo por esa misma escala las devuelve adentro sin tocar el móvil, que
 * no lleva escala y sigue con el 0.44 de siempre.
 */
const RADIO_MOVIL = 0.44
const ESCALA_ESCRITORIO = 1.35
const RADIO_ESCRITORIO = RADIO_MOVIL / ESCALA_ESCRITORIO
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
  guarnicion,
  className = '',
}: {
  items: readonly Burga[]
  /**
   * Aclaración que vale para TODAS las burgas (hoy: "vienen con papas"), al
   * pie de la ficha. Es opcional: sin ella el bloque no se dibuja.
   */
  guarnicion?: string
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

      /* El radio depende del ancho: de `sm` para arriba el bloque va escalado
         y el arco tiene que compensarlo (ver `RADIO_ESCRITORIO`). Se mide acá
         y no con `matchMedia` en un estado aparte porque `pintar` ya corre en
         cada scroll y resize, así que sigue al viewport sin listeners nuevos.
         640px es el breakpoint `sm` de Tailwind: si allá cambia, acá también. */
      const radio = window.innerWidth >= 640 ? RADIO_ESCRITORIO : RADIO_MOVIL

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
        const ncx = cx + Math.sin(ang) * radio
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
    /* `@container` (2026-09-04): en ESCRITORIO el tocadiscos no ocupa la
       pantalla entera sino una caja centrada, y las medidas de la ficha —el
       sticker y su margen negativo— tienen que referirse a ESA caja, no al
       viewport. Con `vw` puro, en 1440px el sticker salía de 216px de alto
       (contra 58 en un celular) y se montaba sobre la foto muchísimo más de
       lo debido. Las unidades `cqw` miden el ancho de este contenedor, así
       que la proporción sticker/foto queda idéntica en las dos pantallas.
       La geometría del giro no necesita nada de esto: ya está toda en
       fracciones del escenario (ver `RADIO`, `SUBIDA`, las `caja`). */
    /* UNA SOLA COLUMNA, el texto DEBAJO de la foto, en las dos pantallas.
       Se probó con el texto a la derecha en escritorio (2026-09-04) para que
       la foto pudiera ser más ancha, y el cliente lo descartó: prefiere el
       nombre y los ingredientes abajo, como en el celular.
       Para que la foto igual ocupe de lado a lado sin que las dos compitan
       por la altura, en escritorio la caja se achata (ver `sm:aspect-[5/3]`)
       en vez de repartirse el ancho. */
    <div className={`relative z-0 @container flex flex-col ${className}`}>
      {/* EL ESCENARIO. Es la foto activa entera —su fondo abajo, su silueta
          encima— y sobre ella las vecinas girando.
          `overflow-hidden` recorta las siluetas que salen por los costados sin
          generar scroll horizontal.

          EN MÓVIL ES CUADRADO, como siempre (`aspect-square`).
          EN ESCRITORIO se le RECORTA EL AIRE DE ARRIBA (2026-09-04): medido,
          la hamburguesa ocupa del 35% al 80% del alto de la foto, o sea que
          el 35% superior es fondo vacío. Como el cuadrado está limitado por
          la ALTURA de la pantalla, ese aire era ancho que no se podía usar y
          se traducía en los 650px muertos a cada lado (el 57-68% del ancho).
          Con `sm:aspect-[5/3]` la caja es bien apaisada: a la misma altura
          entra mucho más ancha —de lado a lado— la burger se ve grande y la
          ficha sigue quedando dentro de la pantalla. El recorte se lo lleva
          el `object-cover` de los fondos, que ya estaba.

          `sm:-translate-y-[3%]` SUBE el contenido dentro de esa caja. Sin él
          la burger quedaba pegada al piso con una franja negra arriba: las
          siluetas se posicionan en FRACCIONES del alto de la caja (35%-80%),
          así que al achatarla esas mismas fracciones la dejan baja. Se mueve
          el bloque ENTERO —fondos y siluetas juntos— para que no se
          desalineen entre sí, y el `overflow-hidden` del padre se lleva lo
          que sobra. */}
      <div className="relative aspect-square w-full shrink-0 overflow-hidden bg-black sm:aspect-[5/3] sm:max-h-[calc(100svh-23rem)]">
        {/* `sm:scale-[1.35]` AGRANDA el contenido dentro de la caja recortada.
            Al limitar el alto (ver `sm:max-h-…` arriba) la caja queda bien
            apaisada, y como la foto entra con `object-cover` el dibujo se
            aleja: la hamburguesa quedaba chica con mucho negro alrededor.
            Escalar el bloque entero —fondos y siluetas juntos— la devuelve a
            un tamaño que llena la caja sin deformar nada; lo que sobra se lo
            lleva el `overflow-hidden` del padre.
            El `-translate-y` compensa que al escalar el conjunto baja. */}
        <div className="absolute inset-0 sm:-translate-y-[3%] sm:scale-[1.35]">
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
            {/* LA SOMBRA/LUZ MÁS CHICA EN ESCRITORIO (2026-09-05, pedido del
                cliente). El degradé rojo está HORNEADO en la imagen, que es la
                misma en las dos pantallas, así que no se puede achicar en el
                archivo sin afectar al celular — y ahí el cliente lo quiere como
                está.
                Se recorta con una máscara radial: el centro queda intacto y el
                halo se desvanece antes de llegar a los bordes, o sea que la luz
                ocupa menos sin cambiar de color ni de intensidad.
                Hace falta JUSTO en escritorio porque ahí el contenido va con
                `scale-[1.35]` —para que la burger llene la caja apaisada— y esa
                escala agranda el degradé junto con todo (medido: la imagen se
                dibuja a 1793px sobre una caja de 1328). En móvil la escala es 1
                y la máscara no se aplica. */}
            <Image
              src={b.escena.fondo}
              alt=""
              fill
              sizes="100vw"
              priority={i < 2}
              className="object-cover sm:[mask-image:radial-gradient(58%_62%_at_50%_52%,#000_38%,transparent_100%)]"
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
        </div>

        {/* EL FUNDIDO CON EL FONDO (2026-09-04, pedido del cliente: "se nota
            mucho el cambio de rojo a negro, que quede armonizado").
            La foto tiene un degradé rojo horneado que arranca de golpe contra
            el negro de la sección, y ese canto duro se veía como una línea de
            corte en los cuatro bordes.
            Esto lo disimula con negro que se desvanece hacia adentro: arriba
            —donde el rojo es más fuerte y el salto más visible— entra bastante
            más que abajo, y a los costados una franja corta alcanza.
            Va DEBAJO del carril (que vive en 200) y con `pointer-events-none`:
            si no, se comería el gesto. Es puro CSS sobre la caja, así que no
            depende de la burga activa ni hay que regenerar ninguna imagen.

            TAMBIÉN EN MÓVIL (2026-09-04, pedido del cliente): al principio iba
            solo en escritorio, pero en el celular el corte contra el título de
            la sección se ve igual de duro.
            La diferencia es que en móvil la foto ocupa TODO el ancho de la
            pantalla, así que ahí no hay canto lateral que disimular: va solo
            el fundido de arriba y abajo. Meter también el horizontal
            oscurecería los bordes de la foto sin motivo.

            EL NEGRO BAJA MÁS EN MÓVIL —hasta el 52% contra el 28% de
            escritorio— (2026-09-04, pedido del cliente: "la franja roja está
            muy arriba, parece de fondo"). La caja del celular es CUADRADA y
            la de escritorio apaisada, así que el mismo porcentaje no tapa lo
            mismo: al 28% el rojo asomaba a 109px del borde, muy por encima de
            la hamburguesa, y se leía como un fondo aparte en vez de como el
            ambiente de la foto. Al 52% el color arranca recién cerca del pan. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[100] bg-[linear-gradient(to_bottom,#000_0%,#000_18%,transparent_52%,transparent_88%,#000_100%)] sm:bg-[linear-gradient(to_bottom,#000_0%,transparent_28%,transparent_88%,#000_100%),linear-gradient(to_right,#000_0%,transparent_9%,transparent_91%,#000_100%)]"
        />

        {/* EL CARRIL INVISIBLE que capta el dedo, por encima de todo. Va
            FUERA del bloque que se sube en escritorio: tiene que cubrir la
            caja entera para captar el gesto, no correrse con la imagen. Cada
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

        {/* LAS FLECHAS — SOLO ESCRITORIO (2026-09-04, pedido del cliente).
            En el celular el carrusel se pasa con el dedo y no hacen falta;
            con mouse, en cambio, la única forma era hacer clic en la burga de
            al lado, y eso hay que descubrirlo. `hidden sm:flex` las deja
            fuera del móvil, que no se tocó.

            Van en `z-[210]`, POR ENCIMA del carril (200): si no, el carril
            —que cubre todo el escenario para captar el gesto— se come el clic.
            En los extremos se deshabilitan en vez de esconderse: si
            desaparecieran, la otra flecha saltaría de lugar al llegar al
            final. */}
        <button
          type="button"
          onClick={() => irA(Math.max(0, activa - 1))}
          disabled={activa === 0}
          aria-label="Burga anterior"
          className="absolute left-3 bottom-[8%] z-[210] sm:left-[12%] sm:bottom-[10%] lg:left-[26%] flex items-center justify-center rounded-full border border-primary/25 bg-black/30 p-2.5 text-primary/70 backdrop-blur-sm transition-[color,border-color,background-color] hover:border-primary/60 hover:bg-black/55 hover:text-primary disabled:pointer-events-none disabled:opacity-0 sm:p-3"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M15 5 8 12l7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => irA(Math.min(items.length - 1, activa + 1))}
          disabled={activa === items.length - 1}
          aria-label="Burga siguiente"
          className="absolute right-3 bottom-[8%] z-[210] sm:right-[12%] sm:bottom-[10%] lg:right-[26%] flex items-center justify-center rounded-full border border-primary/25 bg-black/30 p-2.5 text-primary/70 backdrop-blur-sm transition-[color,border-color,background-color] hover:border-primary/60 hover:bg-black/55 hover:text-primary disabled:pointer-events-none disabled:opacity-0 sm:p-3"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="m9 5 7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
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
      {/* EN ESCRITORIO ES LA COLUMNA DERECHA (2026-09-04): `flex-1` para que
          se coma el ancho que deja la foto, alineada a la izquierda y sin el
          `px` del móvil. En móvil no cambia nada: sigue debajo y centrada. */}
      <div className="pointer-events-none relative z-[300] grid px-6 text-center">
        {items.map((b, i) => (
          <div
            key={b.id}
            aria-hidden={i !== activa}
            className={`col-start-1 row-start-1 ${i === activa ? 'opacity-100' : 'opacity-0'} ${sinMovimiento ? '' : 'transition-opacity duration-150'}`}
          >
            {b.escena.sticker ? (
              /* El margen negativo que lo monta sobre la foto es SOLO de
                 móvil (`max-sm:`): al costado no hay borde inferior sobre el
                 que montarse y el sticker se subía solo, descolgado.
                 En escritorio su ancho se mide contra la COLUMNA, no contra
                 el escenario, así que va en `%` y no en `cqw`. */
              /* EN ESCRITORIO EL ANCHO MANDA (2026-09-04, pedido del cliente:
                 "algunos son muy grandes"). La caja fija SOLO el alto y los
                 sellos tienen proporciones muy distintas —medido, de 1.71 a
                 3.80, o sea 2.22x—, así que con `object-contain` el más
                 apaisado se dibuja mucho más ancho: Asmodeo salía como un
                 bloque rojo de borde a borde al lado del óvalo discreto de
                 Lucifer.
                 Con `max-w` el ancho queda acotado y los apaisados se achican
                 hasta entrar; los cuadrados no lo tocan y conservan su alto.
                 En MÓVIL no se toca: ahí la caja es más angosta en proporción
                 y el problema no aparece. */
              <div className="pointer-events-none relative mx-auto h-[15cqw] w-[64cqw] -mt-[7.5cqw] sm:-mt-[1cqw] sm:h-[8cqw] sm:w-auto sm:max-w-[24cqw]">
                <Image
                  src={b.escena.sticker}
                  alt={b.nombre}
                  fill
                  sizes="(min-width: 640px) 420px, 64vw"
                  /* CENTRADO, sin `object-left`: ése venía del intento de
                     poner el texto en una columna a la derecha (descartado) y
                     dejaba el sello corrido a la izquierda respecto de la
                     hamburguesa — medido, 152px de desfase en 1440. */
                  className="object-contain drop-shadow-[0_6px_14px_rgba(0,0,0,.6)]"
                />
              </div>
            ) : (
              /* En `cqw` y no `vw`: el ancho de referencia es el escenario.
                 Con `vw`, en escritorio el `clamp` se clavaba en su tope
                 (34px / 15px) y el texto quedaba diminuto al lado de una foto
                 mucho más grande que la del celular. */
              <h3 className="pt-6 font-display text-[clamp(26px,7cqw,34px)] uppercase leading-none tracking-[0.01em] text-primary">
                {b.nombre}
              </h3>
            )}
            {b.ingredientes ? (
              /* BLANCOS y no rojos (2026-09-04, pedido del cliente). De paso
                 gana contraste: `--primary` sobre negro daba 4.50:1, justo el
                 mínimo AA y sin margen para achicar el texto; `--foreground`
                 da 15.96:1. El nombre sigue en rojo — es texto grande y ahí
                 el rojo de marca sí funciona. */
              <p className="mt-2 font-body text-[clamp(13px,3.4cqw,15px)] font-semibold uppercase leading-snug tracking-[0.08em] text-foreground sm:mt-4 sm:text-[clamp(15px,1.5cqw,20px)]">
                {b.ingredientes}
              </p>
            ) : null}
          </div>
        ))}

        {/* LA ACLARACIÓN DE LA GUARNICIÓN (2026-09-06, pedido del cliente:
            "un widget abajo de los ingredientes que diga «todas las burgers
            vienen con papas»").

            VA FUERA DEL BUCLE, no dentro: el dato vale para las doce por
            igual, así que montarlo por burga lo dibujaría doce veces apiladas
            en la misma celda de la grilla. Acá se dibuja UNA sola vez y queda
            fijo mientras las fichas se cruzan por encima.

            Por lo mismo NO se desvanece con el crossfade: no cambia al pasar
            de burga, y parpadear en cada giro lo haría leer como si fuera
            parte de la ficha.

            Es una PÍLDORA con borde rojo y no texto suelto: al pie de una
            ficha que ya tiene nombre e ingredientes, un tercer renglón de
            texto se leería como un ingrediente más. El recuadro lo separa
            como lo que es, una aclaración de la casa.
            Texto en `--foreground` (15.96:1 sobre negro) y el rojo solo en el
            borde: es texto chico y `--primary` daría 4.50:1, el mínimo justo.

            `col-start-1 row-start-1` NO va acá: este bloque es una celda más
            de la grilla, la de abajo, así que se apila debajo de las fichas
            en vez de encima de ellas. */}
        {guarnicion ? (
          <p className="mt-5 justify-self-center rounded-full border border-primary/45 px-4 py-1.5 font-body text-[clamp(11px,2.8cqw,13px)] font-semibold uppercase tracking-[0.1em] text-foreground/85 sm:mt-6 sm:text-[clamp(12px,1.2cqw,15px)]">
            {guarnicion}
          </p>
        ) : null}
      </div>
    </div>
  )
}
