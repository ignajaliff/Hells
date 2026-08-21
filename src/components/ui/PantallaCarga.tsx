'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { LOGO_TRAZOS, LOGO_VIEWBOX } from './logoPath'

/**
 * PantallaCarga — el telón de entrada de la web.
 *
 * Sobre el gris de marca —el mismo fondo del hero—, las líneas van dibujando
 * el logo entero a la vez —cada contorno creciendo en paralelo— y al cerrar se
 * solidifica en el logo pleno (design-rules.txt §6: "un solo momento
 * coreografiado vale más que veinte micro-animaciones").
 *
 * Coreografía, 3.0s de punta a punta (los tiempos se DERIVAN de
 * `TRAZO_TOTAL`, no se hardcodean, así no se pueden desfasar entre sí):
 *   0.00s  arrancan las líneas, escalonadas por unas décimas
 *   1.65s  cierran todas — el logo está completo en línea
 *   1.87s  el relleno entra y los trazos se apagan: el logo cuaja
 *   2.55s  el telón empieza a irse
 *   3.00s  terminó el fade y el hero queda solo
 *
 * CÓMO SE VE LA LÍNEA FORMANDO EL LOGO:
 * los 28 contornos van como <path> SEPARADOS, no en un solo `d` (con un `d`
 * único la animación sería una sola y no se podría escalonar). Todos crecen
 * EN PARALELO con un retardo chico entre sí, y terminan juntos: así el logo se
 * revela como un todo y la silueta se reconoce desde temprano.
 * Se probó dibujarlos de a uno en secuencia y quedaba peor — se veía un
 * segmento suelto avanzando, sin la forma insinuándose, y se leía como líneas
 * rectas sueltas en vez de un logo formándose.
 *
 * El truco de cada trazo es `stroke-dasharray` = su largo y `stroke-dashoffset`
 * animado de ese largo a 0: el guión "crece" desde el principio del path y se
 * ve como si la línea se dibujara sola. Los largos están precalculados en
 * `logoPath.ts` — medirlos en el cliente con `getTotalLength()` obligaría a
 * un render extra y a 28 refs.
 *
 * Son DOS capas superpuestas: abajo el relleno (entra al final con un fade) y
 * arriba los trazos (que se apagan cuando el relleno ya entró). Animar `fill`
 * sobre los mismos paths haría aparecer el relleno de golpe.
 *
 * Con prefers-reduced-motion la pantalla se salta entera: no tiene sentido
 * retener a alguien que pidió no ver movimiento delante de un telón.
 */

/** Lo que tarda el dibujo completo, en segundos. Es el número a tocar si se
 *  quiere más lento o más rápido: el resto se deriva solo.
 *  **El total de la pantalla NO es este número**: hay que sumarle el respiro
 *  de `SOLIDIFICA`, el `LUCIMIENTO` y el fade de salida (0.45s). Ver `FIN`. */
const TRAZO_TOTAL = 1.65

/**
 * Qué fracción de `TRAZO_TOTAL` se reserva para escalonar los arranques.
 *
 * **Todos los trazos se dibujan EN PARALELO, no uno tras otro.** Dibujar de a
 * uno hacía que se viera un segmento suelto avanzando —sin la forma
 * insinuándose— y por eso se leía como rectas sueltas. Creciendo todos a la
 * vez, el logo entero se va revelando y la silueta se reconoce desde temprano.
 */
const ESCALONADO = 0.18

/**
 * Todos los trazos avanzan a la MISMA velocidad y CIERRAN EN EL MISMO INSTANTE.
 *
 * Son las dos mitades de un mismo efecto:
 * - misma velocidad → la punta de la línea viaja como una mano real. Si todos
 *   duraran lo mismo, los contornos largos (los de la hamburguesa) irían
 *   disparados y los cortos se arrastrarían: medido, hasta 16.9x de diferencia.
 * - mismo cierre → el logo se completa de una y no de a pedazos. Cada trazo se
 *   RETRASA lo que haga falta: los cortos (las semillas del pan, las
 *   contraformas de las letras) entran casi al final.
 *
 * Antes la duración era proporcional al largo pero los arranques estaban
 * repartidos parejo, y eso hacía que los trazos cortos cerraran a los 0.2s
 * mientras los largos seguían hasta los 2.1s: las semillas aparecían solas al
 * principio, sueltas, en vez de completarse junto con el resto del logo.
 */
function calcularTiempos() {
  const masLargo = Math.max(...LOGO_TRAZOS.map((t) => t.largo))

  // Una sola velocidad para todos, fijada por el trazo más largo: es el que
  // marca el ritmo, porque arranca primero y cierra al final.
  const velocidad = masLargo / (TRAZO_TOTAL * (1 - ESCALONADO))

  return LOGO_TRAZOS.map((trazo) => {
    // Cada trazo tarda lo que mide dividido la velocidad, y se RETRASA su
    // arranque para que todos cierren en el mismo instante.
    const duracion = trazo.largo / velocidad
    return { inicio: TRAZO_TOTAL - duracion, duracion }
  })
}

