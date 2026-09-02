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
   * Foto de producto del hero (2026-09-01, pedido del cliente): la Satanás
   * sin fondo, la misma toma que mandó para la carta. Es decorativa
   * (`alt=""` en el componente): el contenido indexable es el h1.
   * `burger-satanas.webp` (1600x1108, 195KB) es el PNG original RECORTADO al
   * dibujo real —el archivo traía un 16% de aire arriba y abajo— para que
   * las medidas del layout refieran a la burger visible y no al aire (misma
   * regla que el sticker del nav). Reemplazó a `burger-hero.png`, archivado
   * en originales/.
   */
  imagen: {
    src: '/burger-satanas.webp',
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
 * `BURGUERS` es el único que todavía no tiene sección a la que apuntar:
 * queda en `#` a propósito hasta que exista (`NOSOTROS` y `WORK` ya apuntan
 * a las suyas). `activo` marca cuál lleva el óvalo rojo dibujado a mano.
 */
export const navLinks = [
  { label: 'Inicio', href: '#inicio', activo: true },
  { label: 'Burguers', href: '#', activo: false },
  { label: 'Nosotros', href: '#nosotros', activo: false },
  { label: 'Work', href: '#work', activo: false },
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
 * ── `escena`: LA FOTO EN DOS CAPAS (2026-09-01) ──
 * Para el carrusel "tocadiscos" (`CarruselBurgasV2`) cada foto se separa en
 * `fondo` (la foto SIN la hamburguesa, con el hueco rellenado con su propio
 * degradé) y `silueta` (la hamburguesa sin fondo, del PNG del cliente).
 * `caja` dice dónde y a qué tamaño va la silueta sobre el fondo, en fracción
 * del lado, para que **fondo + silueta reconstruya exactamente la foto
 * original**: en reposo se ve la foto tal cual, y al girar la burger se va
 * sola y el fondo queda limpio. Lo genera `originales/tocadiscos.py`, que
 * también alinea cada PNG (son la misma toma que la foto pero con zoom).
 * No editar las cajas a mano: salen del script.
 *
 * `sticker` (2026-09-01, material del cliente): el sello con el nombre, que en
 * el tocadiscos REEMPLAZA al nombre en texto — va montado sobre el borde
 * inferior de la foto. Recortados a su dibujo desde los PNG de la raíz (ahora
 * en `originales/stickers/`). **Falta el de Balak**: mientras no llegue, esa
 * burga muestra el nombre en texto, como antes.
 *
 * Los PNG `-SFONDO` (1080x1080 con alpha real) son el origen. Los
 * `-recorte.webp` de la versión anterior del carrusel quedaron sin uso.
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
      escena: {
        sticker: '/burgas/lucifer-sticker.webp',
        fondo: '/burgas/lucifer-fondo.webp',
        silueta: '/burgas/lucifer-silueta.webp',
        caja: { x: 0.2407, y: 0.3528, w: 0.5435, h: 0.4479 },
      },
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
      // Su silueta fue un recorte automático por croma hasta que el cliente
      // mandó SATANAS-SFONDO.png (2026-09-01): ya usa el PNG real, como todas.
      // Los archivos van con "-2" EN EL NOMBRE a propósito: los regenerados
      // pisaron la misma URL y el navegador del cliente siguió mostrando el
      // recorte viejo cacheado ("sigue cortada"). URL nueva = caché imposible.
      escena: {
        sticker: '/burgas/satanas-sticker.webp',
        fondo: '/burgas/satanas-fondo-2.webp',
        silueta: '/burgas/satanas-silueta-2.webp',
        caja: { x: 0.2065, y: 0.4037, w: 0.5787, h: 0.3954 },
      },
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
      escena: {
        fondo: '/burgas/balak-fondo.webp',
        silueta: '/burgas/balak-silueta.webp',
        caja: { x: 0.275, y: 0.3926, w: 0.4593, h: 0.4115 },
      },
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
      escena: {
        sticker: '/burgas/belcebu-sticker.webp',
        fondo: '/burgas/belcebu-fondo.webp',
        silueta: '/burgas/belcebu-silueta.webp',
        caja: { x: 0.2491, y: 0.413, w: 0.5046, h: 0.3979 },
      },
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
      escena: {
        sticker: '/burgas/azazel-sticker.webp',
        fondo: '/burgas/azazel-fondo.webp',
        silueta: '/burgas/azazel-silueta.webp',
        caja: { x: 0.2491, y: 0.3778, w: 0.4935, h: 0.4201 },
      },
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
      escena: {
        sticker: '/burgas/belfegor-sticker.webp',
        fondo: '/burgas/belfegor-fondo.webp',
        silueta: '/burgas/belfegor-silueta.webp',
        caja: { x: 0.2519, y: 0.3352, w: 0.5157, h: 0.4646 },
      },
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
      escena: {
        sticker: '/burgas/mammon-sticker.webp',
        fondo: '/burgas/mammon-fondo.webp',
        silueta: '/burgas/mammon-silueta.webp',
        caja: { x: 0.2454, y: 0.3833, w: 0.5102, h: 0.4179 },
      },
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
      escena: {
        sticker: '/burgas/lilith-sticker.webp',
        fondo: '/burgas/lilith-fondo.webp',
        silueta: '/burgas/lilith-silueta.webp',
        caja: { x: 0.275, y: 0.4185, w: 0.463, h: 0.3886 },
      },
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
      escena: {
        sticker: '/burgas/gualicho-sticker.webp',
        fondo: '/burgas/gualicho-fondo.webp',
        silueta: '/burgas/gualicho-silueta.webp',
        caja: { x: 0.2657, y: 0.4444, w: 0.475, h: 0.364 },
      },
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
      escena: {
        sticker: '/burgas/baal-sticker.webp',
        fondo: '/burgas/baal-fondo.webp',
        silueta: '/burgas/baal-silueta.webp',
        caja: { x: 0.2713, y: 0.4731, w: 0.4528, h: 0.3307 },
      },
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
      escena: {
        sticker: '/burgas/asmodeo-sticker.webp',
        fondo: '/burgas/asmodeo-fondo.webp',
        silueta: '/burgas/asmodeo-silueta.webp',
        caja: { x: 0.2454, y: 0.3491, w: 0.5074, h: 0.4463 },
      },
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
      escena: {
        sticker: '/burgas/leviatan-sticker.webp',
        fondo: '/burgas/leviatan-fondo.webp',
        silueta: '/burgas/leviatan-silueta.webp',
        caja: { x: 0.2648, y: 0.4046, w: 0.4611, h: 0.3955 },
      },
    },
  ],
} as const

