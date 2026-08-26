import Image from 'next/image'
import { ETIQUETAS, type FormaEtiqueta } from '@/components/ui/etiquetasBurga'
import { BurgaArmado } from '@/components/ui/BurgaArmado'

/**
 * BurgaCard — una hamburguesa de la carta.
 *
 * Es una tarjeta cuadrada con la foto adentro y una ETIQUETA BLANCA que es el
 * hueco reservado: el cliente pega ahí su sticker con el nombre de cada burga
 * (2026-08-24). Por eso se dibuja aunque `nombre` esté vacío — si desapareciera
 * al no haber texto, no se vería dónde va.
 *
 * **Las ocho etiquetas son distintas** entre sí: forma, esquina y ángulo salen
 * de `etiquetasBurga.ts`, que documenta las variantes y la regla de que dos
 * tarjetas vecinas no compartan esquina. Los nombres de las burgas son propios
 * (Lucifer, Crepúsculo, Jesús...), así que el sello acompaña esa identidad en
 * vez de repetir el mismo recuadro.
 *
 * ROTACIÓN ALTERNADA de la TARJETA: las pares se inclinan al revés que las
 * impares. Con todas rotadas igual la grilla se lee como un error de
 * alineación; en contrafase se lee como stickers pegados uno por uno.
 */

/** El color del recuadro. La grilla los alterna para que no parezca una tabla. */
const TONOS = {
  carbon: 'bg-background',
  rojo: 'bg-[#b81a12]',
  naranja: 'bg-highlight',
} as const

export type TonoBurga = keyof typeof TONOS

export function BurgaCard({
  nombre,
  foto,
  recorte = 'cover',
  animada = false,
  tono,
  etiqueta,
  indice,
}: {
  nombre: string
  foto: string | null
  /**
   * Cómo entra la foto en la tarjeta.
   * `cover` — foto de estudio con su fondo (plato, barril): llena el cuadrado.
   * `contain` — PNG con el fondo ya recortado: la burger va suelta sobre el
   * color del recuadro, así que se muestra entera y con aire. Con `cover` se
   * la comería el recorte.
   */
  recorte?: 'cover' | 'contain'
  /**
   * Si es `true`, en vez de una foto fija se muestra la secuencia de la burga
   * armándose (`BurgaArmado`). Solo la primera tarjeta lo usa: es el gancho de
   * la sección y con más de una compitiendo se perdería el efecto.
   */
  animada?: boolean
  tono: TonoBurga
  etiqueta: FormaEtiqueta
  indice: number
}) {
  const par = indice % 2 === 1
  const forma = ETIQUETAS[etiqueta]

  return (
    <article className="group relative">
      {/* La sombra dura: un bloque carbón corrido en diagonal. Da el volumen de
          sticker recortado sin usar `box-shadow`, que sobre un fondo rojo
          saturado se ve como una mancha gris sucia. */}
      <div
        aria-hidden
        className={`absolute inset-0 translate-x-[6px] translate-y-[6px] rounded-[18px] bg-background/70 transition-transform duration-200 ${
          par ? '-rotate-1' : 'rotate-1'
        } group-hover:translate-x-[10px] group-hover:translate-y-[10px]`}
      />

      <div
        className={`relative overflow-hidden rounded-[18px] ${TONOS[tono]} transition-transform duration-200 ${
          par ? '-rotate-1' : 'rotate-1'
        } group-hover:rotate-0`}
      >
        {/* La foto. `aspect-square` fija la caja ANTES de que cargue la imagen,
            así la grilla no salta cuando entran las 8 fotos. */}
        <div className="relative aspect-square">
          {animada ? (
            <BurgaArmado />
          ) : foto ? (
            <Image
              src={foto}
              alt=""
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className={
                recorte === 'contain'
                  ? /* Baja un poco y se achica: sin eso la burger recortada
                       llega hasta el borde de arriba y la etiqueta le cae
                       encima del pan. Con el fondo transparente ese aire se ve
                       como parte del diseño, no como un hueco. */
                    'translate-y-[7%] scale-[0.94] object-contain drop-shadow-[0_14px_20px_rgba(0,0,0,.45)]'
                  : 'object-cover'
              }
            />
          ) : (
            <MarcadorFoto />
          )}
        </div>

        {/* LA ETIQUETA — el hueco del sticker con el nombre.
            Forma, esquina y ángulo salen de `ETIQUETAS[etiqueta]`: las ocho son
            distintas entre sí. Sobresale del borde de la tarjeta para que se
            lea como algo pegado ENCIMA y no como parte del diseño.
            Alto mínimo fijo: sin él, al estar vacía colapsaría a un hilo y no
            se vería el espacio reservado. */}
        <div
          className={`absolute z-[2] min-h-[40px] bg-foreground shadow-[4px_4px_0_rgba(26,26,26,.45)] sm:min-h-[38px] sm:shadow-[3px_3px_0_rgba(26,26,26,.45)] ${forma.caja} ${forma.pastilla} ${forma.ancho}`}
        >
          {nombre ? (
            <span className="block font-display text-[clamp(17px,5vw,24px)] uppercase leading-tight tracking-[0.01em] text-background sm:text-[clamp(13px,2.2vw,22px)]">
              {nombre}
            </span>
          ) : (
            /* Sin nombre todavía: dos rayas grises marcan dónde va el texto.
               Es deliberadamente evidente que falta el dato — un espacio en
               blanco liso se confundiría con una decisión de diseño. */
            <span
              aria-hidden
              className="flex h-[24px] w-full flex-col justify-center gap-[6px] sm:h-[22px] sm:gap-[5px]"
            >
              <span className="block h-[7px] w-[70%] rounded-full bg-background/25 sm:h-[6px]" />
              <span className="block h-[7px] w-[45%] rounded-full bg-background/15 sm:h-[6px]" />
            </span>
          )}
        </div>
      </div>
    </article>
  )
}

/**
 * El marcador que ocupa el lugar de la foto mientras no exista.
 *
 * No es un gris plano ni un "no image": dibuja la silueta del isotipo de marca
 * sobre un degradé cálido, así la grilla ya se ve terminada y el hueco se lee
 * como intencional. Cuando lleguen las fotos, este componente deja de
 * renderizarse solo — no hay que tocar la tarjeta.
 */
function MarcadorFoto() {
  return (
    <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_50%_38%,rgba(239,143,3,.22),rgba(26,26,26,0)_62%)]">
      <Image
        src="/isotipo.png"
        alt=""
        aria-hidden
        width={512}
        height={512}
        className="w-[38%] opacity-[.14] grayscale"
      />
      <span className="absolute bottom-3 font-body text-[9px] uppercase tracking-[0.16em] text-foreground/25 sm:bottom-4 sm:text-[11px] sm:tracking-[0.18em]">
        Foto pendiente
      </span>
    </div>
  )
}
