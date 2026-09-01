import Image from 'next/image'
import { heroContent } from '@/content/home'
import { LINK_PEDIDOS, NEGOCIO, SECCIONES } from '@/lib/constants'
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
 * En móvil es `min-h` y no `h` (2026-09-01): la burger ahora tiene tamaño
 * FIJO (ver su comentario), así que si una pantalla es muy corta el hero
 * crece unos píxeles y se scrollea, en vez de achicar la burger. En `lg`
 * sigue siendo una pantalla exacta.
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
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-background lg:h-[100svh]"
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

      <NavHero />
      <BarraPromo />

      {/* Zona central: se come todo el alto que sobra. `min-h-0` es necesario
          para que un hijo con overflow no estire el flex por encima del alto
          del hero. */}
      {/* El `pb` de móvil reserva el alto exacto del zócalo de fuego (la misma
          expresión que su `h-`), así la burger apoya justo encima de las llamas
          en vez de pisarlas. En `lg` no hace falta: ahí la burger es absoluta y
          su posición ya se calculó contra el fuego. */}
      {/* MÓVIL: ya NO reserva el alto del fuego. La burger ahora se hunde a
          propósito dentro de las llamas (2026-08-21), así que la zona llega
          hasta el pie y la burger baja hasta meterse en la banda. */}
      <div className="relative flex min-h-0 flex-1 flex-col justify-center lg:flex-row lg:items-center lg:justify-start lg:pb-[12svh]">
        {/* La burger sangra fuera de la pantalla por la derecha.

            MÓVIL — NO VA DETRÁS DEL TEXTO (2026-08-21): estaba en `absolute` al
            120% de ancho y `opacity-25` justo detrás del h1, ocupando el 40-51%
            del alto de la zona. Sumado al lettering del fondo, eran tres capas
            peleando el mismo espacio y se leía todo encimado.
            Ahora en móvil es un hijo más del flex, DEBAJO del texto.
            De `lg` para arriba vuelve a ser absoluta y sangra por la derecha,
            como el diseño.

            MÓVIL — TAMAÑO FIJO POR ANCHO (2026-09-01, pedido del cliente):
            era `flex-1` + `object-contain`, o sea que la burger medía "el
            alto que sobraba" — y eso DEPENDÍA DEL NAVEGADOR: el Chrome de
            Android deja mucho alto libre y se veía grande, pero el Safari
            del iPhone (más barra de UI, menos viewport) le dejaba menos y la
            misma página la mostraba mucho más chica. Ahora es `w-[82%]` con
            la altura de su propio ratio (`h-auto`): el ancho de pantalla es
            igual en todos los navegadores, así que la burger mide SIEMPRE lo
            mismo. `mt-auto` la manda al pie, hundida en las llamas como
            estaba (el zócalo en `z-[5]` le tapa la base).
            **El 82% no es a ojo**: es el tamaño al que Chrome —donde el
            cliente la veía bien— la mostraba en 390x844, y el que hace que
            el hero cierre en 844px EXACTOS (con 112% desbordaba 81px hasta
            ahí; medido). En Safari, cuya UI deja ~660px, el hero crece
            ~130px y se scrollea, en vez de achicar la burger a los 92px de
            alto que le quedaban antes: ese es el trato que pidió el cliente,
            tamaño constante > pantalla exacta.
            (El intento de 2026-08-21 con `flex-none mt-auto` "rompía" porque
            la sección era `h-` fijo y la columna desbordaba por encima del
            nav; con `min-h` el desborde se vuelve unos px de scroll.)

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
        {/* CONTENEDOR COMÚN de la burger y la mascota (2026-08-21).
            Antes el diablillo estaba anclado al viewport (`right-%`) y había que
            recalcularlo a mano cada vez que cambiaba el tamaño de la burger —
            el comentario de abajo ya lo señalaba como deuda. Ahora la mascota
            vive DENTRO de la caja de la burger, así que la sigue sola.

            En móvil el wrapper es `display: contents`: no genera caja, así que
            la burger sigue siendo hija directa del flex y la mascota se sigue
            posicionando contra la zona central, exactamente como antes. De `lg`
            para arriba el wrapper toma la posición que tenía la burger. */}
        <div className="contents lg:absolute lg:right-[-8%] lg:top-1/2 lg:z-[2] lg:block lg:w-[50%] lg:min-w-[460px] lg:max-w-[900px] lg:-translate-y-[calc(50%+6vh)]">
          <Image
            src={imagen.src}
            alt=""
            width={1600}
            height={1108}
            priority
            sizes="(min-width: 1024px) 50vw, 82vw"
            className="pointer-events-none relative z-[4] order-2 mt-auto h-auto w-[82%] max-w-none shrink-0 self-center drop-shadow-[-16px_16px_30px_rgba(0,0,0,.55)] lg:z-auto lg:order-none lg:mx-0 lg:mt-0 lg:w-full lg:drop-shadow-[-24px_24px_44px_rgba(0,0,0,.55)]"
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

            EN LA ESQUINA SUPERIOR IZQUIERDA DE LA BURGER (2026-08-21, pedido
            del cliente): ahora está DENTRO del contenedor de la burger, así que
            se mueve con ella y ya no hay que recalcular nada si cambia de
            tamaño. Eso resuelve la deuda que este comentario venía arrastrando.

            El `18%/14%` NO es la esquina de la caja: la esquina de la imagen
            está vacía —la burger es redondeada— y ahí la mascota quedaría
            flotando en el aire. Medido sobre la Satanás recortada
            (2026-09-01): el filo superior izquierdo del pan pasa por
            (16%, 17%) y (18%, 14%). Centrando el sticker ahí con
            `-translate-1/2` queda montado sobre el filo del pan: mitad
            encima, mitad afuera. **Si cambia la imagen, re-medir.** */}
          <DiabloHero className="pointer-events-none hidden lg:absolute lg:left-[18%] lg:top-[14%] lg:z-[3] lg:block lg:w-[clamp(88px,8.5vw,132px)] lg:-translate-x-1/2 lg:-translate-y-1/2 lg:-rotate-4 lg:drop-shadow-[0_12px_22px_rgba(0,0,0,.5)]" />
        </div>

        {/* MÓVIL: `order-1` + `shrink-0` — el texto va ARRIBA de la burger y no
            se comprime; si falta alto, lo que cede es la burger (que lleva
            `flex-1` y `min-h-0`), nunca el h1 ni los CTAs.
            DESKTOP: los tres se anulan (`lg:order-none lg:shrink`) para dejar
            exactamente el layout original — el texto pegado a la izquierda con
            `max-w-[62%]`, la burger absoluta sangrando por la derecha. */}
        {/* `--titulo` es el tamaño del h1, sacado a variable para que la fila de
            CTAs pueda medirse contra él (ver más abajo). Si se cambia el tamaño
            del título, se cambia acá y los botones acompañan solos. */}
        <div className="relative z-[3] order-1 max-w-full shrink-0 px-5 pb-4 [--titulo:clamp(38px,min(8.5vh,12.2vw),110px)] sm:px-8 lg:order-none lg:max-w-[62%] lg:shrink lg:px-14 lg:[--titulo:clamp(38px,min(13vh,9.2vw),150px)]">
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

          {/* MÓVIL: los dos CTAs SIEMPRE apilados y a lo ancho (2026-08-21).
              El primario estira toda la columna; el secundario también, salvo
              el hueco que le cede al diablillo a su derecha (ver el wrapper).
              La variante de pantallas bajas (lado a lado con max-height:740px)
              se eliminó: con el diablillo sumado DESBORDABA — medido, 370px de
              contenido en los 335px de columna de un iPhone SE — y su razón de
              ser (ahorrarle alto a la burger) ya no corre: la burger es flex-1
              y absorbe sola el alto que haya. */}
          {/* DESKTOP: la fila mide EXACTAMENTE lo que la palabra "INFIERNO" del
              h1, así los botones arrancan y terminan donde ella. El ancho sale
              de medir la fuente: en Anton "INFIERNO" ocupa 3.2627em contando el
              tracking de 0.005em, así que la fila es el tamaño del título por
              ese factor. Los dos botones se reparten ese ancho en partes
              iguales con `flex-1 basis-0` — no importa que las etiquetas midan
              distinto, quedan del mismo tamaño y crecen juntos.
              **Si cambia el texto del destacado o el tracking del h1, hay que
              recalcular el 3.2627.**
              `items-stretch` iguala también el ALTO: el botón primario lleva una
              flecha en `text-lg` que si no lo dejaba 4px más alto que el otro.

              TIPOGRAFÍA DE LOS CTAs (2026-08-21): también atada a `--titulo`
              (×0.175), no un tamaño fijo. Con el ancho ya fijado por la fila,
              un `text-base` suelto no podía crecer: medido, el techo era 17.3px
              en 1280x720 antes de que "LAS BURGUERS" se desbordara. Escalando
              con el título el texto crece donde hay lugar (24.6px en 1920, +54%)
              y se achica solo donde no lo hay. El padding bajó a `px-3` para dar
              ese margen. Verificado que entra de 1024x600 a 2560x1440.
              **El límite lo pone "LAS BURGUERS" (6.0354em): si se alarga esa
              etiqueta, baja el 0.175.**

              MÓVIL: sin restricción de ancho. Medido, la fila de "INFIERNO" ahí
              son 143-165px y "LAS BURGUERS" necesita 97px de texto más el
              padding: no entra, y en pantallas bajas (donde van lado a lado)
              quedarían en 66px cada uno. Siguen ocupando el ancho de la columna,
              como estaban. */}
          <div className="mt-[clamp(20px,4vh,44px)] flex flex-col items-stretch gap-3 sm:gap-4 lg:w-[calc(var(--titulo)*3.2627)] lg:flex-row lg:gap-6">
            <a
              href={LINK_PEDIDOS}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-4 whitespace-nowrap rounded-xl bg-primary px-[clamp(28px,4vw,40px)] py-[clamp(16px,2.2vh,20px)] lg:flex-1 lg:basis-0 lg:px-3 font-display text-base uppercase tracking-[0.06em] text-primary-foreground lg:text-[length:clamp(14px,calc(var(--titulo)*0.175),30px)] transition-[background-color,color,transform] hover:-translate-y-0.5 hover:bg-highlight hover:text-highlight-foreground active:scale-[.97]"
            >
              {cta.primario} <span className="font-body text-lg font-extrabold lg:text-[length:clamp(16px,calc(var(--titulo)*0.2),34px)]">→</span>
            </a>

            {/* MÓVIL: la fila del secundario ocupa el ancho completo de la
                columna, igual que el primario — el botón se estira (`flex-1`) y
                solo cede a su derecha el hueco del diablillo (2026-08-21,
                pedido del cliente). En `lg` el wrapper desaparece (`contents`) y
                el botón vuelve a repartir la fila con el primario. */}
            <div className="flex items-center gap-3 lg:contents">
              <a
                href={`#${SECCIONES.carta}`}
                className="inline-flex flex-1 items-center justify-center whitespace-nowrap rounded-xl border-2 border-primary px-[clamp(26px,4vw,38px)] py-[clamp(16px,2.2vh,20px)] lg:basis-0 lg:px-3 font-display text-base uppercase tracking-[0.06em] text-foreground lg:text-[length:clamp(14px,calc(var(--titulo)*0.175),30px)] transition-[background-color,transform] hover:bg-primary active:scale-[.97]"
              >
                {cta.secundario}
              </a>

              {/* La mascota, al lado del botón y apenas elevada sobre él
                  (`-translate-y-2`, pedido del cliente). Solo móvil: en `lg`
                  vive dentro del contenedor de la burger y acá se oculta. */}
              <DiabloHero className="pointer-events-none w-[clamp(52px,15vw,76px)] shrink-0 -translate-y-2 -rotate-4 drop-shadow-[0_10px_18px_rgba(0,0,0,.55)] lg:hidden" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
