import { type Resena, resenasContent } from '@/content/resenas'
import { LINK_RESENAS } from '@/lib/constants'

/**
 * Una reseña, con la MISMA ANATOMÍA que una tarjeta de Google pero en oscuro
 * (2026-09-02, pedido del cliente: "exactamente como Google en formato
 * oscuro").
 *
 * FORMA APAISADA Y LOGO DE GOOGLE (2026-09-03, 2ª iteración, con captura de
 * referencia del cliente): la tarjeta se ensanchó y se achicó de alto, y el
 * encabezado ganó la "G" de Google arriba a la derecha. Es la anatomía del
 * WIDGET de reseñas de Google (el que se incrusta en sitios), no la del panel
 * de Maps que se había clonado antes — que es una columna angosta y alta
 * porque vive en una barra lateral. Cambios respecto de esa primera versión:
 *
 * * ANCHO 340/416px contra 320/368, y el texto se corta en 3 líneas en vez de
 *   5. Las dos cosas van juntas: ensanchar sin recortar el texto habría hecho
 *   la tarjeta más grande, no más apaisada. Queda en ~1.9:1 en desktop.
 * * LA FECHA SUBIÓ a la línea gris bajo el nombre, junto a "Google" —así es
 *   en la referencia—, y las estrellas quedaron solas en su fila. Antes fecha
 *   y estrellas compartían fila y la línea gris era el recuento de reseñas de
 *   la persona; ese dato ahora vive en el `title` del nombre, para no gastar
 *   una línea de alto en él.
 * * La "G" es el logo OFICIAL de cuatro colores, en su color: es el sello de
 *   procedencia y en monocromo dejaría de leerse como el de Google.
 *
 * Medidas heredadas de inspeccionar una tarjeta real (`getComputedStyle`, no
 * de memoria): avatar 32px, nombre 16px/20, línea gris 13px, estrellas 16px
 * ámbar, texto 14px/21 y el "Más" en azul-link.
 *
 * QUÉ CAMBIA respecto de Google, y por qué:
 * * Los colores se invierten al esquema oscuro del propio Google (`#1f1f1f`
 *   texto → blanco, gris → `--muted-foreground`), que es lo que pidió el
 *   cliente. El ámbar de las estrellas es el `#ffbb29` EXACTO de Google, no el
 *   `--highlight` de la marca: es el sello de "esto es de Google" y cambiarlo
 *   lo disfraza. Da 10.4:1 sobre el carbón.
 * * NO hay avatar de foto: los de Google son URLs de `googleusercontent` que
 *   caducan y además implicarían servir la cara de esas personas desde acá.
 *   En su lugar va la INICIAL sobre un disco de color, que es exactamente lo
 *   que Google dibuja cuando alguien no tiene foto. El color sale del nombre
 *   (ver `colorAvatar`), así cada persona tiene siempre el mismo.
 * * Falta el menú de tres puntos, el "¿Te resultó útil?" y las fotos: son
 *   controles de Google, no información. La tarjeta acá no es interactiva.
 *
 * El ancho FIJO no es decorativo: la pista del carrusel mide la suma de las
 * tarjetas y el `-50%` del loop solo cierra si las dos copias miden
 * exactamente lo mismo.
 */
export function TarjetaResena({ resena }: { resena: Resena }) {
  const { autor, meta, fecha, estrellas, texto } = resena

  return (
    <li className="flex w-[340px] shrink-0 flex-col rounded-2xl bg-background p-5 sm:w-[416px]">
      {/* Encabezado: avatar + nombre a la izquierda, la "G" a la derecha.
          `items-start` y no `items-center`: la G se alinea con la primera
          línea del nombre, como en la referencia, y no con el bloque entero. */}
      <div className="flex items-start gap-3">
        <span
          aria-hidden
          className={`grid size-8 shrink-0 place-items-center rounded-full font-body text-[15px] font-semibold text-black ${colorAvatar(autor)}`}
        >
          {autor.trim().charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0 flex-1">
          {/* `truncate`: "Luis Alberto Cortés González" no entra en una línea
              y partido en dos rompería la altura del encabezado. Google hace
              lo mismo. El nombre completo y su recuento quedan en el `title`. */}
          <a
            href={LINK_RESENAS}
            target="_blank"
            rel="noopener noreferrer"
            title={`${autor} · ${meta}`}
            className="block truncate font-body text-[16px] leading-5 text-foreground hover:underline"
          >
            {autor}
          </a>
          <p className="truncate font-body text-[13px] leading-[18px] text-muted-foreground">
            {fecha} · {resenasContent.fuente}
          </p>
        </div>
        <LogoGoogle />
      </div>

      <span className="mt-3 flex gap-px" aria-label={`${estrellas} de 5 estrellas`}>
        {Array.from({ length: 5 }, (_, i) => (
          <Estrella key={i} llena={i < estrellas} />
        ))}
      </span>

      {/* El texto. `line-clamp-3` + "Más": las reseñas largas se cortan como
          en Google, en vez de estirar la tarjeta y desnivelar la fila. */}
      <p className="mt-3 line-clamp-3 font-body text-[14px] leading-[21px] text-foreground/90">
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
 * La "G" de Google, en sus cuatro colores oficiales. Va inline y no como
 * archivo: son cuatro paths, pesa menos que la petición que costaría bajarla
 * y así hereda el tamaño del texto sin una capa de layout extra.
 * `shrink-0` porque el nombre de al lado es flexible y si no la aplastaría.
 */
function LogoGoogle() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden className="size-[18px] shrink-0">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
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
