import { Hero } from '@/components/sections/Hero'
import { LasBurgas } from '@/components/sections/LasBurgas'
import { LasBurgasV2 } from '@/components/sections/LasBurgasV2'

/**
 * Home — una landing es una composición de secciones.
 * Las próximas secciones se agregan acá, en orden de lectura.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <LasBurgas />
      {/* CLON EN PRUEBA (2026-08-31): la misma carta con la otra versión del
          carrusel de móvil, para comparar las dos en la misma pantalla.
          **Sacar esta línea cuando el cliente elija** — ver `LasBurgasV2`. */}
      <LasBurgasV2 />
    </>
  )
}
