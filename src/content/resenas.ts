/**
 * Reseñas (2026-09-02, pedido del cliente): la intro es SU texto, tal cual lo
 * mandó —el chiste del cliché cortado y el "mirá lo que opinan"—. Las
 * reseñas son de la ficha del local en Google Maps.
 *
 * Va en su propio archivo y no en `home.ts` porque ese ya pasa las 300 líneas
 * (rules.txt) y diez reseñas lo empeoraban.
 *
 * LA FECHA SÍ SE MUESTRA (2026-09-02, 2ª iteración): el cliente pidió las
 * tarjetas "exactamente como Google", y ahí la fecha va al lado de las
 * estrellas. Es RELATIVA ("Hace 7 meses") y está CONGELADA al día en que se
 * tomaron: no se recalcula sola, así que envejece. Si algún día se nota,
 * volver a pasar el scraper (la URL está más abajo).
 */
export type Resena = {
  autor: string
  estrellas: 1 | 2 | 3 | 4 | 5
  texto: string
  /** La línea gris bajo el nombre, tal cual la muestra Google. */
  meta: string
  /** Relativa, como la escribe Google. Ver la nota de arriba. */
  fecha: string
}

export const resenasContent = {
  cliche:
    'Somos dos amigos que un día decidieron abrir una hamburguesería con el gran sueño de...',
  remate: 'Ufff, aburrido. 🥱',
  parrafo1:
    'Podríamos escribirte un texto interminable sobre cómo empezamos, pero la verdad es que preferimos que hablen los que realmente saben.',
  parrafo2: 'Mejor, mirá lo que opinan los que ya se sentaron en nuestra mesa 👇',
  fuente: 'Reseña de Google',
  verTodas: 'Ver todas las reseñas en Google',
} as const

/**
 * Diez reseñas de la ficha de Google Maps del local (tomadas el 2026-09-02;
 * la ficha tenía 4,9 y 28 reseñas con texto). TEXTO Y NOMBRE VERBATIM, como
 * los escribió cada persona — solo se unieron los saltos de línea en un
 * párrafo, y se quitaron los DOS 🫨 (U+1FAE8, "shaking face") de la reseña de
 * vittorio: es un emoji de Unicode 15 (2022) que muchos sistemas todavía no
 * tienen y se dibujaba como un cuadradito vacío — verificado midiéndolo en
 * canvas contra el ancho del "tofu". Los otros nueve emojis que aparecen
 * (🍔👇🔥😍😎🙌🤤🥱♥) sí renderizan.
 * Criterio de selección: de 5 estrellas, completas (Google corta
 * algunas con "…"), de 60 a 480 caracteres para que entren en la tarjeta,
 * variadas (turistas, delivery, burgas por nombre, el dip, la atención) y
 * sin la que critica a un competidor con nombre.
 * Cómo se sacaron: `maps.google.com` con el bloque `data=` del lugar más
 * `!9m1!1b1` abre el panel de reseñas sin login; la búsqueda de Google y su
 * diálogo `lrd` devuelven captcha.
 */
export const resenas: readonly Resena[] = [
  {
    autor: 'vittorio leonel bianchi',
    estrellas: 5,
    texto:
      'Las hamburguesas son una BOOOMBAA !!!, soy de buen comer y la terrible Balak XXL me dejo detonado, los sabores se distinguen a la perfección, la calidad de la carne smasheada es única por la zona ( ya que no cae pesado ), la panceta viene en abundancia, ni hablar del queso 🤤 y las papas fritas vienen en buena cantidad. Respecto a la atención, la verdad muy buena onda los chicos😎🙌 Desde Buenos Aires hasta esta excelente hamburguesería digna de degustar, un Lujo!!!!!',
    meta: '4 reseñas',
    fecha: 'Hace 5 meses',
  },
  {
    autor: 'David Emmanuel Vera',
    estrellas: 5,
    texto:
      'Servicio excelente, la comida un 10 recomiendo la hamburguesa satanás con el dip de salsa picante del local que la eleva a un mil. No tuvimos que esperar mucho para que la sirvan. Son unos cracks',
    meta: 'Local Guide · 25 reseñas · 1 foto',
    fecha: 'Hace 7 meses',
  },
  {
    autor: 'Macsi',
    estrellas: 5,
    texto:
      'fue la mejor hamburguesa smash q probe en mi vidaa, si vienen a Mendoza no se vayan sin venir aca, yo me arrepiento de no comprar una para el viaje, son riquísimas.',
    meta: '2 reseñas · 1 foto',
    fecha: 'Hace 6 meses',
  },
  {
    autor: 'Franco Daniel Schischlo',
    estrellas: 5,
    texto:
      'Nos pedimos una Lilith y una Belcebú, estaban increíbles, las papas también súper crocantes y con un polvito simil Doritos que quedaba muy bien. De yapa por ser San Patricio no nos cobraron la bebida a pesar de que no era alcohol, un mimo pero que hace a la atención 10 puntos.',
    meta: '5 reseñas · 4 fotos',
    fecha: 'Hace 5 meses',
  },
  {
    autor: 'Gize Lopez',
    estrellas: 5,
    texto:
      'Las mejores hamburguesas de la Aristides...unos genios los chicos que atienden. Soberbios los demons, no defraudan! Siempre que puedo, voy!',
    meta: 'Local Guide · 30 reseñas · 7 fotos',
    fecha: 'Hace un mes',
  },
  {
    autor: 'Celeste Fortes',
    estrellas: 5,
    texto:
      'Excelente atención, muy rapido el servicio. Las hamburguesas muy ricas y son generosos con las cantidades. Las papas tremendas!!',
    meta: '4 reseñas',
    fecha: 'Hace un mes',
  },
  {
    autor: 'Edu Gulino',
    estrellas: 5,
    texto:
      'Soy un gordo hamburguesero, que buena calidad de hamburguesa. La carne es smasheada y queda crocante, el pan suave y por la textura parece casero. He pedido varias veces y pienso volver, la temática es divertida y por el precio es un manjar muchas gracias',
    meta: '3 reseñas',
    fecha: 'Hace 11 meses',
  },
  {
    autor: 'Juan Pablo Mendoza',
    estrellas: 5,
    texto:
      'Zarpadas hamburguesas y papas ♥😍 Además un servicio muy bueno y humano. Tuve un problema con pedidos ya, hable con el local a su numero de WhatsApp y me solucionaron de forma rápida y eficiente ellos mismos el problema. 100% recomendadas estas hamburguesas 🔥🍔',
    meta: '5 reseñas',
    fecha: 'Hace 4 meses',
  },
  {
    autor: 'Leandro Eyub',
    estrellas: 5,
    texto:
      'Terribles burgers hacen los pibes!!! Y si las pedis para buscarlas por el local las tienen de toque',
    meta: '2 reseñas',
    fecha: 'Hace 3 semanas',
  },
  {
    autor: 'Luis Alberto Cortés González',
    estrellas: 5,
    texto:
      'Muy buenas hamburguesas no alcance a sacar foto jaja muy contundentes y frescas y no se demoraron prácticamente nada las recomiendo !',
    meta: '2 reseñas',
    fecha: 'Hace 3 meses',
  },
]