const TIEMPOS = calcularTiempos()

/**
 * Cuándo cierra el último trazo. Se calcula recorriendo los tiempos reales y
 * no con `TRAZO_TOTAL` a secas: si el relleno entra antes de que cierren
 * todos, el logo cuaja a medio dibujar.
 */
const FIN_TRAZO = Math.max(...TIEMPOS.map((t) => t.inicio + t.duracion))

/**
 * El relleno entra EN CUANTO cierra el último trazo, sin respiro intermedio.
 *
 * Antes había 0.22s de pausa para ver el logo cerrado en línea. Se sacó
 * (decisión del cliente, 2026-08-21): con el corte, el dibujo y el relleno se
 * leen como un solo gesto continuo en vez de dos momentos separados.
 * No usar `TRAZO_TOTAL` acá: `FIN_TRAZO` es el cierre real del último trazo y
 * si el relleno entrara antes, el logo cuajaría a medio dibujar.
 */
const SOLIDIFICA = FIN_TRAZO
/**
 * Cuánto queda el logo YA SÓLIDO en pantalla antes de que se vaya el telón.
 * Es una pausa deliberada: sin ella el logo cuaja y desaparece en el mismo
 * gesto, y no se llega a leer la marca — que es todo el punto de la pantalla.
 */
const LUCIMIENTO = 0.68
/**
 * Cuándo se va el telón. El TOTAL que percibe quien entra es esto **más el
 * fade de salida** (`exit`, 0.45s): 2.33 + 0.45 = 2.78s.
 * Si se quiere otro total, el reparto es:
 *   TRAZO_TOTAL (1.65) + LUCIMIENTO (0.68) + fade (0.45) = total
 * La palanca más grande es `TRAZO_TOTAL`: es el 59% del tiempo.
 */
const FIN = SOLIDIFICA + LUCIMIENTO

/**
 * Las dos capas del trazo de neón, de abajo hacia arriba.
 *
 * **El grosor va en PÍXELES DE PANTALLA, no en unidades del viewBox**, porque
 * el grupo lleva `vector-effect="non-scaling-stroke"`. Es lo que hace que la
 * línea mida lo mismo en un monitor que en un celular.
 *
 * Sin eso el grosor se interpreta en unidades del viewBox y encoge junto con
 * el SVG: **la línea NUNCA debe quedar por debajo de 1px real** —un trazo
 * sub-pixel el navegador lo pinta entrecortado y grisáceo, y eso es lo que
 * antes se veía como "pixelado" (no era el path)—. Medido: con el grosor
 * atado al viewBox, en un celular de 390px el núcleo caía a 0.55px, o sea que
 * **en móvil venía roto de antes**, que es donde está casi todo el tráfico.
 * Con `non-scaling-stroke` el problema desaparece por construcción y ya no hay
 * que recalcular nada si cambia el tamaño del logo.
 */
const ANIMADAS = [
  // El cuerpo del tubo: un rojo apagado, más oscuro que el de marca, con el
  // halo encima. Es lo que hace que el resplandor respire en vez de quemar.
  { stroke: '#b81815', ancho: 2.2, filtro: 'url(#neonLogo)' },
  // El núcleo: el rojo del logo, fino y sin halo propio. Antes era casi blanco
  // (`#ff8f8a`) y eso era la mitad de lo que hacía ver la línea tan fuerte.
  { stroke: '#e3211f', ancho: 1.2, filtro: undefined },
] as const

