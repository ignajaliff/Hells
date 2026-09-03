import Image from 'next/image'
import { nosotrosContent } from '@/content/home'
import { SECCIONES } from '@/lib/constants'

/**
 * Sobre nosotros — "Nuestra historia".
 *
 * COMPOSICIÓN (2026-09-02, pedido del cliente, reemplaza a la primera): el
 * título, un párrafo, LA FOTO DEL LOCAL a todo el ancho, el segundo párrafo y
 * al pie las otras DOS FOTOS EN LA MISMA LÍNEA, repartiéndose el ancho. Antes
 * las fotos se alternaban con el texto en dos columnas.
 *
 * Los párrafos quedan intercalados a propósito: con los tres bloques de foto
 * seguidos, el copy —que es el que cuenta la historia— quedaba arrinconado
 * arriba y la sección se leía como una galería.
 *
 * LAS FOTOS SIGUEN EN LA MISMA LÍNEA EN MÓVIL: el cliente pidió "en la misma
 * línea", y son verticales, así que a media pantalla (~173px de ancho) siguen
 * entrando bien. Por eso NO llevan un breakpoint que las apile.
 *
 * Las tres venían verticales (2:3) y se recortaron —16:9 la del local, 4:5 las
 * otras dos— en `content/home.ts` está el detalle. Van con el ratio ya horneado
 * en el archivo, así que `w-full h-auto` alcanza: no hace falta `aspect-` ni
 * `object-cover`, y de paso no hay salto de layout al cargar.
 *
 * EL TÍTULO VA EN BLANCO (2026-09-02, pedido del cliente): antes era rojo,
 * como el de la carta. Llevaba encima un rótulo "Sobre nosotros" en Splatink
 * (`font-grafiti`) que el cliente pidió sacar el mismo día — la sección
 * arranca directo con el título.
 *
 * Fondo NEGRO PURO (#000), igual que la carta (2026-09-01, pedido del
 * cliente — primero fue carbón para separar tonalmente las secciones).
 */
export function Nosotros() {
  const { titulo, parrafo1, parrafo2, fotos } = nosotrosContent

  return (
    <section
      id={SECCIONES.nosotros}
      className="relative overflow-hidden bg-black px-4 py-20 sm:px-8 sm:py-28 lg:px-14"
    >
      {/* Mismo gesto que el título de la carta: se sale un poco por la
          izquierda para que la sección no se lea como una caja prolija. */}
      <h2 className="-ml-[2%] mb-8 font-display text-[clamp(44px,13vw,150px)] uppercase leading-[0.9] tracking-[-0.02em] text-foreground sm:mb-10">
        {titulo}
      </h2>

      <p className="max-w-[52ch] font-body text-[clamp(15px,4vw,18px)] leading-relaxed text-foreground/90">
        {parrafo1}
      </p>

      {/* La foto del local, a todo el ancho de la sección. */}
      <Image
        src={fotos.local.src}
        alt={fotos.local.alt}
        width={1920}
        height={1080}
        sizes="100vw"
        className="mt-10 h-auto w-full rounded-2xl lg:mt-14"
      />

      <p className="mt-10 max-w-[52ch] font-body text-[clamp(15px,4vw,18px)] leading-relaxed text-foreground/90 lg:mt-14">
        {parrafo2}
      </p>

      {/* Las otras dos, en la misma línea y repartiéndose el ancho.
          `grid-cols-2` sin breakpoint: van lado a lado también en móvil. */}
      <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 lg:mt-14 lg:gap-8">
        {[fotos.izquierda, fotos.derecha].map((foto) => (
          <Image
            key={foto.src}
            src={foto.src}
            alt={foto.alt}
            width={900}
            height={1125}
            sizes="(min-width: 640px) 45vw, 47vw"
            className="h-auto w-full rounded-2xl"
          />
        ))}
      </div>
    </section>
  )
}