/**
 * Sobre nosotros — "Nuestra historia".
 * EL COPY ES DEL CLIENTE (2026-09-02) y reemplaza al provisorio que había
 * escrito yo: ya no es placeholder. Solo se le corrigieron los acentos y un
 * dedazo ("de3" -> "de"), y se escribió "Hell's" con apóstrofo, como el logo.
 * Los dos párrafos son UN texto partido en el corte natural —el origen, y
 * después el objetivo— porque la sección los alterna con las fotos.
 * Las fotos siguen sin estar: los huecos van con borde punteado.
 */
export const nosotrosContent = {
  // Tenía un rótulo "Sobre nosotros" en Splatink encima del título; el
  // cliente lo sacó el 2026-09-02 (queda en el historial).
  titulo: 'Nuestra historia',
  parrafo1:
    'Hell’s Burger nació de las ganas de dos amigos, Gastón y Gonzalo, de apostar por una idea real.',
  parrafo2:
    'Más que hacer buenas hamburguesas, nuestro objetivo siempre fue crear el lugar ideal para encontrarse. Un espacio donde las charlas se alargan y los momentos se comparten.',
} as const

/**
 * Work — "Sumate!" (2026-09-02, texto y link aportados por el cliente).
 * A diferencia del copy del hero y de nosotros, ESTE SÍ ESTÁ APROBADO: lo
 * escribió el cliente. Solo se le pusieron los acentos que faltaban
 * (increíbles, tenés, energía, dinámico, querés, dejá) — la fuente de cuerpo
 * los trae y sin ellos se leen como erratas.
 */
export const workContent = {
  // En Splatink (font-grafiti): sin acentos a propósito, la fuente no trae.
  rotulo: 'Buscamos crew',
  titulo: 'Sumate!',
  texto:
    'Hacemos hamburguesas increíbles y necesitamos un equipo a la altura. Si tenés buena energía, te gusta el ritmo dinámico y querés romperla, dejá tu CV y sumate a HELLS.',
  cta: 'Unite al equipo',
} as const

/**
 * Footer (2026-09-02, pedido del cliente).
 * La dirección NO se escribe acá: sale de `NEGOCIO` en `constants.ts`, que es
 * la única fuente de verdad de los datos del negocio (el mapa la usa también).
 */
export const footerContent = {
  titulo: 'Contacto',
  // Los rótulos de los dos cuadraditos: solo los lee un lector de pantalla.
  instagram: 'Seguinos en Instagram',
  whatsapp: 'Escribinos por WhatsApp',
  mapa: 'Mapa con la ubicación del local',
  creditos: 'Made By Nuvvora',
} as const
