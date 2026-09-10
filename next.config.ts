import { type NextConfig } from 'next'

/**
 * DOS SALIDAS, SEGÚN CÓMO SE DEPLOYE (2026-09-09):
 *
 * * `npm run build`           → **standalone**, para Docker/CapRover. Es lo que
 *   había y no cambia en nada.
 * * `npm run build:hostinger` → **export estático** a `out/`, para el hosting
 *   COMPARTIDO de Hostinger, que sirve archivos desde `public_html` y no corre
 *   Node. Se puede porque la web no tiene una sola API de servidor: `src/app`
 *   son páginas más `robots.ts` y `sitemap.ts`, que en export se generan como
 *   archivos.
 *
 * **Se distingue por `npm_lifecycle_event`**, que npm setea con el NOMBRE del
 * script que se está corriendo. Es a propósito y no una variable de entorno:
 * `VAR=1 next build` no funciona en PowerShell ni en cmd, así que en Windows
 * haría falta `cross-env`, o sea una dependencia nueva.
 */
const estatico = process.env.npm_lifecycle_event === 'build:hostinger'

const nextConfig: NextConfig = {
  output: estatico ? 'export' : 'standalone',
  images: estatico
    ? // SIN SERVIDOR NO HAY OPTIMIZADOR DE IMÁGENES, así que `next/image` tiene
      // que servir los archivos tal como están. No se pierde casi nada: las
      // imágenes de `public/` ya están convertidas a WebP y recortadas a
      // medida (el fondo del hero pesa 19KB, los stickers 8-39KB). Lo único
      // que se resigna es el AVIF, que ahorraría un ~15% más.
      // `unoptimized` es OBLIGATORIO acá: sin esto el build de export falla.
      { unoptimized: true }
    : { formats: ['image/avif', 'image/webp'] },
}

export default nextConfig
