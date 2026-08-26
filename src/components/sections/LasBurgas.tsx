import { burgasContent } from '@/content/home'
import { SECCIONES } from '@/lib/constants'
import { BurgaCard, type TonoBurga } from '@/components/ui/BurgaCard'
import { type FormaEtiqueta } from '@/components/ui/etiquetasBurga'

/**
 * Las Burgas — Server Component. La carta: título y grilla de 8 hamburguesas.
 *
 * Invierte la relación de la paleta: acá el rojo es el FONDO y el gris carbón
 * es la tipografía, al revés que en el resto del sitio.
 *
 * El rojo es `--superficie-fuego` (#d62218) y no `--primary` (#e3211f): es el
 * tono que tienen las ilustraciones de llamas, así que la sección empalma con
 * el zócalo de fuego del hero sin salto visible.
 *
 * CONTRASTE: gris carbón sobre este rojo da 3.40:1. Alcanza para texto grande
 * (AA pide 3:1 a partir de 24px, o 18.66px en negrita) pero NO para texto
 * normal. Por eso la bajada va en BLANCO (5.12:1) y no en carbón: es texto
 * chico. Misma regla para cualquier párrafo o precio que entre más adelante.
 *
 * GRILLA: **1 columna en móvil** (decisión del cliente, 2026-08-24), 3 desde
 * `sm` y 4 desde `lg`.
 *
 * Se había probado a 2 columnas cuando las tarjetas eran placeholders grises:
 * ahí una sola columna daba 3284px de scroll para ver ocho recuadros vacíos,
 * que se leía como una lista larga. Con las fotos reales el caso cambia — cada
 * tarjeta tiene algo que mirar, la burger se ve al tamaño que merece y el
 * sticker del nombre entra a ancho completo. El scroll largo deja de ser un
 * costo y pasa a ser el recorrido de la carta.
 */
export function LasBurgas() {
  const { titulo, bajada, items } = burgasContent

  return (
    <section
      id={SECCIONES.carta}
      className="relative overflow-hidden bg-superficie-fuego px-4 py-20 sm:px-8 sm:py-28 lg:px-14"
    >
      {/* Encabezado. El título se sale un poco por la izquierda (`-ml-[2%]`)
          para que la sección no se lea como una caja centrada y prolija. */}
      <header className="relative z-[1] mb-12 sm:mb-16">
        <h2 className="-ml-[2%] font-display text-[clamp(56px,16vw,190px)] uppercase leading-[0.85] tracking-[-0.02em] text-background sm:text-[12vw] lg:text-[9vw]">
          {titulo}
        </h2>
        <p className="mt-3 max-w-[36ch] font-body text-[clamp(15px,4vw,19px)] font-medium text-white/90">
          {bajada}
        </p>
      </header>

      {/* La grilla. El `gap` es generoso a propósito: las tarjetas están
          rotadas y con sombra desplazada, así que necesitan aire para no
          tocarse entre sí — con un gap chico las esquinas se pisan. */}
      <ul className="relative z-[1] grid grid-cols-1 gap-y-8 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-11 lg:grid-cols-4 lg:gap-x-7 lg:gap-y-12">
        {items.map((burga, i) => (
          <li key={burga.id}>
            <BurgaCard
              nombre={burga.nombre}
              foto={burga.foto}
              recorte={'recorte' in burga ? burga.recorte : undefined}
              animada={'animada' in burga ? burga.animada : undefined}
              tono={burga.tono as TonoBurga}
              etiqueta={burga.etiqueta as FormaEtiqueta}
              indice={i}
            />
          </li>
        ))}
      </ul>
    </section>
  )
}
