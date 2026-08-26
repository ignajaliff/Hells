import Image from 'next/image'
import { ETIQUETAS, type FormaEtiqueta } from '@/components/ui/etiquetasBurga'
import { BurgaArmado } from '@/components/ui/BurgaArmado'
import { BurgaVideo } from '@/components/ui/BurgaVideo'

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
 * SIN RECUADRO (2026-08-26, pedido del cliente): la tarjeta ya no tiene
 * esquinas redondeadas, rotación, sombra ni color de fondo propio. Es un
 * bloque negro plano con la foto (o el video) adentro y la etiqueta encima.
 * En móvil va de borde a borde de la pantalla. Se hizo primero con la burga
 * del video y el cliente pidió lo mismo para todas: las otras siete van a
 * recibir su propio video.
 * Antes tenía rotación alternada, sombra desplazada y tres tonos de fondo
 * (carbón, rojo oscuro y naranja); todo eso se sacó junto.
 */

export function BurgaCard({
  nombre,
  foto,
  recorte = 'cover',
  animada = false,
  video,
  sticker,
  etiqueta,
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
  /**
   * Si viene, la tarjeta muestra un VIDEO movido por el scroll (`BurgaVideo`)
   * en vez de la foto. Empezó con la primera burga (2026-08-26) y las demás
   * van a seguir el mismo camino cuando lleguen sus videos.
   */
  video?: { src: string; final: string; alt: string }
  /**
   * El sticker REAL con el nombre, hecho por el cliente (2026-08-26). Si
   * viene, REEMPLAZA a la etiqueta blanca: la etiqueta era el hueco reservado
   * para esto. Va arriba a la izquierda, encima del video/foto.
   */
  sticker?: { src: string; alt: string }
  etiqueta: FormaEtiqueta
}) {
  const forma = ETIQUETAS[etiqueta]

  return (
    <article className="relative">
      {/* Bloque negro plano. Es `#000` a propósito y no `--background`: el
          video arranca en negro puro y así el primer frame se funde con el
          bloque en vez de verse como un cuadrado apenas más oscuro. Mismo
          negro que el fondo de la sección. */}
      <div className="relative overflow-hidden bg-black">
        {/* La foto. `aspect-square` fija la caja ANTES de que cargue la imagen,
            así la grilla no salta cuando entran las 8 fotos. */}
        <div className="relative aspect-square">
          {video ? (
            <BurgaVideo src={video.src} final={video.final} alt={video.alt} />
          ) : animada ? (
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

        {sticker ? (
          /* EL STICKER del cliente, arriba a la izquierda sobre el video. El
             PNG ya trae la chapa negra con las letras blancas, así que no
             lleva fondo ni sombra propios. Ancho relativo a la tarjeta para que
             escale con ella: 36% en móvil, casi pegado a la esquina (1.5%).
             Venía en 48% y 4%; el cliente lo quiso más chico y más esquinado. */
          <Image
            src={sticker.src}
            alt={sticker.alt}
            width={900}
            height={367}
            className="absolute left-[1.5%] top-[1.5%] z-[2] h-auto w-[36%] sm:w-[42%]"
          />
        ) : (
        /* LA ETIQUETA — el hueco del sticker con el nombre.
            Forma, esquina y ángulo salen de `ETIQUETAS[etiqueta]`: las ocho son
            distintas entre sí. Sobresale del borde de la tarjeta para que se
            lea como algo pegado ENCIMA y no como parte del diseño.
            Alto mínimo fijo: sin él, al estar vacía colapsaría a un hilo y no
            se vería el espacio reservado. */
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
        )}
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
