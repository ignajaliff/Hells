# CLAUDE.md — Hoja de ruta del proyecto web

> Este archivo es leído automáticamente por Claude al iniciar cualquier conversación en este proyecto.
> Contiene el contexto de la web, las decisiones tomadas y el estado actual del desarrollo.
> **Mantenerlo actualizado es obligatorio** — es la memoria del proyecto entre sesiones.
> Al iniciar un proyecto nuevo: completar todos los campos entre [corchetes] antes de la primera sesión.

---

## Proyecto

**Nombre**: [Nombre de la web]
**Tipo**: [Landing / Sitio institucional / Web de comercio / Portfolio / etc.]
**Cliente**: [Nombre del cliente]
**Desarrollado por**: [Tu empresa]
**Inicio**: [Fecha de inicio]
**Sistema de gestión asociado**: [Nombre del sistema que administra el contenido, o "Ninguno todavía"]
**Proyecto Supabase compartido**: [project-ref o "el mismo que el sistema X"]

### Descripción de la web

[Describir en 2-3 líneas qué muestra la web, para quién y qué debe lograr]

Ejemplo: *Web pública de una pinturería. Muestra el catálogo destacado, promociones vigentes, horarios y datos de contacto. Las promos, los horarios y el botón de WhatsApp se administran desde el sistema de gestión del comercio.*

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

* Next.js 15 (App Router) + TypeScript strict
* Tailwind CSS
* Framer Motion (animaciones)
* Supabase (solo lectura desde la web, con anon key)
* React Hook Form + Zod (solo si hay formulario de contacto)

> Si este proyecto usa versiones distintas a las de `rules.txt`, registrarlo en "Decisiones técnicas".

---

## Dirección estética

Definir ANTES de escribir código (ver design-rules.txt §1) y no cambiarla a mitad de proyecto.

**Concepto**: [ej. "minimalismo cálido con acentos terracota" / "editorial tipo revista" / "oscuro premium con dorados"]
**Tipografía display**: [fuente para títulos]
**Tipografía de texto**: [fuente para cuerpo]
**Paleta**: [color dominante, color de fondo, 1-2 acentos]
**Referencias**: [links a webs o capturas que el cliente aprobó]

---

## Comandos

```
npm run dev          → servidor de desarrollo
npm run build        → build de producción (debe pasar sin errores antes de entregar)
npx tsc --noEmit     → verificación de tipos (correr antes de entregar cualquier cambio)
npm run lint         → linter (si está configurado)
```

---

## Páginas de la web

Actualizar esta sección a medida que se van completando páginas.

| Página | Ruta | Estado | Notas |
|--------|------|--------|-------|
| Home | `/` | Pendiente | — |
| [Página 2] | `/[ruta]` | Pendiente | — |
| [Página 3] | `/[ruta]` | Pendiente | — |

Estados posibles: `Pendiente` / `En desarrollo` / `Maquetada` / `Conectada` / `Completa`

---

## Contenido dinámico — Qué se administra desde el sistema de gestión

Esta tabla es EL contrato entre la web y el sistema de gestión. Actualizarla cada vez que un valor pasa de fijo a dinámico.

| Valor en la web | Origen (tabla/clave) | Default si la base falla | Frescura |
|-----------------|----------------------|--------------------------|----------|
| [ej. Botón de WhatsApp visible] | `web_config` → `whatsapp` | Visible, número fijo | Cliente (al cargar) |
| [ej. Texto de horarios] | `web_config` → `horarios` | "Lun a Vie 9-18hs" | Revalidate 5 min |
| [ej. Promos vigentes] | `promos` (publicado = true) | Sección oculta | Revalidate 5 min |

Frescuras posibles: `Build` (estático puro) / `Revalidate X min` (ISR) / `Cliente (al cargar)` (fetch en el navegador, para toggles que deben verse al instante)

---

## Base de datos — Tablas que la web lee

Actualizar cuando se crea o conecta una tabla nueva. Las tablas se crean siguiendo `supabase-web-rules.txt` (la web solo lee — las escribe el sistema de gestión).

```
[Ninguna todavía]
```

Ejemplo de cómo completar:
```
- web_config   → clave/valor con toggles y textos de la web (whatsapp, horarios, banner)
- promos       → promociones (la web solo lee las que tienen publicado = true)
- consultas    → formulario de contacto (única tabla donde la web INSERTA)
```

