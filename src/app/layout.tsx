import { type Metadata, type Viewport } from 'next'
import { body, display, grafiti } from './fonts'
import { SITE_URL } from '@/lib/constants'
import { getRestaurantSchema } from '@/lib/schema'
import { PantallaCarga } from '@/components/ui/PantallaCarga'
import '@/styles/globals.css'

/**
 * Metadata reducida a la marca sola (2026-08-21, pedido del cliente): el copy
 * anterior ("Hamburguesas a la brasa en Rosario…") era placeholder sin aprobar
 * y decía cualquier cosa. Hasta que haya copy real, pestaña y previews dicen
 * solo HELLS BURGUERS.
 * OJO SEO: una description igual al nombre no cumple seo-rules.txt §1
 * (140-160 caracteres para el resultado de Google) — reponer cuando el
 * cliente apruebe el texto definitivo.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'HELLS BURGUERS',
    template: '%s · HELLS BURGUERS',
  },
  description: 'HELLS BURGUERS',
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    siteName: 'HELLS BURGUERS',
    url: SITE_URL,
    title: 'HELLS BURGUERS',
    description: 'HELLS BURGUERS',
    // TODO(diseño): crear public/og.jpg de 1200x630 y verificar la preview por WhatsApp.
    images: [{ url: '/og.jpg', width: 1200, height: 630, alt: 'HELLS BURGUERS' }],
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: '#1b1a1a',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR" className={`${display.variable} ${body.variable} ${grafiti.variable}`}>
      <body className="min-h-screen antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(getRestaurantSchema()) }}
        />
        <PantallaCarga />
        <main>{children}</main>
      </body>
    </html>
  )
}
