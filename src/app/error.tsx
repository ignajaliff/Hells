'use client'

import { useEffect } from 'react'

/**
 * Error boundary global. Mensaje amigable, cero detalles técnicos
 * (ai-pmp/error-handling.txt §6).
 */
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') console.error(error)
  }, [error])

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden">
      <div aria-hidden className="brasa-glow absolute inset-0 -z-10" />
      <div className="mx-auto w-full max-w-3xl px-6 text-center">
        <h1 className="font-display text-3xl uppercase leading-tight text-balance sm:text-5xl">
          Se nos fue de las manos
        </h1>
        <p className="mx-auto mt-5 max-w-md font-body text-muted-foreground text-pretty">
          Algo falló de nuestro lado. Probá de nuevo en un segundo.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-9 inline-flex min-h-[52px] items-center justify-center rounded-marca bg-primary px-8 py-4 font-body text-sm font-semibold uppercase tracking-[0.18em] text-primary-foreground transition-all duration-300 hover:brightness-110 active:scale-[0.98]"
        >
          Reintentar
        </button>
      </div>
    </section>
  )
}
