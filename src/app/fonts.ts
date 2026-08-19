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

export const body = Archivo({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
})
