import Image from 'next/image'
import { esqueletoContent, heroContent } from '@/content/home'
import { LINK_PEDIDOS, SECCIONES } from '@/lib/constants'
import { BarraPromo } from '@/components/ui/BarraPromo'

/**
 * Hero — Server Component. Ocupa exactamente una pantalla, sin scroll.
 *
 * Implementa el handoff de diseño "Hero HELLS v3" (2026-08-20), con dos
 * cambios grandes del 2026-09-02 pedidos por el cliente:
 * * EL NAV SE FUE A `page.tsx` y es sticky (ver `NavHero`). Acá se compensa
 *   restando `--nav` de la altura, así la primera pantalla sigue midiendo
 *   exactamente lo mismo que cuando el nav estaba adentro.
 * * SE FUE EL LOGO de la columna de texto —ahora vive en el nav, tenerlo en
 *   los dos lados lo duplicaba— y en su lugar el título y los CTAs SUBEN. Ese
 *   hueco es justo lo que necesitaba el esqueleto para apoyarse sobre la
 *   burger. También se borró la mascota del diablito.
 *
 * ALTURA: `100svh` y no `100vh`. En los navegadores móviles `vh` incluye la
 * barra de direcciones, así que un hero de `100vh` queda cortado por abajo
 * justo donde van los CTAs. `svh` mide el viewport chico —el que queda con la
 * barra visible— y entra siempre.
 * En móvil es `min-h` y no `h` (2026-09-01): la burger tiene tamaño FIJO (ver
 * su comentario), así que si una pantalla es muy corta el hero crece unos
 * píxeles y se scrollea, en vez de achicar la burger. En `lg` sigue siendo
 * una pantalla exacta.
 *
 * MÓVIL: el diseño original está definido solo para desktop (1440x900) y ahí
 * no entra —la columna de texto ocupa 62% y la burger 54%, se pisarían—. Se
 * resolvió apilando: el texto arriba, la burger abajo con el esqueleto
 * encima, y los CTAs uno sobre otro. De `lg` para arriba es el diseño tal
 * cual lo entregaron.
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
      className="relative isolate flex min-h-[calc(100svh-var(--nav))] flex-col overflow-hidden bg-background lg:h-[calc(100svh-var(--nav))]"
    >
      {/* Fondo ilustrado: trae las palabras de marca. Va `aria-hidden` porque
          es decoración: el texto que importa está en el h1.

          SOLO DESKTOP. En móvil no sirve: es 16:9 y el hero de un celular es
          mucho más alto, así que `object-cover` la escala por ALTURA y solo
          entra un 25-32% del ancho — las palabras quedan tan grandes que se ven
          como manchas y no se lee ninguna. Ahí va la capa en mosaico de abajo.
          `object-bottom`: el zócalo de fuego tiene que quedar pegado al pie.

          SIN EL ZÓCALO DE FUEGO (2026-08-27): `fondo-fuegitos.webp` traía las
          llamas HORNEADAS en su 9.8% inferior. Al cambiar el dibujo de llamas
          por el nuevo (`zocalo-llamas.webp`) ese fuego viejo habría quedado
          por debajo, duplicado. `fondo-sin-fuego.webp` es la misma imagen
          recortada justo donde arrancaba el fuego, así que ahora las llamas
          las pone UNA sola capa —la de abajo— en móvil y en desktop.
          El borde inferior del recorte quedó en #1a1a1a exacto (muestreado),
          o sea el mismo `--background`: empalma sin costura con la banda.

          `unoptimized`: ya está servida en WebP a su tamaño final (2560px,
          10KB), así que volver a pasarla por el optimizador de Next solo
          agregaría latencia. */}
      <Image
        src="/fondo-sin-fuego.webp"
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

      {/* LA FRANJA DE LLAMAS al pie, a todo el ancho.

          DIBUJO NUEVO (2026-08-27, aportado por el cliente): `llamasnegras.png`
          reemplaza al recorte del fondo ilustrado. Son picos NEGROS con el
          contorno rojo, y ahora se usan en móvil Y en desktop — antes el
          desktop tenía su fuego horneado dentro del fondo (ver arriba).

          EN MOSAICO (`repeat-x` + `background-size: auto 100%`) y no estirada:
          así el dibujo conserva su forma en cualquier ancho. El patrón EMPALMA
          consigo mismo —verificado: los dos extremos caen en el valle, con 1px
          de diferencia sobre 422— que es justo lo que el zócalo anterior no
          podía hacer (sus bordes diferían 46px, por eso iba estirado).
          Es `background-image` y no `<Image>` porque `next/image` no repite
          patrones.

          Va por ALTURA y no por ancho: el dibujo tiene ratio 6:1, así que a
          ancho completo de una pantalla quedaría en una franja finita. Al
          fijar el alto, el mosaico repite las copias que hagan falta.
          El alto de móvil (`max(52px,11svh)`, tope 96px) es el mismo que tenía
          la banda anterior: está calculado para que la burger se hunda un
          cuarto en las llamas. **Si se cambia, rehacer esa cuenta.**
          En desktop toma el 10% del alto, que es lo que ocupaba el fuego
          horneado del fondo (medido: 9.8%).

          `z-[5]` en móvil: tiene que quedar por ENCIMA de la burger (`z-[4]`)
          para taparle la base. En desktop vuelve a ser fondo (`lg:-z-10`): ahí
          la burger va por delante del fuego, como en el diseño original. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-[max(52px,11svh)] max-h-[96px] select-none bg-[url('/zocalo-llamas.webp')] bg-[length:auto_100%] bg-bottom bg-repeat-x lg:-z-10 lg:h-[10svh] lg:max-h-[110px]"
      />

      <BarraPromo />

      {/* Zona central: se come todo el alto que sobra. `min-h-0` es necesario
          para que un hijo con overflow no estire el flex por encima del alto
          del hero. */}
      {/* MÓVIL: no reserva el alto del fuego. La burger se hunde a propósito
          dentro de las llamas (2026-08-21), así que la zona llega hasta el pie
          y la burger baja hasta meterse en la banda. */}
      <div className="relative flex min-h-0 flex-1 flex-col justify-center lg:flex-row lg:items-center lg:justify-start lg:pb-[12svh]">
        {/* LA BURGER Y EL ESQUELETO. El wrapper es la caja de referencia de los
            dos: el esqueleto se posiciona contra ella, así que si la burger
            cambia de tamaño o de lugar, el esqueleto la sigue solo.

            MÓVIL — TAMAÑO FIJO POR ANCHO (2026-09-01, pedido del cliente):
            antes la burger medía "el alto que sobraba" (`flex-1` +
            `object-contain`) y eso DEPENDÍA DEL NAVEGADOR: el Chrome de
            Android deja mucho alto libre y se veía grande, pero el Safari del
            iPhone (más barra de UI, menos viewport) le dejaba menos y la misma
            página la mostraba mucho más chica. Ahora es `w-[82%]` con la altura
            de su propio ratio: el ancho de pantalla es igual en todos los
            navegadores, así que la burger mide SIEMPRE lo mismo.
            **El 82% no es a ojo**: es el tamaño al que Chrome —donde el cliente
            la veía bien— la mostraba en 390x844, y el que hace que el hero
            cierre en 844px EXACTOS (con 112% desbordaba 81px hasta ahí).
            `mt-auto` la manda al pie, hundida en las llamas (el zócalo, en
            `z-[5]` sobre esta capa en `z-[4]`, le tapa la base).
            El wrapper dejó de ser `display: contents` en móvil (2026-09-02):
            ahora es una caja real, que es lo que le da al esqueleto contra qué
            posicionarse. Lleva las clases que antes tenía la imagen, así el
            layout no cambia.

            DESKTOP: absoluta, sangrando por la derecha, como el diseño.
            NO TAPAR EL FUEGO (2026-08-21): el zócalo ocupa el 9.7% de abajo,
            así que la burger tiene que terminar antes. Tres ajustes, en orden
            de cuánto aportan:
            * **la sombra era el problema real**, no el tamaño: bajaba 40px y se
              difuminaba 60, o sea llegaba ~100px más abajo del dibujo y
              ensuciaba las llamas. Ahora baja 24 con blur 44 (~68px).
            * el centro se sube un 6% del alto (`-translate-y-[calc(50%+6vh)]`).
            * el ancho baja de 54% a 50%, el mínimo que pidió el cliente.
            **Si se agranda la burger o su sombra, rehacer esta cuenta.** */}
        <div className="relative z-[4] order-2 mt-auto w-[82%] shrink-0 self-center lg:absolute lg:right-[-8%] lg:top-1/2 lg:z-[2] lg:order-none lg:mt-0 lg:w-[50%] lg:min-w-[460px] lg:max-w-[900px] lg:-translate-y-[calc(50%+6vh)] lg:self-auto">
          <Image
            src={imagen.src}
            alt=""
            width={1600}
            height={1108}
            priority
            sizes="(min-width: 1024px) 50vw, 82vw"
            className="pointer-events-none h-auto w-full drop-shadow-[-16px_16px_30px_rgba(0,0,0,.55)] lg:drop-shadow-[-24px_24px_44px_rgba(0,0,0,.55)]"
          />

          {/* EL ESQUELETO, apoyado sobre la burger (2026-09-02, dibujo del
              cliente). Reemplaza a la mascota del diablito, que se borró.

              Se posiciona contra la CAJA DE LA BURGER, no contra el viewport:
              el `bottom` en % lo deja siempre a la misma altura relativa del
              pan, y el `w` en % lo mantiene en proporción. Así no hay ningún
              número que recalcular si la burger cambia de tamaño — que es
              justo la deuda que arrastraba el diablito.

              El `bottom` lo deja con los brazos cruzados sobre el pan y el
              cuerpo saliendo por arriba de la caja. Es MÁS CHICO EN DESKTOP en
              proporción: ahí la burger mide 720px y a la misma escala que en
              móvil el esqueleto se saldría del hero por arriba (medido).

              `z-[6]`: por encima de la burger y también del zócalo de llamas
              (`z-[5]`), que si no le comería los pies en pantallas bajas. */}
          <Image
            src={esqueletoContent.src}
            alt=""
            aria-hidden
            width={esqueletoContent.ancho}
            height={esqueletoContent.alto}
            priority
            sizes="(min-width: 1024px) 18vw, 42vw"
            className="pointer-events-none absolute bottom-[72%] left-1/2 z-[6] h-auto w-[52%] -translate-x-1/2 select-none drop-shadow-[0_14px_26px_rgba(0,0,0,.55)] lg:bottom-[62%] lg:w-[36%]"
          />
        </div>

        {/* MÓVIL: `order-1` + `shrink-0` — el texto va ARRIBA de la burger y no
            se comprime; si falta alto, lo que cede es la burger.
            DESKTOP: los tres se anulan (`lg:order-none lg:shrink`) para dejar
            exactamente el layout original — el texto pegado a la izquierda con
            `max-w-[62%]`, la burger absoluta sangrando por la derecha. */}
        {/* `--titulo` es el tamaño del h1, sacado a variable para que la fila de
            CTAs pueda medirse contra él (ver más abajo). Si se cambia el tamaño
            del título, se cambia acá y los botones acompañan solos. */}
        {/* El `pt-5` de móvil es el aire que antes daba el logo: sin él el h1
            arrancaba EXACTAMENTE donde termina la barra promo (medido, 107px
            los dos) y se leía pegado. No agranda el hero — se lo come el hueco
            libre que queda por encima de la burger, que va con `mt-auto`. */}
        <div className="relative z-[3] order-1 max-w-full shrink-0 px-5 pb-4 pt-5 [--titulo:clamp(38px,min(8.5vh,12.2vw),110px)] sm:px-8 lg:order-none lg:max-w-[62%] lg:shrink lg:px-14 lg:pt-0 lg:[--titulo:clamp(38px,min(13vh,9.2vw),150px)]">
          {/* El tamaño se limita por ALTURA y por ANCHO a la vez.
              El `9vh` solo mide alto, y en un celular alto y angosto (390x844)
              daba 76px: "HAMBURGUESAS", que es la palabra más larga, se salía
              de la pantalla. El `min()` lo ata a las DOS restricciones: `12.2vw`
              para que la línea más larga entre a lo ancho, y `8.5vh` para que
              las cuatro líneas no se coman el alto de la burger.
              En desktop no cambia nada: ahí manda el `13vh` y el tope. */}
          <h1 className="font-display text-[length:var(--titulo)] uppercase leading-none tracking-[0.005em] text-foreground">
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

          {/* MÓVIL: los dos CTAs SIEMPRE apilados y a lo ancho (2026-08-21). */}
          {/* DESKTOP: la fila mide EXACTAMENTE lo que la palabra "INFIERNO" del
              h1, así los botones arrancan y terminan donde ella. El ancho sale
              de medir la fuente: "INFIERNO" ocupa 3.2627em contando el tracking
              de 0.005em, así que la fila es el tamaño del título por ese
              factor. Los dos botones se reparten ese ancho en partes iguales
              con `flex-1 basis-0` — no importa que las etiquetas midan
              distinto, quedan del mismo tamaño y crecen juntos.
              **Si cambia el texto del destacado o el tracking del h1, hay que
              recalcular el 3.2627.**
              `items-stretch` iguala también el ALTO: el botón primario lleva una
              flecha en `text-lg` que si no lo dejaba 4px más alto que el otro.

              TIPOGRAFÍA DE LOS CTAs (2026-08-21): también atada a `--titulo`
              (×0.175), no un tamaño fijo. Con el ancho ya fijado por la fila,
              un `text-base` suelto no podía crecer: medido, el techo era 17.3px
              en 1280x720 antes de que "LAS BURGUERS" se desbordara.
              **El límite lo pone "LAS BURGUERS" (6.0354em): si se alarga esa
              etiqueta, baja el 0.175.** */}
          <div className="mt-[clamp(20px,4vh,44px)] flex flex-col items-stretch gap-3 sm:gap-4 lg:w-[calc(var(--titulo)*3.2627)] lg:flex-row lg:gap-6">
            <a
              href={LINK_PEDIDOS}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-4 whitespace-nowrap rounded-xl bg-primary px-[clamp(28px,4vw,40px)] py-[clamp(16px,2.2vh,20px)] lg:flex-1 lg:basis-0 lg:px-3 font-display text-base uppercase tracking-[0.06em] text-primary-foreground lg:text-[length:clamp(14px,calc(var(--titulo)*0.175),30px)] transition-[background-color,color,transform] hover:-translate-y-0.5 hover:bg-highlight hover:text-highlight-foreground active:scale-[.97]"
            >
              {cta.primario}{' '}
              <span className="font-body text-lg font-extrabold lg:text-[length:clamp(16px,calc(var(--titulo)*0.2),34px)]">
                →
              </span>
            </a>

            <a
              href={`#${SECCIONES.carta}`}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-xl border-2 border-primary px-[clamp(26px,4vw,38px)] py-[clamp(16px,2.2vh,20px)] lg:flex-1 lg:basis-0 lg:px-3 font-display text-base uppercase tracking-[0.06em] text-foreground lg:text-[length:clamp(14px,calc(var(--titulo)*0.175),30px)] transition-[background-color,transform] hover:bg-primary active:scale-[.97]"
            >
              {cta.secundario}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