export function PantallaCarga() {
  const sinMovimiento = useReducedMotion()
  const [visible, setVisible] = useState(true)
  const [solido, setSolido] = useState(false)

  // El telón bloquea el scroll mientras está puesto: si no, se puede scrollear
  // a ciegas por detrás y al levantarse la página aparece por la mitad.
  useEffect(() => {
    if (!visible) return
    const previo = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previo
    }
  }, [visible])

  useEffect(() => {
    if (sinMovimiento) {
      setVisible(false)
      return
    }

    const temporizadores = [
      setTimeout(() => setSolido(true), SOLIDIFICA * 1000),
      setTimeout(() => setVisible(false), FIN * 1000),
    ]

    return () => temporizadores.forEach(clearTimeout)
  }, [sinMovimiento])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          // Puramente decorativa: el lector de pantalla debe leer el hero,
          // no anunciar un logo que se dibuja.
          aria-hidden
          // El fondo es SIEMPRE el gris de marca, el mismo del hero
          // (`--background`, #1a1a1a). Se toma del token vía la clase de
          // Tailwind y no de un color escrito a mano, así no se pueden
          // desincronizar si algún día se retoca la paleta.
          // Antes arrancaba en negro puro y viraba al gris al final; el
          // cliente lo pidió parejo de punta a punta (2026-08-20). De paso se
          // fue el riesgo de que se notara el cambio de tono como un parpadeo.
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] } }}
        >
          {/* El SVG va dentro de un contenedor con ancho propio.
              IMPORTANTE: un <svg> sin `height` dentro de un flex se ESTIRA a
              toda la altura disponible e ignora el `max-w` — por eso el logo
              se veía gigante y desbordado. El wrapper fija el ancho y el
              `h-auto` del svg deja que la altura salga del viewBox. */}
          <motion.div
            // Centrado EXACTO: el `flex items-center justify-center` del telón
            // lo centra solo, sin corrección óptica encima. Antes llevaba un
            // `-translate-y-[4%]` que lo subía a propósito, y por eso no
            // quedaba en el medio (2026-08-20, pedido del cliente).
            className="w-[58vw] max-w-[440px]"
            // SIN fade de entrada: el SVG está presente desde el frame 0 pero
            // vacío, y lo único que aparece es lo que la línea va trazando.
            // Con un fade encima, la línea se materializaba mientras dibujaba
            // en vez de construirse desde cero sobre el fondo.
            initial={false}
            animate={{ scale: solido ? 1.02 : 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
          <svg
            viewBox={`0 0 ${LOGO_VIEWBOX.width} ${LOGO_VIEWBOX.height}`}
            className="block h-auto w-full overflow-visible"
          >
            <defs>
              {/* Halo del neón: UN solo desenfoque, fusionado una sola vez.
                  Antes eran dos blurs con el ancho puesto dos veces y el
                  resplandor quemaba — el cliente lo pidió más tranquilo
                  (2026-08-20). Con una sola pasada la luz se insinúa alrededor
                  de la línea en vez de saturarla.
                  El área del filtro es 180% porque el halo se extiende bastante
                  más allá del path: con el default (110%) se recorta.
                  **El halo también recorta contra el viewBox**, y por eso
                  `logoPath.ts` lleva 28 unidades de margen: si se sube el
                  `stdDeviation`, agrandar ese margen (3 * stdDeviation). */}
              <filter id="neonLogo" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="lejos" />
                <feMerge>
                  <feMergeNode in="lejos" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {/* Relleno: debajo de los trazos, entra cuando el dibujo cerró. */}
            <motion.g
              className="fill-primary"
              initial={{ opacity: 0 }}
              animate={{ opacity: solido ? 1 : 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <path
                d={LOGO_TRAZOS.map((t) => t.d).join(' ')}
                fillRule="evenodd"
              />
            </motion.g>

            {/* Los trazos, cada uno con su retardo.
                Cada uno arranca con `strokeDashoffset` = su largo, o sea
                INVISIBLE, y ese valor inline rige también durante su delay:
                así en el frame 0 no hay absolutamente nada dibujado y todo
                aparece a medida que la línea lo traza.
                Sobre el fondo oscuro una línea fina se ve apagada, y el halo la
                hace leer como encendida sin engrosarla. */}
            <g
              style={{
                // Se apagan cuando el relleno ya entró: si quedaran, el logo
                // se vería con un borde más grueso que el original.
                opacity: solido ? 0 : 1,
                transition: 'opacity 0.4s ease-out',
              }}
            >
              {/* NEÓN ROJO, en dos capas: abajo un rojo apagado con el halo, y
                  encima un núcleo del rojo de marca, fino. Así se lee como un
                  tubo encendido —donde el centro satura— y no como una línea
                  con sombra. Todo el trazo es rojo: el degradé a amarillo de
                  antes se cambió por pedido del cliente. */}
              {ANIMADAS.map(({ stroke, ancho, filtro }, capa) => (
                <g
                  key={capa}
                  stroke={stroke}
                  fill="none"
                  // El grosor en píxeles de PANTALLA: así la línea mide lo
                  // mismo en un monitor que en un celular, y no cae en
                  // sub-pixel cuando el logo se dibuja chico (ver ANIMADAS).
                  vectorEffect="non-scaling-stroke"
                  strokeWidth={ancho}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  filter={filtro}
                >
                  {LOGO_TRAZOS.map((trazo, i) => (
                    <path
                      key={i}
                      d={trazo.d}
                      style={{
                        strokeDasharray: trazo.largo,
                        strokeDashoffset: trazo.largo,
                        // Curva suave (no `linear`): la línea sale con impulso y
                        // cierra frenando, que es como se dibuja a mano. Con
                        // `linear` el avance es mecánico y parece una barra de
                        // progreso en vez de un trazo.
                        animation: `trazar ${TIEMPOS[i].duracion}s cubic-bezier(0.33, 0.1, 0.24, 1) ${TIEMPOS[i].inicio}s forwards`,
                      }}
                    />
                  ))}
                </g>
              ))}
            </g>
          </svg>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
