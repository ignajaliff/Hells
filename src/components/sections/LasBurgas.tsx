import { burgasContent } from '@/content/home'
import { SECCIONES } from '@/lib/constants'

/**
 * Las Burgas — Server Component.
 *
 * Primera sección después del hero. Invierte la relación de la paleta: acá el
 * rojo es el FONDO y el gris carbón es la tipografía, al revés que en el resto
 * del sitio.
 *
 * El rojo es `--superficie-fuego` (#d62218) y no `--primary` (#e3211f): es el
 * tono que tienen las ilustraciones de llamas, así que la sección empalma con
 * el zócalo de fuego del hero sin salto visible.
 *
 * CONTRASTE: gris carbón sobre este rojo da 3.40:1. Alcanza para texto grande
 * (AA pide 3:1 a partir de 24px, o 18.66px en negrita) pero NO para texto
 * normal. Si más adelante entra un párrafo, precios o texto chico, no pueden ir
 * en gris: hay que usar blanco, que da 5.12:1.
 *
 * Por ahora es solo el fondo y el título, a la espera del contenido.
 */
export function LasBurgas() {
  return (
    <section
      id={SECCIONES.carta}
      className="relative bg-superficie-fuego px-6 py-24 sm:px-8 sm:py-32"
    >
      <h2 className="font-display text-[16vw] uppercase leading-[0.85] tracking-[-0.02em] text-background sm:text-[12vw] lg:text-[9vw]">
        {burgasContent.titulo}
      </h2>
    </section>
  )
}
