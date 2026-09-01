'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

/**
 * CarruselBurgasV2 — la VARIANTE en prueba de la carta en móvil (2026-08-31,
 * pedido del cliente). Convive con `CarruselBurgas` en la misma página, en la
 * sección clonada de abajo, para poder comparar las dos y elegir.
 * **Cuando el cliente decida, una de las dos se borra.**
 *
 * ── LA BANDEJA GIRATORIA (2026-09-01, pedido del cliente) ──
 * Las burgas ya no se apilan ni desfilan de costado: están repartidas
 * alrededor de una ELIPSE, como platos en una bandeja giratoria, y la bandeja
 * entera gira con el dedo. La que queda al frente se ve grande, a todo el
 * ancho y a color sobre el rojo; las que van hacia el fondo se achican, suben,
 * **se despintan a gris y se apagan** — quedan en segundo plano.
 *
 * Cada posición sale de un ángulo, así que todo (lugar, tamaño, gris, rojo)
 * es continuo: el giro se ve DURANTE el arrastre y no salta al soltar.
 *
 * ── QUÉ CAMBIA CONTRA LA v1 ──
 * 1. La del frente va DE BORDE A BORDE de la pantalla, no al 84%.
 * 2. Se muestra sobre FONDO ROJO; las del fondo van sobre el negro de la
 *    sección, sin cuadro de color ni marco propio.
 * 3. El movimiento es circular, no lateral.
 *
 * El resto —el carril invisible que capta el dedo, `snap-proximity`, el
 * pintado por frame sobre refs— es idéntico a la v1 y por las mismas razones;
 * están documentadas allá y no se repiten acá.
 *
 * ── LAS DOS FOTOS DE CADA BURGA ──
 * Cada tarjeta monta DOS capas que se cruzan por opacidad según la
 * profundidad:
 *   * AL FRENTE la foto CON FONDO (`video.foto`), que se ve mejor y llena la
 *     tarjeta con `cover`.
 *   * GIRANDO ATRÁS el recorte SIN FONDO (`miniatura`), chiquito y con
 *     `contain`: la hamburguesa sola sobre el rojo.
 * El cruce ocurre solo en el último tramo del recorrido — la foto con fondo
 * arrastra un bloque negro y no puede verse a medias mientras gira.
 * Satanás no tiene recorte propio (no vino en la entrega del cliente) y usa la
 * `sativa` de ejemplo; si a alguna le faltara, se queda con su foto normal.
 */

type Burga = {
  id: string
  nombre: string
  video: { src: string; poster: string; foto: string; alt: string }
  ingredientes?: string
  /**
   * La foto SIN FONDO que se ve MIENTRAS LA BURGA ESPERA SU TURNO, asomada
   * chiquita al costado. Al pasar al frente vuelve a su `foto` normal.
   * Si falta, la miniatura muestra la foto normal.
   */
  miniatura?: string
}

/**
 * Cuántas burgas se dibujan a cada lado del frente. Más allá van con
 * `visibility: hidden`: están en la vuelta pero detrás de todo, y componerlas
 * sería trabajo del navegador para algo que no se ve.
 */
const VECINAS_VISIBLES = 2
/**
 * Sobre cuántas posiciones se reparte la vuelta completa de la bandeja.
 *
 * NO son las doce: con doce, cada burga estaría a 30° de la siguiente y el
 * giro entre una y otra casi no se notaría. Con 7 el recorrido de la que entra
 * es visible —sube desde el fondo, cruza el costado y llega al frente— que es
 * el movimiento de ruleta que se pidió.
 */
const VUELTA = 7
/**
 * Cuánto se abre la elipse a los costados, en % del ancho de la tarjeta.
 *
 * **Es el movimiento principal**: la vuelta va de DERECHA A IZQUIERDA, así que
 * lo que se recorre es el eje horizontal. Tiene que ser grande para que la que
 * entra haga un viaje visible desde el borde derecho hasta el centro.
 */
const RADIO_X = 58
/**
 * Cuánto se corren en VERTICAL las del fondo, en % de su alto.
 *
 * Deliberadamente MUY chico: la vuelta es horizontal, no de arriba hacia
 * abajo. Esto solo desplaza un poquito a las del fondo para que no queden
 * exactamente detrás de la del frente y se lea la profundidad.
 * Antes era grande (bajaban 66%) pero eso era un rodeo para esquivar el panel
 * rojo, de cuando cada tarjeta traía su propio bloque negro opaco; ahora las
 * tarjetas no tienen fondo y pueden pasar POR DETRÁS de la del frente.
 */
