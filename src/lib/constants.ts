/**
 * Datos fijos del negocio y del sitio.
 * TODO(cliente): reemplazar TODOS los valores marcados con ⚠ por los reales
 * antes de publicar. Hasta entonces la web no se puede dar por entregada.
 */

export const SITE_URL = 'https://www.hellsburger.com.ar' // ⚠ dominio final

export const NEGOCIO = {
  nombre: "Hell's Burger", // según el logo de marca
  claim: 'Hamburguesas hechas en el infierno',
  ciudad: 'Mendoza', // dato real del cliente (2026-09-02)
  provincia: 'Mendoza', // dato real del cliente (2026-09-02)
  pais: 'AR',
  direccion: 'Olascoaga 715', // dato real del cliente (2026-09-02)
  codigoPostal: '5502', // de la ficha de Google Maps del local (M5502), 2026-09-02
  telefono: '+542615990627', // de la ficha de Google Maps (0261 599-0627). Es el WhatsApp del local (confirmado 2026-09-05)
  email: 'hola@hellsburger.com.ar', // ⚠
  instagram: 'https://www.instagram.com/hellsburgerok/', // dato real del cliente (2026-09-05)
} as const

/**
 * Menú de pedidos online (Fudo). Es el destino real del CTA "Pedí ya"
 * (2026-08-21): antes abría WhatsApp, pero el pedido se toma acá.
 * Externo: los links a este dominio van con `rel="noopener noreferrer"`.
 */
export const LINK_PEDIDOS = 'https://menu.fu.do/hellsburger'

/**
 * Google Analytics 4 (2026-09-10, pedido del cliente).
 * **Reemplazó al `GTM_ID = 'GTM-WTL23CKL'`** que estaba acá desde el
 * 2026-09-09: el cliente pidió sacar el Tag Manager y poner esta etiqueta.
 * Se carga en `app/layout.tsx`, así que vale para toda la web.
 * ⚠ Aquel contenedor de GTM queda desconectado — si tenía etiquetas adentro
 * (Analytics, Meta, conversiones), dejan de medir.
 */
export const GA_ID = 'G-92PYHY1M6R'

/**
 * Formulario de postulación de la sección WORK (2026-09-02, lo dio el
 * cliente). Es un Google Form, o sea un dominio ajeno: el link va con
 * `target="_blank"` + `rel="noopener noreferrer"`.
 */
/**
 * El mapa del footer y el link para abrirlo en Google Maps. Se arman con la
 * dirección de `NEGOCIO` para que no haya dos fuentes de verdad: si cambia
 * la dirección, el mapa la sigue solo.
 * El `output=embed` es el modo de inserción de Maps y NO necesita API key.
 */
const DIRECCION_COMPLETA = encodeURIComponent(
  `${NEGOCIO.direccion}, ${NEGOCIO.ciudad}, Argentina`,
)
export const MAPA_EMBED = `https://www.google.com/maps?q=${DIRECCION_COMPLETA}&output=embed`
export const MAPA_LINK = `https://www.google.com/maps/search/?api=1&query=${DIRECCION_COMPLETA}`

/**
 * La ficha del local en Google Maps (por su CID), donde estan todas las
 * resenas. Es el "ver todas" de la seccion de resenas.
 */
export const LINK_RESENAS = 'https://maps.google.com/?cid=3607505650167350392'

export const LINK_TRABAJO =
  'https://docs.google.com/forms/d/e/1FAIpQLScFG92hKd4tsXul7qO1qgAfl5ZdphslI3c0Im4YncVF2tFtiw/viewform'

/** Anclas internas de la landing. Se van agregando a medida que nacen las secciones. */
export const SECCIONES = {
  hero: 'inicio',
  carta: 'carta',
  /** Papas, nuggets y aros (2026-09-07): entre la carta y Reseñas. Sin link
   *  en el nav — el óvalo la cuenta como parte de "Burgers". */
  acompanamientos: 'acompanamientos',
  nosotros: 'nosotros',
  work: 'work',
  resenas: 'resenas',
  pedidos: 'pedidos',
  /**
   * El footer (2026-09-04): no era una seccion con ancla hasta que el cliente
   * pidio el link "Contacto" en el nav. Sigue sin ser una seccion del recorrido
   * —es el pie— pero necesita un ancla a la que llevar.
   */
  contacto: 'contacto',
} as const
