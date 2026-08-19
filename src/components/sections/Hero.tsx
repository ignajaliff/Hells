import Image from 'next/image'
import { heroContent } from '@/content/home'
import { NEGOCIO, SECCIONES } from '@/lib/constants'
import { FadeIn } from '@/components/ui/FadeIn'

/**
 * Hero — Server Component.
 * Composición tipográfica sobre el gris de marca: logo, título y la foto de
 * producto sangrando por el borde derecho.
 *
 * El h1 está dimensionado en vw para que la línea más larga ("HAMBURGUESAS")
 * llegue como máximo al 60% del ancho de la pantalla. Medido sobre la fuente:
 * en Anton esa palabra ocupa 5.718em (ya descontado el tracking de -0.02em),
 * así que 60 / 5.718 = 10.5vw. Si cambia el copy del título o el tracking,
 * recalcular — el 60% depende de la palabra más larga.
 *
 * La foto de producto sangra por el borde derecho (design-rules.txt §5: romper
 * la grilla a propósito). Va detrás del texto en el eje z y arranca recién en
 * `md`: en móvil el h1 ya ocupa el ancho y superponerlos lo volvería ilegible.
 */
export function Hero() {
  const { titulo, imagen } = heroContent

  return (
    <section
      id={SECCIONES.hero}
      className="relative isolate flex min-h-[100svh] flex-col justify-between overflow-hidden px-6 py-10 sm:px-8 sm:py-12"
    >
      {/* Foto de producto con las llamas asomando por detrás.
          El `isolate` de la <section> es imprescindible: sin él, el `-z-10` de
          este bloque lo manda detrás del fondo opaco del body y desaparece.
          Dentro del bloque, las llamas van en `z-0` y la burger en `z-10`:
          al estar ambas en el mismo contenedor comparten posición y escalan
          juntas si se cambia el ancho del bloque. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[10%] top-1/2 -z-10 hidden w-[58%] -translate-y-1/2 md:block lg:-right-[8%] lg:w-[54%]"
      >
        {/* Llamas: más anchas que la burger y corridas hacia abajo, para que
            asomen por los costados y por debajo en vez de quedar centradas. */}
        <div className="absolute inset-x-[-14%] bottom-[-10%] z-0">
          <Image
            src="/llamas-burger.png"
            alt=""
            width={1400}
            height={608}
            sizes="(min-width: 1024px) 62vw, 66vw"
            className="h-auto w-full"
          />
        </div>

        <Image
          src={imagen.src}
          alt=""
          width={1195}
          height={769}
          priority
          sizes="(min-width: 1024px) 54vw, 58vw"
          className="relative z-10 h-auto w-full"
        />
      </div>

      <FadeIn alEntrarEnPantalla={false} y={12} className="relative z-10">
        <Image
          src="/logo.png"
          alt={NEGOCIO.nombre}
          width={1258}
          height={722}
          priority
          className="h-auto w-32 sm:w-40"
        />
      </FadeIn>

      <FadeIn alEntrarEnPantalla={false} delay={0.14} y={28} className="relative z-10">
        <h1 className="font-display text-[10.5vw] uppercase leading-[0.82] tracking-[-0.02em]">
          <span className="block">{titulo.linea1}</span>
          <span className="block">{titulo.linea2}</span>
          <span className="block text-primary">{titulo.destacado}</span>
        </h1>
      </FadeIn>
    </section>
  )
}
