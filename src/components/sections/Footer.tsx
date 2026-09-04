import Image from 'next/image'
import { footerContent } from '@/content/home'
import { DEFAULTS } from '@/lib/defaults'
import { MAPA_EMBED, MAPA_LINK, NEGOCIO, SECCIONES } from '@/lib/constants'

/**
 * Footer (2026-09-02, pedido del cliente): "Contacto", los dos cuadraditos de
 * Instagram y WhatsApp, el mapa en un rectángulo curvado, la dirección debajo,
 * el logo y el crédito de Nuvvora.
 *
 * TODO EL TEXTO EN BLANCO (pedido del cliente). El rojo de marca queda solo en
 * los bordes de los cuadraditos y del mapa: sobre negro, `--primary` da 4.50:1
 * —justo AA para texto—, y acá el texto es chico. En blanco son 15.96:1.
 *
 * Fondo NEGRO PURO (#000): la sección de arriba (Work) es carbón, así que el
 * pie cierra la página con el tono más oscuro, sin necesitar un borde.
 *
 * EL MAPA ES REAL, no un marco marcado: la dirección ya la dio el cliente, así
 * que se muestra Google Maps embebido. Va `loading="lazy"` — está al final de
 * la página y no tiene por qué competir con nada al abrir. El `output=embed`
 * de Maps no necesita API key ni dependencia nueva.
 *
 * La dirección y los links salen de `constants.ts`/`defaults.ts`, no escritos
 * acá: son datos del negocio y viven en un solo lugar.
 *
 * LAS LLAMAS DEL TECHO (2026-09-02, pedido del cliente): una banda dentada
 * colgando del borde superior, con los picos hacia abajo. Así el hero y el pie
 * se cierran con el mismo gesto, uno arriba y otro invertido.
 * DIBUJO PROPIO (`llamasrojas.png`, aportado por el cliente el mismo día): son
 * picos MACIZOS rojos CON CONTORNO NARANJA, no los del hero —que son negros con
 * contorno rojo y sobre este fondo negro casi desaparecían—.
 */
