import Image from 'next/image'
import { acompanamientosContent } from '@/content/acompanamientos'
import { SECCIONES } from '@/lib/constants'

/**
 * Acompañamientos (2026-09-07, pedido del cliente): entre la carta y Reseñas.
 * Papas, nuggets y aros de cebolla, cada uno tirado hacia un costado de la
 * pantalla —derecha, izquierda, derecha— y del costado libre una LÍNEA ROJA
 * que sale del plato, dobla hacia arriba y termina en el nombre.
 *
 * EL DISEÑO ES EL DE MÓVIL y en escritorio es el mismo zigzag a escala (el
 * cliente lo pensó para el celular y pidió "hacé el de PC igual"): no hay
 * una fila de tres ni una grilla, cambian solo los tamaños.
 *
 * LA FLECHA ES CURVA (2026-09-07, 2º pedido del cliente: "que sean curvas,
 * como con movimiento, y donde apunta al subtítulo que se ponga la flecha").
 * Antes era un codo rígido hecho con dos bordes de un div. Ahora son DOS
 * PIEZAS dentro de la misma caja absoluta:
 * 1. **La curva**: un `<svg>` con `preserveAspectRatio="none"` que se estira
 *    a la caja. Una Bézier sigue siendo una Bézier bajo una escala afín, así
 *    que el trazo se adapta a cualquier proporción de plato sin dejar de ser
 *    una curva. Lo que sí se deformaría es el GROSOR —el estirado no es
 *    uniforme—, y eso lo resuelve `vector-effect="non-scaling-stroke"`: el
 *    trazo se mide en píxeles de pantalla, no en unidades del viewBox.
 * 2. **La punta**: un `<svg>` aparte, CUADRADO y de tamaño fijo, porque una
 *    punta metida en el primero saldría torcida al estirarse. Se ancla al
 *    mismo punto donde muere la curva expresado en PORCENTAJE de la caja
 *    (8%/8%), que es la misma unidad en la que el viewBox de la curva coloca
 *    su último punto — así los dos coinciden siempre, mida lo que mida la
 *    caja.
 * La caja va `absolute` en la fila de la imagen, de `top-0` a `bottom-1/2`:
 * así la cola de la flecha sale SIEMPRE de media altura del plato, sea cual
 * sea su proporción —las papas son 2:1 y los nuggets 1.4:1— sin medir nada.
 * El nombre va EN FLUJO, encima de la fila, ocupando la columna libre
 * (`100% - var(--imagen)`, más un 8% de holgura).
 *
 * ── LA PUNTA APUNTA AL CENTRO DEL SUBTÍTULO (2026-09-08, pedido del cliente:
 * "que apunten al medio del texto subtitulo, ya que apuntan mal") ──
 * Antes la punta caía en el BORDE del subtítulo (el arranque en los platos de
 * la derecha, el final en los de la izquierda), porque la caja de la flecha
 * empezaba en el borde de la columna.
 * **El texto pasó a ir CENTRADO en su columna, y ese cambio es lo que hace
 * posible el pedido**: con el texto pegado al costado, el centro del subtítulo
 * queda en `4% + anchoDelTexto/2` — depende de CUÁNTO mide el texto, y eso CSS
 * no lo puede apuntar. Centrado, el centro del subtítulo es exactamente el
 * centro de la columna, o sea `(100% - var(--imagen) + 8%) / 2`, que es un
 * número que la caja de la flecha sí puede tomar. **Queda exacto para
 * cualquier largo de subtítulo**, que era el punto.
 * Por eso la caja arranca ahí y no en el 4%: la punta va literalmente en su
 * borde (`left-0` / `left-full`), sin fracciones mágicas que recalcular.
 * **Con esto se fue el truco de `tituloCentrado`**: existía para centrar el
 * nombre sobre el subtítulo sin mover al subtítulo (un `inline-block` con el
 * h3 en `w-0 min-w-full`), y hacía falta justamente porque centrar el grupo
 * habría descolocado la flecha. Ahora la columna entera va centrada y el
 * nombre queda centrado sobre el subtítulo solo — sin truco, y de paso el
 * nombre dejó de estar acotado al ancho del subtítulo (en escritorio "PAPAS
 * HELLS" vuelve a entrar en una línea).
 * **La contra, asumida**: la flecha se acorta, porque su punta se corrió hacia
 * adentro. Es inevitable — apuntar al medio y no al borde ES tener menos
 * recorrido. Los puntos de control se rehicieron para que el trazo siga
 * leyéndose como una curva con envión y no como un gancho.
 *
 * TIPOGRAFÍAS (pedido del cliente): el nombre con la del hero
 * (`font-grafiti-italica`, la Splatink inclinada) y el subtítulo con la de
 * los ingredientes del tocadiscos (cuerpo, semibold, versalitas espaciadas).
 *
 * EL TÍTULO DE LA SECCIÓN ES "SIDES", EN BLANCO Y MÁS GRANDE (2026-09-08,
 * pedido del cliente). Tres cosas que van juntas:
 * * el texto vive en `content/acompanamientos.ts`; el ancla y el nombre del
 *   archivo siguen diciendo "acompanamientos" a propósito (son internos).
 * * **el cuerpo VOLVIÓ al de "Las Burgas" y "Nosotros"** (16vw/12vw/9vw).
 *   Estaba achicado a 11.5vw/9vw/7vw por una sola razón: "Acompañamientos"
 *   tiene 15 letras y al tamaño de las otras dos no entraba en una línea.
 *   "Sides" tiene 5, así que esa restricción desapareció y los tres títulos
 *   de sección vuelven a medir lo mismo.
 * * **en blanco y no en rojo**: es `--foreground`, 15.96:1 sobre este fondo,
 *   holgado. De paso deja el rojo de marca solo para los nombres de los
 *   platos y las flechas, que es lo que la sección quiere que se mire.
 *
 * MÁS AIRE ENTRE EL TÍTULO Y LOS PLATOS (2026-09-08, pedido del cliente):
 * el margen del header pasó de 32/48px a 64/96/112. Hacía falta más que
 * antes justamente porque el título creció: al mismo margen, un cuerpo de
 * 16vw se comía el hueco y el primer nombre quedaba pegado.
 *
 * LOS NOMBRES VAN EN ROJO (2026-09-07, pedido del cliente): eran blancos. Es
 * `--primary` sobre el fondo del hero — 3.79:1, que **solo alcanza para texto
 * grande**, y lo es: el mínimo del `clamp` son 24px, justo el piso de "texto
 * grande" de WCAG (24px normal / 18.66px negrita). Si alguna vez se achica
 * este título, vuelve a blanco. El subtítulo NO cambia: es texto chico y en
 * rojo no llegaría — la misma regla que la bajada de la carta.
 *
 * EL FONDO ES EL DEL HERO, pero en MOSAICO vertical: `fondo-movil.webp` en
 * el celular y `fondo-sin-fuego.webp` en escritorio, repetidos a ancho
 * completo. El hero los muestra con `object-cover` porque mide una pantalla
 * justa; esta sección es dos o tres veces más alta y con `cover` las
 * palabras se escalarían al doble. Repitiéndolos quedan al MISMO tamaño que
 * en el hero, que es lo que hace que se lea como "el mismo fondo".
 * Ninguno de los dos empalma consigo mismo —el de móvil arranca a mitad de
 * palabra y el de escritorio trae 17% de aire arriba—, pero el dibujo está
 * a 4–6 niveles del gris de fondo (medido) y la costura no se ve.
 * Es `background-image` y no `<Image>` porque `next/image` no repite.
 *
 * LAS DOS BANDAS DE LLAMAS YA NO SON EL MISMO DIBUJO (2026-09-08, pedido del
 * cliente: "al final cambiemos las llamas por estas"). Al pie va ahora
 * `zocalo-llamas-naranja.webp`, dibujo nuevo del cliente: relleno GRIS con
 * contorno NARANJA, contra el negro con filo rojo del hero que sigue arriba.
 * * **El gris es (25,25,25) y `--background` es (26,26,26)** — medido, 1/255.
 *   O sea que el relleno se funde con la sección igual que el negro se fundía
 *   en el hero, y lo que dibuja la silueta es el filo naranja. Es el mismo
 *   gesto, con otro color de filo.
 * * **Y ADEMÁS TAPA LA COSTURA QUE HABÍA CON RESEÑAS**: la banda anterior
 *   tenía la base NEGRA maciza y Reseñas es `--background`, así que al pie
 *   quedaba una línea horizontal de 26 niveles a todo el ancho (medida el
 *   2026-09-07 y anotada como pendiente). Con la base gris esa diferencia
 *   pasa a 1/255 y desaparece sola.
 * * Llega en un PNG de 6917x11135 donde el dibujo ocupa SOLO la franja
 *   inferior (984px): recortado a su contorno y llevado a 2560px de ancho da
 *   56KB. **Empalma consigo mismo**: los dos bordes caen en el valle con 1px
 *   de diferencia sobre 984 — la misma calidad que el zócalo del hero.
 * * Los picos ya vienen apuntando HACIA ARRIBA en el original, así que al pie
 *   va sin dar vuelta.
 *
 * ARRIBA SIGUEN LAS DEL HERO (2026-09-07, pedido del cliente), dadas vuelta y
 * son las QUE ESTABAN EN RESEÑAS: colgaban del techo de esa sección desde el
 * 2026-09-04 para llenar el hueco negro que había entre la carta y ella, y
 * al meterse «Acompañamientos» en el medio quedaban pegadas a las de acá,
 * formando una franja doble. Se movieron, no se duplicaron.
 * `-scale-y-100` y no `rotate-180`: el giro de 180° espejaría también en
 * horizontal y acá solo hay que darla vuelta de arriba a abajo. El mosaico
 * se arma ANTES de la transformación, así que sigue empalmando consigo
 * mismo. **Al verificarlo, `transform` devuelve `none`**: Tailwind v4 pone
 * la escala en la propiedad `scale`.
 * **La de arriba no deja costura con la carta**: la base del dibujo es 100%
 * opaca —negra maciza— y dada vuelta ese es el borde que toca el negro de
 * la carta, así que se funden.
 * Los dos paddings reutilizan `--llamas`, así que si cambia el alto de la
 * banda el aire acompaña solo y ni el título ni el último plato se meten
 * bajo los picos.
 */
