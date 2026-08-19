import { type Metadata, type Viewport } from 'next'
import { body, display } from './fonts'
import { NEGOCIO, SITE_URL } from '@/lib/constants'
import { getRestaurantSchema } from '@/lib/schema'
import { PantallaCarga } from '@/components/ui/PantallaCarga'
import '@/styles/globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${NEGOCIO.nombre} — Hamburguesas a la brasa en ${NEGOCIO.ciudad}`,
    template: `%s · ${NEGOCIO.nombre}`,
  },
  description:
    'Hamburguesas a la brasa con carne fresca y pan de masa madre. Pedí online o acercate: solo por las noches, en Rosario.',
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    siteName: NEGOCIO.nombre,
    url: SITE_URL,
    title: `${NEGOCIO.nombre} — Hamburguesas a la brasa en ${NEGOCIO.ciudad}`,
    description:
      'Hamburguesas a la brasa con carne fresca y pan de masa madre. Solo por las noches.',
    // TODO(diseño): crear public/og.jpg de 1200x630 y verificar la preview por WhatsApp.
    images: [{ url: '/og.jpg', width: 1200, height: 630, alt: NEGOCIO.nombre }],
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: '#1b1a1a',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR" className={`${display.variable} ${body.variable}`}>
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
