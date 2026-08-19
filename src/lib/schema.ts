import { NEGOCIO, SITE_URL } from './constants'
import { DEFAULTS } from './defaults'

/**
 * JSON-LD de LocalBusiness (ai-pmp/seo-rules.txt §3).
 * Se genera en build: usa siempre los defaults, no necesita frescura.
 * TODO(cliente): completar geo y openingHours reales antes de publicar.
 */
export function getRestaurantSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: NEGOCIO.nombre,
    description: NEGOCIO.claim,
    url: SITE_URL,
    telephone: NEGOCIO.telefono,
    email: NEGOCIO.email,
    servesCuisine: 'Hamburguesas',
    priceRange: '$$',
    image: `${SITE_URL}/og.jpg`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: NEGOCIO.direccion,
      addressLocality: NEGOCIO.ciudad,
      addressRegion: NEGOCIO.provincia,
      postalCode: NEGOCIO.codigoPostal,
      addressCountry: NEGOCIO.pais,
    },
    openingHours: DEFAULTS.horarios.texto,
    sameAs: [NEGOCIO.instagram],
  }
}