export function Acompanamientos() {
  const { titulo, items } = acompanamientosContent

  return (
    <section
      id={SECCIONES.acompanamientos}
      className="relative isolate scroll-mt-[var(--nav)] overflow-hidden bg-background px-5 pb-[calc(var(--llamas)_+_48px)] pt-[calc(var(--llamas)_+_48px)] [--llamas:min(max(52px,11svh),96px)] sm:px-8 sm:pb-[calc(var(--llamas)_+_72px)] sm:pt-[calc(var(--llamas)_+_72px)] lg:px-14 lg:[--llamas:min(10svh,110px)]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 select-none bg-[url('/fondo-movil.webp')] bg-[length:100%_auto] bg-top bg-repeat-y lg:bg-[url('/fondo-sin-fuego.webp')]"
      />

      {/* Las llamas del hero DADAS VUELTA, colgando del techo: los picos
          apuntan hacia abajo y la base maciza queda arriba, fundiéndose con
          el negro de la carta. Ver el comentario de arriba. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[var(--llamas)] -scale-y-100 select-none bg-[url('/zocalo-llamas.webp')] bg-[length:auto_100%] bg-repeat-x"
      />

      {/* El título, con el MISMO tratamiento y el MISMO cuerpo que "Las
          Burgas" y "Nosotros" — ver el comentario de arriba: estaba achicado
          solo porque "Acompañamientos" no entraba en una línea, y "Sides" sí.
          En BLANCO (`--foreground`, 15.96:1) y no en el rojo de marca. */}
      <header className="relative mb-16 sm:mb-24 lg:mb-28">
        <h2 className="ml-0 font-display text-[clamp(56px,16vw,190px)] uppercase leading-[0.85] tracking-[-0.02em] text-foreground sm:-ml-[2%] sm:text-[12vw] lg:text-[9vw]">
          {titulo}
        </h2>
      </header>

      {/* `--imagen` es el ancho del plato como fracción de la fila; la columna
          del nombre es el resto. Un solo número mueve las dos cosas y la
          línea. */}
      <ul className="relative space-y-12 [--imagen:58%] sm:space-y-16 lg:mx-auto lg:max-w-[1200px] lg:space-y-16 lg:[--imagen:42%]">
        {items.map((item) => {
          const derecha = item.lado === 'derecha'
          return (
            <li
              key={item.titulo}
              className={`flex flex-col ${derecha ? 'items-start' : 'items-end'}`}
            >
              {/* El nombre y el subtítulo, CENTRADOS en la columna libre.
                  El centrado no es estético: es lo que fija el centro del
                  subtítulo en un punto que la flecha puede apuntar (ver el
                  comentario de arriba). El padding es simétrico por lo mismo
                  — con `pl-[4%] pr-3` el centro del contenido no caía en el
                  centro de la columna.
                  ES UN 8% MÁS ANCHO QUE LA COLUMNA LIBRE a propósito: como va
                  en flujo ENCIMA de la fila del plato, no hay nada con qué
                  chocar, y ese margen es lo que hace que "AROS DE CEBOLLA"
                  entre en dos líneas en 390px en vez de partirse en tres. */}
              <div className="w-[calc(100%_-_var(--imagen)_+_8%)] px-[4%] text-center">
                <h3 className="font-grafiti-italica text-[clamp(24px,7.5vw,40px)] uppercase leading-[0.95] tracking-[0.005em] text-primary lg:text-[clamp(40px,4vw,64px)]">
                  {item.titulo}
                </h3>
                <p className="mt-1.5 font-body text-[clamp(12px,3.2vw,15px)] font-semibold uppercase leading-snug tracking-[0.08em] text-foreground/85 lg:mt-3 lg:text-[clamp(15px,1.3vw,20px)]">
                  {item.subtitulo}
                </p>
              </div>

              {/* La fila del plato. La línea va absoluta adentro: baja desde
                  el nombre hasta la mitad del plato y dobla hacia él. */}
              <div className="relative mt-2 w-full lg:mt-3">
                <div
                  aria-hidden
                  className={`pointer-events-none absolute bottom-1/2 top-0 text-primary [stroke-width:2px] lg:[stroke-width:3px] ${
                    derecha
                      ? 'left-[calc((100%_-_var(--imagen)_+_8%)_/_2)] right-[var(--imagen)]'
                      : 'left-[var(--imagen)] right-[calc((100%_-_var(--imagen)_+_8%)_/_2)]'
                  }`}
                >
                  {/* La curva. Sale del plato a media altura, barre hacia el
                      costado libre y remonta hasta el centro del subtítulo.
                      El primer punto de control la deja caer un poco antes de
                      arrancar para arriba: eso es lo que le da el envión.
                      Arranca en 96 y no en 100 para no tocar el recorte del
                      plato. */}
                  <svg
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    fill="none"
                    className="h-full w-full overflow-visible"
                  >
                    <path
                      d={
                        derecha
                          ? 'M 96 84 C 62 106, 22 92, 0 6'
                          : 'M 4 84 C 38 106, 78 92, 100 6'
                      }
                      stroke="currentColor"
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                  {/* La punta, en el extremo de arriba. Va en el BORDE de la
                      caja —que es el centro de la columna, o sea el centro del
                      subtítulo— con `-translate-x-1/2` para que su vértice caiga
                      justo ahí. Es el mismo 0/100 en el que muere la curva, así
                      que las dos coinciden siempre. */}
                  <svg
                    viewBox="0 0 12 12"
                    fill="none"
                    className={`absolute top-[6%] size-[clamp(11px,3.4vw,22px)] -translate-x-1/2 -translate-y-[6%] ${
                      derecha ? 'left-0' : 'left-full'
                    }`}
                  >
                    <path
                      d="M 1.5 8.5 L 6 2.5 L 10.5 8.5"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                </div>
                {/* `alt=""`: el nombre ya lo dice el h3 de al lado; la foto
                    no agrega información que un lector de pantalla necesite
                    dos veces. */}
                <Image
                  src={item.imagen.src}
                  alt=""
                  width={item.imagen.ancho}
                  height={item.imagen.alto}
                  sizes="(min-width: 1024px) 42vw, 58vw"
                  className={`h-auto w-[var(--imagen)] select-none drop-shadow-[-10px_14px_24px_rgba(0,0,0,.5)] ${
                    derecha ? 'ml-auto' : ''
                  }`}
                />
              </div>
            </li>
          )
        })}
      </ul>

      {/* Las llamas al pie: dibujo PROPIO (gris con filo naranja), no el del
          hero. Mismo mosaico y misma altura; los picos ya vienen para arriba
          en el original, así que va sin dar vuelta. Ver arriba por qué el
          gris importa: es lo que borra la costura con Reseñas. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[var(--llamas)] select-none bg-[url('/zocalo-llamas-naranja.webp')] bg-[length:auto_100%] bg-bottom bg-repeat-x"
      />
    </section>
  )
}
