/**
 * Prepara `out/` para el hosting compartido de Hostinger (2026-09-09).
 * Corre solo, después de `next build`, vía `npm run build:hostinger`.
 *
 * Hace tres cosas:
 * 1. Escribe los dos `.htaccess` que Apache/LiteSpeed necesita (404 propio,
 *    caché y la redirección de www). Van generados acá y NO en `public/`: Next no copia los archivos
 *    que empiezan con punto, así que puestos ahí nunca llegarían a `out/`.
 * 2. AUDITA que no se haya colado nada interno — es el requisito del pedido:
 *    ni `ai-pmp`, ni `KNOW - HOW WEB`, ni `CLAUDE.md`, ni una mención a
 *    Claude. Si aparece algo, corta con error en vez de avisar por lo bajo.
 * 3. Informa cuánto pesa lo que hay que subir.
 */
import fs from 'node:fs'
import path from 'node:path'

const OUT = path.resolve('out')
if (!fs.existsSync(OUT)) {
  console.error('✗ No existe out/. ¿Corriste `npm run build:hostinger`?')
  process.exit(1)
}

// ── 1. Los .htaccess ──────────────────────────────────────────────────────
// El de la raíz: la 404 de la web y el HTML SIN caché. El HTML es el que
// apunta a los nombres con hash del JS y el CSS; si se cachea, después de
// actualizar la web el visitante sigue viendo la versión vieja hasta que
// recargue a mano. Es el mismo motivo por el que un deploy "no se ve".
fs.writeFileSync(
  path.join(OUT, '.htaccess'),
  `# Hell's Burger — configuración de Apache/LiteSpeed para Hostinger.
# Generado por scripts/hostinger.mjs. No editar a mano: se reescribe.

# La página 404 de la web, en vez de la de Hostinger.
ErrorDocument 404 /404.html

# UNA SOLA VERSIÓN DEL SITIO: www redirige a la dirección sin www, con un 301
# (permanente), que es el que le dice a Google que las dos son la misma página.
# Sin esto las dos respondían 200 y Google veía el sitio duplicado.
# La condición toma el dominio de la propia petición, así que no hay que
# escribirlo acá: si cambia el dominio, la regla sigue sirviendo.
# Solo se toca el www — forzar https acá podría entrar en bucle detrás de la
# CDN de Hostinger, que es la que termina el certificado.
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteCond %{HTTP_HOST} ^www\\.(.+)$ [NC]
  RewriteRule ^ https://%1%{REQUEST_URI} [R=301,L]
</IfModule>

<IfModule mod_headers.c>
  # El HTML nunca se cachea: es el que apunta a los archivos con hash.
  <FilesMatch "\\.html$">
    Header set Cache-Control "no-cache, must-revalidate"
  </FilesMatch>
  # Las imágenes y fuentes de public/ NO llevan hash en el nombre, así que
  # una semana y no un año: si se reemplaza un archivo con el mismo nombre,
  # el visitante lo ve en días y no en meses.
  <FilesMatch "\\.(webp|png|jpg|jpeg|svg|ico|avif|woff2)$">
    Header set Cache-Control "public, max-age=604800"
  </FilesMatch>
</IfModule>
`,
  'utf8',
)

// El de _next/: todo lo de acá LLEVA HASH en el nombre, o sea que un archivo
// dado nunca cambia de contenido. Se puede cachear un año sin riesgo, y es
// lo que hace que la segunda visita cargue instantánea.
fs.mkdirSync(path.join(OUT, '_next'), { recursive: true })
fs.writeFileSync(
  path.join(OUT, '_next', '.htaccess'),
  `# Archivos con hash en el nombre: inmutables.
<IfModule mod_headers.c>
  Header set Cache-Control "public, max-age=31536000, immutable"
</IfModule>
`,
  'utf8',
)

// ── 2. La auditoría ───────────────────────────────────────────────────────
const PROHIBIDO = [/claude/i, /anthropic/i, /ai-pmp/i, /know\s*-?\s*how/i, /originales[/\\]/i]
const TEXTO = /\.(html|css|js|json|txt|xml|map)$/i

const archivos = []
;(function recorrer(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    e.isDirectory() ? recorrer(p) : archivos.push(p)
  }
})(OUT)

const delitos = []
for (const abs of archivos) {
  const rel = path.relative(OUT, abs).replace(/\\/g, '/')
  for (const re of PROHIBIDO) {
    if (re.test(rel)) delitos.push(`nombre de archivo: ${rel} (${re})`)
  }
  if (TEXTO.test(abs)) {
    const txt = fs.readFileSync(abs, 'utf8')
    for (const re of PROHIBIDO) {
      const m = txt.match(re)
      if (m) delitos.push(`contenido de ${rel}: "${m[0]}"`)
    }
  }
}

const bytes = archivos.reduce((s, f) => s + fs.statSync(f).size, 0)
const mb = (bytes / 1024 / 1024).toFixed(2)

if (delitos.length) {
  console.error(`\n✗ Se coló material interno en out/ (${delitos.length}):`)
  delitos.slice(0, 20).forEach((d) => console.error('   · ' + d))
  process.exit(1)
}

console.log(`\n✓ out/ listo para subir a public_html`)
console.log(`  ${archivos.length} archivos · ${mb} MB`)
console.log(`  .htaccess escritos (404 propia + caché)`)
console.log(`  auditado: sin rastro de ai-pmp, KNOW - HOW WEB, CLAUDE.md ni Claude`)
