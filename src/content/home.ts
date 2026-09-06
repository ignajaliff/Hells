/**
 * Contenido estático de la home (ai-pmp/rules.txt § Reglas de código).
 * Los textos fijos NUNCA van hardcodeados dentro del JSX: se editan acá.
 */

export const heroContent = {
  /**
   * "BEST BAD FOOD" (2026-09-06, pedido del cliente): reemplaza a
   * "Hamburguesas hechas en el infierno". Las tres palabras se reparten en
   * los campos que ya existían, así el componente no cambia: `destacado` es
   * el que va en ROJO, o sea "Food".
   *
   * `linea2` se parte en dos (`linea2a` / `linea2b`) para que en móvil la
   * tipografía pueda crecer — el tamaño del h1 lo limita la línea más larga.
   * Acá la segunda línea es UNA sola palabra, así que `linea2b` queda vacío;
   * el componente lo omite en vez de dibujar un espacio suelto.
   *
   * OJO — la palabra más ancha YA NO ES el destacado: medido en Ardillah,
   * "BEST" mide 2.026em y "FOOD" 1.911em. El ancho de la fila de CTAs en
   * escritorio se calcula contra la línea más larga (ver `Hero.tsx`), así
   * que ese factor pasó a atarse a "BEST" y no al destacado.
   */
  titulo: {
    linea1: 'Best',
    linea2a: 'Bad',
    linea2b: '',
    destacado: 'Food',
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
    // 2026-09-06, pedido del cliente: decía "Las burguers".
    secundario: 'Las burgers',
  },
} as const

/**
 * Links del navegador.
 *
 * LOS CUATRO APUNTAN A SU SECCIÓN (2026-09-03): `BURGUERS` pasó a "Burgers"
 * —pedido del cliente, sin la U— y de apuntar a `#` (a ningún lado) pasó a
 * `#carta`, el ancla de `LasBurgasV2` (la sección "Las Burgas"; conserva ese
 * nombre de ancla porque el CTA del hero también apunta ahí). Hasta ahora
 * en desktop no se notaba —el link activo no navega, solo marca "Inicio" con
 * el óvalo— pero en el DESPLEGABLE DE MÓVIL sí se toca, y llevaba a ningún
 * lado. `activo` marca cuál lleva el óvalo rojo dibujado a mano.
 *
 * "NOSOTROS" APUNTA A RESEÑAS (2026-09-04, pedido del cliente): iba a
 * `#nosotros`, la tira de fotos, y ahí el visitante caía en fotos sueltas sin
 * una palabra. **Quien es la marca se cuenta en `Resenas`** —el "somos dos
 * amigos que un día decidieron…" y lo que dice la gente— y la tira arranca
 * justo debajo, así que sigue apareciendo al scrollear. El ancla `#nosotros`
 * queda puesta en `TiraFotos` pero ya no la usa ningún link.
 */
export const navLinks = [
  { label: 'Inicio', href: '#inicio', activo: true },
  { label: 'Burgers', href: '#carta', activo: false },
  { label: 'Nosotros', href: '#resenas', activo: false },
  { label: 'Work', href: '#work', activo: false },
  /**
   * CONTACTO (2026-09-04, pedido del cliente): apunta al footer, que hasta
   * ahora no tenía ancla porque no es una sección del recorrido sino el pie.
   * Es donde viven la dirección, el mapa y los links a Instagram y WhatsApp,
   * así que es lo que alguien busca cuando toca "Contacto".
   */
  { label: 'Contacto', href: '#contacto', activo: false },
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
        fondo: '/burgas/lucifer-fondo-rojo.webp',
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
        fondo: '/burgas/satanas-fondo-rojo.webp',
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
        fondo: '/burgas/balak-fondo-rojo.webp',
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
        fondo: '/burgas/belcebu-fondo-rojo.webp',
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
        fondo: '/burgas/azazel-fondo-rojo.webp',
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
        fondo: '/burgas/belfegor-fondo-rojo.webp',
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
        fondo: '/burgas/mammon-fondo-rojo.webp',
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
        fondo: '/burgas/lilith-fondo-rojo.webp',
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
        fondo: '/burgas/gualicho-fondo-rojo.webp',
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
        fondo: '/burgas/baal-fondo-rojo.webp',
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
        fondo: '/burgas/asmodeo-fondo-rojo.webp',
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
        fondo: '/burgas/leviatan-fondo-rojo.webp',
        silueta: '/burgas/leviatan-silueta.webp',
        caja: { x: 0.2648, y: 0.4046, w: 0.4611, h: 0.3955 },
      },
    },
  ],
} as const

