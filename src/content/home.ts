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
 * Sección "Las Burgas" — la carta. Las DOCE hamburguesas, cada una con su
 * video y su foto (2026-08-27, material del cliente).
 *
 * Cada tarjeta reproduce su video UNA vez al entrar en pantalla y queda en la
 * foto de producto (ver `BurgaVideo`). El orden y los ingredientes los dio el
 * cliente; los nombres se escriben acá y la tarjeta los dibuja.
 *
 * Los videos vienen de `burgashells/` (originales del cliente, 960x960 y ~2.3MB
 * cada uno) recomprimidos a 720px/24fps/crf26: ~200KB por video, 3.2MB las doce
 * con sus fotos. **Si entra un video nuevo, pasarlo por la misma receta** — está
 * en `originales/procesar.sh` y documentada en `BurgaVideo`.
 *
 * ── `miniatura`: LAS FOTOS SIN FONDO (2026-09-01, material del cliente) ──
 * Es la foto recortada que se ve mientras la burga ESPERA SU TURNO, asomada
 * chiquita al costado en el carrusel en prueba (`CarruselBurgasV2`). Al pasar
 * al frente cada una vuelve a su `foto` normal sobre el rojo.
 *
 * Salen de los PNG `-SFONDO` (1080x1080 con alpha real): recortados al sujeto
 * por su canal alpha, cuadrados con relleno TRANSPARENTE —no recortados, que
 * comería parte de la burger— y a WebP 900x900. **12.7MB → 993KB.**
 *
 * OJO CON LOS NOMBRES DE ARCHIVO, vienen corridos:
 *   * `AMODEO-SFONDO` (sin S) es el ASMODEO real — pollo rebozado, lechuga,
 *     tomate y panceta, que es justo lo que dicen sus ingredientes.
 *   * `ASMODEO-SFONDO` es en realidad LEVIATÁN (medallón veggie, tomate y
 *     mayonesa) y es **byte a byte idéntico** a `LEVIATAN-SFONDO` (md5
 *     verificado). Se usa el segundo, que además está bien nombrado.
 * Se resolvió mirando las fotos contra los ingredientes, no por el nombre.
 *
 * FALTA UNA: la de Satanás. Belfegor llegó después, en su propio archivo
 * (`belfegor- sfondo.png`, verificado contra sus ingredientes: es la del
 * huevo). Satanás usa mientras tanto la `sativa` que sirvió de ejemplo del
 * formato; **cuando llegue la suya, reemplazarla**.
 */
