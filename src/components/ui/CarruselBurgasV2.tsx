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
 * ── EL ANILLO REEMPLAZÓ AL DEGRADÉ ROJO (2026-09-10, pedido del cliente) ──
 * Detrás de la burga ya no va su foto: va `anillo-burgas.webp` —el aro de
 * texto de la marca— girando despacio y quieto en el centro, y cada
 * hamburguesa entra ahí adentro. El escenario quedó NEGRO.
 * **Lo de abajo sigue explicando el mecanismo del giro de las siluetas, que
 * no cambió**; lo que ya no existe es la capa de fondos. Con ella se fueron
 * su fundido cruzado, la máscara radial de escritorio y el velo negro de los
 * bordes: los tres estaban para disimular el rojo.
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
  /** Texto alternativo de la silueta. Era `video.alt`, del objeto `video`
   *  que se borro el 2026-09-08 al quedar sin un solo consumidor. */
  alt: string
  escena: {
    fondo: string
    silueta: string
    caja: { x: number; y: number; w: number; h: number }
    /** El sello con el nombre. Sin él, el nombre va en texto. */
    sticker?: string
    /**
     * Achica ESTE sello respecto de los demás (2026-09-08, pedido del cliente
     * para Balak: "lo veo muy grande en comparación"). Default 1.
     * La caja fija el ALTO, así que todos los sellos se dibujan a la misma
     * altura de caja — pero eso NO los iguala a la vista, porque cada dibujo
     * llena su caja distinto. Medido: las letras de Balak ocupan el **0.672**
     * del alto de su recorte contra una mediana de **0.62** en los otros once,
     * y además su proporción es 2.87 contra ~2.45, o sea que también se dibuja
     * más ancho. Igualar la altura de letra pedía 0.92 y igualar el ancho
     * 0.85; **0.88 es el punto medio de las dos cuentas**, no un valor a ojo.
     * **Se aplica con `scale` sobre la IMAGEN, no sobre la caja**: la caja
     * define el alto que ocupa el sticker en el flujo, y los ingredientes van
     * justo debajo — achicándola, Balak quedaba como la única burga con el
     * texto corrido hacia arriba. `scale` no ocupa lugar, así que el sello se
     * ve más chico y todo lo de abajo queda alineado con las otras once.
     */
    escalaSticker?: number
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
/**
 * EL CENTRO COMÚN AL QUE SE ALINEAN LAS DOCE BURGAS (2026-09-10, pedido del
 * cliente: "la hamburguesa se ve chueca y no está en el medio del círculo").
 *
 * **Cada burga se posicionaba por el centro de SU PROPIA `caja`, y esos doce
 * centros no coinciden entre sí**: `cx` va de 0.4953 (leviatán) a 0.5124
 * (lucifer) y `cy` de 0.5675 (belfegor) a 0.6384 (baal). El aro, en cambio,
 * está clavado en el promedio (`sm:left-[50.19%]`, que es exactamente este
 * `cx`). O sea que cada burga se apartaba del aro justo lo que su caja se
 * aparta del promedio — y por eso el desvío era DISTINTO en cada una.
 *
 * Medido en 1440: dx de -11.8 a +18.9px y dy de -20.9 a +30.1px, con promedio
 * -0.1 y +1.7. **Ese promedio casi nulo con extremos de ±20px es la firma del
 * problema**: ninguna constante global lo puede arreglar, porque corregir el
 * promedio no mueve la dispersión. Un intento anterior (`SUBIDA_ESCRITORIO =
 * 0.0766`) hacía justo eso y por eso "centraba" sin centrar.
 *
 * Las cajas encierran la hamburguesa MÁS el aire que le sobra a cada PNG, que
 * es distinto en cada archivo — son las que dedujo `originales/tocadiscos.py`
 * al alinear cada silueta contra su foto. **No se editan a mano** (regla ya
 * anotada), así que la corrección va acá: cada burga se ancla a este centro
 * común en vez de al suyo. Por construcción el residuo queda en cero para las
 * doce, en los dos ejes.
 *
 * **Vale para móvil y escritorio.** Ahí el mismo defecto existía dividido por
 * ~4 (dx de -1.8 a +4.8) porque no lleva el `scale-[1.35]` que lo amplifica:
 * es el MISMO arreglo, y deja el celular mejor centrado, no distinto. Móvil
 * conserva intactos su aro, su escala y su radio, que es lo que el cliente
 * pidió no tocar.
 *
 * Se aplica en `pintar` y no en el `left`/`top` del JSX porque `pintar` los
 * reescribe en cada frame: puesto en el JSX se pisaría al primer scroll.
 *
 * **EL `y` ES DISTINTO EN CADA PANTALLA, porque el aro tampoco cae en el mismo
 * lugar**: medido dentro del escenario, el aro está en el 60.00% de su alto en
 * móvil pero en el 49.70% en escritorio, donde lo suben el `sm:top-[52%]` y el
 * `sm:-translate-y-[3%]` del bloque. Con un solo valor, escritorio quedaba
 * 10.66 puntos porcentuales por debajo del aro — o sea 46px en 1280, 57 en
 * 1440 y 76 en 1920: **crece con la pantalla porque es una fracción y no un
 * offset fijo**, que es justo la firma de haber comparado contra el aro
 * equivocado.
 *
 * ⚠ **`Y_ESCRITORIO` NO SE DERIVA RESTANDO EL DESVÍO MEDIDO**, y el primer
 * intento se equivocó justo ahí: al mover `cy` se mueve también la burga
 * contra la que se comparó, así que restar los 10.66 puntos medidos ANTES del
 * cambio se pasaba de largo (la dejó en el 45.97% contra el 49.70% del aro:
 * ahora alta, en vez de baja). El valor bueno sale de igualar la fracción de
 * la burga a la del aro MIDIENDO LAS DOS DESPUÉS de cada ajuste.
 *
 * Los porcentajes salen IDÉNTICOS en 1280, 1440 y 1920: son geometría del
 * bloque, no del viewport — por eso alcanza una fracción. **Si cambia
 * `sm:top-[52%]` o el `sm:-translate-y-[3%]`, volver a medirlos.**
 */
const CENTRO_COMUN = { x: 0.5019, y: 0.599 }
/** El mismo centro, corrido a donde el aro cae de `sm` para arriba. */
const Y_ESCRITORIO = 0.5166
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
      const esEscritorio = window.innerWidth >= 640
      const radio = esEscritorio ? RADIO_ESCRITORIO : RADIO_MOVIL

      items.forEach((b, i) => {
        const d = i - posicion
        const dist = Math.abs(d)

        const el = siluetas.current[i]
        if (!el) return
        if (dist > VISIBLES) {
          el.style.visibility = 'hidden'
          return
        }
        el.style.visibility = 'visible'

        const { w, h } = b.escena.caja
        /* Ver `CENTRO_COMUN`: las doce se anclan al MISMO centro y no al de su
           propia caja, que es lo que las dejaba corridas del aro cada una para
           su lado. La caja sigue dando el TAMAÑO (`w`/`h`), que sí es propio de
           cada silueta; lo único que se descarta es su posición. */
        const cx = CENTRO_COMUN.x
        const cy = esEscritorio ? Y_ESCRITORIO : CENTRO_COMUN.y
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
      {/* ENVOLTORIO SIN `overflow-hidden` PARA LAS FLECHAS (2026-09-10, pedido
          del cliente: "un poco más abajo" de lo que el escenario permitía).
          El escenario recorta lo que se sale —lo necesita para las siluetas—,
          así que con las flechas adentro el piso era `bottom-0`. Colgadas de
          este envoltorio, que mide lo mismo que el escenario pero no recorta,
          pueden ir con `bottom` NEGATIVO y asomar por debajo de la foto, en
          la franja del sticker. Van después del escenario en el DOM y en
          `z-[210]`, o sea encima del carril (200). */}
      <div className="relative">
      <div className="relative aspect-square w-full shrink-0 overflow-hidden bg-black sm:aspect-[5/3] sm:max-h-[calc(100svh-23rem)]">
        {/* EL `scale` BAJÓ DE 1.35 A 1.15 (2026-09-10, pedido del cliente: "se
            siguen tapando las esquinas del círculo, no quiero que se recorten
            las puntas" — **solo en formato PC**, que es donde vive este `sm:`).
            **Era esta escala la que tapaba el aro.** Infla la burga junto con
            el resto del bloque, y a 1.35 medía ~974px en 1440 contra los 743
            del círculo: le comía "DOCE" a la izquierda y "BURGER" a la derecha.
            A 1.15 la burga queda en 830 y el aro sube a `sm:h-[86%]` (693px),
            así que el texto se lee entero por los cuatro lados.
            ⚠ **ESTE VALOR Y EL `sm:h-[86%]` DEL ARO SON UN SOLO AJUSTE.**
            Bajar el `scale` sin subir el aro no agranda el círculo en términos
            relativos: encoge a los dos por igual y el ratio aro/burga queda
            clavado (medido: 0.74-0.75 en 1.35, 1.20, 1.10 y 1.00). Hay que
            mover los dos a la vez.
            El costo asumido: la hamburguesa se ve ~15% más chica que antes. Es
            inevitable —el círculo solo gana lugar si el contenido lo cede— y el
            cliente eligió el círculo completo.
            MÓVIL NO SE TOCA: no lleva `scale`, su escenario es cuadrado y ahí
            el aro ya se veía entero.

            `sm:scale-[1.15]` AGRANDA el contenido dentro de la caja recortada.
            Al limitar el alto (ver `sm:max-h-…` arriba) la caja queda bien
            apaisada, y como la foto entra con `object-cover` el dibujo se
            aleja: la hamburguesa quedaba chica con mucho negro alrededor.
            Escalar el bloque entero —fondos y siluetas juntos— la devuelve a
            un tamaño que llena la caja sin deformar nada; lo que sobra se lo
            lleva el `overflow-hidden` del padre.
            El `-translate-y` compensa que al escalar el conjunto baja. */}
        <div className="absolute inset-0 sm:-translate-y-[3%] sm:scale-[1.15]">
        {/* EL ANILLO DE TEXTO, GIRANDO (2026-09-10, pedido del cliente:
            "saquemos el degrade rojo de atras de las hamburguesas y pongamos
            esto, que este girando, y que cada burga entre en el centro de este
            circulo").

            REEMPLAZA A LOS DOCE FONDOS. Hasta ahora acá iban las doce fotos
            sin hamburguesa —el degradé rojo horneado— apiladas y fundiéndose
            entre sí según el scroll. Ahora el escenario es NEGRO y lo único que
            hay detrás de la burga es este anillo. Con eso se fueron tres cosas
            que existían solo por el rojo: el fundido cruzado de fondos en
            `pintar`, la máscara radial que achicaba el halo en escritorio, y el
            velo negro que tapaba el canto duro de la foto contra la sección.
            ⚠ **Los doce `-fondo-rojo.webp` quedan sin uso** mientras dure esta
            prueba. NO se borraron: el campo `escena.fondo` sigue en el
            contenido, así que volver atrás es reponer este bloque.

            **NO HACE FALTA MOVERLO CUANDO CAMBIA LA BURGA**, que era el
            pedido: las doce siluetas descansan prácticamente en el mismo
            punto —medido sobre las doce `caja`: el centro cae en x 0.495-0.512
            e y 0.568-0.638—, así que un anillo fijo en ese punto recibe a cada
            una en su centro. Va antes que las siluetas en el DOM, o sea por
            DEBAJO de ellas: la hamburguesa se apoya sobre el anillo.

            El tamaño va por ALTURA y no por ancho, y esa es la parte que no es
            obvia: en móvil la caja es cuadrada pero en escritorio es 5:3, así
            que un porcentaje de ancho daría dos círculos de tamaños muy
            distintos. La burga, en cambio, mide casi lo mismo en las dos
            (`object-contain` la ajusta por el alto de su caja), así que
            atarlo al alto es lo que mantiene la proporción anillo/burga.
            El `sm:` compensa el `scale-[1.35]` del bloque: 62 × 1.35 ≈ 84, o
            sea el mismo círculo que en el celular.

            **EL ARO VA ENTERO, con sus dos frases** ("HELL'S BURGER - DOCE
            MANERAS DE PECAR -"). Hubo un rato en que estuvo cortado a solo
            "HELL'S BURGER": fue un malentendido mío — el cliente había pedido
            sacar "Doce maneras de pecar" de la BAJADA de la sección, el
            renglón debajo del título "Las Burgas", no del dibujo. Revertido.

            La animación va como CLASE y no como `style` inline: con
            `prefers-reduced-motion` la regla global de `globals.css` frena
            toda animación con `!important`, y a un estilo inline no le
            ganaría. Un anillo dando vueltas en loop es justo lo que molesta a
            quien pidió no ver movimiento. */}
        {/* LA SOMBRA DEL CÍRCULO (2026-09-10, pedido del cliente: "probar
            detrás del círculo opacar con negro tipo sombra, así las no
            seleccionadas que se vean dentro del círculo se opaquen un poco").
            Un disco negro semitransparente del MISMO tamaño y posición que el
            aro, en `z-[94]`: por encima de las vecinas (89 y menos) y por
            debajo del aro (95) y de la activa (99). Lo que asome de una vecina
            dentro del círculo se oscurece; la activa, encima, queda intacta.
            `circle_closest-side` para que el 100% del degradé sea el BORDE del
            disco y no la esquina de la caja: así se desvanece justo donde
            está el texto del aro. Termina en negro con alfa 0, no en
            `transparent` — es la misma regla de siempre (y acá da igual
            porque es negro, pero la regla es una sola).
            La luz roja va DESPUÉS y en el mismo `z-[94]`: por orden de DOM
            queda sobre la sombra, así que la sombra no la apaga. */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[60%] z-[94] aspect-square h-[80%] -translate-x-1/2 -translate-y-1/2 select-none rounded-full bg-[radial-gradient(circle_closest-side,rgba(0,0,0,0.62)_0%,rgba(0,0,0,0.62)_62%,rgba(0,0,0,0)_100%)] sm:h-[62%]"
        />

        {/* LA LUZ ROJA DETRÁS DE LA BURGA SELECCIONADA (2026-09-10, 3er
            pedido del cliente). Es lo único que quedaba del ambiente cálido que
            aportaban las fotos con su degradé horneado: al sacarlas, la burga
            quedó recortada contra negro plano.

            **NO HACE FALTA QUE SIGA A NADIE**: la seleccionada es siempre la
            que descansa en el centro del escenario, así que una luz fija en
            ese punto ilumina siempre a la que está al frente y deja a las
            vecinas —que están a los costados y ya van oscurecidas por
            `brightness`— fuera del halo. Un elemento quieto, sin JS.

            Va en `z-[94]` justo DESPUÉS de la sombra del círculo (mismo número,
            gana por orden de DOM): por encima de la sombra —que si no la
            apagaría— y de las vecinas, y por debajo del aro y de la activa. A
            las vecinas les llega apenas: están en los bordes, donde la elipse
            ya va en 0.1 de alfa.
            Es una ELIPSE y no un círculo porque la hamburguesa es más ancha
            que alta (medido sobre las doce `caja`: ~0.51 × 0.42 del
            escenario), y va centrada en el 60% del alto, que es donde caen los
            centros de las doce.
            **SUBIÓ DE INTENSIDAD** (2026-09-10, pedido del cliente: "un poco
            más intensa"): el centro pasó de 0.42 a 0.62 de alfa y el medio de
            0.20 a 0.34, y la elipse se abrió un poco (46×34 → 50×37).
            **Y VOLVIÓ A BAJAR** el mismo día ("bajar la luz roja"): 0.46 en el
            centro y 0.24 al medio — entre la primera y la segunda versión.
            El color sale del token `--primary` y **el degradé termina en ese
            mismo rojo con alfa 0, nunca en `transparent`**: en CSS
            `transparent` es NEGRO transparente y al mezclarse ensucia el rojo
            con gris — la regla está documentada en la hoja de ruta desde el
            banding de `brasa-glow`. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[94] select-none bg-[radial-gradient(ellipse_50%_37%_at_50%_60%,hsl(var(--primary)/0.46)_0%,hsl(var(--primary)/0.24)_45%,hsl(var(--primary)/0.08)_72%,hsl(var(--primary)/0)_100%)]"
        />

        {/* POR DELANTE DE LAS VECINAS (2026-09-10, 2º pedido del cliente:
            "que esté por delante de las hamburguesas que están opacadas, o sea
            las que no se seleccionan").
            **El tamaño VOLVIÓ al original** (3er pedido del mismo día): se
            probó más chico —66%/52%— y el cliente lo quiso como estaba.
            **Queda EN SANDWICH**: `z-[95]` cae justo entre el 99 de la burga
            activa y el 89 de la de un paso —los que reparte `pintar` con
            `99 - dist * 10`—, así que el aro pasa por ENCIMA de las vecinas
            oscurecidas y por DEBAJO de la que está al frente. Es lo que hace
            que la activa se lea adentro del círculo y las otras detrás, en vez
            de todas en el mismo plano.
            ⚠ **Ese 95 está atado a la fórmula de `pintar`**: si cambian los
            z-index de las siluetas, este número tiene que seguir cayendo entre
            el de la activa y el de la vecina.

            ── EL CÍRCULO ENTERO EN ESCRITORIO (2026-09-10, pedido del cliente:
            "en PC se ve mal, quedan partes recortadas; ponelo como en celu,
            que móvil está espectacular y no se toca") ──
            **El arte no tenía nada malo** (medido: 1100x1100, cuadrado exacto,
            su centro en 49.95%) y **el aro tampoco se recortaba contra el
            `overflow-hidden`**: se verificó punto por punto sobre su
            circunferencia y los cuatro extremos caían DENTRO del escenario.
            Las letras que faltaban —"DOCE" a la izquierda, "LL'S BURGER" a la
            derecha— **las tapaba la hamburguesa**, que se dibujaba MÁS GRANDE
            que el círculo.

            El número que lo explica es la proporción aro/burga:
            en móvil el aro mide **1.54x** la burga (la rodea con aire), y en
            escritorio medía **0.41x** — o sea que la burga era más del doble
            del círculo y le comía el texto de los costados. La causa es el
            `sm:scale-[1.35]` del bloque: agranda la burga hasta 974px en 1440
            mientras el escenario apaisado (5:3) solo deja 532px de alto.

            * `sm:h-[86%]` — el círculo ENTERO, sin puntas recortadas
              (2026-09-10, pedido del cliente: "se siguen tapando las esquinas
              del círculo, no quiero que se recorten las puntas").
              ⚠ **VA ATADO AL `sm:scale-[1.15]` DEL BLOQUE**: son un solo
              ajuste y no se toca uno sin el otro. Ver el comentario de ese
              `scale` para la explicación completa.
              ⚠ **LO QUE TAPABA EL ARO ERA LA BURGA, NO EL ESCENARIO.** Ese fue
              el diagnóstico que costó tres intentos fallidos: la burga escalada
              por el viejo `sm:scale-[1.35]` medía ~974px en 1440 contra los 743
              del aro, o sea que le comía las letras de los costados. Bajando el
              `scale` a 1.15 la burga queda en 830 y el aro puede subir a 86%
              (693px) sin que nada lo tape.
              ⚠ **NO SE ARREGLA achicando el aro ni agrandando el escenario**
              (dos intentos revertidos el mismo día): achicar el aro lo mete
              DEBAJO de la burga y queda peor; agrandar el escenario lo hace
              crecer a él también —el aro se mide en % de esa caja— y el corte
              empeora (medido: de 135px a 164px en 1920).
              ⚠ **LA CAJA NO ES EVIDENCIA, LA CAPTURA SÍ.** Tres tandas de
              mediciones dijeron "DENTRO, con aire por los cuatro lados"
              mientras la captura mostraba el aro tapado: comparaban el
              rectángulo del `<img>` contra el del escenario, que responde
              "¿entra la caja?" y no "¿se ve el texto?" — y el texto compite
              contra LA BURGA, que ningún script miraba. Dos intentos de medir
              el aire del PNG por umbral de píxeles también fallaron ("0% por
              los cuatro lados": el umbral caza el fondo y el aro claro, no las
              letras). **Acá se decide mirando el escenario recortado.**
              Historia del tamaño: 52-58% (entraba pero lo tapaba la burga),
              72%, 76% (el cliente lo pidió más grande) y 86% con el contenido
              a 1.15, que es cuando el círculo se ve por fin completo.
              ⚠ **No se puede igualar el 1.54 de móvil**: haría falta un aro de
              ~1500px en un escenario de 532 de alto. La proporción de móvil
              solo es posible con escenario cuadrado.
            * `sm:top-[52%]` — centra el aro en el alto VISIBLE. Con el
              `top-[60%]` de móvil, tras el `scale` y su `-translate-y-[3%]`,
              el centro caía en 59.3% y dejaba solo 81.4% de alto aprovechable;
              con 52% sube a 97.3% y el círculo entra mucho más grande.
            * `sm:left-[50.19%]` — el centro X REAL de las doce siluetas
              (promedio 0.5019, van de 0.4953 a 0.5124), en vez del 50% exacto.

            MÓVIL NO SE TOCA: sigue con `top-[60%]` y `h-[80%]` sin `sm:`. Ahí
            no hay escala, el escenario es cuadrado y la proporción ya es la
            buena. */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[60%] z-[95] aspect-square h-[80%] -translate-x-1/2 -translate-y-1/2 select-none sm:left-[50.19%] sm:top-[52%] sm:h-[86%]"
        >
          <div className="relative h-full w-full [animation:girar_34s_linear_infinite]">
            <Image
              src="/anillo-burgas.webp"
              alt=""
              fill
              sizes="(min-width: 640px) 45vw, 85vw"
              priority
              /* `opacity-70` (2026-09-10, pedido del cliente: "opacalo un poco"):
                 el blanco puro del dibujo competía con la burga.
                 EN MÓVIL BAJA A 0.3 (mismo día, 2º y 3er pedido: "hacerlo más opaco
                 en formato móvil"): ahí el aro mide el 80% del alto y ocupa
                 casi toda la pantalla, así que pesa más que en escritorio. */
              className="object-contain opacity-30 sm:opacity-70"
            />
          </div>
        </div>

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
              alt={i === activa ? b.alt : ''}
              fill
              sizes="60vw"
              priority={i < 2}
              className="object-contain"
            />
          </div>
        ))}
        </div>


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
          className="absolute left-[9%] bottom-[-7%] z-[210] sm:left-[18%] sm:bottom-[-4%] lg:left-[30%] flex items-center justify-center rounded-full border border-white bg-transparent p-2.5 text-white transition-[background-color,border-color,color] hover:border-primary hover:bg-primary disabled:pointer-events-none disabled:opacity-0 sm:p-3"
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
          className="absolute right-[9%] bottom-[-7%] z-[210] sm:right-[18%] sm:bottom-[-4%] lg:right-[30%] flex items-center justify-center rounded-full border border-white bg-transparent p-2.5 text-white transition-[background-color,border-color,color] hover:border-primary hover:bg-primary disabled:pointer-events-none disabled:opacity-0 sm:p-3"
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
          EL SELLO YA NO SE MONTA SOBRE LA FOTO (2026-09-10, 2º pedido del
          cliente: "que el sticker y los ingredientes estén más abajo, así no
          pasan por encima del círculo"). Llevaba `-mt-[7.5cqw]` —la mitad de su
          alto— justamente para montarse mitad sobre la imagen; con el aro de
          texto detrás, esa mitad le caía encima al círculo y se pisaban dos
          cosas que quieren leerse solas. Ahora es un margen POSITIVO y la
          ficha entera arranca por debajo del escenario.
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
      {/* TODA LA FICHA 32px MÁS ABAJO EN MÓVIL, SIN AGRANDAR LA SECCIÓN
          (2026-09-10, dos pedidos del cliente el mismo día: primero "bajar el
          sticker y los ingredientes", después "un poco más, y también el texto
          de las papas"). Va como TRANSFORMACIÓN (`translate-y`) y no como
          margen, a propósito: un margen estira la sección, el desplazamiento
          mueve el bloque sin ocupar lugar y la sección mide exactamente lo
          mismo. Lo que se paga es que el aire al pie baja de 80 a 48px — hay
          margen, pero **si se vuelve a bajar, revisar que la píldora no toque
          el borde**. El primer intento movía solo las fichas (16px) y dejaba
          la píldora quieta; ahora se mueve el contenedor entero y el hueco
          entre ingredientes y píldora vuelve a ser el de siempre (40px). */}
      <div className="pointer-events-none relative z-[300] grid px-6 text-center max-sm:translate-y-8">
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
              <div className="pointer-events-none relative mx-auto h-[15cqw] w-[64cqw] mt-[3cqw] sm:mt-[2cqw] sm:h-[8cqw] sm:w-auto sm:max-w-[24cqw]">
                <Image
                  src={b.escena.sticker}
                  alt={b.nombre}
                  fill
                  sizes="(min-width: 640px) 420px, 64vw"
                  /* CENTRADO, sin `object-left`: ése venía del intento de
                     poner el texto en una columna a la derecha (descartado) y
                     dejaba el sello corrido a la izquierda respecto de la
                     hamburguesa — medido, 152px de desfase en 1440. */
                  /* LA ESCALA VA SOBRE LA IMAGEN, NUNCA SOBRE LA CAJA
                     (2026-09-08). Primero se hizo achicando el alto de la
                     caja y eso DESALINEÓ a Balak: los ingredientes van debajo
                     del sticker en el flujo, así que una caja 12% más baja se
                     los subía y esa burga quedaba como la única corrida.
                     `scale` no ocupa lugar: el sello se dibuja más chico y
                     todo lo de abajo sigue donde estaba. Escala desde el
                     CENTRO, que es justo donde la caja cruza el borde de la
                     foto, así el sello sigue montado igual que los otros.
                     Ojo al verificar: Tailwind v4 pone las escalas en la
                     propiedad `scale`, no en `transform`. */
                  style={{ scale: String(b.escena.escalaSticker ?? 1) }}
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
        {/* MÁS ABAJO Y SIEMPRE EN UNA LÍNEA (2026-09-08, pedido del cliente:
            "que esté un poco más abajo, está muy cerca de los ingredientes, e
            importante que siempre entre en una línea").
            * El margen pasó de 20/24px a **40/48**: el doble.
            * `whitespace-nowrap` es lo que garantiza la línea única. **No
              alcanza con que hoy entre**: sin él, un ancho de pantalla o un
              texto un poco más largo lo parten en dos y el óvalo se deforma.
              El riesgo del `nowrap` es el desborde, y con el texto nuevo se
              desbordaba: medido, 329px de píldora contra 296 disponibles en
              una pantalla de 320. Se ajustó **solo en móvil** —el piso del
              clamp de 11 a 10px, el tracking de 0.10 a 0.08em y el padding de
              16 a 14px— hasta los 293px que entran. Escritorio queda igual.
            */}
        {guarnicion ? (
          <p className="mt-10 justify-self-center whitespace-nowrap rounded-full border border-primary/45 px-3.5 py-1.5 font-body text-[clamp(10px,2.8cqw,13px)] font-semibold uppercase tracking-[0.08em] text-foreground/85 sm:mt-12 sm:px-4 sm:text-[clamp(12px,1.2cqw,15px)] sm:tracking-[0.1em]">
            {guarnicion}
          </p>
        ) : null}
      </div>
    </div>
  )
}
