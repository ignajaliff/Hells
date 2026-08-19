/**
 * Datos fijos del negocio y del sitio.
 * TODO(cliente): reemplazar TODOS los valores marcados con ⚠ por los reales
 * antes de publicar. Hasta entonces la web no se puede dar por entregada.
 */

export const SITE_URL = 'https://www.hellsburger.com.ar' // ⚠ dominio final

export const NEGOCIO = {
  nombre: "Hell's Burger", // según el logo de marca
  claim: 'Hamburguesas hechas en el infierno',
  ciudad: 'Rosario', // ⚠
  provincia: 'Santa Fe', // ⚠
  pais: 'AR',
  direccion: 'Calle Falsa 123', // ⚠
  codigoPostal: '2000', // ⚠
  telefono: '+5493411234567', // ⚠
  email: 'hola@hellsburger.com.ar', // ⚠
  instagram: 'https://instagram.com/hellsburger', // ⚠
} as const

/** Anclas internas de la landing. Se van agregando a medida que nacen las secciones. */
export const SECCIONES = {
  hero: 'inicio',
  carta: 'carta',
  pedidos: 'pedidos',
} as const
