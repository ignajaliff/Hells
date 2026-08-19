# CLAUDE.md — Hoja de ruta del proyecto web

> Este archivo es leído automáticamente por Claude al iniciar cualquier conversación en este proyecto.
> Contiene el contexto de la web, las decisiones tomadas y el estado actual del desarrollo.
> **Mantenerlo actualizado es obligatorio** — es la memoria del proyecto entre sesiones.

---

## Proyecto

**Nombre**: Hell's Burger
**Tipo**: Landing page de alta conversión (una sola página, navegación por anclas)
**Cliente**: Hell's Burger
**Desarrollado por**: Nuvvora
**Inicio**: 2026-08-18
**Sistema de gestión asociado**: Ninguno todavía
**Proyecto Supabase compartido**: Ninguno todavía

### Descripción de la web

Landing de una hamburguesería. Muestra el producto, la carta y los canales de pedido, con la
conversión concentrada en un CTA de pedido/WhatsApp siempre a mano. Pensada mobile-first: la
mayoría del tráfico llega desde Instagram en el celular, de noche, decidiendo dónde comer.

---

## Reglas del proyecto

Este proyecto respeta estrictamente los siguientes documentos. Leerlos antes de hacer cualquier cambio:

* [ai-pmp/rules.txt](ai-pmp/rules.txt) — Stack Next.js, arquitectura general y reglas de código
* [ai-pmp/design-rules.txt](ai-pmp/design-rules.txt) — Dirección estética, tipografía, color y animaciones
* [ai-pmp/frontend-rules.txt](ai-pmp/frontend-rules.txt) — Componentes, secciones, islas dinámicas y formularios
* [ai-pmp/supabase-web-rules.txt](ai-pmp/supabase-web-rules.txt) — Conexión de solo lectura, `web_config` y RLS
* [ai-pmp/seo-rules.txt](ai-pmp/seo-rules.txt) — Metadata, Open Graph, sitemap y Core Web Vitals
* [ai-pmp/error-handling.txt](ai-pmp/error-handling.txt) — Fallbacks y estados de carga
* [ai-pmp/naming-rules.txt](ai-pmp/naming-rules.txt) — Convenciones de nombres
* [ai-pmp/git-rules.txt](ai-pmp/git-rules.txt) — Commits y ramas

---

## Stack del proyecto

* Next.js 15.5 (App Router) + TypeScript strict
* Tailwind CSS v4 (`@tailwindcss/postcss`)
* Motion (`motion/react`) para animaciones
* Supabase — **todavía no conectado** (la estructura está preparada)
* React Hook Form + Zod — todavía no (solo si se agrega formulario de contacto)

---

## Dirección estética

**Concepto**: oscuro premium con rojo infierno — la noche, el fuego y la carne. Fondo carbón,
un solo color dominante (el rojo del logo) que aparece poco pero manda, tipografía display
condensada y gigante en caja alta.
**Tipografía display**: Anton (títulos, siempre en mayúsculas)
**Tipografía de texto**: Archivo (cuerpo, 400/500/600)
**Paleta** — tomada del logo de marca:

| Token | HSL | Aprox. | Rol |
|-------|-----|--------|-----|
| `--background` | `0 0% 10%` | #1a1a1a | Fondo del logo, fondo de toda la web |
| `--foreground` | `0 0% 96%` | #f5f5f5 | Texto principal |
| `--primary` | `1 78% 51%` | #e3211f | El rojo del logo — dominante, CTAs y títulos destacados |
| `--accent` | `1 78% 62%` | #ea5553 | El mismo rojo aclarado — texto chico, foco y detalles |
| `--muted` | `0 0% 14%` | #242424 | Superficies elevadas |
| `--border` | `0 0% 20%` | #333333 | Bordes |

**Referencias**: logo de marca aportado por el cliente (2026-08-18)

Los dos colores fueron **muestreados del archivo del logo**, no estimados. Contrastes verificados:

| Par | Ratio | Veredicto |
|-----|-------|-----------|
| `foreground` sobre `background` | 15.96:1 | AA / AAA |
| `muted-foreground` sobre `background` | 7.32:1 | AA / AAA |
| `accent` sobre `background` | 4.91:1 | AA texto normal |
| `primary` sobre `background` | 3.79:1 | **Solo texto grande** (h1, cifras) |
| blanco sobre `primary` | 4.59:1 | AA — botón primario |

