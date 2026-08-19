# KNOW - HOW WEB — Kit de arranque de páginas web

Plantilla base para iniciar **páginas web estéticas** (landings, sitios institucionales, webs de comercios) con contenido controlado desde un sistema de gestión. Esta carpeta NO es un proyecto — es el origen del que se copia todo al arrancar uno.

> **Diferencia con el kit KNOW - HOW (sistemas)**: aquel kit es para sistemas de gestión (SPA con auth, CRUD, roles). Este kit es para webs públicas: Next.js, SEO, diseño premium, y conexión de **solo lectura** con Supabase. La web muestra; el sistema de gestión administra. Si el proyecto es un sistema, usar el otro kit.

## Arquitectura de la dupla web + sistema

```
[Sistema de gestión]  ──escribe──►  [Supabase]  ◄──solo lee──  [Página web]
 (kit KNOW - HOW)                                              (este kit)
```

* Un solo proyecto de Supabase compartido entre ambos
* El sistema de gestión (con auth y roles) da de alta promos, horarios, precios, toggles (ej. mostrar/ocultar botón de WhatsApp)
* La web pública lee esos valores con la **anon key** — sin login, sin service key, sin escritura (única excepción: formulario de contacto, ver `supabase-web-rules.txt`)
* Todo valor dinámico tiene un **default hardcodeado**: si Supabase no responde, la web se ve igual de bien

## Procedimiento al iniciar un proyecto nuevo

1. Crear la carpeta del proyecto y dentro la carpeta `ai-pmp/`
2. Copiar los 8 archivos `.txt` de reglas a `[proyecto]/ai-pmp/`:
   `rules.txt`, `design-rules.txt`, `frontend-rules.txt`, `supabase-web-rules.txt`, `seo-rules.txt`, `error-handling.txt`, `naming-rules.txt`, `git-rules.txt`
3. Copiar `CLAUDE.md` a la **raíz** del proyecto (Claude lo lee automáticamente solo si está en la raíz)
4. Completar en `CLAUDE.md` todos los campos entre `[corchetes]`: nombre, cliente, descripción, páginas y contenido dinámico
5. Definir con el cliente la **dirección estética** ANTES de la primera sesión de código (ver `design-rules.txt` §1) y registrarla en `CLAUDE.md`
6. Usar el prompt "1. INICIO DE PROYECTO" de `nuvvora-prompts-web.txt` para la primera sesión

> **Importante**: el `CLAUDE.md` referencia las reglas en `ai-pmp/` — si los `.txt` quedan en otra ruta, la IA no los encuentra y falla en silencio.

## Contenido del kit

| Archivo | Para qué sirve | ¿Se copia al proyecto? |
|---------|----------------|------------------------|
| `CLAUDE.md` | Memoria viva del proyecto, leída por Claude en cada sesión | Sí, a la raíz |
| `rules.txt` | Stack Next.js, arquitectura y reglas de código | Sí, a `ai-pmp/` |
| `design-rules.txt` | Dirección estética, tipografía, color, animaciones | Sí, a `ai-pmp/` |
| `frontend-rules.txt` | Componentes, secciones, islas dinámicas, formularios | Sí, a `ai-pmp/` |
| `supabase-web-rules.txt` | Conexión de solo lectura, tabla `web_config`, RLS pública | Sí, a `ai-pmp/` |
| `seo-rules.txt` | Metadata, Open Graph, sitemap, Core Web Vitals | Sí, a `ai-pmp/` |
| `error-handling.txt` | Fallbacks — la web nunca se rompe por la base | Sí, a `ai-pmp/` |
| `naming-rules.txt` | Convenciones de nombres (adaptadas a Next.js) | Sí, a `ai-pmp/` |
| `git-rules.txt` | Commits, ramas y .gitignore | Sí, a `ai-pmp/` |
| `nuvvora-prompts-web.txt` | Prompts base para cada etapa del desarrollo | No — es para uso humano |

## Mantenimiento del kit

* Cuando un proyecto descubre una regla nueva que vale para todos, traerla acá — esta carpeta es la fuente de verdad
* Las reglas de naming y git se mantienen alineadas con el kit KNOW - HOW de sistemas: si se cambia una convención allá, replicarla acá
* Revisar la sección de stack de `rules.txt` cuando cambien las versiones estándar (Next.js, Tailwind) y anotar la fecha de la última verificación
* Última revisión general del kit: 2026-08-13
