'use client'

import { burgasContent } from '@/content/home'
import { SECCIONES } from '@/lib/constants'
import { GrillaBurgas } from '@/components/ui/GrillaBurgas'
import { CarruselBurgasV2 } from '@/components/ui/CarruselBurgasV2'
import { useEsMovil } from '@/lib/useEsMovil'

/**
 * Las Burgas — la carta oficial (2026-09-01: el cliente eligió esta versión,
 * el "tocadiscos", y la anterior se borró junto con su carrusel).
 *
 * MÓVIL: el tocadiscos (`CarruselBurgasV2`) — la foto de la burga activa
 * entera y a todo el ancho, las vecinas sin fondo girando a los costados, el
 * sticker con el nombre montado al pie de la foto y los ingredientes debajo.
 *
 * DE `sm` PARA ARRIBA: la grilla de siempre (`GrillaBurgas`) — el cliente
 * pidió no trabajar la versión de escritorio todavía.
 *
 * La elección carrusel/grilla se hace EN JS (`useEsMovil`), no con clases:
 * montadas las dos, la rama oculta igual existiría en el DOM y descargaría
 * sus assets (medido con los videos: 13 en un celular en vez de 1).
 *
 * FONDO NEGRO PURO (#000, no `--background`): los fondos de las fotos
 * arrancan en negro puro y se funden con la sección sin borde visible.
 *
 * CONTRASTE: el título en `--primary` sobre negro da 4.50:1 — para el texto
 * display grande sobra. La bajada va en BLANCO (pedido del cliente,
 * 2026-09-01; además 15.96:1, holgado para texto chico).
 */
export function LasBurgasV2() {
  const { titulo, bajada, items } = burgasContent
  const esMovil = useEsMovil()

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
        <p className="mt-3 max-w-[36ch] font-body text-[clamp(15px,4vw,19px)] font-medium text-foreground">
          {bajada}
        </p>
      </header>

      {esMovil ? (
        <CarruselBurgasV2 items={items} className="relative z-[1] -mx-4" />
      ) : (
        <GrillaBurgas items={items} className="relative z-[1]" />
      )}
    </section>
  )
}
