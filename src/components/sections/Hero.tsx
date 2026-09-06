import Image from 'next/image'
import { heroContent } from '@/content/home'
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
 *   los dos lados lo duplicaba— y en su lugar el título y los CTAs SUBEN.
 *   También se borraron la mascota del diablito y el esqueleto que se apoyaba
 *   sobre la burger (2026-09-03), así que el hero no tiene más ilustraciones
 *   sueltas: fondo, llamas, burger y texto.
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
 * resolvió apilando: el texto arriba, la burger abajo y los CTAs uno sobre
 * otro. De `lg` para arriba es el diseño tal cual lo entregaron.
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
        {/* LA BURGER.

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
            El wrapper es una caja real y no `display: contents` (lleva las
            clases que antes tenía la imagen, así el layout es el mismo). Se
            hizo así para el esqueleto, que necesitaba contra qué posicionarse;
            el esqueleto se borró el 2026-09-03 pero la caja se deja, porque
            es a lo que se ancla cualquier cosa que se apoye sobre la burger.

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
        </div>

        {/* MÓVIL: `order-1` + `shrink-0` — el texto va ARRIBA de la burger y no
            se comprime; si falta alto, lo que cede es la burger.
            DESKTOP: los tres se anulan (`lg:order-none lg:shrink`) para dejar
            exactamente el layout original — el texto pegado a la izquierda con
            `max-w-[62%]`, la burger absoluta sangrando por la derecha. */}
        {/* `--titulo` es el tamaño del h1, sacado a variable para que la fila de
            CTAs pueda medirse contra él (ver más abajo). Si se cambia el tamaño
            del título, se cambia acá y los botones acompañan solos. */}
        {/* REPARTO VERTICAL DEL HERO — **SOLO MÓVIL** (2026-09-06, pedido del
            cliente: "el texto más grande, FOOD más grande que las demás, más
            margen con el banner y el nav, y los botones más abajo, cerca de
            la burga"). Se probó primero en escritorio y el cliente lo pidió
            de vuelta: **ahí queda todo como estaba** (`lg:` sin tocar).

            En móvil la columna pasa a ser FLEX de alto completo (`flex h-full
            flex-col`) y los CTAs llevan `mt-auto`: así el aire sobrante se
            junta ENTRE el título y los botones en vez de repartirse, que es lo
            que los baja hacia la burger sin un margen fijo que habría que
            recalcular en cada pantalla. En `lg` se anula (`lg:block`).

            * AIRE DE ARRIBA: `pt-5` → `pt-14`. Antes el h1 arrancaba pegado a
              la barra promo (medido: 107px los dos).
            * TAMAÑO: `min(8.5vh,12.2vw)` → `min(10.5vh,15vw)`, tope 110→130px.
              Se pudo porque el copy pasó de cuatro líneas a tres.
            * `--destacado` es el tamaño de "FOOD", 1.28× el resto (ver el h1).
              Se declara en las dos pantallas: en escritorio también se pidió
              que FOOD fuera más grande.

            El `pb-4` se mantiene: la burger va debajo en el flujo y este
            bloque no debe pegarse a ella. */}
        <div className="relative z-[3] order-1 flex h-full max-w-full shrink-0 flex-col px-5 pb-4 pt-14 [--destacado:calc(var(--titulo)*1.28)] [--titulo:clamp(38px,min(10.5vh,15vw),130px)] sm:px-8 lg:order-none lg:block lg:h-auto lg:max-w-[62%] lg:shrink lg:px-14 lg:pt-[6vh] lg:[--titulo:clamp(38px,min(17vh,14vw),200px)]">
          {/* El tamaño se limita por ALTURA y por ANCHO a la vez, con un
              `min()`: el `vh` solo mide alto, y en un celular angosto un
              tamaño atado solo a la altura sacaba la palabra más larga fuera
              de la pantalla (pasaba con el copy viejo, "HAMBURGUESAS").
              Con "BEST BAD FOOD" la restricción que manda es la ALTURA en las
              dos pantallas —son tres líneas más los dos CTAs—; el `vw` quedó
              como red de seguridad para pantallas muy angostas. */}
          <h1 className="font-display text-[length:var(--titulo)] uppercase leading-none tracking-[0.005em] text-foreground">
            <span className="block">{titulo.linea1}</span>
            {/* La segunda línea puede venir partida en dos palabras: en móvil
                se apilan para que la tipografía pueda crecer —el límite del
                tamaño lo pone la línea más larga— y en `lg` vuelven a la misma
                línea (`lg:inline`), como el diseño.
                Con el copy actual ("BEST BAD FOOD") `linea2b` viene VACÍO, así
                que el segundo `<span>` y su espacio se omiten: si se dibujaran
                igual quedaría un espacio colgando al final de la línea. */}
            <span className="block">
              <span className="block lg:inline">{titulo.linea2a}</span>
              {titulo.linea2b ? (
                <>
                  {' '}
                  <span className="block lg:inline">{titulo.linea2b}</span>
                </>
              ) : null}
            </span>
            {/* "FOOD" VA MÁS GRANDE QUE LAS OTRAS DOS (2026-09-06, pedido del
                cliente). Su tamaño es `--destacado` = 1.28× `--titulo`, así
                sigue atado al mismo valor: si cambia el título, la proporción
                se mantiene sola.
                Lleva `leading-[0.9]` propio porque `leading-none` sobre un
                cuerpo más grande abre un escalón visible respecto de las dos
                líneas de arriba — con 0.9 las tres quedan con el mismo ritmo.
                A lo ancho no molesta: aun a 1.28× sobran 557px en 1440 hasta
                donde arranca el dibujo de la burger (medido). */}
            <span className="block text-[length:var(--destacado)] leading-[0.9] text-primary">
              {titulo.destacado}
            </span>
          </h1>

          {/* MÓVIL: los dos CTAs SIEMPRE apilados y a lo ancho (2026-08-21). */}
          {/* DESKTOP: la fila mide EXACTAMENTE lo que la LÍNEA MÁS LARGA del
              h1, así los botones arrancan y terminan donde ella. El ancho sale
              de medir la fuente contando el tracking de 0.005em, así que la
              fila es el tamaño del título por ese factor. Los dos botones se
              reparten ese ancho en partes iguales con `flex-1 basis-0` — no
              importa que las etiquetas midan distinto, quedan del mismo tamaño
              y crecen juntos.

              Con "BEST BAD FOOD" el factor es 2.4461 y la línea más ancha es
              "FOOD": mide 1.911em de glifos, pero se dibuja a `--destacado`,
              o sea 1.28× el título → 1.911 × 1.28 = 2.4461 del `--titulo`.
              **Ojo, cambió dos veces el mismo día (2026-09-06)**: con las tres
              palabras al mismo cuerpo la más ancha era "BEST" (2.026em) y el
              factor era ése; al agrandar el destacado pasó a ganar "FOOD".
              **Si cambia una línea del h1, el tracking o el 1.28, volver a
              medir cuál es la más ancha y rehacer esta cuenta.**
              `items-stretch` iguala también el ALTO: el botón primario lleva una
              flecha en `text-lg` que si no lo dejaba 4px más alto que el otro.

              `mt-auto` EMPUJA LOS BOTONES ABAJO, **SOLO EN MÓVIL** (2026-09-06,
              pedido del cliente): la columna es flex de alto completo, así que
              el margen automático se come todo el sobrante y los deja cerca de
              la burger. **En `lg` se anula** con `lg:mt-[clamp(...)]`: en
              escritorio el cliente pidió dejar el reparto como estaba, y
              además ahí los CTAs empujados al fondo se metían DENTRO del
              zócalo de llamas (medido: 44px adentro en 1440).

              TIPOGRAFÍA DE LOS CTAs (2026-08-21): también atada a `--titulo`
              (×0.175), no un tamaño fijo. Con el ancho ya fijado por la fila,
              un `text-base` suelto no podía crecer.
              **El límite lo pone la etiqueta más larga**, hoy "LAS BURGERS"
              (5.78em con su tracking de 0.06em; antes decía "LAS BURGUERS" y
              medía 6.34). Al acortarse sobra margen, así que el 0.175 se deja
              como está: **si se alarga esa etiqueta, hay que bajarlo.** */}
          <div className="mt-auto flex flex-col items-stretch gap-3 pt-[clamp(28px,7vh,72px)] sm:gap-4 lg:mt-[clamp(20px,4vh,44px)] lg:w-[calc(var(--titulo)*2.4461)] lg:flex-row lg:gap-6 lg:pt-0">
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
