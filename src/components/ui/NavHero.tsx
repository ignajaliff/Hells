'use client'

import { useState } from 'react'
import Image from 'next/image'
import { navLinks, heroContent } from '@/content/home'
import { LINK_PEDIDOS, NEGOCIO } from '@/lib/constants'

/**
 * NavHero — el navegador del sitio.
 *
 * ES STICKY Y VIVE FUERA DEL HERO (2026-09-02, pedido del cliente). Antes era
 * la primera capa DENTRO del `<section>` del hero, y ahí `position: sticky` no
 * sirve: el hero tiene `overflow-hidden` —lo necesita, la burger se sale por
 * los costados— y un ancestro con overflow convierte al nav en sticky RESPECTO
 * DE ESE ANCESTRO, o sea que se despegaría al terminar el hero. Por eso ahora
 * se monta en `page.tsx`, como hermano del hero.
 *
 * ALTURA FIJA (`--nav`, en globals.css): el hero la resta de su `100svh` para
 * que la primera pantalla siga midiendo exactamente lo mismo que cuando el nav
 * estaba adentro. Si cambia el contenido del nav, medir y actualizar el token.
 *
 * Tres columnas (`1fr auto 1fr`) para que los links queden centrados en la
 * pantalla de verdad, sin que los corra el ancho del logo o del botón.
 *
 * Lleva **fondo sólido** (`bg-background`) a propósito: por detrás pasan las
 * palabras de marca del hero y sin fondo se leen cruzando los links. Ahora
 * además es lo que lo separa de las secciones al scrollear por encima.
 *
 * En móvil los links no entran, así que se pliegan en un menú desplegable. El
 * diseño original es solo desktop (1440x900) y no define este caso — se
 * resolvió acá para no dejar el nav roto en el celular, que es de donde llega
 * la mayoría del tráfico.
 */
export function NavHero() {
  const [abierto, setAbierto] = useState(false)

  return (
    <nav className="sticky top-0 z-50 h-[var(--nav)] bg-background px-5 sm:px-8 lg:px-14">
      <div className="grid h-full grid-cols-[1fr_auto] items-center gap-x-6 lg:grid-cols-[1fr_auto_1fr] lg:gap-x-[clamp(24px,3vw,48px)]">
        {/* EL LOGO DE MARCA (2026-09-02, pedido del cliente): reemplaza al
            sticker "Demons Crew", que se borró. Es el mismo lockup que estaba
            en el hero — de ahí se sacó, justamente, porque tenerlo en los dos
            lados lo duplicaba.
            Va por ALTURA y no por ancho: el lockup es 1.74:1 y lo que tiene
            que encajar es el alto del nav. */}
        <a href={`#${'inicio'}`} className="justify-self-start" aria-label={NEGOCIO.nombre}>
          <Image
            src="/logo.png"
            alt={NEGOCIO.nombre}
            width={1258}
            height={722}
            priority
            className="h-[34px] w-auto sm:h-[40px] lg:h-[48px]"
          />
        </a>

        {/* Links: centrados en desktop, plegados en un menú en móvil. */}
        <div className="hidden items-center gap-[clamp(18px,2.6vw,44px)] lg:flex">
          {navLinks.map((link) => (
            <LinkNav key={link.label} {...link} />
          ))}
        </div>

        <a
          href={LINK_PEDIDOS}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden justify-self-end whitespace-nowrap rounded-xl border-2 border-primary px-[26px] py-3 font-display text-[15px] uppercase tracking-[0.06em] text-foreground transition-colors hover:bg-primary active:scale-[.97] lg:inline-flex lg:items-center lg:gap-3.5"
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

      {/* El desplegable va ABSOLUTO, colgado del pie del nav: el nav ahora
          tiene altura fija (`--nav`) y si el menú fuera parte del flujo lo
          estiraría, rompiendo la cuenta que hace el hero.
          Lleva fondo sólido porque se abre sobre el contenido de la página. */}
      {abierto && (
        <div className="absolute inset-x-0 top-full flex flex-col gap-4 border-t border-border bg-background px-5 pb-5 pt-4 sm:px-8 lg:hidden">
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
