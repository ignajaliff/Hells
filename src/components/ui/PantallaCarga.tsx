'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { LOGO_TRAZOS, LOGO_VIEWBOX } from './logoPath'

/**
 * PantallaCarga — el telón de entrada de la web.
 *
 * Sobre negro absoluto, las líneas van dibujando el logo entero a la vez —
 * cada contorno creciendo en paralelo— y al cerrar se solidifica en el logo
 * pleno (design-rules.txt §6: "un solo momento coreografiado vale más que
 * veinte micro-animaciones").
 *
 * Coreografía, ~3.2s (los tiempos se DERIVAN de `TRAZO_TOTAL`, no se
 * hardcodean, así no se pueden desfasar entre sí):
 *   0.00s  arrancan las líneas, escalonadas por unas décimas
 *   2.10s  cierran todas — el logo está completo en línea
 *   2.28s  el relleno entra y los trazos se apagan: el logo cuaja
 *   2.78s  el telón se va y aparece el hero
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
 *  quiere más lento o más rápido: el resto se deriva solo. */
const TRAZO_TOTAL = 2.1

/**
 * Cuánto se escalona el arranque de un trazo respecto del anterior, como
 * fracción de `TRAZO_TOTAL`.
 *
 * **Todos los trazos se dibujan casi EN PARALELO, no uno tras otro.** Dibujar
 * de a uno hacía que se viera un segmento suelto avanzando —sin la forma
 * insinuándose— y por eso se leía como rectas sueltas. Creciendo todos a la
 * vez, el logo entero se va revelando y la silueta se reconoce desde temprano.
 * El escalonado chico es lo que le da vida: sin él arrancarían clavados todos
 * juntos y parecería un fundido, no un trazado.
 */
const ESCALONADO = 0.18

/**
 * Cada trazo arranca con un retardo según su posición en el orden de dibujo
 * (isotipo → "HELL'S" → "BURGER") y dura **en proporción a su largo**.
 *
 * Lo segundo es lo que hace que se vea fluido: si todos duraran lo mismo, la
 * línea avanzaría a velocidades muy distintas según el trazo —medido: hasta
 * 15x de diferencia— y los contornos largos, que son justo los de la
 * hamburguesa, se arrastrarían hasta el final mientras los cortos ya cerraron.
 * Con la duración proporcional, **la punta de la línea viaja siempre a la
 * misma velocidad**, como una mano real: los trazos cortos cierran antes y los
 * largos siguen su recorrido.
 *
 * La velocidad se calcula sobre el trazo MÁS LARGO, que es el que marca el
 * ritmo: es el último en cerrar y define el final del dibujo.
 */
function calcularTiempos() {
  const n = LOGO_TRAZOS.length
  const masLargo = Math.max(...LOGO_TRAZOS.map((t) => t.largo))

  return LOGO_TRAZOS.map((trazo, i) => {
    const inicio = (i / (n - 1)) * TRAZO_TOTAL * ESCALONADO
    // El más largo ocupa todo el tiempo que le queda tras su retardo; los
    // demás, la fracción proporcional a su largo. Misma velocidad para todos.
    const disponible = TRAZO_TOTAL - inicio
    const duracion = disponible * (trazo.largo / masLargo)
    return { inicio, duracion }
  })
}

const TIEMPOS = calcularTiempos()

/**
 * Cuándo cierra el último trazo. Se calcula recorriendo los tiempos reales y
 * no con `TRAZO_TOTAL` a secas: si el relleno entra antes de que cierren
 * todos, el logo cuaja a medio dibujar.
 */
const FIN_TRAZO = Math.max(...TIEMPOS.map((t) => t.inicio + t.duracion))

/** Un respiro para ver el logo ya cerrado en línea: es el momento del efecto. */
const SOLIDIFICA = FIN_TRAZO + 0.22
/**
 * Cuánto queda el logo YA SÓLIDO en pantalla antes de que se vaya el telón.
 * Es una pausa deliberada: sin ella el logo cuaja y desaparece en el mismo
 * gesto, y no se llega a leer la marca — que es todo el punto de la pantalla.
 */