export function Footer() {
  const { titulo, instagram, whatsapp, mapa, creditos } = footerContent

  return (
    <footer id={SECCIONES.contacto} className="relative overflow-hidden bg-black px-4 pb-12 pt-[calc(var(--llamas)_+_56px)] [--llamas:min(max(52px,11svh),96px)] sm:px-8 sm:pb-14 sm:pt-[calc(var(--llamas)_+_80px)] lg:px-14 lg:[--llamas:min(10svh,110px)]">
      {/* LAS LLAMAS, colgando del techo y apuntando hacia abajo.

          Mismo mecanismo que la banda del hero —mosaico (`repeat-x` +
          `background-size: auto 100%`) y altura—, pero con OTRO DIBUJO: picos
          macizos rojos en vez de los negros con contorno. Los del hero, sobre
          este fondo negro, quedaban casi invisibles.

          El PNG del cliente venía con fondo blanco y 3358px de alto para un
          dibujo de 624. Se recortó al dibujo y se le sacó el blanco por el
          CANAL MÁS BAJO, no por "rojez": el dibujo tiene DOS colores y el
          naranja tiene su mínimo en 30, así que normalizando por 225 los dos
          quedan opacos y solo el antialias es semitransparente. Quién es
          quién se decide por `G - B` (el naranja lo tiene en 117, el rojo y
          el blanco en 0). Quedó en `zocalo-llamas-rojas-2.webp` (2560x352,
          47KB); el original está en `originales/`.

          EL ROJO SE REPINTÓ AL DE MARCA, EL NARANJA NO: el relleno venía en
          #ff0000 puro y `--primary` es #e3211f — importa porque la sección de
          arriba (Work) es de ese rojo y la banda arranca pegada a ella, así
          que dos rojos distintos tocándose se verían como una línea. El
          contorno naranja (255,147,30) se deja tal cual: es ilustración, no
          UI, el mismo criterio que las llamas del hero y la mascota. Además
          la BASE del dibujo no tiene contorno (medido, 0 de 112 muestras), o
          sea que dado vuelta el borde que toca a Work es rojo limpio.

          EMPALMA consigo mismo: los dos bordes caen en el valle con 2px de
          diferencia sobre 625 (medido), así que el mosaico no tiene costura.

          `-scale-y-100` y no `rotate-180`: el giro de 180° espejaría también
          en horizontal, y acá solo hay que dar vuelta el dibujo de arriba a
          abajo. Como el mosaico se arma ANTES de la transformación, el patrón
          sigue empalmando consigo mismo igual que en el hero.

          La ALTURA vive en `--llamas`, declarada en el footer: el padding de
          arriba la reutiliza (`calc(var(--llamas) + 56px)`) para que el
          contenido arranque siempre debajo de las llamas. Si se cambia el
          alto, se cambia en un solo lugar y el aire acompaña solo. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[var(--llamas)] -scale-y-100 select-none bg-[url('/zocalo-llamas-rojas-2.webp')] bg-[length:auto_100%] bg-repeat-x"
      />

      <div className="relative mx-auto flex max-w-[520px] flex-col items-center text-center">
        <h2 className="font-display text-[clamp(38px,11vw,72px)] uppercase leading-none tracking-[0.01em] text-foreground">
          {titulo}
        </h2>

        {/* Los dos cuadraditos. Son CUADRADOS de lado fijo (`size-`) y no
            botones con padding: el cliente los pidió así, y de paso los dos
            miden lo mismo aunque sus dibujos no midan igual.
            56px de lado: por encima de los 44px que pide un blanco de toque
            cómodo en móvil. */}
        <div className="mt-7 flex items-center justify-center gap-4">
          <IconoCuadrado
            href={NEGOCIO.instagram}
            etiqueta={instagram}
          >
            {/* Instagram: la cámara se dibuja con primitivas (rect + circle)
                en vez de un path. Se ve más nítida en tamaños chicos y pesa
                una fracción. */}
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
          </IconoCuadrado>

          <IconoCuadrado
            href={`https://wa.me/${DEFAULTS.whatsapp.numero}`}
            etiqueta={whatsapp}
          >
            {/* WhatsApp: el globo y el tubo. Trazo continuo para que combine
                con el de Instagram — el logo oficial es sólido, pero mezclado
                con un ícono de línea se vería como una mancha al lado. */}
            <path d="M3.2 20.8l1.3-4.6A8.5 8.5 0 1 1 7.9 19.5l-4.7 1.3z" />
            <path d="M9 8.4c.3 0 .5.2.6.4l.7 1.6c.1.2 0 .4-.1.5l-.5.6c-.1.2-.2.3-.1.5.4.8 1.4 1.8 2.3 2.2.2.1.4 0 .5-.1l.6-.6c.1-.2.3-.2.5-.1l1.6.7c.2.1.4.3.4.6 0 1-.8 1.7-1.8 1.7-2.9 0-6.2-3.3-6.2-6.2 0-1 .8-1.8 1.7-1.8z" />
          </IconoCuadrado>
        </div>

        {/* El rectángulo curvado con la ubicación. El `aspect-[4/3]` le da alto
            sin fijarlo en píxeles, así entra igual en cualquier ancho.
            `border` rojo + `overflow-hidden`: sin el overflow, las esquinas del
            iframe se comen el redondeo.

            MÁS ANCHO EN ESCRITORIO (2026-09-04, pedido del cliente). El resto
            del footer vive en una columna de 520px —que es lo que le conviene
            al texto, para que las líneas no queden larguísimas— y ahí el mapa
            se veía chico: medido, apenas el 27% del ancho en 1920.
            Se sale de esa columna con `w-[80vw]` y un margen negativo de la
            mitad de lo que sobra: `calc((520px - 80vw) / 2)` a cada lado.
            Así queda CENTRADO respecto de la pantalla, no de la columna.
            **No sirve `left-1/2` + `-ml-[50vw]`**: con el contenedor ya
            centrado, ese desplazamiento se suma al que la columna trae y el
            mapa termina corrido a la derecha — medido, se salía 88px fuera de
            la ventana en 1440.
            El tope de 1100px evita que en pantallas muy anchas quede una
            banda desproporcionada.
            De `sm` para abajo no cambia nada: en el celular ya ocupaba el 91%
            del ancho y el cliente pidió no tocar móvil. */}
        <div className="mt-9 w-full overflow-hidden rounded-2xl border-2 border-primary/70 sm:mx-[calc((520px_-_min(80vw,1100px))/2)] sm:w-[min(80vw,1100px)]">
          <iframe
            src={MAPA_EMBED}
            title={mapa}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            className="block aspect-[4/3] w-full border-0 sm:aspect-[21/9]"
          />
        </div>

        {/* La dirección, debajo del mapa. Es un link a Google Maps: en el
            celular abre la app y arranca el "cómo llegar", que es lo que hace
            alguien que está leyendo una dirección. El TEXTO es exactamente el
            que pidió el cliente. */}
        <a
          href={MAPA_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 font-body text-[clamp(15px,4vw,18px)] font-medium text-foreground transition-colors hover:text-accent"
        >
          {NEGOCIO.direccion} - {NEGOCIO.ciudad}, Argentina
        </a>

        <Image
          src="/logo.png"
          alt={NEGOCIO.nombre}
          width={1258}
          height={722}
          className="mt-12 h-auto w-[clamp(150px,42vw,220px)]"
        />

        {/* El crédito, bien chico. `text-foreground/70`: en blanco pleno
            competiría con la dirección, que es la información que importa. */}
        <p className="mt-8 font-body text-[11px] uppercase tracking-[0.22em] text-foreground/70">
          {creditos}
        </p>
      </div>
    </footer>
  )
}

/**
 * Uno de los dos cuadraditos: un cuadrado con borde rojo y el dibujo en
 * blanco. Recibe el dibujo como hijos —los `<path>`/`<rect>` sueltos— así el
 * `<svg>` con sus atributos de trazo se declara UNA sola vez acá y los dos
 * íconos salen con el mismo grosor de línea.
 */
function IconoCuadrado({
  href,
  etiqueta,
  children,
}: {
  href: string
  etiqueta: string
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={etiqueta}
      className="grid size-14 place-items-center rounded-xl border-2 border-primary/70 text-foreground transition-[background-color,transform] hover:-translate-y-0.5 hover:bg-primary active:scale-[.97]"
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden
        className="size-7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {children}
      </svg>
    </a>
  )
}
