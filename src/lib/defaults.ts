/**
 * Defaults hardcodeados de todo valor que en el futuro venga de Supabase
 * (ai-pmp/error-handling.txt §1).
 *
 * Regla: el default es contenido REAL y válido — el último valor conocido y
 * estable. Si la base no responde, la web se ve exactamente igual de bien.
 * Cada clave de acá tiene su fila en la tabla "Contenido dinámico" de CLAUDE.md.
 */

import { NEGOCIO } from './constants'

export const DEFAULTS = {
  whatsapp: {
    visible: true,
    // Dato real del cliente (2026-09-05): 2615990627, el mismo de la ficha de
    // Maps. Formato wa.me: sin + ni espacios, con código de país (54) y el 9
    // de celular argentino.
    numero: '5492615990627',
    desde: 19,
    hasta: 24,
    mensaje: 'Pedí por WhatsApp',
  },
  horarios: {
    texto: 'Mar a Dom · 19:00 a 00:30hs', // ⚠
  },
  banner: {
    visible: false,
    texto: '',
  },
  contacto: {
    telefono: NEGOCIO.telefono,
    direccion: NEGOCIO.direccion,
  },
} as const
