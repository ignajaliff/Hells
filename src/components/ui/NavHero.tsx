'use client'

import { useState } from 'react'
import Image from 'next/image'
import { navLinks, heroContent } from '@/content/home'
import { LINK_PEDIDOS } from '@/lib/constants'

/**
 * NavHero — el navegador del hero.
 *
 * Tres columnas (`1fr auto 1fr`) para que los links queden centrados en la
 * pantalla de verdad, sin que los corra el ancho del sticker o del botón.
 *
 * Lleva **fondo sólido** (`bg-background`) a propósito: por detrás pasan las
 * palabras de marca y sin fondo se leen cruzando los links.
 * Se sacó un momento el 2026-08-21, cuando el fondo era una sola imagen que
 * reservaba aire arriba (las palabras arrancaban al 17% del alto, por debajo del
 * nav). Al pasar el móvil a un mosaico repetido las palabras vuelven a llegar
 * hasta el borde superior, así que el fondo es necesario de nuevo.
 *
 * En móvil los links no entran, así que se pliegan en un menú desplegable. El
 * diseño original es solo desktop (1440x900) y no define este caso — se
 * resolvió acá para no dejar el nav roto en el celular, que es de donde llega
 * la mayoría del tráfico.
 */
export function NavHero() {
  const [abierto, setAbierto] = useState(false)

  return (
    <nav className="relative z-[6] shrink-0 bg-background px-5 py-3.5 sm:px-8 lg:px-14">
      <div className="grid grid-cols-[1fr_auto] items-center gap-x-6 lg:grid-cols-[1fr_auto_1fr] lg:gap-x-[clamp(24px,3vw,48px)]">
        {/* OJO CON EL TAMAÑO: el handoff pide `height: 130px`, pero sobre el
            PNG original, que tenía 32% de aire arriba y 27% abajo — el
            lettering visible quedaba en ~53px y lo que desbordaba del nav era
            transparencia, no dibujo.
            Acá el asset va RECORTADO al dibujo (632x390, sin aire), así que a
            130px se vería más del doble de grande que en el diseño. 53px es
            el alto que iguala el tamaño visual real, verificado comparando
            los dos renders. Por lo mismo tampoco lleva el `margin: -22px`:
            sin aire alrededor, el dibujo no necesita desbordar. */}
        <Image
          src="/sticker-demons-crew.png"
          alt=""
          width={632}
          height={390}
          priority
          className="relative z-[7] h-[38px] w-auto -rotate-3 justify-self-start sm:h-[46px] lg:h-[53px]"
        />

        {/* Links: centrados en desktop, plegados en un menú en móvil. */}
        <div className="hidden items-center gap-[clamp(18px,2.6vw,44px)] lg:flex">
          {navLinks.map((link) => (
            <LinkNav key={link.label} {...link} />
          ))}
        </div>

        <a
          href="#"
          className="hidden justify-self-end whitespace-nowrap rounded-xl border-2 border-primary px-[30px] py-4 font-display text-[15px] uppercase tracking-[0.06em] text-foreground transition-colors hover:bg-primary active:scale-[.97] lg:inline-flex lg:items-center lg:gap-3.5"
        >
          {heroContent.cta.primario}{' '}
          <span className="font-body text-lg font-extrabold">→</span>
        </a>

        {/* Botón hamburguesa — solo móvil. */}
        <button
          type="button"
          onClick={() => setAbierto((v) => !v)}
          aria-expanded={abierto}
          aria-label={abierto ? 'Cerrar menú' : 'Abrir menú'}
          className="justify-self-end rounded-lg border-2 border-primary p-2.5 lg:hidden"
        >
          <span className="sr-only">Menú</span>
          <svg width="20" height="14" viewBox="0 0 20 14" aria-hidden>
            {(abierto ? [7] : [1, 7, 13]).map((y) => (
              <rect key={y} y={y - 1} width="20" height="2" rx="1" fill="currentColor" />
            ))}
          </svg>
        </button>
      </div>

      {/* El desplegable SÍ lleva fondo sólido: se abre sobre las palabras del
          fondo ilustrado y sin él los links quedarían cruzados por el
          lettering. Los márgenes negativos lo estiran hasta los bordes de la
          pantalla, así el fondo no corta a la mitad del padding del nav. */}
      {abierto && (
        <div className="-mx-5 mt-4 flex flex-col gap-4 border-t border-border bg-background px-5 pb-1 pt-4 sm:-mx-8 sm:px-8 lg:hidden">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setAbierto(false)}
              className="font-display text-lg uppercase tracking-[0.04em] text-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </a>
          ))}
          <a
            href={LINK_PEDIDOS}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-flex items-center gap-3 self-start rounded-xl bg-primary px-7 py-4 font-display text-[15px] uppercase tracking-[0.06em] text-primary-foreground"
          >
            {heroContent.cta.primario}{' '}
            <span className="font-body text-lg font-extrabold">→</span>
          </a>
        </div>
      )}
    </nav>
  )
}

/**
 * Un link del nav. El activo lleva un óvalo rojo dibujado alrededor, con
 * pinta de garabato hecho a mano: la elipse va rotada y con el trazo cortado
 * (`stroke-dasharray` con un `offset` chico) para que no cierre perfecto —
 * un óvalo exacto se leería como un borde, no como algo dibujado encima.
 */
function LinkNav({
  label,
  href,
  activo,
}: {
  label: string
  href: string
  activo: boolean
}) {
  const clases =
    'font-display text-[17px] uppercase tracking-[0.04em] text-foreground transition-colors hover:text-primary'

  if (!activo) {
    return (
      <a href={href} className={clases}>
        {label}
      </a>
    )
  }

  return (
    <span className="relative inline-flex items-center justify-center px-3.5 py-2">
      <svg
        viewBox="0 0 120 52"
        aria-hidden
        className="absolute -inset-1.5 h-[calc(100%+12px)] w-[calc(100%+12px)]"
        preserveAspectRatio="none"
      >
        <ellipse
          cx="60"
          cy="26"
          rx="55"
          ry="21"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray="310"
          strokeDashoffset="12"
          transform="rotate(-4 60 26)"
        />
      </svg>
      <a href={href} className={`relative ${clases}`}>
        {label}
      </a>
    </span>
  )
}
