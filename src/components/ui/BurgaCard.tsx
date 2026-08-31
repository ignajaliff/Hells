import Image from 'next/image'
import { ETIQUETAS, type FormaEtiqueta } from '@/components/ui/etiquetasBurga'

/**
 * BurgaCard — una hamburguesa de la carta.
 *
 * Un bloque negro con el video de la burga adentro —se reproduce una vez y
 * queda en la foto de producto, ver `BurgaVideo`— enmarcado por dos líneas
 * rojas, y debajo su nombre y sus ingredientes.
 *
 * SIN RECUADRO (2026-08-26, pedido del cliente): la tarjeta no tiene esquinas
 * redondeadas, rotación, sombra ni color de fondo propio; en móvil va de borde
 * a borde de la pantalla. Antes tenía rotación alternada, sombra desplazada y
 * tres tonos de fondo.
 *
 * EL NOMBRE VA DEBAJO, junto a los ingredientes (2026-08-27): cuando llegaron
 * los doce nombres reales se leyó mejor como ficha de producto que dentro de
 * la etiqueta blanca, que además tapaba parte de la hamburguesa.
 * La etiqueta sigue soportada (`etiqueta` + `nombreEnEtiqueta`) y `sticker`
 * también: era el hueco reservado para los sellos del cliente, del que hasta
 * ahora llegó uno solo (Belcebú). Si llegan los doce, se vuelve a activar acá
 * sin tocar el resto.
 */
export function BurgaCard({
  nombre,
  video,
  ingredientes,
  sticker,
  etiqueta,
  nombreEnEtiqueta = false,
  conFicha = true,
}: {
  nombre: string
  /**
   * El video de la burga: se reproduce una vez al entrar en pantalla y queda
   * en su `foto` de producto.
   */
  video: { src: string; poster: string; foto: string; alt: string }
  /** La lista de ingredientes, debajo del nombre y en rojo. */
  ingredientes?: string
  /**
   * El sello del cliente, encima del video y arriba a la izquierda. Reemplaza
   * a la etiqueta blanca. Solo llegó el de Belcebú (2026-08-26).
   */
  sticker?: { src: string; alt: string }
  /** La forma de la etiqueta blanca. Solo se dibuja con `nombreEnEtiqueta`. */
  etiqueta?: FormaEtiqueta
  /** Si el nombre va DENTRO de la etiqueta encima del video, y no debajo. */
  nombreEnEtiqueta?: boolean
  /**
   * Con `false` la tarjeta es SOLO el bloque del video, sin nombre ni
   * ingredientes debajo: el carrusel de móvil los muestra en una ficha única
   * compartida (ver `CarruselBurgas`) y acá sobrarían duplicados.
   */
  conFicha?: boolean
}) {
  const forma = etiqueta ? ETIQUETAS[etiqueta] : null

  return (
    <article className="relative">
      {/* Bloque negro. Es `#000` a propósito y no `--background`: los videos
          arrancan en negro puro y así el primer frame se funde con el bloque
          en vez de verse como un cuadrado apenas más oscuro. Mismo negro que
          el fondo de la sección.

          BORDES ROJOS arriba y abajo (2026-08-27, pedido del cliente): sobre
          el fondo negro el video se fundía sin límite visible. Solo los
          horizontales — en móvil la tarjeta va de borde a borde de la
          pantalla, así que unos verticales quedarían pegados al canto. */}
      <div className="relative overflow-hidden border-y-2 border-primary bg-black">
        {/* `aspect-square` fija la caja ANTES de que cargue nada, así la
            grilla no salta cuando entran los doce videos. */}
        <div className="relative aspect-square">
          {/* SIN VIDEO por ahora (2026-08-31, pedido del cliente): se muestra
              la foto de producto. Para reponerlo, volver a `<BurgaVideo
              src={video.src} poster={video.poster} foto={video.foto}
              alt={video.alt} />` — el componente sigue en el proyecto. */}
          <Image
            src={video.foto}
            alt={video.alt}
            fill
            sizes="(min-width: 1024px) 25vw, 33vw"
            className="object-cover"
          />
        </div>

        {sticker ? (
          /* EL STICKER del cliente. El PNG ya trae la chapa negra con las
             letras blancas, así que no lleva fondo ni sombra propios. Ancho
             relativo a la tarjeta para que escale con ella, casi pegado a la
             esquina — el cliente lo quiso chico y esquinado. */
          <Image
            src={sticker.src}
            alt={sticker.alt}
            width={900}
            height={367}
            className="absolute left-[1.5%] top-[1.5%] z-[2] h-auto w-[36%] sm:w-[42%]"
          />
        ) : nombreEnEtiqueta && forma ? (
          /* LA ETIQUETA BLANCA, con el nombre adentro. Sobresale del borde
             para que se lea como algo pegado ENCIMA de la tarjeta. */
          <div
            className={`absolute z-[2] min-h-[40px] bg-foreground shadow-[4px_4px_0_rgba(26,26,26,.45)] sm:min-h-[38px] sm:shadow-[3px_3px_0_rgba(26,26,26,.45)] ${forma.caja} ${forma.pastilla} ${forma.ancho}`}
          >
            <span className="block font-display text-[clamp(17px,5vw,24px)] uppercase leading-tight tracking-[0.01em] text-background sm:text-[clamp(13px,2.2vw,22px)]">
              {nombre}
            </span>
          </div>
        ) : null}
      </div>

      {/* LA FICHA: el nombre y debajo los ingredientes.
          CONTRASTE: `--primary` sobre negro da 4.50:1, JUSTO el mínimo AA para
          texto normal. El nombre va en display y grande, así que le sobra; los
          ingredientes cumplen a estos tamaños pero sin margen — **no achicarlos
          más ni aclarar el fondo**.
          El `px-4` de móvil compensa el `-mx-4` que la tarjeta lleva para ir de
          borde a borde: sin él el texto quedaría pegado al canto. */}
      {conFicha ? (
      <div className="px-4 pb-1 pt-4 text-center sm:px-0 sm:pt-3">
        {!nombreEnEtiqueta && nombre ? (
          <h3 className="font-display text-[clamp(26px,7vw,34px)] uppercase leading-none tracking-[0.01em] text-primary sm:text-[clamp(20px,2.4vw,30px)]">
            {nombre}
          </h3>
        ) : null}

        {ingredientes ? (
          <p className="mt-2 font-body text-[clamp(13px,3.4vw,15px)] font-semibold uppercase leading-snug tracking-[0.08em] text-primary sm:mt-1.5 sm:text-[clamp(11px,1.5vw,14px)]">
            {ingredientes}
          </p>
        ) : null}
      </div>
      ) : null}
    </article>
  )
}
