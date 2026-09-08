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
 * (`100% - var(--imagen)`, más un 8% de holgura — ver el comentario del
 * bloque): así nunca se monta sobre el plato y el alto de cada bloque sale
 * solo. El tramo horizontal se frena 8px antes del recorte de la imagen para
 * no tocar la comida.
 *
 * TIPOGRAFÍAS (pedido del cliente): el nombre con la del hero
 * (`font-grafiti-italica`, la Splatink inclinada) y el subtítulo con la de
 * los ingredientes del tocadiscos (cuerpo, semibold, versalitas espaciadas).
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
 * LA SECCIÓN VA ENMARCADA POR LAS LLAMAS DEL HERO, arriba y abajo
 * (2026-09-07, pedido del cliente). Las de ABAJO son las del hero tal cual,
 * con los picos hacia arriba. Las de ARRIBA son la misma banda dada vuelta y
 * son LAS QUE ESTABAN EN RESEÑAS: colgaban del techo de esa sección desde el
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

      {/* El título, con el MISMO tratamiento que "Las Burgas" y "Nosotros".
          Un cuerpo más chico que aquéllos (11vw contra 16vw en móvil): esta
          palabra tiene 15 letras contra 10 y al mismo tamaño no entraría en
          una línea. En escritorio pasa lo mismo, 7vw contra 9vw. */}
      <header className="relative mb-8 sm:mb-12">
        <h2 className="ml-0 font-display text-[clamp(40px,11.5vw,190px)] uppercase leading-[0.85] tracking-[-0.02em] text-primary sm:-ml-[2%] sm:text-[9vw] lg:text-[7vw]">
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
              {/* El nombre: en la columna libre, pegado al costado por donde
                  sube la línea. `text-right` cuando el plato va a la
                  izquierda, así el bloque cuelga del tramo vertical.
                  ES UN 8% MÁS ANCHO QUE LA COLUMNA LIBRE a propósito: como va
                  en flujo ENCIMA de la fila del plato, no hay nada con qué
                  chocar, y ese margen es lo que hace que "AROS DE CEBOLLA"
                  entre en dos líneas en 390px en vez de partirse en tres
                  (medido: 147px de caja lo partía, 175 no). */}
              <div
                className={`w-[calc(100%_-_var(--imagen)_+_8%)] ${
                  derecha ? 'pl-[4%] pr-3 text-left' : 'pl-3 pr-[4%] text-right'
                }`}
              >
                {/* CÓMO SE CENTRA EL TÍTULO SOBRE EL SUBTÍTULO SIN MOVER AL
                    SUBTÍTULO (`tituloCentrado`, hoy solo las papas): el grupo
                    pasa a `inline-block`, o sea que se encoge al ancho de su
                    contenido en vez de ocupar la columna — y así sigue pegado
                    al costado, como los demás. Para que ese ancho lo fije el
                    SUBTÍTULO y no el nombre, el h3 va `w-0 min-w-full`: un
                    ancho definido de 0 no aporta nada al ancho intrínseco del
                    grupo (los `min-width` en porcentaje no cuentan en esa
                    medición), pero una vez que el grupo ya midió, el
                    `min-w-full` lo hace ocupar ese ancho completo. Resultado:
                    el grupo mide lo que "CHEDAR Y BACON" y el nombre se
                    centra encima.
                    **Centrar todo el grupo no servía**: correría también al
                    subtítulo hacia el medio de la columna y la flecha, que
                    apunta al borde, dejaría de señalarlo. */}
                <div className={item.tituloCentrado ? 'inline-block text-center' : ''}>
                  <h3
                    className={`font-grafiti-italica text-[clamp(24px,7.5vw,40px)] uppercase leading-[0.95] tracking-[0.005em] text-primary lg:text-[clamp(40px,4vw,64px)] ${
                      item.tituloCentrado ? 'w-0 min-w-full' : ''
                    }`}
                  >
                    {item.titulo}
                  </h3>
                  <p className="mt-1.5 font-body text-[clamp(12px,3.2vw,15px)] font-semibold uppercase leading-snug tracking-[0.08em] text-foreground/85 lg:mt-3 lg:text-[clamp(15px,1.3vw,20px)]">
                    {item.subtitulo}
                  </p>
                </div>
              </div>

              {/* La fila del plato. La línea va absoluta adentro: baja desde
                  el nombre hasta la mitad del plato y dobla hacia él. */}
              <div className="relative mt-2 w-full lg:mt-3">
                <div
                  aria-hidden
                  className={`pointer-events-none absolute bottom-1/2 top-0 text-primary [stroke-width:2px] lg:[stroke-width:3px] ${
                    derecha
                      ? 'left-[4%] right-[calc(var(--imagen)_+_8px)]'
                      : 'left-[calc(var(--imagen)_+_8px)] right-[4%]'
                  }`}
                >
                  {/* La curva. Sale del plato a media altura, barre hacia el
                      costado libre y remonta hasta el subtítulo. El primer
                      punto de control la deja caer un poco antes de arrancar
                      para arriba: eso es lo que le da el envión. */}
                  <svg
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    fill="none"
                    className="h-full w-full overflow-visible"
                  >
                    <path
                      d={
                        derecha
                          ? 'M 100 86 C 66 102, 14 98, 8 8'
                          : 'M 0 86 C 34 102, 86 98, 92 8'
                      }
                      stroke="currentColor"
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                  {/* La punta, en el extremo de arriba, señalando al
                      subtitulo. El `-translate-x-1/2` deja su vértice justo
                      sobre el 8%/8% donde muere la curva. */}
                  <svg
                    viewBox="0 0 12 12"
                    fill="none"
                    className={`absolute top-[8%] size-[clamp(11px,3.4vw,22px)] -translate-x-1/2 -translate-y-[6%] ${
                      derecha ? 'left-[8%]' : 'left-[92%]'
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

      {/* Las llamas del hero al pie, derechas: mismo dibujo y mismo mosaico
          que las del techo, sin dar vuelta. Ver el zócalo en `Hero.tsx`. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[var(--llamas)] select-none bg-[url('/zocalo-llamas.webp')] bg-[length:auto_100%] bg-bottom bg-repeat-x"
      />
    </section>
  )
}
