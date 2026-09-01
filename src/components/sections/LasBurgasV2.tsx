'use client'

import { burgasContent } from '@/content/home'
import { GrillaBurgas } from '@/components/ui/GrillaBurgas'
import { CarruselBurgasV2 } from '@/components/ui/CarruselBurgasV2'
import { useEsMovil } from '@/lib/useEsMovil'

/**
 * LasBurgasV2 — la MISMA carta, con la variante nueva del carrusel de móvil
 * (2026-08-31, pedido del cliente: "cloná las hamburguesas y hacelo en la de
 * abajo, para poder notar la diferencia").
 *
 * Es un clon deliberado de `LasBurgas` y vive debajo de ella en la home, con
 * un rótulo que la identifica. Sirve para comparar los dos carruseles en la
 * misma pantalla y elegir; **no es una sección definitiva de la landing**.
 *
 * CUANDO EL CLIENTE ELIJA: se borra este archivo junto con
 * `CarruselBurgasV2`, o se reemplaza el contenido de `LasBurgas` por el de
 * acá. Las dos no pueden quedar publicadas: la carta duplicada en la misma
 * página confunde al visitante y le duplica el peso a la sección.
 *
 * NO LLEVA `id` de sección: el ancla `#carta` ya la tiene `LasBurgas` y dos
 * elementos con el mismo id romperían la navegación del nav.
 *
 * De `sm` para arriba muestra la MISMA grilla que la v1, sin cambios: la
 * prueba es solo del móvil.
 */
export function LasBurgasV2() {
  const { items } = burgasContent
  const esMovil = useEsMovil()

  return (
    <section className="relative overflow-hidden bg-black px-4 py-20 sm:px-8 sm:py-28 lg:px-14">
      {/* RÓTULO DE PRUEBA, no copy de la landing: está para saber cuál de las
          dos versiones se está mirando. Se va con la sección. */}
      <header className="relative z-[1] mb-12 sm:mb-16">
        <p className="mb-3 inline-block border border-primary px-3 py-1 font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
          Versión 2 · en prueba
        </p>
        <h2 className="-ml-[2%] font-display text-[clamp(56px,16vw,190px)] uppercase leading-[0.85] tracking-[-0.02em] text-primary sm:text-[12vw] lg:text-[9vw]">
          Las Burgas
        </h2>
        <p className="mt-3 max-w-[36ch] font-body text-[clamp(15px,4vw,19px)] font-medium text-primary">
          La activa a ancho completo y sobre rojo
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
