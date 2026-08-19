import { type NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Deploy en CapRover / Docker (ver ai-pmp/rules.txt § Deploy).
  // Si el proyecto pasa a Vercel, borrar esta línea.
  output: 'standalone',
  images: {
    formats: ['image/avif', 'image/webp'],
  },
}

export default nextConfig
