import { type ReactNode } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

type BotonProps = {
  href: string
  children: ReactNode
  variante?: 'primario' | 'secundario'
  className?: string
}

const base =
  'inline-flex items-center justify-center gap-2 rounded-marca px-8 py-4 font-body text-sm font-semibold uppercase tracking-[0.18em] transition-all duration-300 min-h-[52px]'

const variantes = {
  primario:
    'bg-primary text-primary-foreground shadow-[0_0_0_0_hsl(var(--primary)/0.55)] hover:shadow-[0_0_36px_0_hsl(var(--primary)/0.55)] hover:brightness-110 active:scale-[0.98]',
  secundario:
    'border border-border text-foreground hover:border-primary hover:text-accent active:scale-[0.98]',
} as const

/** Pieza de UI pura: no sabe de dónde viene nada, recibe todo por props. */
export function Boton({ href, children, variante = 'primario', className }: BotonProps) {
  return (
    <Link href={href} className={cn(base, variantes[variante], className)}>
      {children}
    </Link>
  )
}
