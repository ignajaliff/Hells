import { type Metadata, type Viewport } from 'next'
import { body, display, grafiti, grafitiItalica } from './fonts'
import { GTM_ID, SITE_URL } from '@/lib/constants'
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
    <html
      lang="es-AR"
      className={`${display.variable} ${body.variable} ${grafiti.variable} ${grafitiItalica.variable}`}
    >
      <head>
        {/* GOOGLE TAG MANAGER (2026-09-09, pedido del cliente).
            Va INLINE y en el `<head>`, tal cual lo entrega Google, y no con
            `next/script`: así el contenedor arranca lo antes posible y el
            snippet queda igual al que GTM verifica cuando prueba la
            instalación. **No bloquea el renderizado**: lo único que corre acá
            es crear un `<script async>` e insertarlo; la descarga de GTM va
            por su cuenta.
            El ID vive en `constants.ts` — acá no se escribe a mano.
            Ojo: esto sale en el HTML de la web compilada, así que **también
            viaja en el export estático** que se sube a Hostinger. */}
        {/* eslint-disable-next-line @next/next/next-script-for-ga --
            La regla sugiere `next/script`, que con `afterInteractive` cargaría
            GTM después de la hidratación. Acá conviene lo contrario: que el
            contenedor arranque cuanto antes —ya hay una pantalla de carga de
            3s por delante— y que el snippet sea idéntico al que Google
            entrega y verifica. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`,
          }}
        />
      </head>
      <body className="min-h-screen antialiased">
        {/* La contraparte del GTM para quien tenga el JS apagado. Google pide
            que sea lo PRIMERO del `<body>`. Es un iframe de 0x0 y oculto. */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            title="Google Tag Manager"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
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
