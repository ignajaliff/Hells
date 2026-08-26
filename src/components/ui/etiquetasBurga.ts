/**
 * Las ocho formas de etiqueta de "Las Burgas" (2026-08-24, pedido del cliente).
 *
 * Cada burga tiene nombre propio —Lucifer, Crepúsculo, Jesús, Antidemonio— así
 * que su sticker no puede ser el mismo recuadro repetido ocho veces. Cada
 * variante cambia **tres cosas a la vez**: forma, esquina y ángulo. Con una
 * sola de las tres se siguen leyendo como la misma etiqueta movida de lugar.
 *
 * REGLA AL EDITAR: dos tarjetas vecinas —la de al lado y la de abajo— no pueden
 * compartir esquina. En la grilla de 2 columnas de móvil eso deja el sello
 * saltando de posición en cada tarjeta, que es lo que las hace ver pegadas a
 * mano. El orden de `burgasContent.items` ya cumple esa regla; si se reordena,
 * volver a chequearlo.
 *
 * `caja` posiciona y rota. `pastilla` define la silueta y el padding. Van
 * separadas porque la silueta se reusa entre variantes con distinta posición.
 *
 * Las clases se escriben COMPLETAS y no armadas por template string: Tailwind
 * escanea el código fuente y una clase construida en runtime no se compila.
 */

export const ETIQUETAS = {
  /** 1 — Rectángulo recto arriba a la izquierda, sobresaliendo del borde. */
  recta: {
    caja: 'left-[-6px] top-3 -rotate-3 sm:left-[-8px] sm:top-4',
    pastilla: 'rounded-[9px] px-2.5 py-1.5 sm:rounded-[10px] sm:px-4 sm:py-2',
    ancho: 'min-w-[62%] max-w-[88%]',
  },

  /** 2 — Píldora arriba a la derecha. Bordes totalmente redondeados. */
  pildora: {
    caja: 'right-[-6px] top-3 rotate-[4deg] sm:right-[-8px] sm:top-4',
    pastilla: 'rounded-full px-3.5 py-1.5 sm:px-5 sm:py-2',
    ancho: 'min-w-[58%] max-w-[86%]',
  },

  /** 3 — Banda ancha de borde a borde, en la franja ALTA.
      Medido sobre las fotos: la comida ocupa del 33% al 94% del alto, así que
      una banda a media altura le cruzaba por encima del pan. Arriba queda sobre
      el fondo oscuro de la foto, que además es donde mejor contrasta. */
  banda: {
    caja: 'inset-x-[-8px] top-[13%] -rotate-[6deg]',
    pastilla: 'rounded-[6px] px-3 py-2 text-center sm:px-5 sm:py-2.5',
    ancho: '',
  },

  /** 4 — Sello redondo abajo a la derecha, como un timbre estampado.
      No sangra el borde (a diferencia de las otras): un círculo cortado por el
      canto se lee como un error de recorte, no como un sello pegado. */
  sello: {
    caja: 'right-4 top-4 rotate-[8deg] sm:right-5 sm:top-5',
    pastilla:
      'grid aspect-square place-items-center rounded-full px-2 text-center sm:px-3',
    ancho: 'w-[34%] max-w-[96px]',
  },

  /** 5 — Etiqueta con una esquina cortada en diagonal, arriba a la derecha. */
  cortada: {
    caja: 'right-[-6px] top-5 -rotate-[5deg] sm:right-[-8px] sm:top-6',
    pastilla:
      'px-2.5 py-1.5 sm:px-4 sm:py-2 [clip-path:polygon(0_0,100%_0,100%_72%,88%_100%,0_100%)]',
    ancho: 'min-w-[60%] max-w-[86%]',
  },

  /** 6 — Rectángulo alto, pegado al lado izquierdo en el tercio superior.
      Subido del centro: a media altura caía sobre el pan de la burger. */
  vertical: {
    caja: 'left-[-6px] top-[16%] -rotate-2 sm:left-[-8px]',
    pastilla: 'rounded-[8px] px-2.5 py-3 sm:px-3.5 sm:py-4',
    ancho: 'min-w-[52%] max-w-[76%]',
  },

  /** 7 — Chapita chica abajo a la izquierda, como una calco pequeña.
      Es la única que va abajo: al ser chica y estar en el borde izquierdo cae
      sobre la madera del barril, no sobre el plato. */
  chapa: {
    caja: 'bottom-4 left-[-6px] rotate-[6deg] sm:bottom-5 sm:left-[-8px]',
    pastilla: 'rounded-full px-3 py-1 sm:px-4 sm:py-1.5',
    ancho: 'min-w-[46%] max-w-[66%]',
  },

  /** 8 — Banda inclinada fuerte, arriba a la izquierda, sangrando los dos lados. */
  diagonal: {
    caja: 'inset-x-[-10px] top-7 -rotate-[8deg] sm:top-9',
    pastilla: 'rounded-[4px] px-3 py-1.5 text-center sm:px-5 sm:py-2',
    ancho: '',
  },
} as const

export type FormaEtiqueta = keyof typeof ETIQUETAS
