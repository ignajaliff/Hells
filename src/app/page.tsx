import { Hero } from '@/components/sections/Hero'
import { LasBurgas } from '@/components/sections/LasBurgas'

/**
 * Home — una landing es una composición de secciones.
 * Las próximas secciones se agregan acá, en orden de lectura.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <LasBurgas />
    </>
  )
}
