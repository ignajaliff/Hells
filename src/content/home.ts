/**
 * Contenido estático de la home (ai-pmp/rules.txt § Reglas de código).
 * Los textos fijos NUNCA van hardcodeados dentro del JSX: se editan acá.
 */

export const heroContent = {
  /**
   * `linea2` se parte en dos en móvil (`linea2a` / `linea2b`) para que la
   * tipografía pueda crecer: el tamaño del h1 lo limita la línea más larga, y
   * con "hechas en el" entera no había margen. En desktop las dos se muestran
   * en la misma línea, así que el texto leído es idéntico.
   */
  titulo: {
    linea1: 'Hamburguesas',
    linea2a: 'Hechas',
    linea2b: 'en el',
    destacado: 'Infierno',
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
  cta: {
    primario: 'Pedi ya',
    secundario: 'Las burguers',
  },
} as const

/**
 * Links del navegador.
 *
 * `BURGUERS`, `NOSOTROS` y `WORK` todavía no tienen sección a la que apuntar:
 * quedan en `#` a propósito hasta que existan. `activo` marca cuál lleva el
 * óvalo rojo dibujado a mano.
 */
export const navLinks = [
  { label: 'Inicio', href: '#inicio', activo: true },
  { label: 'Burguers', href: '#', activo: false },
  { label: 'Nosotros', href: '#', activo: false },
  { label: 'Work', href: '#', activo: false },
] as const

/**
 * Frases de la barra roja que corre bajo el nav.
 *
 * Se listan UNA vez: el componente las repite las veces que hagan falta para
 * que el loop no deje huecos. Si se agregan o sacan frases no hay que tocar
 * nada más.
 */
export const marqueeFrases = [
  "Hell's Burguer",
  'Smash Burguer',
  '10% Off Cash',
  'Envios a Domicilio',
] as const

/**
 * La mascota. `diablo.png` viene del handoff de diseño (2026-08-20) y
 * `diablo-guino.png` del sticker fotografiado que ya estaba en el proyecto.
 * Son cortes de origen distinto, así que se RE-ENCUADRARON a una caja común
 * de 620x699 alineando por el ancho del dibujo: sin eso la cabeza saltaba al
 * cruzarlas para el guiño. Verificado: 95.7% de silueta compartida.
 * Decorativas siempre: van con alt="".
 */
export const diabloContent = {
  abierto: '/diablo.png',
  guino: '/diablo-guino.png',
} as const

/**
 * Sección "Las Burgas" — la carta. Por ahora solo el título: el listado de
 * hamburguesas entra cuando el cliente pase los productos y las fotos.
 */
export const burgasContent = {
  titulo: 'Las Burgas',
} as const
