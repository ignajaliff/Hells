import { type Metadata, type Viewport } from 'next'
import { body, display, grafiti, grafitiItalica } from './fonts'
import { GA_ID, SITE_URL } from '@/lib/constants'
import { getRestaurantSchema } from '@/lib/schema'
import { PantallaCarga } from '@/components/ui/PantallaCarga'
import '@/styles/globals.css'

/**
 * NOMBRE Y DESCRIPCIÓN REALES (2026-09-10, pedido del cliente: "poné bien el
 * nombre en el head, que sea hells burgers, y la descripción").
 *
 * **Se fue la U de "BURGUERS"**, que estaba mal escrito en los siete lugares
 * donde aparecía (pestaña, plantilla, OG, alt). Va **HELL'S BURGERS**: el
 * cliente lo pidió plural y sin la U, y el apóstrofo es el de la marca —el
 * logo y `NEGOCIO.nombre` dicen "Hell's Burger".
 *
 * **La descripción ya no es el nombre repetido.** Desde el 2026-08-21 decía
 * "HELLS BURGUERS" a secas, con una nota de deuda: una description igual al
 * nombre **no cumple `seo-rules.txt` §1**, que pide 140-160 caracteres escritos
 * para humanos porque ése es el texto del resultado de Google. Ahora los tiene
 * y menciona lo que el negocio hace y dónde (Mendoza), que es lo que la regla
 * pide para un comercio local. El dato de la dirección es real (ficha de Maps,
 * 2026-09-02), así que no se está publicando nada inventado.
 *
 * El `title` entra en los 50-60 caracteres de la regla.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "HELL'S BURGERS — Hamburguesas en Mendoza",
    template: "%s · HELL'S BURGERS",
  },
  description:
    "Hamburguesas artesanales en Mendoza. Doce burgers para pecar, con papas sazonadas. Pedí por WhatsApp o pasá por Olascoaga 715. Hell's Burgers.",
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    siteName: "HELL'S BURGERS",
    url: SITE_URL,
    title: "HELL'S BURGERS — Hamburguesas en Mendoza",
    description:
      "Hamburguesas artesanales en Mendoza. Doce burgers para pecar, con papas sazonadas. Pedí por WhatsApp o pasá por Olascoaga 715. Hell's Burgers.",
    // TODO(diseño): crear public/og.jpg de 1200x630 y verificar la preview por WhatsApp.
    images: [{ url: '/og.jpg', width: 1200, height: 630, alt: "HELL'S BURGERS" }],
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
        {/* GOOGLE ANALYTICS 4 — gtag.js (2026-09-10, pedido del cliente).
            **REEMPLAZÓ AL GOOGLE TAG MANAGER** (`GTM-WTL23CKL`) que estaba acá
            desde el 2026-09-09. Eran las DOS piezas del mismo GTM —el script
            de este `<head>` y el `<noscript>` con el iframe al tope del
            `<body>`—, no dos etiquetas distintas; se fueron las dos.
            ⚠ **Ese contenedor de GTM queda desconectado**: si tenía etiquetas
            configuradas adentro, dejan de dispararse. Se avisó al cliente.

            gtag NO necesita contraparte en el `<body>`: sin JS no mide, y
            listo. Por eso el `<noscript>` no se reemplazó por otro.

            Va INLINE y tal cual lo entrega Google, no con `next/script`: así
            la etiqueta arranca lo antes posible y el snippet queda idéntico al
            que Google verifica al probar la instalación. **No bloquea el
            renderizado** — el `src` es `async`.
            El ID vive en `constants.ts` — acá no se escribe a mano.
            Ojo: esto sale en el HTML compilado, así que **también viaja en el
            export estático** que se sube a Hostinger. */}
        {/* Sin `eslint-disable`: el GTM inline disparaba
            `@next/next/next-script-for-ga` y necesitaba uno, pero este `<script
            async src=...>` no la dispara — dejarlo puesto daba un warning de
            directiva sin usar. */}
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', '${GA_ID}');`,
          }}
        />
      </head>
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
