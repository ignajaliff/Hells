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
* **Pantalla de carga: el logo se dibuja solo (2026-08-19, decisión del cliente)**:
  las líneas dibujan el logo entero a la vez sobre negro y al cerrar se solidifica en el
  logo pleno. Coreografía ~3.9s: trazan (0→2.10s) → solidifica (2.32s) → pausa 1.1s → hero (3.42s + fade).
  Con `prefers-reduced-motion` se saltea entera. Bloquea el scroll mientras está puesta.
  **Los tiempos se DERIVAN, no se hardcodean**: el único número a tocar es `TRAZO_TOTAL`;
  `FIN_TRAZO` sale de recorrer los tiempos reales con `Math.max` y `SOLIDIFICA`/`FIN` se
  calculan a partir de él. Es importante que sea así: con los números sueltos el relleno
  entraba en el mismo frame en que cerraba el último trazo — el logo cuajaba a medio
  dibujar.
  **Los 28 contornos van como `<path>` SEPARADOS**, cada uno con su `animation-delay`
  proporcional a lo ya dibujado: así se ve la línea formando letra por letra (isotipo →
  "HELL'S" → "BURGER"). Con un `d` único no se puede escalonar, la animación es una sola.
  Los largos están precalculados en `logoPath.ts` — medirlos con `getTotalLength()`
  obligaría a 28 refs y un render extra.
  **Arranca en NEGRO PURO y el frame 0 está vacío** (2026-08-19, decisión del cliente):
  el fondo del telón es `#000000`, no el carbón del sitio — a viewport completo el
  `#1a1a1a` se lee gris y no como "pantalla apagada". Todo lo que aparece lo dibuja la
  línea: los 28 trazos arrancan con `strokeDashoffset` = su largo (invisibles) y ese
  valor inline rige también durante su delay. **El SVG no lleva fade de entrada**
  (`initial={false}`): con el fade, la línea se materializaba mientras dibujaba en vez de
  construirse desde cero. Verificado en el HTML servido: 28/28 trazos con
  `dashoffset === dasharray` y el relleno en `opacity: 0`.
  Antes de salir el telón **vira del negro al carbón** del hero: si se fuera desde negro
  puro, el salto de tono contra el fondo del sitio se vería como un parpadeo.
  **Los 28 trazos crecen EN PARALELO, no en secuencia** (2026-08-19, corrección final —
  esta es la que quedó). Se probaron las dos alternativas y las dos quedaban mal:
  * con solape parcial se dibujaban 4 trazos sueltos a la vez en puntos distintos y se
    leía como "puntos que aparecen de la nada";
  * de a uno en secuencia estricta se veía un segmento aislado avanzando, sin la forma
    insinuándose, y se leía como "líneas rectas" sueltas.
  Ahora arrancan todos escalonados por unas décimas (`ESCALONADO = 0.22`) y **cierran
  todos juntos**: cada uno dura `TRAZO_TOTAL - su retardo`. Así el logo se revela como un
  todo y la silueta se reconoce desde temprano. Verificado en el HTML servido: arranques
  de 0 a 0.46s y cierres con 0.000s de diferencia entre sí.
  El easing es una curva suave, no `linear`: la línea sale con impulso y cierra frenando,
  como se dibuja a mano. Con `linear` el avance parece una barra de progreso.
  **La duración de cada trazo es PROPORCIONAL A SU LARGO** (2026-08-19): así la punta de
  la línea viaja siempre a la misma velocidad, como una mano real, y los trazos cortos
  cierran antes mientras los largos siguen. Antes todos duraban lo mismo y las
  velocidades variaban **15.6x** — los contornos largos, que son justo los de la
  hamburguesa, se arrastraban hasta el final. Ahora la variación es 1.22x.
