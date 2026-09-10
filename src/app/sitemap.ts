import { type MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/constants'

/**
 * `force-static` es lo que le permite existir al export estático
 * (`npm run build:hostinger`, para el hosting compartido de Hostinger): sin
 * esto Next no puede saber si la ruta depende de algo del request y corta el
 * build. **No cambia nada en el deploy de Docker**: ahí esta ruta ya se
 * resolvía una sola vez, al compilar.
 */
export const dynamic = 'force-static'

/** Una entrada por página real. Actualizar al crear una ruta nueva. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ]
}