---

## Checklist de entrega

Verificar antes de publicar la web y repasar en cada entrega importante.

- [ ] `npm run build` pasa sin errores ni warnings de tipos
- [ ] Toda tabla que lee la web tiene RLS con SELECT público SOLO de lo publicado (ver supabase-web-rules.txt)
- [ ] Ningún valor dinámico rompe la página si Supabase no responde (probar desconectando la URL)
- [ ] Metadata completa en todas las páginas: title, description, Open Graph con imagen
- [ ] `sitemap.ts` y `robots.ts` generados y accesibles
- [ ] Imágenes con `next/image`, tamaños definidos y formato moderno
- [ ] Lighthouse en móvil: Performance ≥ 90, SEO ≥ 95, Accessibility ≥ 90
- [ ] Probada en móvil real (no solo el emulador del navegador)
- [ ] Favicon, título de pestaña y preview al compartir el link por WhatsApp verificados
- [ ] Si hay formulario de contacto: honeypot activo y constraints SQL en la tabla
- [ ] `get_advisors` del MCP sin alertas de seguridad

---

## Decisiones técnicas tomadas

Registrar aquí cualquier decisión que se salga del estándar o que sea importante recordar.

Ejemplos del tipo de cosas que van acá:
* El botón de WhatsApp calcula la franja horaria en el cliente con los horarios que vienen de `web_config`
* Las imágenes de promos se guardan en el bucket público `web-assets` de Supabase Storage
* Se usa revalidate de 60s en la home porque el cliente cambia promos varias veces al día

---

## Estado actual del desarrollo

Actualizar al final de cada sesión de trabajo.

**Última sesión**: [fecha]
**Próximo paso**: [qué hay que hacer en la próxima sesión]

**Lo que está funcionando**:
* [listar]

**Lo que está pendiente**:
* [listar]

**Problemas conocidos o deuda técnica**:
* [listar o escribir "Ninguno"]

---

## Instrucciones para la IA

1. **Antes de escribir cualquier código**, leer los documentos de `ai-pmp/` referenciados arriba.
2. **Respetar la dirección estética definida** en este archivo — no cambiar fuentes, paleta ni concepto sin que el usuario lo pida.
3. **No empezar nuevas páginas o secciones** sin que el usuario lo indique explícitamente.
4. **Antes de entregar cualquier cambio**: correr `npx tsc --noEmit` y verificar que no hay imports rotos ni errores. Si el cambio es grande, verificar también que `npm run build` pasa.
5. **Todo valor que venga de Supabase debe tener default hardcodeado** — la web nunca puede romperse ni quedar en blanco por un fallo de la base.
6. **Si hay ambigüedad** en un requerimiento, preguntar antes de implementar.
7. **No agregar dependencias nuevas** sin consultarlo primero.
8. **Actualizar la tabla de páginas y la de contenido dinámico** de este archivo cuando se complete una.
9. **El límite es 300 líneas por archivo** — si se supera, dividir en subcomponentes.
10. **Nunca leer, imprimir ni commitear el contenido de `.env`** ni de ningún archivo con credenciales.
11. **La web nunca escribe en Supabase** salvo la tabla del formulario de contacto — si una feature parece necesitar escritura, frenar y consultar: probablemente pertenece al sistema de gestión.
12. **Después de cualquier cambio de schema en Supabase**, correr `get_advisors` del MCP y corregir las alertas antes de dar por terminada la tarea.
13. **Al terminar una sesión de trabajo**, actualizar la sección "Estado actual del desarrollo" de este archivo.

---

## Cómo actualizar este archivo

Este archivo es la memoria viva del proyecto. Actualizarlo:

* **Al terminar una página o sección** → cambiar su estado en la tabla de páginas
* **Al conectar un valor dinámico nuevo** → agregarlo en "Contenido dinámico" con su default y frescura
* **Al crear una tabla nueva** → agregarla en "Base de datos"
* **Al tomar una decisión técnica importante** → registrarla en "Decisiones técnicas"
* **Al terminar una sesión** → actualizar "Estado actual del desarrollo"

No es necesario actualizar en cada commit — solo cuando hay cambios de estado o decisiones importantes.