* **Un `<svg>` sin `height` dentro de un flex se ESTIRA (2026-08-19)**: esta era la causa
  REAL de que el logo se viera gigante y desbordado por los bordes — no el viewBox ni el
  vectorizado, que fue donde busqué varias rondas sin dar con el problema.
  El SVG estaba directo dentro del telón (`flex items-center justify-center`) con
  `w-[74vw] max-w-[560px]` pero sin altura: en un contenedor flex eso hace que se estire
  a toda la altura disponible **ignorando el `max-w`**. Ahora el ancho lo fija un `<div>`
  wrapper y el SVG va con `block h-auto w-full`, así la altura sale del viewBox.
  **Regla: todo SVG dentro de un flex necesita altura explícita o `h-auto` con el ancho
  fijado por un wrapper.**
* **El trazo es BRASA (2026-08-19, pedido del cliente)**: degradé vertical de amarillo
  incandescente a rojo profundo (`#ffd24a` → `#ef8f03` → `#e3211f` → `#8f0f0c`), el orden
  real de temperatura del fuego — por eso se lee como calor y no como degradé decorativo.
  El amarillo y el naranja no están en la paleta de UI: mismo criterio que las
  ilustraciones de llamas, es imagen de marca y no interfaz. **El relleno final sigue
  siendo `fill-primary`** (el rojo del logo): solo el trazo es brasa.
  Encima va un filtro de dos desenfoques (`stdDeviation` 1.5 y 6) fusionados sobre el
  original: con un solo blur el resplandor queda como mancha, en dos capas hay brillo
  pegado a la línea más halo amplio, que es como se comporta la luz real.
  Se probaron y quedaron descartadas otras variantes (rojo plano fino, tubo de neón con
  núcleo claro, trazo grueso sólido) — están en el historial por si se quiere volver.
* **El halo necesita MARGEN dentro del viewBox (2026-08-19)**: era la causa de que los
  bordes se siguieran viendo cortados. Un `feGaussianBlur` de `stdDeviation` N se
  extiende ~3N unidades, y **el filtro recorta contra el viewBox** — el
  `overflow: visible` de CSS no lo evita, porque el recorte lo hace el filtro y no la
  caja del elemento. Con 6 unidades de margen y un halo que necesitaba 22.6, el
  resplandor se cortaba en los cuatro lados.
  Ahora el viewBox lleva **28 unidades de margen** (898x521) y el filtro declara
  `x/y="-40%" width/height="180%"` — con el default (110%) también se recorta.
  **Si se sube el `stdDeviation` del halo, agrandar el margen: `3 * stdDeviation`.**
* **El viewBox tiene que ABARCAR los paths, no el tamaño de la máscara (2026-08-19)**:
  era la causa de que el logo se viera cortado por los bordes. El viewBox se tomaba del
  tamaño de la máscara de píxeles, pero los paths no coinciden con ella — el suavizado de
  Chaikin y los puntos de control de las Bézier corren los trazos hacia afuera. Medido:
  el contenido se salía **24.3 unidades por la izquierda y 3.3 por abajo**, y el SVG
  recorta todo lo que cae fuera del viewBox.
  Ahora el viewBox se ajusta al bbox REAL de los paths (854x477) con 6 unidades de
  margen, que incluyen medio grosor de trazo: un `stroke` se dibuja centrado en el path,
  así que la mitad queda para afuera y también necesita lugar.
  **Si se re-vectoriza, volver a ajustar el viewBox al contenido — el vectorizador emite
  el tamaño de la máscara y reintroduce el recorte.** Verificado en el HTML servido:
  contenido en x 6.0→847.3 e y 6.0→470.3, todo dentro.
* **El grosor del trazo tiene que dar ≥ 1px REAL (2026-08-19)**: era la causa del
  "pixelado", y **no era el path**. El `strokeWidth` va en unidades del viewBox y el SVG
  se dibuja a ~560px: con el valor viejo la línea medía **0.82px, menos de un píxel**, y
  un trazo sub-pixel el navegador lo pinta entrecortado y grisáceo.
  Fórmula: `grosor = 1.8 * anchoViewBox / anchoEnPx`. Con viewBox 854 a 560px → 2.7.
  **Si cambia el viewBox o el `max-w` del SVG, recalcular.**
* **Pausa de lucimiento antes de pasar al hero (2026-08-19, pedido del cliente)**: el
  logo queda **1.1s ya sólido** en pantalla (`LUCIMIENTO`) antes de que salga el telón.
  Sin esa pausa el logo cuajaba y desaparecía en el mismo gesto y no se llegaba a leer
  la marca, que es todo el punto de la pantalla. Total ~3.9s.
