import { nosotrosContent } from '@/content/home'
import { SECCIONES } from '@/lib/constants'

/**
 * Sobre nosotros — "Nuestra historia" (2026-09-01, pedido del cliente).
 *
 * Composición pedida: el título, después IMAGEN a la izquierda con texto a la
 * derecha, después texto a la izquierda con IMAGEN a la derecha, y al pie una
 * imagen a TODO el ancho. En móvil las filas se apilan y el orden del DOM ya
 * da la lectura correcta (imagen, texto, texto, imagen, imagen ancha) sin
 * clases de `order`.
 *
 * LAS FOTOS NO EXISTEN TODAVÍA: el cliente va a decir qué va en cada hueco.
 * Cada marco se dibuja con borde punteado rojo y su leyenda numerada para que
 * se vea exactamente dónde cae cada una — cuando lleguen, cada `MarcoFoto` se
 * reemplaza por un `next/image` con el mismo aspect ratio.
 *
 * El rótulo va en Splatink (`font-grafiti`) — el rol que la comunidad le dio:
 * "detalles, aclaraciones y a veces títulos". "Sobre nosotros" no lleva
 * tildes, que es la condición para usarla (la fuente no trae acentos).
 *
 * Fondo NEGRO PURO (#000), igual que la carta (2026-09-01, pedido del
 * cliente — primero fue carbón para separar tonalmente las secciones).
 */
export function Nosotros() {
  const { rotulo, titulo, parrafo1, parrafo2 } = nosotrosContent

  return (
    <section
      id={SECCIONES.nosotros}
      className="relative overflow-hidden bg-black px-4 py-20 sm:px-8 sm:py-28 lg:px-14"
    >
      <header className="mb-12 sm:mb-16">
        <p className="font-grafiti text-[clamp(18px,5vw,30px)] tracking-wide text-accent">
          {rotulo}
        </p>
        {/* Mismo gesto que el título de la carta: se sale un poco por la
            izquierda para que la sección no se lea como una caja prolija. */}
        <h2 className="-ml-[2%] mt-1 font-display text-[clamp(44px,13vw,150px)] uppercase leading-[0.9] tracking-[-0.02em] text-primary">
          {titulo}
        </h2>
      </header>

      {/* Fila 1: imagen a la izquierda, texto a la derecha. */}
      <div className="grid gap-6 sm:gap-8 lg:grid-cols-2 lg:items-center lg:gap-12">
        <MarcoFoto numero={1} leyenda="Imagen a definir" className="aspect-[4/3]" />
        <p className="max-w-[52ch] font-body text-[clamp(15px,4vw,18px)] leading-relaxed text-foreground/90">
          {parrafo1}
        </p>
      </div>

      {/* Fila 2: texto a la izquierda, imagen a la derecha. */}
      <div className="mt-10 grid gap-6 sm:gap-8 lg:mt-16 lg:grid-cols-2 lg:items-center lg:gap-12">
        <p className="max-w-[52ch] font-body text-[clamp(15px,4vw,18px)] leading-relaxed text-foreground/90">
          {parrafo2}
        </p>
        <MarcoFoto numero={2} leyenda="Imagen a definir" className="aspect-[4/3]" />
      </div>

      {/* Cierre: una imagen a todo el ancho de la sección. */}
      <MarcoFoto
        numero={3}
        leyenda="Imagen a todo el ancho, a definir"
        className="mt-10 aspect-[16/9] sm:aspect-[21/9] lg:mt-16"
      />
    </section>
  )
}

/**
 * El hueco de una foto que todavía no existe: borde punteado y leyenda, para
 * que el cliente vea dónde va cada una (pedido explícito: "marcámelo con
 * bordes y luego yo te digo qué colocar").
 */
function MarcoFoto({
  numero,
  leyenda,
  className,
}: {
  numero: number
  leyenda: string
  className?: string
}) {
  return (
    <div
      className={`grid place-items-center rounded-2xl border-2 border-dashed border-primary/60 bg-muted/40 ${className ?? ''}`}
    >
      <p className="px-6 text-center font-body text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">
        Foto {numero} — {leyenda}
      </p>
    </div>
  )
}