const ALTURA_FONDO = 7
/**
 * Escala de la burga que está justo en el fondo de la vuelta. No tan chica
 * como cuando giraban por debajo: acá pasan por detrás y tienen que seguir
 * leyéndose como hamburguesas, no como puntitos.
 */
const ESCALA_FONDO = 0.34
/**
 * Cuánto se DESPINTAN las del fondo (2026-09-01, pedido del cliente: "que se
 * vea un poco medio gris, o en segundo plano"). 1 = blanco y negro.
 * Va como `grayscale` sobre la tarjeta y no como un velo de color encima:
 * tiene que sacarle el color a la foto, no taparla con un tono.
 */
const GRIS_FONDO = 0.85
/** Cuánto se OSCURECEN las del fondo, sumado al gris. */
const OSCURO_FONDO = 0.45

export function CarruselBurgasV2({
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
      const paso = rail.scrollWidth / items.length
      const posicion = rail.scrollLeft / paso

      tarjetas.current.forEach((li, i) => {
        if (!li) return
        const d = i - posicion
        const dist = Math.abs(d)

        if (dist > VECINAS_VISIBLES + 0.5) {
          li.style.visibility = 'hidden'
          return
        }
        li.style.visibility = 'visible'

        /* ── LA BANDEJA GIRATORIA ──
           Cada burga ocupa un lugar fijo alrededor de una elipse y la elipse
           entera gira con el dedo. El ÁNGULO sale de la distancia a la activa:
           0 = al frente (lo más cerca del espectador), y crece hacia los lados
           hasta mandar la burga al fondo.
           Se reparte sobre `VUELTA` y no sobre las doce: con doce posiciones
           el paso sería de 30° y el giro casi no se notaría entre una y la
           siguiente. Con `VUELTA` la que entra hace un recorrido visible. */
        const ang = (d / VUELTA) * Math.PI * 2

        /* La posición sobre la elipse. `sin` da el lado y `cos` la
           profundidad: +1 al frente, −1 al fondo.

           EL GIRO ES DE DERECHA A IZQUIERDA (2026-09-01, pedido del cliente):
           la que entra aparece por la DERECHA, cruza hacia el centro y sale
           por la izquierda hacia el fondo. Por eso el movimiento fuerte es el
           horizontal y la `y` casi no se usa.

           El `ALTURA_FONDO` que queda es MUY chico y solo levanta un poco a
           las del fondo, lo justo para que no queden exactamente detrás de la
           del frente y se lea la profundidad del plato. Antes era grande y
           positivo (bajaban), pero eso era un rodeo para esquivar el panel
           rojo cuando cada tarjeta traía su propio bloque negro opaco; ahora
           las tarjetas no tienen fondo y pueden pasar POR DETRÁS. */
        const x = Math.sin(ang) * RADIO_X
        const prof = Math.cos(ang)
        const y = (1 - prof) * ALTURA_FONDO

        /* La escala sale de la PROFUNDIDAD, no de la distancia: así la de
           adelante está grande y las del fondo chicas, y una que va bajando
           por el costado se achica sola durante el giro. */
        const p = (prof + 1) / 2 // 0 en el fondo, 1 al frente
        const escala = ESCALA_FONDO + (1 - ESCALA_FONDO) * p ** 1.6
        li.style.transform = `translate(${x}%, ${y}%) scale(${escala})`
        /* Las de adelante tapan a las del fondo. Se queda por debajo de 100:
           el carril invisible vive en 200 y tiene que recibir el dedo. */
        li.style.zIndex = String(10 + Math.round(p * 80))

        /* `cerca` mide "qué tan al frente está" y de ahí salen el rojo, el
           el gris y la escala. Al ser continuo, todo el cambio ocurre DURANTE el
           giro y no salta al soltar. */
        const cerca = Math.max(0, prof) ** 2

        /* AL FONDO VAN EN GRIS (2026-09-01, pedido del cliente): pierden el
           color y se apagan, así queda claro cuál es la que está al frente.
           Es `filter` sobre el `<li>` y no un velo de color encima porque
           tiene que despintar la foto, no taparla con un tono. */
        li.style.filter = `grayscale(${(1 - cerca) * GRIS_FONDO}) brightness(${
          1 - (1 - cerca) * OSCURO_FONDO
        })`

        /* EL CRUCE ENTRE LAS DOS FOTOS (2026-09-01, pedido del cliente).
           La de fondo entra solo cuando la burga está prácticamente al frente
           y el recorte se apaga en ese mismo tramo. La curva es agresiva
           (`** 6`) a propósito: la foto con fondo trae su rectángulo negro
           horneado, así que solo puede verse cuando la tarjeta ya llena la
           pantalla; un poquito antes, ese rectángulo se recortaría contra el
           panel rojo. Con `cerca` a secas el cruce empezaba demasiado pronto.
           Las burgas sin recorte propio no tienen capa `[data-recorte]`: se
           quedan con la de fondo, que es su único material. */
        const conFondo = li.querySelector<HTMLElement>('[data-confondo]')
        const recorte = li.querySelector<HTMLElement>('[data-recorte]')
        /* El cruce ocurre solo en el ÚLTIMO tramo, cuando la burga ya está
           casi clavada al frente (de `cerca` 0.86 a 1). Fuera de esa ventana
           la de fondo está en 0 y solo se ve el recorte.
           Con una curva más suave (se probó `cerca ** 6`) DOS tarjetas tenían
           su bloque negro a media opacidad al mismo tiempo, y a mitad de giro
           se veían dos rectángulos translúcidos cruzándose sobre el rojo. */
        const t = Math.max(0, (cerca - 0.86) / 0.14)
        const mezcla = recorte ? t : 1
        if (conFondo) conFondo.style.opacity = String(mezcla)
        if (recorte) recorte.style.opacity = String(1 - mezcla)

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

    pintar()
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
      {/* EL RECORTE va acá afuera, a ancho completo de la pantalla, y NO sobre
          el escenario: la vecina se corre HACIA AFUERA del escenario para
          asomar, así que un `clip` puesto ahí la borra justo cuando empieza a
          verse (pasó). Acá recorta recién en el borde de la pantalla, que es
          lo único que hace falta para no generar scroll horizontal.
          `overflow-y-visible` es válido junto a `clip` —no lo sería con
          `hidden`— y deja que la vecina sobresalga un poco por abajo. */}
      {/* El `pb` reserva la BANDA donde gira la bandeja: las que no están al
          frente bajan (`ALTURA_FONDO`) y giran ahí, por debajo del bloque
          rojo. Sin esta reserva se montan sobre el nombre y los ingredientes.
          Rehacerlo si se toca `ALTURA_FONDO` o `ESCALA_FONDO`. */}
      <div className="relative w-full overflow-x-clip overflow-y-visible pb-[10%]">
      {/* El escenario, a ANCHO COMPLETO de la pantalla (2026-08-31, pedido del
          cliente: "la principal que ocupe todo el ancho de la página").
          La sección lo saca de su padding con el `-mx-4` que le pasa `LasBurgasV2`.

          Las burgas giran alrededor de una elipse dentro de esta caja (ver el
          bloque "LA BANDEJA GIRATORIA"): la del frente ocupa todo el ancho y
          las demás se van hacia el fondo, más chicas, más arriba y en gris. */}
      <div className="relative aspect-square w-full">
        {/* EL PANEL ROJO es del ESCENARIO, no de la tarjeta.
            Antes vivía dentro de cada `<li>` (`absolute inset-0`), así que se
            movía y escalaba CON la tarjeta: al girar la bandeja su borde
            aparecía como un rectángulo rojo cortado en mitad de la pantalla.
            Acá está quieto, ocupa el ancho completo y es el telón sobre el que
            gira todo: la del frente queda sobre el rojo y las que bajan a la
            bandeja salen de él, contra el negro de la sección. */}
        {/* El panel mide LO MISMO que la tarjeta del frente (74%), no el ancho
            completo: si es más ancho, sus costados asoman como dos FRANJAS
            ROJAS al lado de la foto, que llena su caja con `cover`. */}
        <div
          aria-hidden
          className="absolute inset-y-0 left-1/2 w-[74%] -translate-x-1/2 border-y-2 border-primary bg-primary"
        />
        {/* LAS TARJETAS viven en una caja MÁS ANGOSTA que el panel rojo, no en
            todo el escenario. El panel sigue de borde a borde —es el telón—,
            pero la del frente ocupa el 74% del ancho: ése es el margen por el
            que asoman las que giran detrás.
            **Sin esto no se ve ninguna**: la foto del frente va con `cover` y
            llena su caja entera, así que si la caja es todo el escenario, las
            de atrás quedan siempre tapadas — pasó, y ampliar el radio no lo
            arregla porque nunca salen del bloque. */}
        <ul className="absolute inset-y-0 left-1/2 w-[74%] -translate-x-1/2">
          {items.map((b, i) => (
            <li
              key={b.id}
              ref={(el) => {
                tarjetas.current[i] = el
              }}
              className="absolute inset-0 origin-center will-change-transform"
            >
              {/* NINGUNA TARJETA LLEVA FONDO PROPIO: son la hamburguesa
                  recortada y nada más. El color lo pone el panel rojo del
                  escenario, que está quieto detrás de todas.
                  Con un bloque opaco por tarjeta, la del frente —que ocupa el
                  ancho completo— tapaba a las que giraban detrás: medido, las
                  cuatro daban `rgb(0,0,0)` y solo asomaba un pedazo de pan
                  cortado por su borde. */}
              {/* Las dos capas de foto son decorativas (`alt=""`) porque entre
                  las dos muestran LA MISMA burga y anunciarla dos veces sería
                  ruido; el nombre accesible lo pone este `role="img"`, y el
                  nombre visible lo dice la ficha de abajo. */}
              <div
                role="img"
                aria-label={b.video.alt}
                className="relative block h-full w-full"
              >

                {/* DOS CAPAS QUE SE CRUZAN (2026-09-01, pedido del cliente):
                    - AL FRENTE: la foto CON FONDO, que se ve mejor — llena la
                      tarjeta con `cover`.
                    - EN SEGUNDO PLANO: el recorte SIN FONDO, chiquito, para
                      que gire limpio sobre el rojo sin arrastrar su
                      rectángulo negro.
                    La transición entre las dos ocurre durante el giro: las
                    opacidades las escribe `pintar()` por frame a partir de la
                    profundidad (`data-confondo` / `data-recorte`).

                    Van MONTADAS LAS DOS a la vez y se cruzan por opacidad. Si
                    en vez de eso se cambiara el `src`, el navegador tendría
                    que bajar la otra foto en pleno gesto y se vería un hueco.

                    OJO: la de fondo NO puede quedar visible mientras la burga
                    gira — su fondo negro horneado dibuja un rectángulo de
                    bordes duros sobre el panel rojo (pasó). Por eso su
                    opacidad cae a 0 apenas se aleja del frente. */}
                {/* La foto con fondo va envuelta en un bloque NEGRO propio que
                    se desvanece con ella. La foto trae su fondo negro horneado
                    pero solo dentro de su recorte: sin este bloque, entre su
                    borde y el de la tarjeta se veían dos FRANJAS ROJAS del
                    panel asomando a los costados. */}
                <span
                  data-confondo
                  aria-hidden
                  className="absolute inset-0 bg-black opacity-0"
                >
                  <Image
                    src={b.video.foto}
                    alt=""
                    fill
                    sizes="100vw"
                    priority={i < 2}
                    className="object-cover"
                  />
                </span>

                {b.miniatura ? (
                  <Image
                    data-recorte
                    src={b.miniatura}
                    alt=""
                    aria-hidden
                    fill
                    sizes="100vw"
                    /* El `p` grande es lo que la hace CHIQUITA: la burger
                       ocupa el centro de su caja y no le come espacio a la
                       principal (2026-09-01, pedido del cliente). */
                    className="object-contain p-[24%]"
                  />
                ) : null}

              </div>
            </li>
          ))}
        </ul>

        {/* EL CARRIL INVISIBLE que capta el dedo. Ver `CarruselBurgas` para el
            porqué de cada decisión: va en `z-[200]` por encima de las
            tarjetas, y los botones de "tocar para traer al frente" viven acá
            y no sobre ellas porque un botón encima se come el arrastre. */}
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
      </div>

      {/* LA FICHA de la activa. `min-h` reservada para el ingrediente más
          largo (Asmodeo, 3 líneas): sin eso la página saltaría en cada pasada. */}
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