/**
 * La TIRA DE FOTOS que pasa sola (2026-09-03, pedido del cliente): reemplaza a
 * la sección «Nuestra historia», que tenía título y dos párrafos. El copy del
 * cliente (la historia de Gastón y Gonzalo) se sacó y queda en el historial
 * de git por si vuelve.
 *
 * Es una LISTA y no un objeto con nombres: acá el orden es lo único que
 * importa y el carrusel las recorre.
 *
 * SON OCHO (2026-09-04, material nuevo del cliente): llegaron seis fotos más
 * y se sacó la del cartel de neón recortada a 16:9 (`nosotros-1`), que el
 * cliente pidió quitar — su original sigue en `originales/nosotros/`, y el
 * cartel igual está en la tira, ahora en `nosotros-9` y sin recortar.
 *
 * EL ORDEN ES UN RITMO, no el de los archivos: alterna local / producto /
 * manos para que la tira no muestre dos fotos parecidas seguidas, y eso vale
 * también en el salto del final al principio (cierra con la bolsa roja y
 * arranca con la fachada). Las dos 4:5 —las únicas más anchas— quedan
 * separadas a propósito, si no se leerían como un bloque.
 *
 * Las seis nuevas son 2:3 y las dos viejas 4:5. En la tira se muestran a
 * ALTURA fija, así que esa diferencia se ve como fotos de distinto ancho —
 * que es exactamente lo que hace que se lea como una tira y no como una
 * grilla. Los JPG originales (7MB en total) están en `originales/nosotros/`;
 * acá van en WebP a 1125px de alto: **7MB → 295KB**.
 */
export const tiraFotosContent = [
  {
    src: '/nosotros-6.webp',
    alt: 'La fachada del local de noche, con el cartel de Hell’s Burger encendido y gente esperando en la vereda',
    ancho: 750,
    alto: 1125,
  },
  {
    src: '/nosotros-4.webp',
    alt: 'Una hamburguesa con cebolla crocante y papas fritas onduladas, servidas en un plato con papel de la marca',
    ancho: 750,
    alto: 1125,
  },
  {
    src: '/nosotros-2.webp',
    alt: 'Dos manos sosteniendo una hamburguesa de pollo crocante sobre una bandeja de papas',
    ancho: 900,
    alto: 1125,
  },
  {
    src: '/nosotros-7.webp',
    alt: 'Tres hamburguesas alineadas en fila sobre una bandeja oscura',
    ancho: 750,
    alto: 1125,
  },
  {
    src: '/nosotros-5.webp',
    alt: 'Una mano mojando un aro de cebolla en salsa, sobre una canasta con más aros',
    ancho: 750,
    alto: 1125,
  },
  {
    src: '/nosotros-9.webp',
    alt: 'El cartel colgante de Hell’s Burger, con el isotipo de la hamburguesa, en la fachada de noche',
    ancho: 750,
    alto: 1125,
  },
  {
    src: '/nosotros-3.webp',
    alt: 'Dos manos sosteniendo una hamburguesa con cheddar frente a las luces de la calle',
    ancho: 900,
    alto: 1125,
  },
  {
    src: '/nosotros-8.webp',
    alt: 'Una hamburguesa doble con cheddar apoyada sobre una bolsa roja de Hell’s Burger',
    ancho: 750,
    alto: 1125,
  },
] as const

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
