import { burgasContent } from '@/content/home'
import { SECCIONES } from '@/lib/constants'
import { BurgaCard } from '@/components/ui/BurgaCard'
import { type FormaEtiqueta } from '@/components/ui/etiquetasBurga'

/**
 * Las Burgas — Server Component. La carta: título y grilla de 8 hamburguesas.
 *
 * FONDO NEGRO PURO y títulos en ROJO (2026-08-26, pedido del cliente). Antes
 * la sección era roja (`--superficie-fuego`) con el título en carbón; se
 * invirtió cuando entró el video de la primera burga, que arranca en negro y
 * necesita fundirse con el fondo. Es `#000` y no `--background` (#1a1a1a)
 * por eso mismo: el negro del video es puro.
 *
 * CONTRASTE: `--primary` (#e3211f) sobre negro da 4.50:1 — JUSTO el mínimo
 * AA para texto normal (4.5:1), así que la bajada puede ir en rojo pero sin
 * margen: si se achica o se aclara el fondo, deja de cumplir. Es la única
 * superficie del sitio donde el rojo del logo sirve para texto chico; sobre
 * `--background` no llega (3.79:1).
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
      className="relative overflow-hidden bg-black px-4 py-20 sm:px-8 sm:py-28 lg:px-14"
    >
      {/* Encabezado. El título se sale un poco por la izquierda (`-ml-[2%]`)
          para que la sección no se lea como una caja centrada y prolija. */}
      <header className="relative z-[1] mb-12 sm:mb-16">
        <h2 className="-ml-[2%] font-display text-[clamp(56px,16vw,190px)] uppercase leading-[0.85] tracking-[-0.02em] text-primary sm:text-[12vw] lg:text-[9vw]">
          {titulo}
        </h2>
        <p className="mt-3 max-w-[36ch] font-body text-[clamp(15px,4vw,19px)] font-medium text-primary">
          {bajada}
        </p>
      </header>

      {/* La grilla. Las tarjetas son bloques negros sobre fondo negro, así que
          el `gap` no se ve como separación: lo que separa una burga de otra
          es el aire entre las fotos. */}
      <ul className="relative z-[1] grid grid-cols-1 gap-y-8 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-11 lg:grid-cols-4 lg:gap-x-7 lg:gap-y-12">
        {items.map((burga) => (
          /* En móvil cada tarjeta se sale del padding de la sección (`-mx-4`)
             para ir de borde a borde. De `sm` para arriba vuelve a la grilla. */
          <li key={burga.id} className="-mx-4 sm:mx-0">
            <BurgaCard
              nombre={burga.nombre}
              foto={burga.foto}
              recorte={'recorte' in burga ? burga.recorte : undefined}
              animada={'animada' in burga ? Boolean(burga.animada) : undefined}
              video={'video' in burga ? burga.video : undefined}
              sticker={'sticker' in burga ? burga.sticker : undefined}
              etiqueta={burga.etiqueta as FormaEtiqueta}
            />
          </li>
        ))}
      </ul>
    </section>
  )
}
