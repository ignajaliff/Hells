import { Anton, Archivo } from 'next/font/google'

/**
 * Tipografías del proyecto (ai-pmp/design-rules.txt §3).
 * Siempre con next/font — nunca un <link> a Google Fonts.
 *
 * display → Anton: condensada, pesada, pensada para títulos gigantes en caja alta.
 * body    → Archivo: neutra con carácter, buena legibilidad sobre fondo oscuro.
 */
export const display = Anton({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-display',
  display: 'swap',
})

/**
 * El 800 es para la flecha "→" de los CTAs: el handoff la pide en Archivo
 * extra bold, y sin ese peso el navegador la simula engrosándola y se ve sucia.
 */
export const body = Archivo({
  subsets: ['latin'],
  weight: ['400', '500', '600', '800'],
  variable: '--font-body',
  display: 'swap',
})