> Regla: el rojo del logo (`--primary`) nunca se usa en texto chico. Para eso está `--accent`.

> Definida el 2026-08-18. No se cambia a mitad de proyecto (design-rules.txt §1).

---

## Comandos

```
npm run dev          → servidor de desarrollo
npm run build        → build de producción (debe pasar sin errores antes de entregar)
npm run typecheck    → verificación de tipos (correr antes de entregar cualquier cambio)
npm run lint         → linter
```

---

## Páginas de la web

| Página | Ruta | Estado | Notas |
|--------|------|--------|-------|
| Home | `/` | En desarrollo | Solo el Hero maquetado |
| 404 | — | Maquetada | `app/not-found.tsx` |
| Error global | — | Maquetada | `app/error.tsx` |

Estados posibles: `Pendiente` / `En desarrollo` / `Maquetada` / `Conectada` / `Completa`

---

## Contenido dinámico — Qué se administra desde el sistema de gestión

Todavía ninguno: la web no está conectada a Supabase. Los defaults ya existen en
`src/lib/defaults.ts` para que enchufar cada valor no requiera refactorizar nada.

| Valor en la web | Origen (tabla/clave) | Default si la base falla | Frescura |
|-----------------|----------------------|--------------------------|----------|
| _(ninguno todavía)_ | — | — | — |

Candidatos ya previstos en `defaults.ts`: `whatsapp` (visible + número + franja horaria),
`horarios` (texto), `banner` (promo del día).

---

## Base de datos — Tablas que la web lee

```
[Ninguna todavía]
```

---

## Checklist de entrega

- [ ] `npm run build` pasa sin errores ni warnings de tipos
- [ ] Toda tabla que lee la web tiene RLS con SELECT público SOLO de lo publicado
- [ ] Ningún valor dinámico rompe la página si Supabase no responde
- [ ] Metadata completa en todas las páginas: title, description, Open Graph con imagen
- [ ] `sitemap.ts` y `robots.ts` generados y accesibles
- [ ] Imágenes con `next/image`, tamaños definidos y formato moderno
- [ ] Lighthouse en móvil: Performance ≥ 90, SEO ≥ 95, Accessibility ≥ 90
- [ ] Probada en móvil real
- [ ] Favicon, título de pestaña y preview al compartir el link por WhatsApp verificados
- [ ] Si hay formulario de contacto: honeypot activo y constraints SQL en la tabla
- [ ] `get_advisors` del MCP sin alertas de seguridad
- [ ] **Todos los valores marcados con ⚠ en `src/lib/constants.ts` y `src/lib/defaults.ts` reemplazados por datos reales**

---

## Decisiones técnicas tomadas

* **Next.js 15.5 y no 16**: el kit fija "15+" y 15.5 es la versión estable probada con
  Tailwind v4 y Motion 13. Revisar el salto a 16 recién cuando haya que tocar el stack.
* **`output: standalone` en `next.config.ts`**: el deploy previsto es CapRover/Docker.
  Si el proyecto termina en Vercel, borrar esa línea.
* **Supabase preparado pero no conectado**: existen `lib/defaults.ts` y `components/dynamic/`,
  pero no hay `lib/supabase.ts` ni `lib/queries.ts` hasta que exista el proyecto de Supabase.
* **Hero sin foto en la versión inicial**: la atmósfera se resuelve con gradientes de brasa y
  grano (`brasa-glow` y `textura-grano` en `globals.css`) para no dejar un placeholder roto.
  Cuando llegue la foto de producto va con `next/image` + `priority` (es el LCP).
* **Sin header ni footer todavía**: se agregan cuando existan más secciones que anclar.
* **Hero tipográfico plano (decisión del cliente, 2026-08-18)**: sin degradé rojo, sin eyebrow,
  sin subtítulo y sin CTAs — solo el logo y el h1 sobre el gris `--background`. El tamaño del
  h1 es `text-[16vw]`, calculado midiendo la fuente: Anton da 5.938em de ancho para
  "HAMBURGUESAS", así que a 16vw la línea más larga abarca el viewport completo.
  **Ojo**: al no haber CTA en el hero, la conversión depende de las secciones siguientes.
