import { workContent } from '@/content/home'
import { LINK_TRABAJO, SECCIONES } from '@/lib/constants'

/**
 * Work — "Sumate!" (2026-09-02, pedido del cliente): el aviso de búsqueda de
 * personal. Un mensaje corto y un solo botón al formulario de postulación.
 *
 * La composición va CENTRADA y en una columna angosta (`max-w-[46ch]`), al
 * revés que la carta y nosotros, que van pegadas a la izquierda: acá hay una
 * sola cosa para hacer y el centrado la señala sin competencia. El texto es
 * el argumento y el botón es la conclusión, uno debajo del otro.
 *
 * FONDO ROJO HELL'S (`--primary`) — 2026-09-02, pedido del cliente. Antes era
 * carbón. Entre dos secciones negras (nosotros arriba, el footer abajo) el
 * bloque rojo corta la página y hace que el aviso de búsqueda se lea como algo
 * aparte de la carta.
 *
 * TODO EL TEXTO EN BLANCO, y no en carbón: sobre este rojo el carbón da 3.40:1,
 * que solo alcanza para texto grande. Es la misma regla que ya regía en la
 * sección roja anterior ("Las Burgas", borrada el 2026-09-01): sobre el rojo,
 * el texto chico va blanco.
 *
 * OJO — VA `--primary-foreground` Y NO `--foreground`: el color de texto normal
 * de la web es #f5f5f5 ("hueso"), y sobre este rojo da 4.21:1, que NO llega al
 * 4.5:1 de AA para texto normal (medido; el párrafo son 15.6px en móvil).
 * `--primary-foreground` es blanco PURO y existe justamente para esto: 4.66:1.
 * En el resto de la web los dos se ven igual, acá no.
 *
 * El rótulo va en Splatink (`font-grafiti`), el rol que le dio la comunidad
 * de la marca. "Buscamos crew" no lleva tildes ni eñes, que es la condición
 * para usarla — la fuente no las trae. **Es el único lugar de la web donde
 * quedó Splatink** desde que el rótulo de nosotros se fue (2026-09-02).
 *
 * EL BOTÓN SE INVIRTIÓ: era rojo sobre carbón —o sea invisible sobre este
 * fondo—, así que ahora es un bloque CARBÓN con el texto blanco (15.96:1
 * adentro). El hover ya no puede ir al naranja `--highlight`: sobre el rojo se
 * ensucia. Va al negro, que sobre el rojo se lee como que el botón se hunde.
 * No usa el componente `Boton` porque ese va con `next/link` y tipografía de
 * cuerpo, y acá el destino es un dominio ajeno (Google Forms), que necesita
 * `target="_blank"` + `rel="noopener noreferrer"`.
 */
export function Work() {
  const { rotulo, titulo, texto, cta } = workContent

  return (
    <section
      id={SECCIONES.work}
      className="relative overflow-hidden bg-primary px-4 py-20 sm:px-8 sm:py-28 lg:px-14"
    >
      <div className="mx-auto flex max-w-[46ch] flex-col items-center text-center">
        <p className="font-grafiti text-[clamp(18px,5vw,30px)] tracking-wide text-primary-foreground">
          {rotulo}
        </p>

        <h2 className="mt-1 font-display text-[clamp(52px,15vw,150px)] uppercase leading-[0.9] tracking-[-0.02em] text-primary-foreground">
          {titulo}
        </h2>

        <p className="mt-6 font-body text-[clamp(15px,4vw,18px)] leading-relaxed text-primary-foreground">
          {texto}
        </p>

        {/* `w-full sm:w-auto`: en móvil el botón ocupa la columna entera —el
            mismo criterio que los CTAs del hero, donde a ancho completo son
            un blanco de toque más grande—; de `sm` para arriba se ajusta a
            su texto para no quedar como una barra. */}
        <a
          href={LINK_TRABAJO}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-9 inline-flex w-full items-center justify-center rounded-xl bg-background px-[clamp(32px,6vw,52px)] py-[clamp(16px,2.2vh,20px)] font-display text-[clamp(16px,4.4vw,20px)] uppercase tracking-[0.06em] text-foreground transition-[background-color,transform] hover:-translate-y-0.5 hover:bg-black active:scale-[.97] sm:w-auto"
        >
          {cta}
        </a>
      </div>
    </section>
  )
}