* **El `largo` de los trazos se mide sobre las CURVAS, no sobre la poligonal
  (2026-08-19)**: era un bug real y visible. El valor se calculaba sumando los segmentos
  rectos entre puntos, pero los tramos se emiten como Bézier cúbicas, que son más largas
  que la poligonal que las aproxima. Con el largo subestimado el `stroke-dasharray`
  quedaba corto y **hasta un 18% del contorno nunca se dibujaba** — se notaba sobre todo
  en la hamburguesa, que tiene los contornos más largos y curvos, como trazos que no
  cerraban. Ahora se mide por subdivisión de cada Bézier, con +1.5% de margen porque el
  `getTotalLength()` del navegador puede diferir unas décimas: quedarse corto deja el
  trazo abierto, pasarse solo termina un instante antes y no se nota.
  **Si se re-vectoriza el logo, recalcular los largos con la medición de curvas** — el
  vectorizador los emite sumando rectas y reintroduciría el bug.
  **Son DOS capas superpuestas, no una animando `fill`**: abajo el relleno (entra con
  fade al final) y arriba los trazos (que se apagan cuando el relleno ya entró). Con una
  sola capa, el relleno aparecería de golpe en toda la silueta.
  El `-translate-y-[4%]` del SVG es corrección **óptica**, no un error de centrado: el
  viewBox está ajustado al logo (verificado: márgenes de 0-1px), pero una pieza centrada
  geométricamente se percibe caída. El `drop-shadow` del mismo rojo enciende la línea sin
  engrosarla — a 1.1 de grosor sobre el carbón, sin halo se ve apagada.
* **El logo tuvo que vectorizarse a mano (2026-08-19)**: la animación de línea necesita
  paths reales y el logo de marca es un **JPG de píxeles**. No hay potrace ni inkscape en
  el entorno y no se agregaron dependencias, así que se trazó con `sharp` + código:
  máscara binaria por rojez sobre `logo.jpg`, Moore-neighbor tracing de los 28 contornos
  (exteriores y agujeros) y Douglas-Peucker para simplificar.
  Vive en `components/ui/logoPath.ts` (viewBox 607x339, ~18KB). Con `fill-rule="evenodd"`
  los agujeros (contraformas de las letras, semillas del pan) se recortan solos.
  **Los tramos se emiten como CURVAS Bézier, no como polilíneas** (2026-08-19,
  corrección): la primera versión usaba solo segmentos rectos (`L`) y las curvas del logo
  se veían dentadas — eso era el "pixelado". Ahora se convierten con Catmull-Rom, y las
  esquinas vivas (ángulo < 100°) se dejan rectas a propósito porque el logo tiene cantos
  que redondear arruinaría. **Ojo con los umbrales de filtrado**: si se suben, el
  apóstrofo de "HELL'S" desaparece (pasó dos veces) — tienen que quedar en 28 trazos.
  **Es una aproximación, no el original**: cuando llegue el logo vectorial de marca,
  reemplazar estos trazos por los suyos y listo — el componente no cambia.
* **El incendio con las llamas de marca se descartó (2026-08-19)**: hubo una versión
  previa de la pantalla de carga donde el diablo guiñaba y un incendio se comía la
  pantalla. Se eliminó y se reemplazó por la del logo. Si alguna vez se retoma, los
  originales siguen en la raíz (`llama1-3.png`, `diablos.jpg`) — ojo que
  `llamas-04/05.png` son copias byte a byte de `llama1/llama2`, verificado por md5 — y
  el aprendizaje que costó más caro: las llamas van en **mosaico** (`repeat-x` +
  `background-size: auto 100%`), nunca estiradas con `<Image>`, porque estirar una sola
  copia deforma el dibujo y en pantallas anchas se ve mal.