* **Zócalo de fuego en el hero (2026-08-19)**: banda ilustrada al pie, en `-z-20`,
  derivada de `llama1.png` (la más apaisada de las tres: ratio 2.30 contra 1.37 de
  `llama3`). Se dimensiona por ALTURA (`h-[26vh]` + `object-cover`) y no por ancho:
  a ancho completo mediría 77% del alto del hero en 1920. Animación mínima con dos
  capas en contrafase, solo `transform`/`opacity`, con `useReducedMotion`.
  **El naranja `#ef8f03` de la ilustración no está en la paleta** — se dejó a
  propósito (decisión del cliente) porque es una ilustración, no UI; el rojo de las
  llamas (`#e32521`) sí coincide con el del logo.
* **Assets de marca derivados del JPG original**: `logo.jpg` (raíz) trae el logo rojo sobre
  fondo horneado y con un marco blanco de 4px en el borde. Se extrajo el alpha por distancia
  al color de fondo y se recortó al bounding box real, generando `public/logo.png` (lockup
  transparente), `public/isotipo.png` (solo la hamburguesa) y `src/app/icon.png` (favicon
  512x512, convención de App Router). Si aparece el vectorial, reemplazarlos.

---

## Estado actual del desarrollo

**Última sesión**: 2026-08-18
**Próximo paso**: definir las secciones de la landing y su orden; luego header sticky con
CTA de WhatsApp fijo en móvil.

**Lo que está funcionando**:
* Arquitectura completa del proyecto (App Router, `src/` por secciones, tokens de diseño)
* Sistema tipográfico y paleta cargados como tokens CSS + tema de Tailwind
* Sección Hero tipográfica: logo + h1 a ancho completo, entrada animada, respeto de `prefers-reduced-motion`
* Favicon generado desde el isotipo (`src/app/icon.png`)
* Zócalo de fuego animado al pie del hero (`components/ui/FuegoZocalo.tsx`)
* Metadata base, Open Graph, `sitemap.ts`, `robots.ts` y JSON-LD de `Restaurant`
* 404 y error boundary diseñados con la estética del sitio

**Lo que está pendiente**:
* Datos reales del negocio (dirección, teléfono, WhatsApp, horarios, dominio) — marcados con ⚠
* `public/og.jpg` (1200x630)
* Logo **vectorial** (.svg): los PNG actuales se derivaron del JPG, sirven bien pero
  un SVG escalaría mejor y pesaría menos
* Foto de producto del hero
* Resto de las secciones de la landing
* Conexión con Supabase cuando exista el sistema de gestión

**Problemas conocidos o deuda técnica**:
* Los textos del hero son una primera propuesta de copy, sin aprobar por el cliente
* El hero no tiene CTA: hay que garantizar uno visible apenas se scrollea (o un header sticky)
* `brasa-glow` sigue aplicado en 404 y `error.tsx`, pero ya no en el hero — unificar cuando
  se defina si esas pantallas conservan el degradé
* `textura-grano` quedó definida en `globals.css` pero sin uso

---

## Instrucciones para la IA

1. **Antes de escribir cualquier código**, leer los documentos de `ai-pmp/` referenciados arriba.
2. **Respetar la dirección estética definida** en este archivo — no cambiar fuentes, paleta ni concepto sin que el usuario lo pida.
3. **No empezar nuevas páginas o secciones** sin que el usuario lo indique explícitamente.
4. **Antes de entregar cualquier cambio**: correr `npm run typecheck` y verificar que no hay imports rotos ni errores. Si el cambio es grande, verificar también que `npm run build` pasa.
5. **Todo valor que venga de Supabase debe tener default hardcodeado** — la web nunca puede romperse ni quedar en blanco por un fallo de la base.
6. **Si hay ambigüedad** en un requerimiento, preguntar antes de implementar.
7. **No agregar dependencias nuevas** sin consultarlo primero.
8. **Actualizar la tabla de páginas y la de contenido dinámico** de este archivo cuando se complete una.
9. **El límite es 300 líneas por archivo** — si se supera, dividir en subcomponentes.
10. **Nunca leer, imprimir ni commitear el contenido de `.env`** ni de ningún archivo con credenciales.
11. **La web nunca escribe en Supabase** salvo la tabla del formulario de contacto.
12. **Después de cualquier cambio de schema en Supabase**, correr `get_advisors` del MCP y corregir las alertas.
13. **Al terminar una sesión de trabajo**, actualizar la sección "Estado actual del desarrollo" de este archivo.
