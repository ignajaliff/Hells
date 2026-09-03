import { type Resena } from '@/content/resenas'
import { LINK_RESENAS } from '@/lib/constants'

/**
 * Una reseña, con la MISMA ANATOMÍA que una tarjeta de Google Maps pero en
 * oscuro (2026-09-02, pedido del cliente: "exactamente como Google en formato
 * oscuro").
 *
 * La estructura y las medidas salen de inspeccionar una tarjeta real en
 * `maps.google.com` (el DOM y el `getComputedStyle`, no de memoria):
 *
 *   avatar 32px redondo — nombre 16px/20 — meta 14px gris
 *   estrellas 16px ámbar + fecha 14px gris, EN LA MISMA FILA
 *   texto 14px con interlineado 21px (1.5)
 *   "Más" en azul-link al final del texto recortado
 *
 * QUÉ CAMBIA respecto de Google, y por qué:
 * * Los colores se invierten al esquema oscuro del propio Google Maps
 *   (`#1f1f1f` texto → blanco, `#5e5e5e` gris → `--muted-foreground`), que es
 *   lo que pidió el cliente. El ámbar de las estrellas es el `#ffbb29` EXACTO
 *   de Google, no el `--highlight` de la marca: es el sello de "esto es de
 *   Google" y cambiarlo lo disfraza. Da 10.4:1 sobre el carbón.
 * * NO hay avatar de foto: los de Google son URLs de `googleusercontent` que
 *   caducan y además implicarían servir la cara de esas personas desde acá.
 *   En su lugar va la INICIAL sobre un disco de color, que es exactamente lo
 *   que Google dibuja cuando alguien no tiene foto. El color sale del nombre
 *   (ver `colorAvatar`), así cada persona tiene siempre el mismo.
 * * Falta el menú de tres puntos, el "¿Te resultó útil?" y las fotos: son
 *   controles de Google, no información. La tarjeta acá no es interactiva.
 * * El nombre es un enlace a la ficha del local, como en Google — pero al
 *   local, no al perfil de la persona.
 *
 * El ancho FIJO no es decorativo: la pista del carrusel mide la suma de las
 * tarjetas y el `-50%` del loop solo cierra si las dos copias miden
 * exactamente lo mismo.
 */
export function TarjetaResena({ resena }: { resena: Resena }) {
  const { autor, meta, fecha, estrellas, texto } = resena

  return (
    <li className="flex w-[320px] shrink-0 flex-col rounded-2xl bg-background p-5 sm:w-[368px]">
      {/* Encabezado: avatar + nombre + meta. `items-center` como Google. */}
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className={`grid size-8 shrink-0 place-items-center rounded-full font-body text-[15px] font-semibold text-black ${colorAvatar(autor)}`}
        >
          {autor.trim().charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0">
          {/* `truncate`: "Luis Alberto Cortés González" no entra en una línea
              y partido en dos rompería la altura del encabezado. Google hace
              lo mismo. El nombre completo queda en el `title`. */}
          <a
            href={LINK_RESENAS}
            target="_blank"
            rel="noopener noreferrer"
            title={autor}
            className="block truncate font-body text-[16px] leading-5 text-foreground hover:underline"
          >
            {autor}
          </a>
          <p className="truncate font-body text-[13px] leading-[18px] text-muted-foreground">
            {meta}
          </p>
        </div>
      </div>

      {/* Estrellas y fecha, en la misma fila — igual que Google. */}
      <div className="mt-3 flex items-center gap-2">
        <span className="flex gap-px" aria-label={`${estrellas} de 5 estrellas`}>
          {Array.from({ length: 5 }, (_, i) => (
            <Estrella key={i} llena={i < estrellas} />
          ))}
        </span>
        <span className="font-body text-[13px] text-muted-foreground">{fecha}</span>
      </div>

      {/* El texto. `line-clamp-5` + "Más": las reseñas largas se cortan como
          en Google, en vez de estirar la tarjeta y desnivelar la fila. */}
      <p className="mt-3 line-clamp-5 font-body text-[14px] leading-[21px] text-foreground/90">
        {texto}
      </p>
      <a
        href={LINK_RESENAS}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto pt-3 font-body text-[14px] text-[#8ab4f8] hover:underline"
      >
        Más
      </a>
    </li>
  )
}

/**
 * El disco del avatar. Google reparte un color por persona cuando no hay
 * foto; acá se hace igual, eligiendo por la suma de los caracteres del
 * nombre para que sea SIEMPRE el mismo y no cambie entre renders.
 * Son tonos claros a propósito: la inicial va en negro encima.
 * Las clases se escriben COMPLETAS — Tailwind escanea el fuente y una clase
 * armada por template string no se compila.
 */
function colorAvatar(nombre: string) {
  const colores = [
    'bg-[#f28b82]',
    'bg-[#fbbc04]',
    'bg-[#81c995]',
    'bg-[#78d9ec]',
    'bg-[#c58af9]',
    'bg-[#ff8bcb]',
  ]
  let suma = 0
  for (const ch of nombre) suma += ch.codePointAt(0) ?? 0
  return colores[suma % colores.length]
}

/**
 * La estrella de Google. El `#ffbb29` es el color exacto que sirve Maps
 * (medido con `getComputedStyle`), no el `--highlight` de la marca: es parte
 * de la identidad de la reseña.
 */
function Estrella({ llena }: { llena: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden
      className={`size-4 ${llena ? 'text-[#ffbb29]' : 'text-border'}`}
      fill="currentColor"
    >
      <path d="M10 1.6l2.47 5.28 5.53.72-4.09 3.86 1.06 5.62L10 14.34l-4.97 2.74 1.06-5.62L2 7.6l5.53-.72z" />
    </svg>
  )
}