* **Banding de los degradés sobre fondo oscuro (2026-08-19)**: `brasa-glow` mostraba
  escalones en vez de una transición limpia. Dos causas: iba a `transparent`, que en CSS
  es **negro transparente** y al mezclarse ensucia el rojo con gris; y tenía pocas
  paradas, así que el degradé recorría muy pocos valores y un monitor de 8 bits no tiene
  tonos intermedios. Ahora termina en el mismo color con alfa 0 y lleva 6-7 paradas.
  Para lo que quede está `grano-sutil`, una capa de ruido al 14% en `overlay` que rompe
  los escalones — el mismo truco que usa el cine para el banding de los cielos.
  **Regla: ningún degradé de este proyecto debe terminar en `transparent`.**
* **Assets de la mascota — versión definitiva (2026-08-19)**: salen de `diablos.jpg`,
  los dos stickers fotografiados sobre fondo negro. Reemplazaron a los primeros
  (`diablillo.png` + `diabloguiñando.jfif.jpeg`), que venían de fuentes distintas y por
  eso no compartían contorno ni iluminación. Los nuevos son la misma foto, así que el
  contorno blanco, la luz y el encuadre coinciden.
  El fondo se quitó con flood-fill desde los bordes, **con el umbral medido del
  histograma, no a ojo**: el fondo del panel pica en luminancia 30-39 y el pelo negro del
  dibujo está en 0-29, así que el corte va en 48. Como el pelo no toca el borde, el
  flood-fill no lo alcanza y se conserva entero. Resultado: `public/diablo.png` (60KB) y
  `public/diablo-guino.png` (59KB), ambos 900x1015.
  **Los dos se recortaron con la MISMA caja centrada** (ratio 0.882 y 0.887) en vez de
  cada uno con su propio bounding box: si cada uno se recorta al suyo quedan a distinta
  escala y al cruzarlos para el guiño la cabeza salta. Si aparece el vectorial,
  reemplazarlos.
* **Assets de marca derivados del JPG original**: `logo.jpg` (raíz) trae el logo rojo sobre
  fondo horneado y con un marco blanco de 4px en el borde. Se extrajo el alpha por distancia
  al color de fondo y se recortó al bounding box real, generando `public/logo.png` (lockup
  transparente), `public/isotipo.png` (solo la hamburguesa) y `src/app/icon.png` (favicon
  512x512, convención de App Router). Si aparece el vectorial, reemplazarlos.

---

## Estado actual del desarrollo

**Última sesión**: 2026-08-19
**Próximo paso**: definir las secciones de la landing y su orden; luego header sticky con
CTA de WhatsApp fijo en móvil.

**Lo que está funcionando**:
* Arquitectura completa del proyecto (App Router, `src/` por secciones, tokens de diseño)
* Sistema tipográfico y paleta cargados como tokens CSS + tema de Tailwind
* Sección Hero tipográfica: logo + h1 a ancho completo, entrada animada, respeto de `prefers-reduced-motion`
* Favicon generado desde el isotipo (`src/app/icon.png`)
* Metadata base, Open Graph, `sitemap.ts`, `robots.ts` y JSON-LD de `Restaurant`
* 404 y error boundary diseñados con la estética del sitio
* Mascota en el hero (`components/ui/DiabloHero.tsx`): guiña cada 4.2s y se
  desvanece al salir del hero vía `IntersectionObserver`. La web entra directo al
  hero
* Pantalla de carga (`components/ui/PantallaCarga.tsx`): la línea forma el logo trazo
  por trazo y al cerrar se solidifica (~3s). Los 28 trazos vectorizados con curvas,
  ordenados y con su largo precalculado están en `components/ui/logoPath.ts`

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
* El CLAUDE.md daba por hecho `components/ui/FuegoZocalo.tsx` (zócalo de fuego del
  hero) pero **ese archivo no existe en `src/`** — o nunca se commiteó o se borró.
  El hero actual no tiene zócalo de fuego. Decidir si se rehace o se descarta.
* La pantalla de carga se muestra en **cada recarga**, sin recordar si ya se vio.
  Si molesta en visitas repetidas, guardar una marca en `sessionStorage`.
* El naranja de la mascota (`#e8912a`) tampoco está en la paleta, igual que las
  llamas: es ilustración de marca, no UI. Mismo criterio que el zócalo de fuego.

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
