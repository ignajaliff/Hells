/**
 * Acompañamientos (2026-09-07, pedido del cliente): la sección entre la carta
 * y Reseñas. Archivo propio por la misma razón que `resenas.ts`: `home.ts` ya
 * pasa las 300 líneas.
 *
 * Cada acompañamiento es UNA imagen sin fondo, un título y un subtítulo, y un
 * `lado`: el costado de la pantalla hacia el que se tira la imagen. El título
 * y la línea roja que lo une con el plato van del OTRO lado (ver
 * `Acompanamientos.tsx`). El cliente los pidió alternados: derecha, izquierda,
 * derecha.
 *
 * LAS IMÁGENES son los PNG del cliente (1024x1024, 566–878KB) recortados a su
 * contorno real y pasados a WebP CON alpha: se apoyan sobre el fondo de
 * palabras del hero, que no es un color plano, así que no se pueden aplanar
 * como se hizo con `fondo-movil.webp`. Quedaron en 67–90KB. Los originales
 * están en `originales/acompanamientos/`.
 * `ancho`/`alto` son los del WebP recortado — importan porque cada plato tiene
 * una proporción distinta (las papas son apaisadas 2:1, los nuggets casi
 * cuadrados) y de ahí sale el alto de cada fila.
 */
export type Acompanamiento = {
  titulo: string
  subtitulo: string
  lado: 'derecha' | 'izquierda'
  imagen: { src: string; ancho: number; alto: number }
}

export const acompanamientosContent = {
  /**
   * "SIDES" (2026-09-08, pedido del cliente): reemplaza a "Acompañamientos".
   * El nombre del archivo, el ancla `#acompanamientos` y `SECCIONES` no
   * cambian — son identificadores internos, y renombrarlos rompería el link
   * sin que se vea nada distinto en pantalla.
   */
  titulo: 'Sides',
  items: [
    {
      titulo: 'Papas Hells',
      subtitulo: 'Chedar y bacon',
      lado: 'derecha',
      imagen: { src: '/papas.webp', ancho: 860, alto: 431 },
    },
    {
      titulo: 'Nuggets',
      subtitulo: 'Con 2 salsas',
      lado: 'izquierda',
      imagen: { src: '/nuggets.webp', ancho: 887, alto: 644 },
    },
    {
      titulo: 'Aros de cebolla',
      subtitulo: 'Con 2 salsas',
      lado: 'derecha',
      imagen: { src: '/aros-cebolla.webp', ancho: 984, alto: 542 },
    },
  ] satisfies readonly Acompanamiento[],
}
