import { NavHero } from '@/components/ui/NavHero'
import { Hero } from '@/components/sections/Hero'
import { LasBurgasV2 } from '@/components/sections/LasBurgasV2'
import { Resenas } from '@/components/sections/Resenas'
import { TiraFotos } from '@/components/sections/TiraFotos'
import { Work } from '@/components/sections/Work'
import { Footer } from '@/components/sections/Footer'

/**
 * Home — una landing es una composición de secciones.
 * Las próximas secciones se agregan acá, en orden de lectura.
 */
export default function HomePage() {
  return (
    <>
      {/* El nav es STICKY y por eso vive acá y no dentro del hero: el hero
          tiene `overflow-hidden` (la burger se sale por los costados) y un
          ancestro con overflow rompe el sticky. El hero resta `--nav` de su
          altura para que la primera pantalla siga midiendo 100svh. */}
      <NavHero />
      <Hero />
      {/* La carta. El nombre del archivo conserva el "V2" de cuando convivían
          las dos versiones en prueba (2026-09-01, el cliente eligió ésta). */}
      <LasBurgasV2 />
      {/* Las resenas de Google, debajo de la carta (2026-09-02). */}
      <Resenas />
      {/* La tira de fotos que pasa sola (2026-09-03). Reemplazó a la sección
          «Nuestra historia»; conserva su ancla porque el nav apunta ahí. */}
      <TiraFotos />
      {/* Work — la búsqueda de personal, con el link al formulario. */}
      <Work />
      {/* El pie: contacto, mapa, logo y el crédito de Nuvvora. */}
      <Footer />
    </>
  )
}
