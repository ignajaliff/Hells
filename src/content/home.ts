/**
 * Contenido estático de la home (ai-pmp/rules.txt § Reglas de código).
 * Los textos fijos NUNCA van hardcodeados dentro del JSX: se editan acá.
 */

export const heroContent = {
  titulo: {
    linea1: 'Hamburguesas',
    linea2: 'hechas en',
    destacado: 'el infierno',
  },
  /**
   * Foto de producto del hero. Es decorativa (`alt=""` en el componente): el
   * contenido indexable es el h1, no la imagen.
   * El PNG mide 1195x769: a 54vw se dibuja por DEBAJO de su tamaño nativo
   * (0.87x en 1920), así que se ve nítida sin escalar.
   */
  imagen: {
    src: '/burger-hero.png',
    alt: 'Hamburguesa de Hell’s Burger',
  },
} as const

/**
 * La mascota. Salen del mismo archivo (`diablos.jpg`, los dos stickers sobre
 * fondo negro), así que comparten contorno, iluminación y encuadre.
 * Se recortaron con la MISMA caja centrada — ratio 0.882 y 0.887 — así que
 * se pueden superponer para animar el guiño sin que la cabeza se mueva.
 * Decorativas siempre: van con alt="".
 */
export const diabloContent = {
  abierto: '/diablo.png',
  guino: '/diablo-guino.png',
} as const