export const burgasContent = {
  titulo: 'Las Burgas',
  bajada: 'Doce maneras de pecar',
  items: [
    {
      id: 'lucifer',
      nombre: 'Lucifer',
      video: {
        src: '/burgas/lucifer.mp4',
        poster: '/burgas/lucifer-poster.webp',
        foto: '/burgas/lucifer.webp',
        alt: 'Hamburguesa Lucifer',
      },
      ingredientes: 'Triple medallón, cheddar x6 y salsa Hells',
      miniatura: '/burgas/lucifer-recorte.webp',
    },
    {
      id: 'satanas',
      nombre: 'Satanás',
      video: {
        src: '/burgas/satanas.mp4',
        poster: '/burgas/satanas-poster.webp',
        foto: '/burgas/satanas.webp',
        alt: 'Hamburguesa Satanás',
      },
      ingredientes: 'Doble medallón, cheddar x4, panceta y salsa Hells',
      /**
       * ÚNICA SIN RECORTE PROPIO: entre los archivos que mandó el cliente
       * (2026-09-01) no vino el de Satanás, así que sigue usando la `sativa`
       * que había servido de ejemplo del formato. **Cuando llegue el suyo,
       * reemplazar por `/burgas/satanas-recorte.webp`.**
       */
      miniatura: '/burgas/sativa.webp',
    },
    {
      id: 'balak',
      nombre: 'Balak',
      video: {
        src: '/burgas/balak.mp4',
        poster: '/burgas/balak-poster.webp',
        foto: '/burgas/balak.webp',
        alt: 'Hamburguesa Balak',
      },
      ingredientes: 'Triple medallón, cheddar x6, panceta, cebolla crispy y salsa Hells',
      miniatura: '/burgas/balak-recorte.webp',
    },
    {
      id: 'belcebu',
      nombre: 'Belcebú',
      video: {
        src: '/burgas/belcebu.mp4',
        poster: '/burgas/belcebu-poster.webp',
        foto: '/burgas/belcebu.webp',
        alt: 'Hamburguesa Belcebú',
      },
      ingredientes: 'Doble medallón, cheddar x4, cebolla crispy y barbacoa',
      miniatura: '/burgas/belcebu-recorte.webp',
    },
    {
      id: 'azazel',
      nombre: 'Azazel',
      video: {
        src: '/burgas/azazel.mp4',
        poster: '/burgas/azazel-poster.webp',
        foto: '/burgas/azazel.webp',
        alt: 'Hamburguesa Azazel',
      },
      ingredientes: 'Doble medallón, doble salsa, queso azul, rúcula y cebolla caramelizada',
      miniatura: '/burgas/azazel-recorte.webp',
    },
    {
      id: 'belfegor',
      nombre: 'Belfegor',
      video: {
        src: '/burgas/belfegor.mp4',
        poster: '/burgas/belfegor-poster.webp',
        foto: '/burgas/belfegor.webp',
        alt: 'Hamburguesa Belfegor',
      },
      ingredientes: 'Doble medallón, queso dambo x4, huevo, tomate y lechuga',
      miniatura: '/burgas/belfegor-recorte.webp',
    },
    {
      id: 'mammon',
      nombre: 'Mammón',
      video: {
        src: '/burgas/mammon.mp4',
        poster: '/burgas/mammon-poster.webp',
        foto: '/burgas/mammon.webp',
        alt: 'Hamburguesa Mammón',
      },
      ingredientes: 'Doble medallón, queso dambo x4, guacamole y mayonesa',
      miniatura: '/burgas/mammon-recorte.webp',
    },
    {
      id: 'lilith',
      nombre: 'Lilith',
      video: {
        src: '/burgas/lilith.mp4',
        poster: '/burgas/lilith-poster.webp',
        foto: '/burgas/lilith.webp',
        alt: 'Hamburguesa Lilith',
      },
      ingredientes: 'Doble medallón, cebolla caramelizada, cheddar líquido y cheddar x2',
      miniatura: '/burgas/lilith-recorte.webp',
    },
    {
      id: 'gualicho',
      nombre: 'Gualicho',
      video: {
        src: '/burgas/gualicho.mp4',
        poster: '/burgas/gualicho-poster.webp',
        foto: '/burgas/gualicho.webp',
        alt: 'Hamburguesa Gualicho',
      },
      ingredientes: 'Medallón, cheddar x2 y salsa Hells',
      miniatura: '/burgas/gualicho-recorte.webp',
    },
    {
      id: 'baal',
      nombre: 'Baal',
      video: {
        src: '/burgas/baal.mp4',
        poster: '/burgas/baal-poster.webp',
        foto: '/burgas/baal.webp',
        alt: 'Hamburguesa Baal',
      },
      ingredientes: 'Medallón XL, cheddar x2, cebolla y ketchup',
      miniatura: '/burgas/baal-recorte.webp',
    },
    {
      id: 'asmodeo',
      nombre: 'Asmodeo',
      video: {
        src: '/burgas/asmodeo.mp4',
        poster: '/burgas/asmodeo-poster.webp',
        foto: '/burgas/asmodeo.webp',
        alt: 'Hamburguesa Asmodeo',
      },
      ingredientes: 'Pechuga de pollo rebozada en tempura, cheddar x2, panceta, tomate, lechuga y mayoliva',
      miniatura: '/burgas/asmodeo-recorte.webp',
    },
    {
      id: 'leviatan',
      nombre: 'Leviatán',
      video: {
        src: '/burgas/leviatan.mp4',
        poster: '/burgas/leviatan-poster.webp',
        foto: '/burgas/leviatan.webp',
        alt: 'Hamburguesa Leviatán',
      },
      ingredientes: 'Medallón veggie a elección, queso dambo, portobellos, tomate y mayonesa de perejil',
      miniatura: '/burgas/leviatan-recorte.webp',
    },
  ],
} as const
