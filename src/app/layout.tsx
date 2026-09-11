import { type Metadata, type Viewport } from 'next'
import { body, display, grafiti, grafitiItalica } from './fonts'
import { GA_ID, SITE_URL } from '@/lib/constants'
import { getRestaurantSchema } from '@/lib/schema'
import { PantallaCarga } from '@/components/ui/PantallaCarga'
import '@/styles/globals.css'

/**
 * EL HEAD LLEVA SOLO EL TÍTULO (2026-09-11, pedido del cliente: "que no tenga
 * descripción el head, solo el title").
 * * **Se fueron la `description` y la `og:description`.** Asumido por el
 *   cliente: `seo-rules.txt` §1 pide una description de 140-160 caracteres, y
 *   sin ella **Google arma el resumen del resultado con texto de la página** —
 *   exactamente lo que pasó antes, cuando la description era el nombre
 *   repetido y Google eligió el párrafo de Work ("dejá tu CV y sumate").
 *   Si vuelve a elegir un texto que no conviene, la solución es reponerla.
 * * **El título es la marca sola**, HELL'S BURGERS (2026-09-10).
 * * **La canónica apunta al dominio real SIN `www`** (`alternates.canonical`):
 *   el sitio respondía igual con y sin `www`, y Google veía dos copias de la
 *   misma página. La redirección de `www` vive en `scripts/hostinger.mjs`.
 * * El dominio sale de `SITE_URL` vía `metadataBase` — acá no se escribe.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "HELL'S BURGERS",
    template: "%s · HELL'S BURGERS",
  },
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    siteName: "HELL'S BURGERS",
    url: SITE_URL,
    title: "HELL'S BURGERS",
    // `public/og.jpg` (2026-09-11, pedido del cliente): EL MISMO LOGO DEL NAV
    // (`public/logo.png`) centrado sobre el mismo fondo del nav, sin nada más.
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
            export estático** que se sube a Hostinger.

            ⚠ **"GOOGLE NO DETECTA LA ETIQUETA" NO ES UN PROBLEMA DE ESTE
            CÓDIGO** (2026-09-10, reporte del cliente). Se verificó sobre el
            HTML ya compilado: las dos piezas salen DENTRO del `<head>` y con
            el ID correcto. Lo que Google estaba leyendo era la web PUBLICADA,
            que en ese momento todavía servía el Tag Manager viejo — el zip
            subido a Hostinger se había compilado ANTES de que existiera esta
            etiqueta. **Si vuelve a pasar, lo primero es mirar el "ver código
            fuente" del sitio en vivo, no este archivo.** */}
        {/* Sin `eslint-disable`: el GTM inline disparaba
            `@next/next/next-script-for-ga` y necesitaba uno, pero este `<script
            async src=...>` no la dispara — dejarlo puesto daba un warning de
            directiva sin usar. */}
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
        <script
          dangerouslySetInnerHTML={{
            __html: `  window.dataLayer = window.dataLayer || [];
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
