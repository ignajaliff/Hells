import { BurgaCard } from '@/components/ui/BurgaCard'

type Burga = {
  id: string
  nombre: string
  video: { src: string; poster: string; foto: string; alt: string }
  ingredientes?: string
}

/**
 * GrillaBurgas — la carta de `sm` para arriba: las doce en grilla, cada una
 * con su video.
 *
 * Es lo que había antes en `LasBurgas`; se separó a su propio archivo
 * (2026-08-31) cuando la elección entre carrusel y grilla pasó a hacerse en
 * JS — ver `useEsMovil`.
 *
 * PENDIENTE: el cliente pidió dejar escritorio como está por ahora y decidir
 * después cómo se traslada acá el carrusel en profundidad del móvil.
 */
export function GrillaBurgas({
  items,
  className = '',
}: {
  items: readonly Burga[]
  className?: string
}) {
  return (
    /* Las tarjetas son bloques negros sobre fondo negro, así que el `gap` no
       se lee como separación: lo que separa una burga de otra es el aire
       entre las fotos. */
    <ul
      className={`grid grid-cols-3 gap-x-6 gap-y-11 lg:grid-cols-4 lg:gap-x-7 lg:gap-y-12 ${className}`}
    >
      {items.map((burga) => (
        <li key={burga.id}>
          <BurgaCard
            nombre={burga.nombre}
            video={burga.video}
            ingredientes={burga.ingredientes}
          />
        </li>
      ))}
    </ul>
  )
}
