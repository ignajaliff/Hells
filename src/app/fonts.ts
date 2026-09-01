import localFont from 'next/font/local'

/**
 * Tipografías del proyecto (2026-09-01, indicación de la comunidad de la
 * marca — reemplazan a Anton/Archivo, que eran la propuesta inicial):
 *
 *   display → Ardillah Kafi (StringLabs): títulos, "la que veníamos usando".
 *   grafiti → Splatink (Darrell Flood): graffiti para detalles, aclaraciones
 *             y a veces títulos. OJO: NO TRAE ACENTOS NI EÑES (104 glifos) —
 *             usarla solo en palabras que no los lleven; una tilde caería al
 *             fallback y se notaría el cambio de fuente a mitad de palabra.
 *   body    → Sveningsson (Derek Gomez): cuerpo de texto. Un solo peso, así
 *             que font-medium/semibold/extrabold los sintetiza el navegador.
 *             (La flecha "→" de los CTAs tampoco está en la fuente: la dibuja
 *             el fallback del sistema, verificado que se ve bien.)
 *
 * Van con next/font/local y no next/font/google: ninguna está en Google
 * Fonts. Los .woff2 salieron de los .ttf oficiales vía fontTools (~1/3 del
 * peso, mismo trazo).
 *
 * ⚠ LICENCIA: Ardillah Kafi y Splatink son "free for personal use" — el uso
 * comercial requiere licencia del autor (StringLabs / dadiomouse@gmail.com,
 * mín. USD 10). La marca ya las usa como tipografías propias (las tiene en
 * su Drive): confirmar la licencia con el cliente antes de publicar, y si el
 * Drive trae otros archivos, reemplazar los woff2 de src/app/fonts/.
 */
export const display = localFont({
  src: './fonts/ardillah-kafi.woff2',
  weight: '400',
  variable: '--font-display',
  display: 'swap',
})

export const grafiti = localFont({
  src: './fonts/splatink.woff2',
  weight: '400',
  variable: '--font-grafiti',
  display: 'swap',
})

export const body = localFont({
  src: './fonts/sveningsson.woff2',
  weight: '400',
  variable: '--font-body',
  display: 'swap',
})
