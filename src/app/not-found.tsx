import { type Metadata } from 'next'
import { Boton } from '@/components/ui/Boton'

export const metadata: Metadata = {
  title: 'Página no encontrada',
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden">
      <div aria-hidden className="brasa-glow absolute inset-0 -z-10" />
      <div className="mx-auto w-full max-w-3xl px-6 text-center">
        <p className="font-display text-7xl text-primary sm:text-8xl">404</p>
        <h1 className="mt-4 font-display text-3xl uppercase leading-tight text-balance sm:text-5xl">
          Esta página se quemó
        </h1>
        <p className="mx-auto mt-5 max-w-md font-body text-muted-foreground text-pretty">
          El link que seguiste no existe o cambió de lugar. Volvé al inicio y seguimos.
        </p>
        <Boton href="/" className="mt-9">
          Volver al inicio
        </Boton>
      </div>
    </section>
  )
}
