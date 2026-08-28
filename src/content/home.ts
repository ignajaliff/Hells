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
 * Sección "Las Burgas" — la carta.
 *
 * ⚠ FALTAN LOS NOMBRES. `nombre` va vacío a propósito: la etiqueta blanca de
 * cada tarjeta es el HUECO donde el cliente va a pegar su sticker con el nombre
 * (Lucifer, Crepúsculo, Jesús, Antidemonio...). Si acá se escribe algo, se
 * dibuja como texto provisional dentro de esa etiqueta.
 *
 * FOTOS (2026-08-24, aportadas por el cliente): son **4 fotos para las tarjetas
 * que todavía no tienen video**, así que se repiten. El orden está elegido para
 * que dos tarjetas vecinas —la de al lado y la de abajo— nunca muestren la misma
 * foto. **Si se reordenan los items o cambia la cantidad de columnas, rehacer
 * ese chequeo.**
 * REHECHO EL 2026-08-27 al entrar la burga de prueba como primera: el orden
 * anterior (`2,3,4,2,1,4,3`) se había calculado para 2 columnas de móvil y 4 de
 * desktop, pero la grilla pasó a 1/3/4 y **en 3 columnas ya chocaba desde antes**
 * —dos pares quedaban uno encima del otro—. El orden nuevo (`2,3,1,4,1,4,3`,
 * dos fotos cambiadas) está verificado en las TRES grillas.
 * Cuando lleguen las otras fotos o sus videos, se reemplazan y esto desaparece.
 *
 * `ingredientes` (2026-08-27, pedido del cliente): la lista que va DEBAJO de la
 * tarjeta, en rojo. Por ahora solo la llevan las dos burgas con video, que son
 * las que están en prueba. Las demás la reciben cuando el cliente las mande.
 *
 * El `tono` YA NO SE USA (2026-08-26): las tarjetas perdieron el recuadro y
 * son bloques negros planos. Se deja el campo por si se vuelve atrás.
 *
 * La `etiqueta` es la forma del sticker. **Las ocho son distintas** (decisión
 * del cliente, 2026-08-24): cada burga tiene su nombre propio —Lucifer,
 * Crepúsculo, Jesús, Antidemonio— así que su sello no puede ser el mismo
 * recuadro repetido ocho veces. Cada variante combina forma, esquina y ángulo,
 * y **dos tarjetas vecinas nunca comparten esquina**, ni la de al lado ni la
 * de abajo (verificado sobre la grilla de 2 columnas de móvil).
 */
export const burgasContent = {
  titulo: 'Las Burgas',
  bajada: 'Ocho maneras de pecar',
  items: [
    {
      /**
       * PRUEBA DE VIDEO (2026-08-27, pedido del cliente): un segundo video de
       * Belcebú, para compararlo con el que ya estaba. Es la MISMA burga y
       * lleva el MISMO sticker, así que las dos primeras tarjetas son la misma
       * hamburguesa filmada distinto — es deliberado y temporal: cuando el
       * cliente elija cuál queda, se borra la que pierda.
       * Este video arranca con los ingredientes flotando separados y los va
       * juntando; el otro arranca del pan de abajo.
       */
      id: 'burga-belcebu-nueva',
      nombre: '',
      foto: '/belsebu2-final.webp',
      video: {
        src: '/belsebu2.mp4',
        poster: '/belsebu2-poster.webp',
        final: '/belsebu2-final.webp',
        alt: 'La hamburguesa Belcebú',
      },
      sticker: { src: '/sticker-belcebu.webp', alt: 'Belcebú' },
      ingredientes: 'Doble medallón, cheddar x4, cebolla crispy y barbacoa',
      tono: 'carbon',
      etiqueta: 'recta',
    },
    {
      id: 'burga-1',
      nombre: '',
      foto: '/burga-destacada.webp',
      recorte: 'contain',
      /**
       * PRUEBA (2026-08-26, pedido del cliente): la primera burga muestra un
       * VIDEO movido por el scroll en vez de la secuencia de fotos. Llega al
       * frame final cuando el bloque queda centrado en la pantalla.
       * `final` es el último frame como imagen: se usa con movimiento reducido.
       * `belsebu.mp4` está re-codificado con todos los frames como keyframe
       * (ver `BurgaVideo`); el original del cliente está en `originales/`.
       */
      video: {
        src: '/belsebu.mp4',
        /** Primer frame: se ve mientras el video baja, así no hay hueco. */
        poster: '/belsebu-poster.webp',
        final: '/belsebu-final.webp',
        alt: 'La hamburguesa Belcebú',
      },
      /**
       * El sticker con el nombre, hecho por el cliente (2026-08-26). Reemplaza
       * a la etiqueta blanca. Recortado al dibujo desde `belsevusticker.png`
       * (raíz), que venía con 2481x1282 de lienzo y el sello ocupando la mitad.
       */
      sticker: { src: '/sticker-belcebu.webp', alt: 'Belcebú' },
      ingredientes: 'Doble medallón, cheddar x4, cebolla crispy y barbacoa',
      tono: 'carbon',
      etiqueta: 'recta',
    },
    { id: 'burga-2', nombre: '', foto: '/burga-2.webp', tono: 'naranja', etiqueta: 'pildora' },
    { id: 'burga-3', nombre: '', foto: '/burga-3.webp', tono: 'carbon', etiqueta: 'banda' },
    { id: 'burga-4', nombre: '', foto: '/burga-1.webp', tono: 'rojo', etiqueta: 'sello' },
    { id: 'burga-5', nombre: '', foto: '/burga-4.webp', tono: 'naranja', etiqueta: 'cortada' },
    { id: 'burga-6', nombre: '', foto: '/burga-1.webp', tono: 'carbon', etiqueta: 'vertical' },
    { id: 'burga-7', nombre: '', foto: '/burga-4.webp', tono: 'rojo', etiqueta: 'chapa' },
    { id: 'burga-8', nombre: '', foto: '/burga-3.webp', tono: 'carbon', etiqueta: 'diagonal' },
  ],
} as const
