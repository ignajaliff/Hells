'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { navLinks, heroContent } from '@/content/home'
import { LINK_PEDIDOS, NEGOCIO, SECCIONES } from '@/lib/constants'
import { useSeccionActiva } from '@/lib/useSeccionActiva'

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
 * ALTURA FIJA (`--nav`, en globals.css): en ESCRITORIO el hero la resta de su
 * `100svh` para que la primera pantalla siga midiendo exactamente lo mismo que
 * cuando el nav estaba adentro. Si cambia el contenido del nav, medir y
 * actualizar el token.
 *
 * EN MÓVIL SE ESCONDE MIENTRAS SE VE EL HERO (2026-09-07, pedido del cliente)
 * y entra al scrollear más abajo. Dos cosas van juntas:
 * * Pasa a `fixed` (`fixed lg:sticky`), o sea FUERA DEL FLUJO: si siguiera
 *   siendo sticky, esconderlo dejaría su hueco de 66px reservado igual y el
 *   hero arrancaría más abajo. Por eso en móvil **el hero ya no resta
 *   `--nav`**: ahora toma la pantalla entera (ver `Hero.tsx`).
 * * Aparece al pasar LA MITAD del hero (2026-09-07, pedido del cliente). El
 *   umbral se mide contra el alto real del hero, no contra un número fijo:
 *   el hero es `min-h`, así que en pantallas cortas crece y la cuenta lo
 *   sigue sola.
 * En escritorio no cambia nada: `lg:sticky`, siempre visible.
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

  /* EL ÓVALO SIGUE AL SCROLL (2026-09-04, pedido del cliente): marca la
     sección que el visitante está mirando, en vez de quedarse clavado en
     "Inicio". Los ids salen del `href` de cada link, así que no hay una
     segunda lista que mantener sincronizada — si se agrega un link a una
     sección nueva, el óvalo lo sigue solo.
     `useMemo` porque el array es dependencia del efecto del hook: recreado en
     cada render, volvería a montar los listeners en cada scroll. */
  const idsSecciones = useMemo(
    () => navLinks.map((l) => l.href.replace('#', '')),
    [],
  )
  const seccionActiva = useSeccionActiva(idsSecciones)

  /* ¿Todavía no se pasó la MITAD del hero? Mientras sea así, en móvil el nav
     se va para arriba (ver la doc de arriba). Arranca en `true` para que el
     primer pintado ya lo tenga escondido: si arrancara en `false` se vería el
     nav un instante y saldría solo, que es justo lo que se quiso evitar.

     Es un listener de scroll y no un `IntersectionObserver` (2026-09-07,
     pedido del cliente: "que aparezca pasando la mitad del hero"). Con el
     observer el nav entraba recién cuando el hero terminaba de salir del todo
     —o sea una pantalla entera sin nav—; el umbral de la mitad no es un borde
     de elemento, así que no hay nada que observar y sale más directo
     comparando contra el alto del hero. `offsetHeight` se lee en cada evento
     a propósito: el hero es `min-h` y puede crecer en pantallas cortas.
     `setState` con el mismo valor no re-renderiza, así que scrollear no
     cuesta nada. */
  const [heroALaVista, setHeroALaVista] = useState(true)

  useEffect(() => {
    const hero = document.getElementById(SECCIONES.hero)
    if (!hero) return
    const alScrollear = () => setHeroALaVista(window.scrollY < hero.offsetHeight / 2)
    alScrollear()
    window.addEventListener('scroll', alScrollear, { passive: true })
    window.addEventListener('resize', alScrollear)
    return () => {
      window.removeEventListener('scroll', alScrollear)
      window.removeEventListener('resize', alScrollear)
    }
  }, [])

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 h-[var(--nav)] bg-background px-5 transition-transform duration-300 sm:px-8 lg:sticky lg:translate-y-0 lg:px-14 lg:transition-none ${
        heroALaVista
          ? 'pointer-events-none -translate-y-full lg:pointer-events-auto'
          : 'translate-y-0'
      }`}
    >
      <div className="grid h-full grid-cols-[1fr_auto_auto] items-center gap-x-3 lg:grid-cols-[1fr_auto_1fr] lg:gap-x-[clamp(24px,3vw,48px)]">
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
            /* MÁS GRANDE de `sm` para arriba (2026-09-04, pedido del cliente):
               48 → 76px en desktop, o sea del 52% al 83% del alto del nav (92px).
               En TABLET va a 50: ahí el nav todavía mide 66px, así que el
               mismo salto lo dejaría pegado a los bordes.
               No cambia `--nav`, así que la cuenta del hero —que le resta esa
               altura a su `100svh`— sigue dando igual.
               MÓVIL QUEDA EN 34px: el cliente pidió no tocarlo, y ahí el nav
               mide 66px, así que subirlo dejaría el logo pegado a los bordes. */
            /* MÓVIL SUBIÓ A 62px CON EL NAV EN 76 (2026-09-10, pedido del cliente:
               "más alto, así el logo queda mejor y no tan apretado"): 55 sobre
               66 era el 83% del alto; 62 sobre 76 es el 82%, o sea el mismo
               logo con 7px de aire a cada lado en vez de 5. */
            className="h-[62px] w-auto sm:h-[55px] lg:h-[76px]"
          />
        </a>

        {/* Links: centrados en desktop, plegados en un menú en móvil. */}
        <div className="hidden items-center gap-[clamp(18px,2.6vw,44px)] lg:flex">
          {navLinks.map((link) => (
            <LinkNav
              key={link.label}
              label={link.label}
              href={link.href}
              activo={link.href.replace('#', '') === seccionActiva}
            />
          ))}
        </div>

        {/* "PEDÍ YA" TAMBIÉN EN MÓVIL, A LA IZQUIERDA DE LA HAMBURGUESA
            (2026-09-10, pedido del cliente). Antes solo existía de `lg` para
            arriba y en el celular había que abrir el menú para pedir. Versión
            compacta —13px, padding corto— para que quepa con el logo de 62px
            en 390 de ancho; de `lg` vuelve a las medidas del diseño. La grilla
            de móvil pasó a tres columnas (`1fr auto auto`) por esto.
            **DEL MISMO ALTO QUE LA HAMBURGUESA Y EN ROJO MACIZO CON LETRAS
            BLANCAS** (2º pedido del mismo día): los dos miden 38px —el de la
            hamburguesa sale de 14 de ícono + 10 de padding por lado + 2 de
            borde por lado, y acá se fija a mano— y comparten `rounded-lg`.
            En `lg` vuelve al botón de contorno del diseño. */}
        <a
          href={LINK_PEDIDOS}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-[38px] items-center gap-2 justify-self-end whitespace-nowrap rounded-lg border-2 border-primary bg-primary px-3.5 font-display text-[13px] uppercase tracking-[0.06em] text-primary-foreground transition-colors active:scale-[.97] lg:h-auto lg:gap-3.5 lg:rounded-xl lg:bg-transparent lg:px-[26px] lg:py-3 lg:text-[15px] lg:text-foreground lg:hover:bg-primary"
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
          className="inline-flex h-[38px] items-center justify-center justify-self-end rounded-lg border-2 border-primary px-2.5 lg:hidden"
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
