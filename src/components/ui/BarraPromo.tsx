import { marqueeFrases } from '@/content/home'

/**
 * BarraPromo — la franja roja que corre bajo el nav.
 *
 * El loop es continuo por construcción: la pista va DUPLICADA y la animación
 * la desplaza exactamente -50%. Cuando la primera copia terminó de salir, la
 * segunda está justo donde arrancó la primera, así que al reiniciarse no hay
 * salto ni hueco. Es la razón de que el `translateX` del keyframe sea -50% y
 * no otro valor: los dos números están atados.
 *
 * Las frases se repiten lo suficiente para llenar pantallas anchas — si la
 * pista fuera más corta que el viewport se vería el vacío entre copias.
 *
 * `aria-hidden` en la segunda copia: para un lector de pantalla el texto ya
 * está una vez y repetirlo sería ruido.
 */

/** Cuántas veces se repiten las frases dentro de UNA pista. */
const REPETICIONES = 3

function Pista({ oculta }: { oculta?: boolean }) {
  return (
    <div aria-hidden={oculta} className="flex shrink-0">
      {Array.from({ length: REPETICIONES }).map((_, i) =>
        marqueeFrases.map((frase) => (
          <span key={`${i}-${frase}`} className="px-7">
            {frase}
          </span>
        )),
      )}
    </div>
  )
}

export function BarraPromo() {
  return (
    <div className="relative z-[5] shrink-0 overflow-hidden bg-primary py-[9px]">
      <div className="marquee-pista flex w-max animate-[marquee_24s_linear_infinite] font-display text-[15px] uppercase tracking-[0.14em] text-primary-foreground will-change-transform">
        <Pista />
        <Pista oculta />
      </div>
    </div>
  )
}
