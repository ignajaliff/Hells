import { Hero } from '@/components/sections/Hero'
import { LasBurgasV2 } from '@/components/sections/LasBurgasV2'
import { Nosotros } from '@/components/sections/Nosotros'

/**
 * Home — una landing es una composición de secciones.
 * Las próximas secciones se agregan acá, en orden de lectura.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      {/* La carta. El nombre del archivo conserva el "V2" de cuando convivían
          las dos versiones en prueba (2026-09-01, el cliente eligió ésta). */}
      <LasBurgasV2 />
      {/* Sobre nosotros — "Nuestra historia" (2026-09-01): los huecos de las
          fotos van con borde punteado hasta que el cliente mande el material. */}
      <Nosotros />
    </>
  )
}
