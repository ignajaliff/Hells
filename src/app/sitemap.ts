import { type MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/constants'

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
