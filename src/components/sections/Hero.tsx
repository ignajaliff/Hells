import Image from 'next/image'
import { heroContent } from '@/content/home'
import { NEGOCIO, SECCIONES } from '@/lib/constants'
import { NavHero } from '@/components/ui/NavHero'
import { BarraPromo } from '@/components/ui/BarraPromo'
import { DiabloHero } from '@/components/ui/DiabloHero'

/**
 * Hero — Server Component. Ocupa exactamente una pantalla, sin scroll.
 *
 * Implementa el handoff de diseño "Hero HELLS v3" (2026-08-20). Cinco capas,
 * de atrás hacia adelante: palabras de fondo, nav, barra promo, la burger
 * sangrando por la derecha y la columna de texto.
 *
 * ALTURA: `100svh` y no `100vh`. En los navegadores móviles `vh` incluye la
 * barra de direcciones, así que un hero de `100vh` queda cortado por abajo
 * justo donde van los CTAs. `svh` mide el viewport chico —el que queda con la
 * barra visible— y entra siempre.
 *
 * MÓVIL: el diseño original está definido solo para desktop (1440x900) y ahí
 * no entra —la columna de texto ocupa 62% y la burger 54%, se pisarían—. Se
 * resolvió apilando: en móvil la burger pasa a ser un fondo detrás del texto,
 * atenuada para que el h1 se lea, y los CTAs van uno arriba del otro. De `lg`
 * para arriba es el diseño tal cual lo entregaron.
 *
 * Los tamaños del texto van en `vh` y no en `vw` porque la restricción real es
 * la ALTURA: todo tiene que entrar en una pantalla. Con `vw`, en un monitor
 * ancho y bajo el h1 desbordaría por abajo.
 */
