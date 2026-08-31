'use client'

import { burgasContent } from '@/content/home'
import { SECCIONES } from '@/lib/constants'
import { GrillaBurgas } from '@/components/ui/GrillaBurgas'
import { CarruselBurgas } from '@/components/ui/CarruselBurgas'
import { useEsMovil } from '@/lib/useEsMovil'

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
 * MÓVIL: CARRUSEL horizontal (2026-08-31, pedido del cliente) — las burgas se
 * pasan con el dedo, la activa centrada y las vecinas asomando oscurecidas;
 * la ficha de nombre e ingredientes vive debajo y cambia con la activa. Ver
 * `CarruselBurgas`. Reemplaza a la columna vertical de 12 tarjetas: el
 * cliente eligió el recorrido por deslizamiento aun sabiendo que expone menos
 * la carta completa.
 *
 * DE `sm` PARA ARRIBA sigue la GRILLA de siempre (3 columnas, 4 desde `lg`):
 * la versión de escritorio del carrusel se decide después, para no trabajar
 * dos veces (cliente, 2026-08-31). Son DOCE burgas, todas con video.
 */
export function LasBurgas() {
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
        <p className="mt-3 max-w-[36ch] font-body text-[clamp(15px,4vw,19px)] font-medium text-primary">
          {bajada}
        </p>
      </header>

      {/* Carrusel en móvil, grilla de `sm` para arriba.

          SE ELIGE EN JS, no con `hidden`/`sm:block` (2026-08-31): con clases,
          las DOCE tarjetas de la grilla se renderizan igual en móvil —solo
          quedan invisibles— y sus doce `<video>` existen en el DOM y empiezan
          a descargar. Medido: 13 videos en un celular en vez de 1. Montando
          una sola rama, en móvil vive únicamente el video de la burga activa. */}
      {esMovil ? (
        <CarruselBurgas items={items} className="relative z-[1] -mx-4" />
      ) : (
        <GrillaBurgas items={items} className="relative z-[1]" />
      )}
    </section>
  )
}