const LUCIMIENTO = 1.1
const FIN = SOLIDIFICA + LUCIMIENTO

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
          className="fixed inset-0 z-[100] flex items-center justify-center"
          // Arranca en NEGRO PURO —no en el carbón del sitio— para que la
          // pantalla se lea como vacía y todo nazca del trazo. Pero antes de
          // salir vira al carbón del hero: si se fuera desde negro, el cambio
          // de tono contra el fondo del sitio se notaría como un parpadeo.
          initial={{ opacity: 1, backgroundColor: '#000000' }}
          animate={{ backgroundColor: solido ? 'hsl(0 0% 10%)' : '#000000' }}
          exit={{ opacity: 0, transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] } }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          {/* El SVG va dentro de un contenedor con ancho propio.
              IMPORTANTE: un <svg> sin `height` dentro de un flex se ESTIRA a
              toda la altura disponible e ignora el `max-w` — por eso el logo
              se veía gigante y desbordado. El wrapper fija el ancho y el
              `h-auto` del svg deja que la altura salga del viewBox. */}
          <motion.div
            // `-translate-y` es corrección ÓPTICA, no un error de centrado: el
            // viewBox está ajustado al logo, pero una pieza centrada de forma
            // geométrica se percibe caída. Subirla ~4% la asienta.
            className="w-[74vw] max-w-[560px] -translate-y-[4%]"
            // SIN fade de entrada: el SVG está presente desde el frame 0 pero
            // vacío, y lo único que aparece es lo que la línea va trazando.
            // Con un fade encima, la línea se materializaba mientras dibujaba
            // en vez de construirse desde cero sobre negro.
            initial={false}
            animate={{ scale: solido ? 1.02 : 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
          <svg
            viewBox={`0 0 ${LOGO_VIEWBOX.width} ${LOGO_VIEWBOX.height}`}
            className="block h-auto w-full overflow-visible"
          >
            <defs>
              {/* Trazo BRASA: de amarillo incandescente arriba a rojo profundo
                  abajo, como metal al rojo vivo. Es el orden real de
                  temperatura del fuego, y por eso se lee como calor y no como
                  un degradé decorativo. El amarillo y el naranja no están en
                  la paleta de UI, pero acá es lo mismo que las ilustraciones
                  de llamas: imagen de marca, no interfaz. */}
              <linearGradient id="trazoLogo" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffd24a" />
                <stop offset="35%" stopColor="#ef8f03" />
                <stop offset="70%" stopColor="#e3211f" />
                <stop offset="100%" stopColor="#8f0f0c" />
              </linearGradient>

              {/* Halo: dos desenfoques, uno cerrado y otro abierto. Con un solo
                  blur el resplandor se ve como una mancha; en dos capas queda
                  el brillo pegado a la línea más un halo amplio, que es como se
                  comporta la luz de verdad.
                  El área del filtro es 180% porque el halo se extiende bastante
                  más allá del path: con el default (110%) se recorta. */}
              <filter id="neonLogo" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="cerca" />
                <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="lejos" />
                <feMerge>
                  <feMergeNode in="lejos" />
                  <feMergeNode in="cerca" />
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
                El `drop-shadow` le da un halo tenue del mismo rojo: sobre el
                negro una línea fina se ve apagada, y el halo la hace leer
                como encendida sin engrosarla. */}
            <g
              stroke="url(#trazoLogo)"
              fill="none"
              // El grosor va en unidades del viewBox (854 de ancho) y el SVG se
              // dibuja a ~560px, así que 1 unidad = ~0.66px reales. Con 3.2 la
              // línea mide ~2.1px: sólida y nítida.
              // **La línea NUNCA debe quedar por debajo de 1px real** — un
              // trazo sub-pixel el navegador lo pinta entrecortado y grisáceo,
              // y eso es lo que antes se veía como "pixelado" (no era el path).
              // Si cambia el viewBox o el `max-w`, recalcular:
              //   grosor = 2.1 * anchoViewBox / anchoEnPx
              strokeWidth={3.2}
              strokeLinejoin="round"
              strokeLinecap="round"
              filter="url(#neonLogo)"
              style={{
                // Se apagan cuando el relleno ya entró: si quedaran, el logo
                // se vería con un borde más grueso que el original.
                opacity: solido ? 0 : 1,
                transition: 'opacity 0.4s ease-out',
              }}
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
          </svg>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