export function Hero() {
  const { titulo, imagen, cta } = heroContent

  return (
    <section
      id={SECCIONES.hero}
      className="relative isolate flex h-[100svh] flex-col overflow-hidden bg-background"
    >
      {/* Fondo ilustrado: trae las palabras de marca y el zócalo de fuego al
          pie. Reemplaza a la capa `MarcaAgua`, que dibujaba esas mismas
          palabras en HTML — se veían duplicadas. Va `aria-hidden` porque es
          decoración: el texto que importa está en el h1.

          SOLO DESKTOP. En móvil no sirve: es 16:9 y el hero de un celular es
          mucho más alto, así que `object-cover` la escala por ALTURA y solo
          entra un 25-32% del ancho — las palabras quedan tan grandes que se ven
          como manchas y no se lee ninguna. Ahí va la capa en mosaico de abajo.
          `object-bottom`: el zócalo de fuego tiene que quedar pegado al pie.

          `unoptimized`: ya está servida en WebP a su tamaño final (2560px, 31KB
          contra los 1.2MB del JPEG original), así que volver a pasarla por el
          optimizador de Next solo agregaría latencia. */}
      <Image
        src="/fondo-fuegitos.webp"
        alt=""
        aria-hidden
        fill
        priority
        unoptimized
        sizes="100vw"
        className="pointer-events-none -z-10 hidden select-none object-cover object-bottom lg:block"
      />

      {/* MÓVIL: las palabras de marca, en MOSAICO vertical.
          `background-size: 100% auto` las muestra al ancho completo de la
          pantalla —o sea a escala legible, no como manchas— y `repeat-y` apila
          las ~3.8 copias que hacen falta para cubrir el alto.
          Es `background-image` y no `<Image>` a propósito: `next/image` no puede
          repetir un patrón, y con `object-contain` la imagen ocuparía solo el
          26% de la altura dejando el resto vacío.
          El asset (`fondo-palabras.webp`, 1280x648, 3.5KB) es el mismo fondo
          **recortado antes del fuego**: el zócalo de llamas ya lo pone la capa
          siguiente, y si viniera incluido se repetiría en mitad de la pantalla.
          Va a la mitad de resolución porque en móvil se muestra a ~390px. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 select-none bg-[url('/fondo-palabras.webp')] bg-[length:100%_auto] bg-repeat-y lg:hidden"
      />

      {/* MÓVIL: solo la franja de llamas, al pie y a todo el ancho. Es el
          recorte del 12% inferior de `fondo-fuegitos` (2560x173), así que el
          dibujo es exactamente el mismo que en desktop.
          Va por ALTURA (`h-[7svh]` con mínimo y máximo) y no por ancho: a ancho
          completo el ratio 14.8:1 lo dejaría en ~26px, un hilito. Al fijar la
          altura se recortan los lados, que en un patrón de llamas repetido no
          se nota. */}
      <Image
        src="/zocalo-fuego.webp"
        alt=""
        aria-hidden
        width={2560}
        height={173}
        priority
        unoptimized
        sizes="100vw"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[max(34px,7svh)] max-h-[64px] w-full select-none object-cover object-bottom lg:hidden"
      />

      <NavHero />
      <BarraPromo />

      {/* Zona central: se come todo el alto que sobra. `min-h-0` es necesario
          para que un hijo con overflow no estire el flex por encima del alto
          del hero. */}
      {/* El `pb` de móvil reserva el alto exacto del zócalo de fuego (la misma
          expresión que su `h-`), así la burger apoya justo encima de las llamas
          en vez de pisarlas. En `lg` no hace falta: ahí la burger es absoluta y
          su posición ya se calculó contra el fuego. */}
      <div className="relative flex min-h-0 flex-1 flex-col justify-center pb-[min(max(34px,7svh),64px)] lg:flex-row lg:items-center lg:justify-start lg:pb-[12svh]">
        {/* La burger sangra fuera de la pantalla por la derecha.

            MÓVIL — NO VA DETRÁS DEL TEXTO (2026-08-21): estaba en `absolute` al
            120% de ancho y `opacity-25` justo detrás del h1, ocupando el 40-51%
            del alto de la zona. Sumado al lettering del fondo, eran tres capas
            peleando el mismo espacio y se leía todo encimado.
            Ahora en móvil es un hijo más del flex, DEBAJO del texto: se apoya en
            el espacio libre que queda entre los CTAs y el zócalo de fuego
            (medido: 120px en el iPhone SE, 198 en el 14, 228 en Android).
            `min-h-0` la deja encogerse si la pantalla es muy baja en vez de
            empujar el texto fuera del hero.
            De `lg` para arriba vuelve a ser absoluta y sangra por la derecha,
            como el diseño.

            NO TAPAR EL FUEGO (2026-08-21): el zócalo de llamas ahora es parte
            del fondo y ocupa el 9.7% de abajo, así que la burger tiene que
            terminar antes. Tres ajustes, en orden de cuánto aportan:
            * **la sombra era el problema real**, no el tamaño: bajaba 40px y se
              difuminaba 60, o sea llegaba ~100px más abajo del dibujo y
              ensuciaba las llamas. Ahora baja 24 con blur 44 (~68px).
            * el centro se sube un 6% del alto (`-translate-y-[calc(50%+6vh)]`):
              la burger estaba centrada en la zona central, y esa zona incluye
              la franja del fuego. Esto es lo que lo resuelve en pantallas
              bajas — solo achicándola seguía pisando en 1366x768.
            * el ancho baja de 54% a 50%, el mínimo que pidió el cliente.
            Verificado por cálculo en 1280x720, 1366x768, 1440x900, 1536x864 y
            1920x1080: en el peor caso la sombra termina justo donde arranca el
            fuego. **Si se agranda la burger o su sombra, rehacer esta cuenta.** */}
        <Image
          src={imagen.src}
          alt=""
          width={1195}
          height={769}
          priority
          sizes="(min-width: 1024px) 50vw, 92vw"
          className="pointer-events-none order-2 mx-auto min-h-0 w-[92%] max-w-[420px] flex-1 object-contain object-bottom drop-shadow-[-16px_16px_30px_rgba(0,0,0,.55)] lg:absolute lg:right-[-8%] lg:top-1/2 lg:order-none lg:z-[2] lg:mx-0 lg:w-[50%] lg:min-w-[460px] lg:max-w-[900px] lg:flex-none lg:-translate-y-[calc(50%+6vh)] lg:object-cover lg:drop-shadow-[-24px_24px_44px_rgba(0,0,0,.55)]"
        />

        {/* La mascota, apoyada sobre la burger.

            EN MÓVIL TAMBIÉN (2026-08-21, pedido del cliente): antes iba
            `hidden lg:block` porque la burger estaba DETRÁS del texto y el
            diablillo caía encima del h1. Desde que el móvil se apila eso ya no
            pasa: la burger tiene su propio espacio abajo, así que la mascota se
            apoya ahí, anclada por abajo (`bottom`) en lugar de por arriba.
            El `bottom` repite la expresión del alto del zócalo de fuego + 2%,
            así queda apoyada sobre las llamas sin pisarlas, y va a la derecha
            (`right-[6%]`) para no taparle la cara a la hamburguesa.
            Más chica que en desktop (48-68px contra 110-170px): a tamaño de
            desktop ocuparía casi un cuarto del ancho de la pantalla.
            Se achicó una segunda vez el 2026-08-21 (pedido del cliente): venía
            en 64-92px y quedaba muy pegada a la barra de promos. Ahora también
            se separa más del pie (+6% en vez de +2%).

            SE MUEVE JUNTO CON LA BURGER (2026-08-21): está anclada al viewport
            (`right-%`), no a la burger, así que cualquier cambio de tamaño de
            ésta la deja despegada — que es justo lo que pasó al achicarla de
            54% a 50%. El `right` se recalculó a 32.7% para conservar la misma
            proporción de solape (medido igual en 1366, 1440 y 1920).
            El `top` pasa de `4%` a `0`: al subir la burger 6vh, mantener la
            relación exacta daba ~-0.4% —o sea metido debajo de la barra promo—,
            así que se apoya en el tope de la zona. Verificado que sigue
            solapando la burger en 1280x720, 1366x768, 1440x900 y 1920x1080.
            **Si se vuelve a cambiar el ancho de la burger, hay que recalcular
            este `right`** — o, mejor, envolver las dos en un contenedor común
            y posicionar el diablillo dentro de él. */}
        <DiabloHero className="pointer-events-none absolute bottom-[calc(min(max(34px,7svh),64px)+6%)] right-[3%] z-[4] w-[clamp(48px,12.5vw,68px)] -rotate-4 drop-shadow-[0_10px_18px_rgba(0,0,0,.55)] lg:bottom-auto lg:right-[33.5%] lg:top-[3%] lg:z-[3] lg:w-[clamp(88px,8.5vw,132px)] lg:drop-shadow-[0_12px_22px_rgba(0,0,0,.5)]" />

        {/* MÓVIL: `order-1` + `shrink-0` — el texto va ARRIBA de la burger y no
            se comprime; si falta alto, lo que cede es la burger (que lleva
            `flex-1` y `min-h-0`), nunca el h1 ni los CTAs.
            DESKTOP: los tres se anulan (`lg:order-none lg:shrink`) para dejar
            exactamente el layout original — el texto pegado a la izquierda con
            `max-w-[62%]`, la burger absoluta sangrando por la derecha. */}
        <div className="relative z-[3] order-1 max-w-full shrink-0 px-5 pb-4 sm:px-8 lg:order-none lg:max-w-[62%] lg:shrink lg:px-14">
          <Image
            src="/logo.png"
            alt={NEGOCIO.nombre}
            width={1258}
            height={722}
            priority
            className="mb-[clamp(14px,2.8vh,32px)] block h-[clamp(70px,13vh,150px)] w-auto lg:h-[clamp(88px,16vh,190px)]"
          />

          {/* El tamaño se limita por ALTURA y por ANCHO a la vez.
              El `9vh` solo mide alto, y en un celular alto y angosto (390x844)
              daba 76px: "HAMBURGUESAS", que es la palabra más larga, se salía
              de la pantalla. El `min()` lo ata a las DOS restricciones: `12.2vw`
              para que la línea más larga entre a lo ancho, y `6.5vh` para que
              las cuatro líneas no se coman el alto de la burger —con `9vh`
              quedaba en 84px en un iPhone SE, una franja aplastada—.
              En desktop no cambia nada: ahí manda el `9vh` y el tope de 110px. */}
          <h1 className="font-display text-[clamp(38px,min(8.5vh,12.2vw),110px)] uppercase leading-none tracking-[0.005em] text-foreground lg:text-[clamp(38px,min(13vh,9.2vw),150px)]">
            <span className="block">{titulo.linea1}</span>
            {/* En móvil "hechas en el" se parte en dos para que la tipografía
                pueda crecer: el límite del tamaño lo pone la línea más larga, y
                con tres líneas era ésta la que frenaba todo. En `lg` vuelve a
                ser una sola (`lg:inline`), como el diseño. */}
            <span className="block">
              <span className="block lg:inline">{titulo.linea2a}</span>{' '}
              <span className="block lg:inline">{titulo.linea2b}</span>
            </span>
            <span className="block text-primary">{titulo.destacado}</span>
          </h1>

          {/* En pantallas BAJAS los dos CTAs van lado a lado. Apilados se
              llevan 130px de alto y en un iPhone SE (667px) dejaban la burger
              en 73px, una franja aplastada. La condición es por ALTURA
              (`max-height`), no por ancho: el problema es el alto disponible,
              y un celular ancho pero corto sufre lo mismo. */}
          <div className="mt-[clamp(20px,4vh,44px)] flex flex-col items-stretch gap-4 [@media(max-height:740px)]:flex-row [@media(max-height:740px)]:items-center [@media(max-height:740px)]:gap-3 sm:flex-row sm:items-center sm:gap-6">
            <a
              href={`https://wa.me/${NEGOCIO.telefono.replace(/\D/g, '')}`}
              className="inline-flex items-center justify-center gap-4 whitespace-nowrap rounded-xl bg-primary px-[clamp(28px,4vw,40px)] py-[clamp(16px,2.2vh,20px)] font-display text-base uppercase tracking-[0.06em] text-primary-foreground transition-[background-color,color,transform] hover:-translate-y-0.5 hover:bg-highlight hover:text-highlight-foreground active:scale-[.97]"
            >
              {cta.primario} <span className="font-body text-lg font-extrabold">→</span>
            </a>

            <a
              href={`#${SECCIONES.carta}`}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-xl border-2 border-primary px-[clamp(26px,4vw,38px)] py-[clamp(16px,2.2vh,20px)] font-display text-base uppercase tracking-[0.06em] text-foreground transition-[background-color,transform] hover:bg-primary active:scale-[.97]"
            >
              {cta.secundario}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
