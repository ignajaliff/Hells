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
**Tipografías (2026-09-01, mensajes de la comunidad de la marca — reemplazan a Anton/Archivo)**:
* Display: **Ardillah Kafi** — títulos, siempre en mayúsculas ("la que veníamos usando")
* Graffiti: **Splatink** — detalles, aclaraciones y a veces títulos. **SIN acentos ni eñes**: solo palabras que no los lleven
* Texto: **Sveningsson** — cuerpo. Un solo peso; los medium/semibold los sintetiza el navegador

Ninguna está en Google Fonts: van con `next/font/local` desde `src/app/fonts/` (woff2,
11–21KB). ⚠ Ardillah Kafi y Splatink son "free for personal use": **confirmar la licencia
comercial con el cliente** (dice tener las fuentes en su Drive) antes de publicar.
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
| Home | `/` | En desarrollo | Hero, carta (tocadiscos), «Nuestra historia» y Work maquetadas; faltan las fotos de nosotros |
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

## Dónde vive cada cosa

```
public/       SOLO lo que la web sirve. Si un archivo no se referencia desde
              src/, no va acá.
originales/   Los archivos del cliente de los que se derivaron esos assets
              (videos sin comprimir, logo.jpg, llamasnegras.png, las fotos de
              producto en JPG). La web no los usa; están para poder re-derivar.
              Excluidos del build de Docker.
ai-pmp/       Las reglas que el proyecto respeta.
src/          El código.
```

**LIMPIEZA DEL 2026-08-27**: la raíz tenía 11MB de originales sueltos y `public/`
otros 3.4MB de fuentes que no se servían. Se movieron a `originales/` (21 archivos,
15MB) y se borró lo que ya no usaba nadie:
* `BurgaArmado.tsx` y sus dos fotos de fase — **nunca se renderizaba** desde que la
  primera burga pasó a video: ninguna burga tenía ya `animada: true`. Con él se fue
  el prop `animada` de `BurgaCard` y de `LasBurgas`.
* `zocalo-fuego.webp` y `zocalo-fuego-alpha.webp` — las llamas viejas, reemplazadas
  por `zocalo-llamas.webp`.
* `llamas-burger.png` — sin una sola referencia.
* `dev.log` y `tsconfig.tsbuildinfo` — generados, ya estaban en `.gitignore`.

`fondo-fuegitos.webp` **se conserva aunque no se renderice**: es la fuente de la que
salen `fondo-sin-fuego.webp` y `fondo-palabras.webp`. Solo aparece en comentarios.

---

## Trampas del entorno de desarrollo

* **`position: relative` SIN `z-index` no crea contexto de apilamiento — y
  eso dejó al tocadiscos tapando al nav (2026-09-03)**: `CarruselBurgasV2`
  tiene un carril invisible en `z-[200]` (capta el arrastre) y una ficha en
  `z-[300]` (nombre + ingredientes), ambos por encima del escenario a
  propósito. El escenario y la sección que lo contiene (`LasBurgasV2`) son
  `relative` pero SIN un `z-index` explícito, así que —por spec— no delimitan
  un contexto de apilamiento propio: el 200 y el 300 competían, en el
  contexto RAÍZ de toda la página, contra el `z-50` del nav sticky (que es
  HERMANO de la sección, no ancestro). Con 200/300 > 50, el nav —con fondo
  sólido y todo— quedaba pintado DEBAJO de la foto de la burga activa al
  scrollear. Se corrigió con `relative z-0` en el wrapper raíz de
  `CarruselBurgasV2`, que sí es explícito y encierra el 200/300 adentro.
  **Regla: cualquier `z-index` de dos o tres dígitos necesita un contenedor
  con `z-index` (no solo `position`) más arriba, si no compite directo
  contra el nav.**

* **Un `style` inline le gana a la regla de `prefers-reduced-motion`**: los
  carruseles que calculan su duración según la cantidad de items (reseñas, tira
  de fotos) la fijan con `style={{ animation: ... }}`, y eso pisaba al
  `.marquee-pista { animation: none }` de `globals.css` — o sea que quien pidió
  no ver movimiento lo seguía viendo. **La regla va con `!important`**
  (2026-09-03). La barra promo no estaba afectada: usa una clase de Tailwind,
  no un inline.

* **Las tres fuentes de marca NO traen emoji** y el contenido sí los usa (las
  reseñas de Google). El token de cada fuente en `globals.css` lleva ahora una
  cadena de emoji AL FINAL (`--font-emoji`), así solo entra donde la fuente de
  marca no tiene glifo. El 🥱 del remate y el 👇 del segundo párrafo de
  Reseñas se sacaron el 2026-09-03 (ver más abajo): ya no aplica.
  **Eso no alcanza si el emoji es demasiado nuevo**: 🫨 (U+1FAE8, Unicode 15 de
  2022) se dibujaba igual como cuadradito porque la fuente del sistema no lo
  tiene. Se quitó de la reseña que lo usaba.
  **Cómo detectarlo sin ojo**: medir el carácter en un `<canvas>` y compararlo
  con el ancho del "tofu" (`￿`); si coinciden, no hay glifo. Los otros
  nueve emojis del contenido pasaron la prueba.

* **Tailwind v4 pone las escalas en la propiedad `scale`, NO en `transform`**:
  `getComputedStyle(el).transform` devuelve `none` aunque `-scale-y-100` esté
  aplicada y funcionando. Pasó al verificar las llamas del footer: la medición
  decía que no se había dado vuelta y la captura mostraba que sí.
  **Al verificar transformaciones, mirar `scale`/`rotate`/`translate` —o la
  captura— antes de dar por roto algo que anda.**

* **NUNCA correr `npm run build` con el dev server levantado**: los dos escriben en el
  mismo `.next/`. El build borra y reescribe `.next/static/`, y el dev server queda
  apuntando a archivos que ya no existen → **el CSS y el JS dan 404 y la página se sirve
  sin estilos**. Se ve como "no carga el fondo / no se ve el sticker", pero el HTML está
  perfecto y los assets responden 200: lo que falta es la hoja de estilos.
  Síntomas para reconocerlo rápido: el `<section>` mide miles de píxeles de alto en vez de
  `100svh`, las imágenes salen a su tamaño natural y `getComputedStyle` devuelve
  `display:inline` y `z-index:auto` en todo.
  **Arreglo**: frenar el dev server, `rm -rf .next`, y volver a levantarlo.
  Lo mismo vale para tener **dos `npm run dev` a la vez** sobre este proyecto: se pisan el
  caché y tiran `__webpack_modules__[moduleId] is not a function`.
* **Playwright está instalado como devDependency (2026-08-21)** justamente por esto: sin
  ver el render no se pueden distinguir estos fallos de un bug de CSS, y varios problemas
  reales (el h1 desbordando en móvil) no aparecen en ningún cálculo de layout.
  Uso: `chromium.launch()` → `page.goto('http://localhost:3000')` → esperar ~4s (la
  pantalla de carga dura 3.0s) → `screenshot()` o medir con `getBoundingClientRect()`.
  **Verificar siempre que el CSS cargó** antes de sacar conclusiones:
  `document.styleSheets[0].cssRules.length` tiene que ser > 0.

---

## Decisiones técnicas tomadas

* **"NOSOTROS" DEL NAV APUNTA A RESEÑAS (2026-09-04, pedido del cliente)**:
  iba a `#nosotros`, o sea a la tira de fotos, y ahí el visitante caía en fotos
  sueltas sin una sola palabra que le dijera quién es la marca. Eso ahora se
  cuenta en `Resenas` —el "somos dos amigos que un día decidieron…" del cliente
  más lo que dice la gente—, y la tira arranca JUSTO DEBAJO, así que sigue
  apareciendo al scrollear. **El ancla `#nosotros` se dejó puesta en
  `TiraFotos` pero ya no la usa ningún link**; `SECCIONES.nosotros` sigue en
  `constants.ts` por lo mismo. Verificado en móvil y desktop: los dos aterrizan
  en `#resenas` con la sección al tope.

* **LA TIRA PASÓ A OCHO FOTOS (2026-09-04, material nuevo del cliente)**:
  llegaron seis (`nosotros-4` a `-9`, 2:3, 7MB de JPG → **295KB** en WebP a
  1125px de alto) y salió `nosotros-1`, la del cartel de neón recortada a 16:9,
  que el cliente pidió quitar. **No se perdió nada**: el cartel sigue en la tira,
  ahora en `nosotros-9` y sin recortar. El original de la que salió queda en
  `originales/nosotros/`; su WebP se borró de `public/` porque ahí solo va lo
  que la web sirve.
  * **EL ORDEN ES UN RITMO, no el de los archivos**: alterna local / producto /
    manos para que no queden dos fotos parecidas seguidas, **y eso vale también
    en el salto del final al principio** (cierra con la bolsa roja y arranca con
    la fachada). Las dos 4:5 —las únicas más anchas— van separadas: juntas se
    leerían como un bloque.
  * **`REPETICIONES` BAJÓ DE 3 A 2** y esa cuenta hay que rehacerla si se sacan
    fotos: el loop necesita que UNA copia sea más ancha que la pantalla. Con
    ocho, una vuelta mide ~1770px — alcanza para 1440 pero **no para 1920**—, y
    dos vueltas dan **3540px** (medido), que sobra en cualquier pantalla. Con
    tres vueltas serían 48 nodos de DOM para nada.
  * Verificado en 390/1440/1920: las 8 distintas en orden, las dos copias del
    mismo ancho exacto, la tira yendo hacia la derecha, sin desborde horizontal
    ni errores. Las imágenes que `next/image` deja sin cargar son SOLO las que
    están fuera de pantalla (lazy): todas las visibles cargan, 0 fallos HTTP.

* **LA TIRA DE FOTOS REEMPLAZA A «NUESTRA HISTORIA» (2026-09-03, pedido del
  cliente)**: `TiraFotos.tsx` (antes `Nosotros.tsx`, borrado). Se fueron el
  título y los dos párrafos —el copy aprobado del cliente, la historia de
  Gastón y Gonzalo, queda en el historial de git— y quedaron SOLO las tres
  fotos, pasando solas a todo el ancho. **Conserva el ancla `#nosotros`**
  porque el link del nav apunta ahí.
  * **VA HACIA LA DERECHA**, al revés que los otros dos carruseles de la web:
    mismo `@keyframes marquee` (que termina en `-50%`) con `animation-direction:
    reverse`, así arranca en -50% y vuelve a 0. Un keyframe propio sería el
    mismo movimiento escrito dos veces.
  * **LAS FOTOS SE REPITEN 3 VECES POR COPIA**: son solo tres y el loop necesita
    que UNA copia sea más ancha que la pantalla, o se ve el hueco. Tres fotos a
    300px de alto miden ~1050px, menos que un desktop de 1440; repetidas tres
    veces son 3136px (medido). `next/image` sirve el mismo archivo para todas.
  * **ALTURA FIJA, ancho automático** (180/240/300px): las tres tienen
    proporciones distintas (16:9 la del local, 4:5 las otras dos), así que
    fijando el alto quedan alineadas y de distinto ancho — que es lo que hace
    que se lea como una tira y no como una grilla.
  * **Solo la primera vuelta lleva `alt` real**; el resto va vacío y
    `aria-hidden`, para que un lector de pantalla no lea la misma foto nueve
    veces. La copia duplicada, entera en `aria-hidden`.
  * Lleva `pb` y no `py`: arriba el aire ya lo pone el `py` de reseñas, pero
    abajo la sección Work es ROJA y arrancaba pegada al borde de las fotos,
    cortándoles las esquinas redondeadas.
* **EL ESQUELETO DEL HERO SE BORRÓ (2026-09-03, pedido del cliente)**: duró un
  día. Con él se fue `public/esqueleto.webp` (el original queda en
  `originales/esqueleto.png`). **La caja de la burger se dejó como está** —era
  `display: contents` y se hizo real para que el esqueleto tuviera contra qué
  posicionarse—: es a lo que se ancla cualquier cosa que se apoye sobre la
  burger, y volver atrás cambiaría el layout sin ganar nada.

* **NAV STICKY, LOGO EN EL NAV Y ESQUELETO SOBRE LA BURGER (2026-09-02, pedido
  del cliente)** — cuatro cambios que van juntos:
  * **EL NAV SALIÓ DEL HERO Y ES STICKY**: ahora se monta en `page.tsx`, como
    hermano del hero. **No podía quedarse adentro**: el hero tiene
    `overflow-hidden` —lo necesita, la burger sangra por los costados— y un
    ancestro con overflow convierte al sticky en sticky RESPECTO DE ESE
    ANCESTRO, o sea que el nav se despegaría al terminar el hero.
  * **LA PÁGINA NO CAMBIÓ DE TAMAÑO**, que era el requisito: el nav tiene altura
    FIJA en el token `--nav` (66px móvil / 92px desktop, medidos) y el hero la
    resta de su `100svh`. Verificado: nav + hero = 844 en 390x844 y 900 en
    1440x900, o sea exactamente el viewport, igual que antes.
    `calc()` no puede leer el alto real de un elemento, así que el token es un
    número a mano: **si cambia el contenido del nav, re-medir y actualizarlo.**
  * **EL STICKER "DEMONS CREW" SE FUE Y EN SU LUGAR VA EL LOGO** de marca
    (`logo.png`, el mismo lockup). Por eso mismo **el logo se sacó del hero**:
    tenerlo en los dos lados lo duplicaba. Eso liberó ~134px en móvil y es lo
    que hace subir al h1 y a los CTAs.
    * El desplegable de móvil pasó a `absolute top-full`: con el nav de altura
      fija, si el menú fuera parte del flujo lo estiraría y rompería la cuenta.
    * En móvil el h1 quedaba arrancando EXACTAMENTE donde termina la barra promo
      (medido: 107px los dos). Se le puso `pt-5`, que es el aire que antes daba
      el logo. **No agranda el hero**: se lo come el hueco libre que queda sobre
      la burger, que va con `mt-auto`.
  * **EL ESQUELETO SE APOYA SOBRE LA BURGER** (`esqueleto.webp`, dibujo del
    cliente). Reemplaza a la mascota del diablito, **que se borró** junto con
    `diablo.png`, `diablo-guino.png` y `DiabloHero.tsx`.
    * **Se posiciona contra la CAJA DE LA BURGER, no contra el viewport**: el
      wrapper de la burger dejó de ser `display: contents` en móvil y pasó a ser
      una caja real, con las clases que antes tenía la imagen (el layout no
      cambió). El esqueleto va `absolute` adentro, con `bottom` y `w` en %: si
      la burger cambia de tamaño, la sigue sola. Esa era justo la deuda que
      arrastraba el diablito, que estaba anclado al viewport.
    * **Es más chico en desktop en proporción** (36% del ancho de la burger
      contra 52% en móvil): ahí la burger mide 720px y a la escala de móvil el
      esqueleto se saldría del hero por arriba.
    * `z-[6]`: por encima de la burger y también del zócalo de llamas (`z-[5]`),
      que si no le comería los pies en pantallas bajas.
    * El PNG venía en 4752x3358 con el dibujo ocupando 2191x2407 en el medio:
      se recortó a su contorno y se pasó a WebP. **500KB → 105KB.**

* **LA BURGER DEL HERO ES LA SATANÁS + TAMAÑO FIJO EN MÓVIL (2026-09-01, pedido
  del cliente)**: `burger-satanas.webp` (1600x1108, 195KB) reemplaza a
  `burger-hero.png` (archivado en `originales/`). Es el `SATANAS-SFONDO.png` del
  cliente RECORTADO al dibujo —traía 16% de aire arriba y abajo— para que las
  medidas del layout refieran a la burger visible (misma regla que el sticker del
  nav). El ratio quedó en 1.44 contra 1.55 del anterior, así que el desktop casi
  no se movió: verificado en 1440x900 y 1280x720 (h1 793 < burger 835; burger
  termina 99px/43px antes del fuego).
  * **EN MÓVIL LA BURGER YA NO MIDE "EL ALTO QUE SOBRA"**: era `flex-1` +
    `object-contain`, y eso dependía del navegador — Chrome de Android deja mucho
    alto libre y se veía grande; el Safari del iPhone (más UI, menos viewport) le
    dejaba ~92px y la MISMA página la mostraba diminuta (el reporte del cliente).
    Ahora es `w-[82%]` con su propio ratio (`h-auto`): el ancho de pantalla es
    igual en todos los navegadores → la burger mide SIEMPRE lo mismo (medido:
    320x222 idéntica en 390x844 y 390x660).
  * **El 82% no es a ojo**: es el tamaño de Chrome en 390x844 (donde el cliente
    la veía bien) y el que hace cerrar el hero en 844px exactos. Con 112%
    desbordaba 81px hasta ahí.
  * **El hero móvil pasó de `h-[100svh]` a `min-h-[100svh]`**: si la pantalla es
    corta (Safari ~660px útiles) el hero crece ~140px y se scrollea, en vez de
    achicar la burger. Tamaño constante > pantalla exacta: ese es el trato. En
    `lg` sigue `h-` exacto.
  * **La mascota se re-midió** para la imagen nueva: el filo superior izquierdo
    del pan pasa por (18%, 14%) — antes (16%, 12%). Si cambia la imagen, re-medir.
* **TIPOGRAFÍAS DE LA MARCA (2026-09-01, mensajes de la comunidad)**: Ardillah Kafi
  (títulos), Splatink (graffiti para detalles) y Sveningsson (cuerpo) reemplazan a
  Anton/Archivo. Ninguna está en Google Fonts: van con `next/font/local` desde
  `src/app/fonts/` — los woff2 se convirtieron de los TTF con fontTools (1/3 del peso).
  Verificado con Playwright: el h1 del hero con Ardillah termina en el 55% del ancho en
  1440 (el límite es 58.6%, donde arranca la burger) y no hay desborde en 390.
  * **Splatink NO TRAE acentos ni eñes** (104 glifos): solo se usa en palabras sin
    tilde — una tilde caería al fallback y se notaría el cambio a mitad de palabra.
    Por eso el rótulo de nosotros dice "Sobre nosotros". El token es `font-grafiti`.
  * **Ninguna de las tres trae la flecha "→"** de los CTAs: la dibuja el fallback del
    sistema. Verificado en captura que se ve bien.
  * **Sveningsson tiene UN solo peso**: `font-medium`/`semibold`/`extrabold` los
    sintetiza el navegador. Si algún peso se ve sucio, esa es la causa. (Archivo
    cargaba el 800 solo para la flecha; ya no hace falta.)
  * ⚠ **LICENCIA**: Ardillah Kafi (StringLabs) y Splatink (Darrell Flood) son "free
    for personal use" — el uso comercial se compra (Splatink: USD 10 mín. a
    dadiomouse@gmail.com). La marca ya las usa como propias y las tiene en su Drive:
    confirmar con el cliente, y si el Drive trae otras versiones, reemplazar los woff2.
* **SECCIÓN "RESEÑAS" (2026-09-02, pedido del cliente)**: `Resenas.tsx`, ancla
  `#resenas`, entre la carta y «Nuestra historia». La intro es el TEXTO DEL
  CLIENTE tal cual (el cliché "somos dos amigos…" en itálica atenuada y entre
  comillas, cortado por un "Ufff, qué aburrido 🥱" en display que hace de título)
  y debajo diez reseñas de Google en una fila que se desplaza sola.
  * **LA INTRO SE REORDENÓ EN TRES BLOQUES Y GANÓ EL ESQUELETO DORMIDO
    (2026-09-03, pedido del cliente)**: antes los cuatro textos iban en una
    sola columna pegada a la izquierda. Ahora:
    1. El cliché, CENTRADO.
    2. Una fila con el remate — ya sin el 🥱, quedó "Ufff, aburrido." a secas
       — a la izquierda y el ESQUELETO DORMIDO de la marca (dibujo del
       cliente, `esqueletoDurmiendo` en `content/resenas.ts`) tirado a la
       derecha. **El dibujo reemplaza al emoji**: ya cuenta el chiste del
       aburrimiento con la bandeja de comida y el "ZZZ", así que el 🥱 sobraba
       al lado.
    3. Los dos párrafos, otra vez CENTRADOS. El segundo perdió el 👇 final:
       sin un remate-emoji arriba señalando, un emoji suelto apuntando hacia
       abajo ya no acompañaba nada.
    * PNG con alpha del cliente, recortado a su contorno real (ratio 1.77) y
      pasado a WebP: **1.9MB → 115KB**. El original queda en
      `originales/esqueletodurmiendo.png`.
    * Se dimensiona por ANCHO (`w-[46%] sm:w-[38%] lg:w-[30%]`, `h-auto`) y
      no por alto: es un dibujo apaisado que tiene que convivir al lado del
      remate en la misma fila, en vez de imponer su propia altura.
  * **LAS RESEÑAS SON REALES**, sacadas de la ficha de Google Maps del local
    (4,9 con 28 reseñas con texto al 2026-09-02). El cliente dijo "si no podés
    conseguirlas, inventalas" — no hizo falta, y mejor: reseñas inventadas en la
    web de un negocio es justo lo que no conviene publicar.
    * **Cómo se consiguieron**: la búsqueda de Google (`#lrd=…`) y su endpoint
      `/async/reviewDialog` devuelven CAPTCHA / 404 a un navegador automatizado.
      Lo que funciona es Google Maps con el bloque `data=` completo del lugar más
      `!9m1!1b1` al final, que abre el panel de reseñas sin login (URL en
      `content/resenas.ts`). El ID del lugar es `0x967e093f49e06e95:
      0x32106f4683708478` (CID `3607505650167350392`). Ojo: cada reseña rinde
      varios nodos `[data-review-id]` — para saber cuántas hay, contar IDs únicos
      (contando nodos, el scroll de carga se cortaba en 5).
    * **Criterio de selección**: 5 estrellas, completas (Google corta algunas con
      "…"), 60–480 caracteres para que entren en la tarjeta, variadas (turistas,
      delivery, burgas por nombre, el dip, la atención) y **sin la que critica a
      un competidor con nombre**. Quedaron afuera una de 1 estrella y tres de 4.
    * **Texto y nombre VERBATIM**: como los escribió cada persona, con sus
      mayúsculas y emojis; solo se unieron los saltos de línea. SIN fecha a
      propósito: Google las muestra relativas ("hace 2 meses") y quedarían viejas.
  * **El carrusel es el MISMO mecanismo que la barra promo**: tarjetas duplicadas
    y la pista se desplaza -50% con el `@keyframes marquee` que ya existía. La
    segunda copia va `aria-hidden`. Se pausa con el mouse encima; con
    `prefers-reduced-motion` queda quieta, scrolleable a mano, y la copia
    duplicada se oculta. Duración = 7s × cantidad de reseñas, así la velocidad
    no cambia si se agregan o sacan. Las tarjetas tienen ANCHO FIJO (no `min-w`):
    el `-50%` solo cierra si las dos copias miden exactamente lo mismo.
  * **LAS TARJETAS SON APAISADAS Y LLEVAN LA "G" (2026-09-03, pedido del
    cliente con captura de referencia)**: se ensancharon (340/416px contra
    320/368) y el texto pasa a cortarse en **3 líneas y no 5**. Las dos cosas
    van juntas: ensanchar sin recortar el texto habría hecho la tarjeta más
    grande, no más apaisada. Quedó en **416x214 — ratio 1.94** (medido; antes
    era casi cuadrada), y las 20 tarjetas de la fila miden exactamente lo mismo.
    * **La referencia es el WIDGET de reseñas de Google**, el que se incrusta
      en sitios — no el panel de Maps que se había clonado el 2026-09-02, que
      es angosto y alto porque vive en una barra lateral.
    * **LA FECHA SUBIÓ a la línea gris**, junto a "Google", y las estrellas
      quedaron solas en su fila. Antes esa línea era el recuento de reseñas de
      la persona (`meta`): ese dato **ya no se dibuja** y vive en el `title`
      del nombre — con la tarjeta apaisada no sobra alto para las dos líneas.
      El campo sigue en `content/resenas.ts` con su nota.
    * **La "G" va en sus CUATRO COLORES oficiales**, inline como SVG: es el
      sello de procedencia y en monocromo dejaría de leerse como la de Google.
      Es la única excepción de color de toda la web junto al ámbar de las
      estrellas, y por el mismo motivo.
  * **LAS TARJETAS SON CLONES DE LAS DE GOOGLE MAPS, en oscuro** (2ª iteración
    del mismo día, pedido del cliente: "exactamente como Google en formato
    oscuro"). Viven en `ui/TarjetaResena.tsx`. La anatomía NO se hizo de memoria:
    se sacó inspeccionando una tarjeta real con `getComputedStyle` —avatar 32px,
    nombre 16px/20, meta 13px gris, estrellas 16px + fecha en la MISMA fila,
    texto 14px/21 y el "Más" en azul-link—.
    * **El ámbar de las estrellas es el `#ffbb29` EXACTO de Google**, no el
      `--highlight` de marca: es el sello de "esto es de Google" y cambiarlo lo
      disfraza. Da 10.27:1 sobre el carbón de la tarjeta (medido).
    * **El avatar es la INICIAL sobre un disco de color**, que es lo que Google
      dibuja cuando no hay foto. Las fotos reales son URLs de
      `googleusercontent` que caducan, y además implicarían servir la cara de
      esas personas desde acá. El color sale de la suma de caracteres del
      nombre, así cada persona tiene siempre el mismo.
    * Quedaron afuera el menú de tres puntos, el "¿Te resultó útil?" y las
      fotos: son controles de Google, no información.
    * El fondo de la sección pasó a NEGRO PURO y las tarjetas a carbón
      (`--background`): antes era al revés y sobre el negro se les perdía el
      cuerpo. Ahora la sección es el fondo y la tarjeta la superficie elevada,
      igual que en Google.
  * Viven en `content/resenas.ts`, archivo propio: `home.ts` ya pasa las 300
    líneas.
  * **De paso llegaron DOS datos reales más de la ficha de Maps**: el CP es
    **M5502** (yo había puesto 5500 a ojo) y el teléfono es **0261 599-0627**.
    Actualizados en `constants.ts`. ⚠ NO se sabe si ese teléfono es WhatsApp:
    `DEFAULTS.whatsapp.numero` sigue en placeholder hasta que el cliente confirme.
* **SECCIÓN "WORK" (2026-09-02, pedido del cliente)**: `Work.tsx`, ancla `#work`
  — el aviso de búsqueda de personal. El link del nav ya apunta ahí, así que el
  único que sigue en `#` es BURGUERS. Un rótulo, el título "Sumate!", un párrafo
  y un solo botón rojo al **formulario de Google** (`LINK_TRABAJO` en
  `constants.ts`, con `target="_blank"` + `rel="noopener noreferrer"` por ser
  dominio ajeno).
  * **Va CENTRADA y en columna angosta** (`max-w-[46ch]`), al revés que la carta
    y nosotros, que van pegadas a la izquierda: acá hay UNA sola acción y el
    centrado la señala sin competencia.
  * **FONDO ROJO HELL'S (`--primary`) — 2026-09-02, pedido del cliente**: era
    carbón. Entre dos secciones negras (nosotros arriba, el footer abajo) el
    bloque rojo corta la página y separa el aviso de la carta.
    * **El texto va con `--primary-foreground`, NO con `--foreground`**: el color
      de texto normal de la web es #f5f5f5 ("hueso") y sobre este rojo da
      **4.21:1 — no llega** al 4.5:1 de AA para texto normal (medido; el párrafo
      son 15.6px en móvil). `--primary-foreground` es blanco PURO y existe justo
      para esto: 4.59:1 medido. En el resto de la web los dos se ven igual, sobre
      el rojo no. Misma familia de regla que la sección roja anterior ("Las
      Burgas"): sobre el rojo, el carbón da 3.40:1 y solo sirve para texto grande.
    * **El botón se invirtió**: era rojo, o sea invisible sobre este fondo. Ahora
      es un bloque CARBÓN con texto blanco (15.96:1 adentro) y el hover va al
      negro — al naranja `--highlight` se ensuciaba sobre el rojo.
  * **El copy ES del cliente** —a diferencia del hero y de nosotros, que siguen
    sin aprobar—. Solo se le agregaron los acentos que faltaban (increíbles,
    tenés, energía, dinámico, querés, dejá): la fuente de cuerpo los trae y sin
    ellos se leían como erratas. El título "Sumate!" quedó tal cual lo escribió.
  * **El botón NO usa el componente `Boton`**: ése va con `next/link` y
    tipografía de cuerpo. Acá se repite el CTA primario del hero (rojo,
    `font-display`, hover al naranja `--highlight`) porque es el mismo gesto de
    marca. Blanco sobre `--primary` da 4.59:1, AA.
* **SECCIÓN "NUESTRA HISTORIA" (2026-09-01, pedido del cliente)**: `Nosotros.tsx`,
  ancla `#nosotros` (el link del nav ya apunta ahí; quedan `#` BURGUERS y WORK).
  Composición pedida: título, imagen izquierda + texto derecha, texto izquierda +
  imagen derecha, y una imagen a TODO el ancho al pie. En móvil se apila en orden de
  lectura sin clases de `order`. **Las tres fotos no existen**: cada hueco es un marco
  de borde punteado rojo con leyenda numerada (pedido explícito del cliente:
  "marcámelo con bordes y luego yo te digo qué colocar"). **El copy lo dio el
  cliente el 2026-09-02** y reemplazó al provisorio (el del hero sigue sin aprobar). Fondo NEGRO PURO como la carta (2026-09-01,
  pedido del cliente; primero fue carbón para separar tonalmente las secciones).
  * **Sin rótulo y con el título en BLANCO (2026-09-02, pedido del cliente)**:
    llevaba un "Sobre nosotros" en Splatink encima del título, y el título iba en
    rojo como el de la carta. Los dos se fueron el mismo día: la sección arranca
    directo con "NUESTRA HISTORIA" en blanco. El `rotulo` se sacó también de
    `content/home.ts` para no dejar dato muerto (queda en el historial).
    Splatink SIGUE EN USO: el rótulo "Buscamos crew" de Work es su único lugar
    en la web, así que su licencia comercial sigue haciendo falta confirmarla.
* **Next.js 15.5 y no 16**: el kit fija "15+" y 15.5 es la versión estable probada con
  Tailwind v4 y Motion 13. Revisar el salto a 16 recién cuando haya que tocar el stack.
* **Grilla de "Las Burgas" (2026-08-24)**: 8 tarjetas cuadradas con la foto adentro y una
  **etiqueta blanca en la esquina** que es el HUECO donde el cliente pega su sticker con
  el nombre (decisión del cliente: los nombres los define él más adelante).
  * **La etiqueta se dibuja aunque `nombre` esté vacío**, con dos rayas grises adentro:
    si desapareciera al no haber texto, no se vería dónde va el sticker. Cuando el
    nombre exista, se escribe en `content/home.ts` y la etiqueta lo dibuja sola.
  * **LAS OCHO ETIQUETAS SON DISTINTAS** (2026-08-24, pedido del cliente): cada burga
    tiene nombre propio —Lucifer, Crepúsculo, Jesús, Antidemonio— así que su sello no
    puede ser el mismo recuadro repetido. Viven en `components/ui/etiquetasBurga.ts`:
    recta, píldora, banda, sello redondo, esquina cortada, vertical, chapa y diagonal.
    * Cada variante cambia **tres cosas a la vez**: forma, esquina y ángulo. Con una
      sola de las tres se siguen leyendo como la misma etiqueta corrida de lugar.
    * **Dos tarjetas vecinas no comparten esquina** —ni la de al lado ni la de abajo—
      sobre la grilla de 2 columnas de móvil. Si se reordenan los items, rehacer ese
      chequeo. Verificado 8/8 posiciones distintas de 280px a 1920px.
    * **El sello redondo NO sangra el borde**, a diferencia de las otras: un círculo
      cortado por el canto se lee como un error de recorte, no como un sello pegado.
    * La banda cruzada va a media altura y la chapa sube su `bottom`: al pie tapaban la
      leyenda "Foto pendiente" (y taparían la foto real).
    * Las clases se escriben COMPLETAS, no armadas por template string: Tailwind escanea
      el fuente y una clase construida en runtime no se compila.
  * **1 columna en móvil** (decisión del cliente, 2026-08-24), 3 de `sm` y 4 de `lg`.
    Se había pasado a 2 columnas cuando las tarjetas eran placeholders grises: ahí una
    sola columna daba 3284px de scroll para ver ocho recuadros vacíos y se leía como una
    lista larga. **Con las fotos reales el criterio cambia**: cada tarjeta tiene algo que
    mirar, la burger se ve al tamaño que merece (343px en un iPhone SE contra 164px a dos
    columnas) y el sticker del nombre entra a ancho completo. La sección mide ~3.3k px en
    móvil y eso ahora es el recorrido de la carta, no un costo.
    Al pasar a una columna se agrandaron la etiqueta y su tipografía **solo en móvil**:
    a doble ancho de tarjeta, las medidas de la grilla de 2 columnas quedaban chicas en
    proporción.
  * **Las tarjetas rotan en CONTRAFASE** (pares al revés que impares): con todas
    inclinadas igual la grilla se lee como un error de alineación; alternadas se lee
    como stickers pegados a mano, que es la estética que pidió el cliente.
  * **La sombra es un bloque desplazado, no `box-shadow`**: sobre el rojo saturado de la
    sección un `box-shadow` se ve como una mancha gris sucia.
  * **Los recuadros alternan tres tonos** (carbón, rojo oscuro y el naranja `--highlight`)
    para que la grilla no se lea como una tabla.
  * **La bajada va en BLANCO y no en carbón**: es texto chico, y el carbón sobre el rojo
    de la sección da 3.40:1 — solo alcanza para texto grande. Misma regla para precios.
  * **Mientras no hay foto se dibuja un marcador con el isotipo** y la leyenda "Foto
    pendiente", no un gris plano: deja la grilla presentable y a la vez es evidente que
    falta el material real. (Ya no se usa: las 8 tarjetas tienen foto.)
  * **FOTOS (2026-08-24, aportadas por el cliente)**: 4 fotos de estudio para 8 tarjetas,
    repetidas en el orden `1,2,3,4,2,1,4,3` — elegido para que **dos tarjetas vecinas
    nunca muestren la misma foto**, y eso vale en las dos grillas (2 columnas en móvil y
    4 en desktop). Si se reordenan los items, rehacer el chequeo.
    Los JPG venían en 3840x2880 y ~540KB cada uno; se recortaron a cuadrado y se
    convirtieron a WebP: **2.1MB → 258KB**. El recorte se centra en el sujeto, detectado
    por centro de masa de brillo (está en el 41-45% del ancho en las cuatro).
  * **La primera tarjeta SE ARMA SOLA (2026-08-25, pedido del cliente)**: encadena tres
    fotos de la misma burga —ingredientes separados, a medio juntar, terminada— con un
    crossfade, en `components/ui/BurgaArmado.tsx`. Es el gancho de la sección.
    * **Arranca al entrar en pantalla**, no al cargar la página: la carta está debajo del
      hero y si corriera al montar el visitante se la perdería entera. Lo dispara un
      `IntersectionObserver` con threshold 0.45.
    * **Se reproduce UNA vez** y queda en la foto final. En bucle competiría con el resto
      de la grilla, y la burga terminada es la que conviene dejar puesta.
    * **Las tres se montan desde el arranque** con opacidad 0. Si entraran a demanda, el
      cambio de fase mostraría un hueco mientras baja el archivo.
    * Con `prefers-reduced-motion` se muestra directo la foto final.
    * **Las dos primeras fases venían con fondo BLANCO** (las originales del cliente son
      JPG). Se les quitó con flood-fill desde los bordes, no por umbral de color: el
      queso y el pan claro del interior no llegan al borde, así que el relleno no los
      alcanza. Con un umbral plano se habrían borrado.
    * **Ojo con el contenedor**: `BurgaArmado` va en `absolute inset-0` y NO en
      `relative`. Sus tres imágenes son `fill` —o sea absolutas—, así que un `relative`
      sin alto propio colapsa el div a 6px y la tarjeta se ve vacía. Pasó al armarlo.
  * **La primera tarjeta lleva una foto SIN FONDO** (`burga-destacada.webp`, PNG con
    alpha aportado por el cliente). Va con `recorte: 'contain'` y no `cover`: la burger
    está recortada y flota sobre el color del recuadro, así que `cover` se la comería.
    Lleva `translate-y-[7%] scale-[0.94]` para que la etiqueta no le caiga sobre el pan,
    y un `drop-shadow` que le da el volumen que las otras tienen por la foto.
  * **Las etiquetas se reubicaron al entrar las fotos**: con el marcador gris daba igual
    dónde caían, pero sobre una foto real la banda cruzada y la chapa **tapaban la
    hamburguesa**. Medido: la comida ocupa del 33% al 94% del alto, así que las etiquetas
    grandes viven en la franja alta (sobre el fondo oscuro de la foto, que además es
    donde más contrastan) y solo la chapita chica queda abajo, sobre la madera.
* **La primera burga es un VIDEO movido por el scroll (2026-08-26, prueba pedida por el
  cliente)**: `belsebu.mp4` reemplaza a la secuencia de fotos (`BurgaArmado`, que sigue
  en el código por si se vuelve atrás: basta borrar `video` y poner `animada: true` en
  `content/home.ts`). Vive en `components/ui/BurgaVideo.tsx`.
  * **No se reproduce solo: el tiempo lo fija el scroll.** Progreso 0 cuando el bloque
    asoma por abajo y 100% cuando queda **centrado en el viewport**; de ahí en adelante
    se queda en el frame final. Fórmula: `(vh − top) / (vh/2 + alto/2)`. Verificado en
    390x844: 60px asomando → 0.48s, centrado → 5.02s de 5.04.
  * **El mp4 tiene TODOS los frames como keyframe** (`ffmpeg -g 1 -keyint_min 1`). El
    original del cliente (960x960, 3.5MB) traía **1 keyframe en 121 frames**: cada
    `currentTime` obligaba a decodificar desde el principio y el scrub se trababa.
    **Si se reemplaza el video, volver a hacerlo.** El original quedó en la raíz
    (`belsebu.mp4`), sin trackear.
  * **RECETA PARA LOS 8 VIDEOS (2026-08-26)** — la primera visita se veía trabada y
    van a entrar siete más. El comando exacto está en `BurgaVideo.tsx`:
    `scale=720:720,fps=12 -g 1 -crf 25 -preset veryslow -movflags +faststart`
    → **765KB** contra 1.37MB de la primera versión (**-44%**).
    * **Se recortan los FRAMES, no la resolución**: a 12 fps el scrub se ve igual
      porque el frame lo elige el dedo, no un reloj. **No bajar de 720px** — a 540
      (509KB) en pantallas 3x la cebolla crocante se ve pastosa. Comparado por
      recorte de detalle antes de decidir.
    * **Carga en cascada**: `preload="none"` + `rootMargin: 150%`. El video ya NO se
      descarga con la página (competía con el JS y llegaba tarde: ése era el tirón de
      la primera visita), sino cuando el visitante se le acerca. Con ocho videos es lo
      que evita que se peleen ocho descargas a la vez. Medido en 4G simulado: el
      video queda **completamente buffereado antes de que el visitante llegue**.
    * **`poster` con el primer frame** (`belsebu-poster.webp`, 5KB): mientras el video
      no tiene datos se ve la foto en vez de un rectángulo negro sobre fondo negro.
      Es lo que más cambia la percepción — el video tarda lo mismo pero nunca hay un
      hueco. Tiene que ser el PRIMER frame: con cualquier otro habría un salto.
  * **En móvil la tarjeta pierde el recuadro**: sin rotación, sin esquinas ni sombra, y
    el `<li>` se sale del padding de la sección (`-mx-4`) para que el bloque **negro**
    llegue de borde a borde. Es `#000` y no `--background` a propósito: el video
    arranca en negro puro y así el primer frame se funde con el bloque. **De `sm` para
    arriba conserva la tarjeta** como las demás para no romper la grilla (verificado:
    4 columnas alineadas en 1440).
  * Solo escucha el scroll mientras el bloque está cerca (`IntersectionObserver`,
    `rootMargin: 25%`) y encola un seek por frame con `requestAnimationFrame`.
    Con `prefers-reduced-motion` se muestra `belsebu-final.webp` (el último frame) y
    el video ni se descarga.
  * **En producción el celular NO mostraba el video (2026-08-26)** mientras en escritorio
    andaba: iOS Safari y Chrome con ahorro de datos **ignoran `preload="auto"`** y no
    bajan ni un byte hasta que alguien reproduce; sin datos el `<video>` no dibuja
    ningún frame y sobre el bloque negro se ve vacío. Se "destraba" con `play()` +
    `pause()` la primera vez que el bloque se acerca (permitido sin gesto por ser
    muted + playsInline). Si vuelve a fallar, lo siguiente a revisar es que el server
    responda `Accept-Ranges: bytes` para el mp4 — sin rangos, iOS tampoco reproduce.
  * **Arranca cuando entró el 45% del bloque** (`ARRANQUE` en `BurgaVideo.tsx`), no
    apenas asoma: el cliente lo vio "empezar sin que se esté viendo" (con un 10% del
    bloque asomando ya iba por 0.5s). Verificado: 0.00s al 10% y al 45%, 1.10s al 70%,
    5.01s centrado.
* **LAS DOCE BURGAS CON SU VIDEO (2026-08-27, material del cliente)**: llegó la
  carpeta `burgashells/` con 12 videos y 12 fotos. Reemplazan a todo lo anterior de la
  sección (las 4 fotos repetidas, los dos videos de Belcebú en prueba, los stickers).
  Orden, nombres e ingredientes los dio el cliente y viven en `content/home.ts`.
  * **EL VIDEO YA NO SE MUEVE CON EL SCROLL** (pedido del cliente): se reproduce solo,
    UNA vez, al entrar en pantalla, y al terminar queda la **foto de producto** —no el
    último frame—, que está mejor iluminada.
  * **VAN A DOBLE VELOCIDAD (2026-08-31, pedido del cliente)**: 2.02s en vez de 4.04s.
    La aceleración se hornea al codificar (`setpts=0.5*PTS`), NO con `playbackRate`
    desde JS: el archivo queda con la mitad de frames (**~130KB**, -39%) y no depende
    de que el navegador del celular respete la velocidad. En la cadena de filtros
    `setpts` va ANTES de `fps=24`; al revés, el remuestreo duplicaría frames para
    rellenar y pesaría de más sin verse mejor.
  * **Eso es lo que permitió que pesaran poco.** El scrub obligaba a codificar el mp4
    con todos los frames como keyframe (`-g 1`), que multiplicaba el peso por ~5. Al
    reproducirse de corrido alcanza un GOP normal:
    `scale=720:720,fps=24 -crf 26 -preset slow -movflags +faststart`
    → **~200KB por video** contra los 765KB de la receta anterior y los 2.3MB del
    original. Las doce con sus fotos y posters: **3.2MB** (los originales eran 31MB).
    La receta quedó en `originales/procesar.sh`.
  * Cada burga tiene tres archivos en `public/burgas/`: `<slug>.mp4`, `<slug>-poster.webp`
    (primer frame, se ve mientras baja) y `<slug>.webp` (la foto que queda al final).
  * **Carga en cascada, en dos tiempos**: un observer con `rootMargin: 200%` dispara la
    DESCARGA bastante antes de que la tarjeta se vea, y otro con `threshold: 0.5` dispara
    el `play()` cuando ya se ve. Con doce videos, precargarlos todos al abrir la página
    los haría competir entre sí y con el JS — que era justo el tirón que había que sacar.
  * **El nombre pasó a ir DEBAJO**, junto a los ingredientes, en vez de dentro de la
    etiqueta blanca: con los doce nombres reales se lee mejor como ficha de producto, y
    la etiqueta tapaba parte de la hamburguesa. `BurgaCard` sigue soportando la etiqueta
    (`nombreEnEtiqueta`) y el `sticker` por si el cliente manda los doce sellos.
  * `sticker-belcebu.webp` e `isotipo.png` quedaron **sin uso** y se archivaron en
    `originales/`. Con ellos se fueron `etiquetasBurga.ts` del uso diario (el módulo
    sigue, lo importa `BurgaCard`) y el marcador de "Foto pendiente", que ya no hace
    falta porque las doce tienen material.
  * Ojo con `ffmpeg` dentro de un `while read`: **se come el stdin del bucle** y corrompe
    las variables (la primera pasada dejó archivos llamados `atanas.mp4`, `al.mp4`).
    Va con `-nostdin`.
* **EL "TOCADISCOS" ES LA CARTA OFICIAL (2026-09-01, elección del cliente)**: la foto
  de la burga activa se ve ENTERA y a todo el ancho, tal cual la original; sobre esa
  misma foto asoman a los costados las vecinas SIN FONDO, más chicas y oscurecidas; al
  deslizar, la de al lado gira hacia el centro creciendo y llega a tamaño real sobre
  su propia foto. Vive en `components/ui/CarruselBurgasV2.tsx`, montado en
  `LasBurgasV2` — **los archivos conservan el "V2" en el nombre** de cuando convivía
  en prueba con la versión anterior; ésa (`LasBurgas.tsx` + `CarruselBurgas.tsx`, el
  carrusel en profundidad) **se borró el 2026-09-01** al elegir el cliente. Quedan en
  el historial. `LasBurgasV2` heredó el ancla `#carta` (el CTA del hero apunta ahí),
  el título/bajada de `content/home.ts`, y la bajada pasó a BLANCO (pedido del
  cliente; 15.96:1, holgado). El rótulo "Versión 2 · en prueba" se fue con la prueba.
  * **La clave es que cada foto está partida en DOS CAPAS** (`escena` en
    `content/home.ts`): `fondo` (la foto sin la hamburguesa) y `silueta` (la
    hamburguesa sola) más una `caja` que la coloca donde estaba. **Fondo + silueta
    reconstruyen exactamente la original** (diferencia medida: 2–10 sobre 255).
    Así la activa no es "una foto" sino su fondo con su silueta clavada encima; al
    deslizar, la silueta gira sola y el fondo se funde con el de la siguiente (son
    degradés casi iguales). **Nunca se cambia una imagen por otra**: la burger que
    llega al centro es la misma que después queda quieta. Por eso no hay salto ni
    "fondo rojo apareciendo", que era lo que fallaba en la versión anterior.
  * **Los PNG sin fondo del cliente son la MISMA TOMA que la foto, pero con zoom**
    (la burger llena el cuadrado). `originales/tocadiscos.py` alinea cada uno contra
    su foto —primero por cajas, después afinando escala y posición hasta minimizar
    la diferencia de color— y de ahí sale la `caja`. **No editar las cajas a mano.**
  * **El fondo sin burger no existía**: se genera rellenando el hueco. Primero se
    interpola cada columna entre el píxel de arriba y el de abajo del hueco (el
    degradé es vertical/radial y así lo sigue) y después se difumina en pasadas
    fijando lo conocido. Arrancar con un color medio dejaba una **banda más clara**
    donde había estado la burger — verificado a ojo, corregido.
  * **Satanás ya usa su PNG real**: `SATANAS-SFONDO.png` llegó el 2026-09-01 (la
    primera pasada la recortó por croma y se comía la base del pan). Alineó con
    diff 6.6 — invisible — y la caja nueva quedó en `content/home.ts`.
    * **Sus archivos van con `-2` en el nombre** (`satanas-silueta-2.webp`,
      `satanas-fondo-2.webp`): el regenerado pisó la MISMA URL y el navegador del
      cliente siguió mostrando el recorte viejo cacheado — reportó "sigue cortada"
      cuando el servidor ya servía el bueno (verificado: alpha opaco hasta la
      base, luminancia foto 76 vs render 74, diff 4.7–6.6). URL nueva = caché
      imposible. **Regla: si se regenera un asset con otro contenido, cambiarle
      el nombre.** Ojo: `tocadiscos.py` escribe SIN el `-2`; si se re-corre,
      renombrar o actualizar `content/home.ts`.
  * El giro: `x` sigue el seno del ángulo (60° por paso, radio 0.44 del ancho), sube
    un 7% por paso, escala 1 → 0.5 → 0.3 y brillo 1 → 0.42. El escenario lleva
    `overflow-hidden`, así que las siluetas salen por los costados sin scroll.
  * **EL NOMBRE ES EL STICKER (2026-09-01, material del cliente)**: en el tocadiscos
    el sello con el nombre reemplaza al texto, montado sobre el borde inferior de la
    foto (mitad sobre la imagen, mitad afuera) y aparece/desaparece con la burga.
    Va en `escena.sticker`; los 11 PNG de la raíz se recortaron a `public/burgas/
    <slug>-sticker.webp` y los originales están en `originales/stickers/`.
    * **Caja de ALTO fijo (`15vw`), no de ancho**: los sellos van de 1.7:1 a 3.8:1 de
      proporción; con ancho fijo Lucifer saldría el doble de alto que Asmodeo.
    * **`pointer-events-none` en TODA la ficha**: el margen negativo del sticker se
      propaga (margin collapse) y la ficha entera sube sobre el escenario — medido,
      el toque en la franja de abajo caía en la ficha y ahí no se podía arrastrar.
    * **Falta el sticker de Balak**: esa burga muestra el nombre en texto hasta que
      llegue. Al llegar: guardarlo en la raíz, agregarlo al mapa y reprocesar.
  * **LA FICHA MIDE SIEMPRE LO MISMO (2026-09-01, pedido del cliente)**: las doce
    fichas (sticker + ingredientes) van MONTADAS Y APILADAS en una grilla —todas en
    la celda 1/1— y solo la activa se ve. El contenedor toma la altura de la más
    alta, así que la sección ya no cambia de alto al pasar de burga (antes un
    sticker más petiso o un ingrediente de una línea encogían la página en cada
    pasada; el `min-h` a mano no alcanzaba). Verificado: #carta mide 800px en las
    12 posiciones en 390x844. El fundido pasó de `AnimatePresence` a un crossfade
    de opacidad — mismo efecto, sin desmontar nada. Los 12 stickers montados suman
    ~250KB, coherente con el escenario que ya monta los 12 fondos y siluetas.
  * **EL VIGÍA (2026-09-01)**: `snap-proximity` solo engancha CERCA de un punto — si
    el dedo suelta lejos de todos, el carril quedaba quieto a mitad de giro, con dos
    burgas congeladas a medio camino (pasaba en el celular real). Ahora, 160ms
    después de que el scroll se aquieta sin un dedo apoyado (touchstart/touchend lo
    rastrean), un `scrollTo` suave lo asienta en la burga más cercana; como dispara
    los mismos eventos de scroll, el giro se completa con la misma animación. El
    umbral de 0.02 evita que se re-dispare mientras su propio asentado corre.
  * Verificado en 390x844: reposo = foto original; a mitad de giro las dos al 0.71
    de escala y fondos 50/50; en la segunda, Satanás toma su caja exacta.
    **Pendiente probarlo en un celular real.** Pesa: fondo 4KB + silueta ~45KB por
    burga. Los `-recorte.webp` y `sativa.webp` de la versión anterior quedaron sin uso.
* **EL CARRUSEL PASÓ A SER EN PROFUNDIDAD (2026-08-31, 2ª iteración, pedido del
  cliente)**: las tarjetas ya no van en fila sino APILADAS en el mismo punto — la
  activa al frente y las vecinas detrás, más chicas, corridas a los costados y
  oscurecidas. Al deslizar o TOCAR una de atrás, se acerca hacia adelante.
  * **El gesto lo mueve un CARRIL INVISIBLE**: como las tarjetas están superpuestas
    (`absolute`), no pueden ser lo que se scrollea. Encima de todo va un carril
    transparente con `scroll-snap` cuyos hijos son slots vacíos; su `scrollLeft` es
    la única fuente de verdad y de ahí salen escala, corrimiento, velo y `z-index`
    de cada tarjeta. Así la inercia y el imán al centro siguen siendo del sistema
    operativo, en vez de una física reimplementada a mano.
  * **El corrimiento lateral crece con la RAÍZ de la distancia**, no lineal: lineal,
    las lejanas se iban tan afuera que dejaban un hueco alrededor de la activa.
  * **VA CON `snap-proximity`, NUNCA `mandatory` (2026-08-31)** — y esto es lo que
    hacía que la animación no existiera. Con `mandatory` el navegador **prohíbe las
    posiciones intermedias**: medido, `scrollLeft = 150` se corregía solo a 0 y solo
    aceptaba múltiplos exactos del paso. Como toda la profundidad se calcula a partir
    de esa posición, no había estados a medio camino que dibujar y las tarjetas
    saltaban de una escala a la otra. Con `proximity` se recorre el trayecto y
    engancha igual al soltar. Verificado: a mitad de camino las dos tarjetas quedan
    en 0.71 y 0.72, cruzándose.
  * **Las tarjetas NO llevan `transition` en el `transform`**: el arrastre ya las
    actualiza por frame y una transición encima las haría ir por detrás del dedo. El
    movimiento suave al TOCAR lo da el `behavior: 'smooth'` del scroll.
  * **El `z-index` de las tarjetas se queda por debajo de 100 y el carril va en 200**:
    con las tarjetas en 100 tapaban al carril y **el arrastre no movía nada**. Por lo
    mismo, el "tocar para traer al frente" vive en los slots DEL CARRIL y no sobre
    las tarjetas — un botón encima se comía el gesto.
  * **La activa ocupa el 84% del ancho** (2026-08-31, pedido del cliente: antes iba
    al 64% y la hamburguesa se veía chica). **No va al 100%**: probado, ahí la vecina
    arranca justo en el borde y no se ve nada de ella.
  * **SIN VIDEO POR AHORA (2026-08-31, pedido del cliente)**: todas las tarjetas
    muestran la FOTO de producto, en el carrusel y en la grilla. El cliente los sacó
    para ver primero cómo se lee el carrusel en producción. Verificado: **0 videos
    en el DOM y 0 mp4 descargados** en móvil y escritorio.
    Antes de esto el video iba **solo en la activa** (`VideoActivo`, local al
    carrusel), justamente para no tener tres o cuatro decodificando en paralelo.
    Para reponerlo hay que volver a montar ese componente —está en el historial de
    `CarruselBurgas.tsx`— y en `BurgaCard` cambiar el `<Image>` por `<BurgaVideo>`,
    que sigue en el proyecto sin uso.
  * **Los mp4 de `public/burgas/` quedaron sin referencia** mientras dure la prueba.
    NO borrarlos: son la sección entera si el cliente los repone. `BurgaVideo.tsx`
    queda igual, sin uso.
  * **La elección carrusel/grilla se hace en JS** (`lib/useEsMovil.ts`), no con
    `hidden`/`sm:block`. Con clases, las doce tarjetas de la grilla se renderizaban
    igual en móvil y sus doce `<video>` existían en el DOM descargando: **medido, 13
    videos en un celular en vez de 1**. El hook arranca en `false` a propósito para
    no romper la hidratación. La grilla se separó a `components/ui/GrillaBurgas.tsx`.
  * Verificado en 390x844: escalas 1.00 / 0.72 / 0.44, `z-index` decreciente, velo
    0 / 0.55 / 0.80, un solo video, y la ficha y el apilado correctos al tocar una
    vecina. **Falta probar el gesto en un celular real.**
* **Primera versión del carrusel (2026-08-31, reemplazada el mismo día)**: las doce
  en fila con `scroll-snap`, la activa centrada al 78vw y las vecinas asomando 11%
  a cada lado, oscurecidas por un velo proporcional. Vive en el historial de
  `components/ui/CarruselBurgas.tsx`.
  * **SOLO MÓVIL**: de `sm` para arriba sigue la grilla. El cliente pidió no trabajar
    la versión de desktop todavía ("después vemos cómo la pasamos").
  * **El gesto es `scroll-snap` NATIVO, sin librería**: la física del deslizamiento y
    el imán al centro los pone el navegador. JS solo gradúa los velos por frame
    (`requestAnimationFrame`, `style.opacity` directo sobre refs — un setState por
    frame re-renderizaría el carril) y detecta la activa para la ficha.
  * Tarjetas de **78vw** con **11vw** de padding a cada lado del carril
    (78+11+11=100): la primera y la última también centran, y las vecinas asoman ese
    11% que invita a deslizar. Velo máximo 0.62, proporcional a la distancia al
    centro — por eso se desvanece DURANTE el arrastre.
  * La ficha reserva `min-h` para el ingrediente más largo (Asmodeo, 3 líneas): sin
    eso la página saltaría en cada pasada. El fundido usa `AnimatePresence`
    (`mode="wait"`, 0.16s).
  * `BurgaCard` ganó `conFicha={false}` y la precarga de `BurgaVideo` pasó a
    `rootMargin: '200%'` (los cuatro lados). Las dos siguen sirviendo a la grilla de
    escritorio; el carrusel en profundidad ya no usa ninguna de las dos.
  * El cliente aceptó explícitamente que el carrusel expone menos la carta completa
    que la columna vertical (hay que deslizar para descubrir; se le señaló por ser
    una landing de conversión).
  * Verificado en 390x844: velo 0 en la activa y 0.62 en el resto, ficha y video
    correctos al deslizar. **Pendiente probarlo en un celular real** — el snap y la
    inercia son del navegador, pero el gesto real no se puede simular con Playwright.
* **LLAMAS NUEVAS en el hero (2026-08-27, dibujo aportado por el cliente)**:
  `llamasnegras.png` reemplaza a TODAS las llamas anteriores — picos negros con el
  contorno rojo, en `public/zocalo-llamas.webp` (2560x422, 52KB).
  * **Ahora hay UNA sola capa de llamas para móvil y desktop.** Antes eran dos: la
    banda `zocalo-fuego-alpha.webp` en móvil y el fuego **horneado dentro de**
    `fondo-fuegitos.webp` en desktop (su 9.8% inferior, medido). Si solo se cambiaba
    la banda, en desktop habría quedado el fuego viejo por debajo, duplicado. Por eso
    se generó `fondo-sin-fuego.webp`: la misma imagen recortada justo donde arrancaba
    el fuego. Su nuevo borde inferior quedó en **#1a1a1a exacto** (muestreado), o sea
    `--background`, así que empalma sin costura.
  * **VA EN MOSAICO** (`repeat-x` + `background-size: auto 100%`), no estirada: así el
    dibujo conserva su forma en cualquier ancho. **El patrón EMPALMA consigo mismo** —
    verificado: los dos extremos caen en el valle con 1px de diferencia sobre 422. Esto
    es lo que el zócalo anterior NO podía hacer (sus bordes diferían 46px, por eso iba
    estirado con `object-cover`). Es `background-image` y no `<Image>` porque
    `next/image` no repite patrones.
  * **Se dimensiona por ALTURA**: ratio 6:1, a ancho completo quedaría en una franja
    finita. Móvil conserva `max(52px,11svh)` tope 96px —el mismo valor calculado para
    que la burger se hunda en las llamas—; desktop toma el 10% del alto, que es lo que
    ocupaba el fuego horneado.
  * **El negro del dibujo es `#000` puro y el fondo del hero es #1a1a1a**, así que el
    relleno casi se funde con el fondo y lo que dibuja el filo es el **contorno rojo**.
    Es deliberado y se ve bien; donde la banda cruza la burger, el negro sí contrasta.
  * **Tapa un poco más que el dibujo anterior**: 58% de cobertura opaca contra 47%, y
    el dibujo ocupa el 58% del alto de su caja contra el 48%. En 390x844 se ve bien; en
    pantallas BAJAS (375x667) la burger —que es `flex-1` y ahí colapsa a ~94px— queda
    casi tapada. Eso ya venía de antes por el `flex-1`, el dibujo nuevo solo lo hace más
    evidente. Si molesta, bajarle la altura a la banda con un `@media(max-height:700px)`.
  * `zocalo-fuego.webp` y `zocalo-fuego-alpha.webp` quedaron **sin uso**;
    `fondo-fuegitos.webp` se conserva porque es la fuente de la que salen
    `fondo-sin-fuego.webp` y `fondo-palabras.webp`.
* **Deploy en CapRover con Docker (2026-08-21)**: `captain-definition` apunta a un
  `Dockerfile` multi-etapa (deps → builder → runner) que se apoya en el
  `output: standalone` de `next.config.ts`. La imagen final corre como usuario sin
  privilegios y escucha en `PORT=80` con `HOSTNAME=0.0.0.0` — sin esa segunda
  variable el server queda en localhost y CapRover no lo alcanza.
  `public/` y `.next/static` se copian aparte porque el standalone no los incluye.
  Verificado corriendo el `server.js` standalone fuera de Docker: páginas, sitemap,
  robots, favicon, 404, assets y el optimizador de imágenes (AVIF) responden OK.
  **No verificado**: el build del Dockerfile en sí — no hay Docker en el entorno.
  Si el proyecto termina en Vercel, borrar `output: standalone` y estos tres archivos.
* **Supabase preparado pero no conectado**: existen `lib/defaults.ts` y `components/dynamic/`,
  pero no hay `lib/supabase.ts` ni `lib/queries.ts` hasta que exista el proyecto de Supabase.
* **Hero sin foto en la versión inicial**: la atmósfera se resuelve con gradientes de brasa y
  grano (`brasa-glow` y `textura-grano` en `globals.css`) para no dejar un placeholder roto.
  Cuando llegue la foto de producto va con `next/image` + `priority` (es el LCP).
* **FOOTER (2026-09-02, pedido del cliente)**: `Footer.tsx` — "Contacto", los dos
  cuadraditos de Instagram y WhatsApp, el mapa, la dirección, el logo y el crédito
  de Nuvvora. Cierra la página; no es una sección con ancla, así que no entra en
  `SECCIONES`. (Header propio sigue sin existir: el nav vive dentro del hero.)
  * **TODO EL TEXTO EN BLANCO** (pedido del cliente). El rojo queda solo en los
    bordes de los cuadraditos y del mapa: sobre negro `--primary` da 4.50:1
    —justo AA— y acá el texto es chico; en blanco son 15.96:1.
  * **EL MAPA ES REAL, no un marco marcado**: la dirección ya la dio el cliente,
    así que va Google Maps embebido (`output=embed`, **sin API key ni dependencia
    nueva**) con `loading="lazy"` — está al pie y no tiene por qué competir con
    nada al abrir. **Se ve BLANCO y brillante contra el negro de la página**: se
    dejó así a propósito para no distorsionar los colores reales del mapa, pero
    si el cliente lo quiere oscuro se le aplica un `filter` de inversión.
  * **La URL del mapa se ARMA con la dirección de `NEGOCIO`** (`MAPA_EMBED` y
    `MAPA_LINK` en `constants.ts`), no escrita a mano: si cambia la dirección, el
    mapa la sigue solo. Por lo mismo el texto de la dirección sale de ahí.
  * **Los dos íconos son de TRAZO, dibujados a mano en el componente**: el logo
    oficial de WhatsApp es sólido, y al lado del de Instagram (que es de línea) se
    veía como una mancha. El `<svg>` con sus atributos de trazo se declara una
    sola vez en `IconoCuadrado` y los dos salen con el mismo grosor.
    El de Instagram va con primitivas (`rect` + `circle`) en vez de un path: más
    nítido en tamaño chico y pesa una fracción.
  * Los cuadrados miden 56px de lado — por encima de los 44px de un blanco de
    toque cómodo en móvil.
  * **LLAMAS EN EL TECHO (2026-09-02, pedido del cliente)**: una banda dentada
    colgando del borde superior y espejada, con los picos hacia abajo. El hero y
    el pie cierran con el mismo gesto, uno derecho y otro invertido.
    * **DIBUJO PROPIO, no el del hero** (`llamasrojas.png`, aportado por el
      cliente el mismo día → `public/zocalo-llamas-rojas-2.webp`): picos MACIZOS
      rojos CON CONTORNO NARANJA. Los del hero son negros con contorno rojo y
      sobre el #000 del footer quedaban casi invisibles. El mecanismo es el mismo
      (mosaico `repeat-x` + `background-size: auto 100%`, misma altura).
      El cliente mandó DOS versiones el mismo día: primero sin contorno (quedó
      en `originales/llamasrojas.png`) y después con el contorno naranja
      (`originales/llamasrojas-contorno.png`), que es la que se usa. El
      `-2` del nombre es por eso: URL nueva = caché imposible.
    * **EL ROJO SE REPINTÓ AL DE MARCA, EL NARANJA NO**: el relleno venía en
      #ff0000 puro y `--primary` es #e3211f. Importa porque la sección de arriba
      (Work) es de ese rojo y la banda arranca pegada a ella: con dos rojos
      distintos se vería una línea horizontal donde termina Work. Repintado, el
      rojo es CONTINUO y los picos negros muerden hacia arriba — se lee como si
      Work tuviera el borde dentado. El contorno naranja (255,147,30) se deja
      tal cual: es ilustración, no UI — mismo criterio que las llamas del hero y
      la mascota. Y la BASE no tiene contorno (medido, 0 de 112 muestras), así
      que dado vuelta el borde que toca a Work es rojo limpio.
    * **El blanco se saca por el CANAL MÁS BAJO, no por "rojez"**: con dos
      colores, el naranja tiene su mínimo en 30 y el rojo en 0, así que
      normalizando por 225 los dos quedan opacos y solo el antialias es
      semitransparente. Quién es quién se decide por `G - B` (naranja 117, rojo
      y blanco 0). Con el método de "rojez" de la primera versión el contorno
      habría salido semitransparente. 141KB → 47KB.
    * **EMPALMA consigo mismo**: los dos bordes caen en el valle con 2px de
      diferencia sobre 625 (medido). Verificado en el render: en 1440 entran 2.2
      repeticiones y no se ve la juntura.
    * **Va `-scale-y-100` y NO `rotate-180`**: el giro de 180° espejaría también
      en horizontal, y acá solo hay que dar vuelta el dibujo de arriba a abajo.
      El mosaico se arma ANTES de la transformación, así que el patrón sigue
      empalmando consigo mismo igual que en el hero.
    * **La altura vive en `--llamas`**, declarada en el `<footer>`: el padding de
      arriba la reutiliza (`calc(var(--llamas) + 56px)`) para que el contenido
      arranque siempre por debajo. Si se cambia el alto, se cambia en un solo
      lugar y el aire acompaña solo. Verificado: 56px de aire en móvil, 80 en
      desktop, sin tapar el título.
  * ⚠ **Instagram y WhatsApp apuntan a los placeholders** de `constants.ts` /
    `defaults.ts` (`instagram.com/hellsburger`, `+5493411234567`): el cliente
    todavía no dio los reales. Cambiarlos ahí y el footer los toma solo.
* **LA DIRECCIÓN REAL LLEGÓ (2026-09-02)**: `Olascoaga 715, Mendoza`. Reemplaza a
  los ⚠ de `NEGOCIO` (decía "Calle Falsa 123, Rosario, Santa Fe"), así que **el
  JSON-LD de `Restaurant` ya no publica datos falsos**. El código postal quedó en
  `5500` —el de Mendoza capital— pero **sin confirmar con el cliente**, sigue ⚠.
* **Hero según el handoff de diseño "Hero HELLS v3" (2026-08-20)**: reemplazó al hero
  tipográfico plano del 2026-08-18 (que era solo logo + h1, sin CTAs). Ahora ocupa una
  pantalla exacta con seis capas: fondo ilustrado, nav con sticker, barra promo tipo
  marquee, burger sangrando por la derecha, mascota y columna de texto con dos CTAs.
  **Esto resuelve la deuda de "el hero no tiene CTA"** que venía arrastrándose.
  * **`100svh`, no `100vh`**: en móvil `vh` incluye la barra de direcciones, así que un
    hero de `100vh` queda cortado justo donde van los CTAs. `svh` mide el viewport chico
    y entra siempre.
  * **Los tamaños van en `vh` y no en `vw`**: la restricción real es la ALTURA, porque
    todo tiene que entrar en una pantalla. Con `vw`, en un monitor ancho y bajo el h1
    desbordaría por abajo.
  * **El diseño es solo desktop (1440x900)**: no define móvil, y ahí no entra —la columna
    de texto ocupa 62% y la burger 54%, se pisarían—. Se resolvió apilando: en móvil la
    burger pasa a fondo atenuado (`opacity-25`) detrás del texto, los CTAs se apilan y
    los links del nav se pliegan en un menú. De `lg` para arriba es el diseño tal cual.
  * **Los colores del handoff coinciden con la paleta**: fondo `#1a1a1a` idéntico y rojo
    `#e32521` contra `#e42421` del token — 1/255, imperceptible. Se usan **los tokens**,
    no los hex del handoff (design-rules.txt §4). Se agregaron `--highlight` (el naranja
    del hover) y `--hundida`/`--hundida-mas` (las palabras del fondo).
  * **Las fuentes ya estaban** con `next/font`; el README pedía un `<link>` a Google
    Fonts y eso iría contra las reglas y empeoraría el LCP. Solo se sumó el peso 800 de
    Archivo, que es el de la flecha "→".
* **El fondo del hero pasó a ser una IMAGEN (2026-08-21, aporte del cliente)**:
  `public/fondo-fuegitos.webp` reemplaza a la capa `MarcaAgua`, que dibujaba las palabras
  de fondo en HTML. **La imagen ya trae esas mismas palabras** (DEMONS CREW, BURGUERS,
  HELL'S, I LOVE, los nombres de demonios) más el zócalo de fuego dentado al pie, así que
  mantener las dos capas las duplicaba. Se eliminaron `components/ui/MarcaAgua.tsx` y
  `marcaAguaFilas` de `content/home.ts`.
  **De paso resuelve la deuda del zócalo de fuego**, que figuraba como pendiente desde el
  2026-08-19 porque `FuegoZocalo.tsx` nunca existió en `src/`.
  * **Se sirve optimizada, no como vino**: el original era un JPEG de 8000x4500 y 1.2MB
    para un fondo que además es el LCP. A 2560px y WebP q82 pesa **31KB** — 40x menos, sin
    pérdida visible porque es arte plano, sin fotografía. Va con `unoptimized` justo por
    eso: ya está en su tamaño y formato final, pasarla otra vez por el optimizador de Next
    solo agregaría latencia. **El JPEG original se borró.**
  * **En móvil NO se usa esta imagen** (2026-08-21): es 16:9 y el hero en celular es mucho
    más alto, así que `object-cover` la escala por ALTURA y **solo entra un 25-32% del
    ancho** — el lettering queda gigante y cortado justo detrás del h1. Se probaron los
    dos anclajes y ninguno sirve: centrada se ve el interior de una letra, y con
    `object-left-bottom` se lee el margen izquierdo pero igual de grande. `object-contain`
    tampoco: deja la imagen ocupando el 26% de abajo, el fuego en 21px y el 74% vacío.
    En su lugar va `public/zocalo-fuego.webp` (ver abajo) sobre el fondo liso.
    De `lg` para arriba sí se usa, centrada y con `object-bottom`.
  * **El ancla es INFERIOR**: el zócalo de fuego tiene que quedar pegado al pie del hero.
    Anclado al centro se recorta fuera de vista.
  * **El nav perdió su fondo sólido**: lo llevaba para tapar las palabras que se dibujaban
    por detrás. Ahora la imagen ya reserva ese aire —las palabras arrancan al 17.2% del
    alto, por debajo del nav— y un fondo sólido solo cortaría el fondo ilustrado en una
    banda plana. **El desplegable de móvil sí conserva el fondo** (se abre sobre las
    palabras) y se estira con márgenes negativos hasta los bordes de la pantalla.
  * **En 21:9 se pierde la primera fila de palabras** (`cover` recorta 25% de arriba). Se
    aceptó: es fondo decorativo, quedan las otras cinco filas y el zócalo de fuego intacto.
  * El fondo de la imagen es `#1a1a1a` **exacto** (muestreado: 26,26,26), o sea el mismo
    `--background`, así que se funde sin costura con el resto del hero.
* **El hero en móvil se APILA, no se superpone (2026-08-21)**: se veía todo encimado
  porque había **tres capas peleando el mismo espacio** — el fondo con su lettering
  gigante, la burger al 120% de ancho con `opacity-25` justo detrás del h1 (ocupaba el
  40-51% del alto de la zona central), y el texto encima de las dos. Se separó cada una:
  * **Las palabras de marca van en MOSAICO vertical** (`public/fondo-palabras.webp`,
    1280x648, 3.5KB): el fondo recortado ANTES del fuego, repetido con
    `bg-[length:100%_auto] bg-repeat-y`. Al mostrarse al ancho completo de la pantalla
    las palabras quedan a escala legible, y las ~3.8 copias cubren todo el alto.
    Es `background-image` y no `<Image>` porque `next/image` no repite patrones, y con
    `object-contain` la imagen ocuparía apenas el 26% del alto.
    **Se llegó acá después de dos intentos peores**: ocultar el fondo (`hidden lg:block`)
    dejaba la pantalla negra y perdía las palabras, que son parte del diseño; y mostrarlo
    con `object-cover` —con o sin `opacity`— las agranda tanto que se ven como manchas.
    El recorte tiene que excluir el fuego: si viniera incluido se repetiría en mitad de
    la pantalla.
  * **El fondo ilustrado grande se oculta** (`hidden lg:block`) y el zócalo lo aporta
    `public/zocalo-fuego.webp` — el recorte del 12% inferior de `fondo-fuegitos`
    (2560x173, 25KB), o sea **el mismo dibujo de llamas**, pegado al pie y a todo el
    ancho. Se dimensiona por ALTURA (`h-[max(34px,7svh)]`, tope 64px) y no por ancho:
    con ratio 14.8:1, a ancho completo quedaría en ~26px, un hilito.
    **No va en mosaico**: los bordes del recorte no coinciden (46px de diferencia en el
    perfil de las llamas) y el empalme se notaría. Se escala por alto y se recortan los
    lados, que en un patrón repetido no se ve.
  * **La burger deja de estar detrás del texto**: en móvil pasa a ser un hijo más del
    flex, con `order-2`, apoyada en el espacio libre que queda entre los CTAs y el fuego
    (medido: 120px en el iPhone SE, 198 en el 14, 228 en Android). Lleva `flex-1` +
    `min-h-0` para que, si la pantalla es baja, **lo que ceda sea ella y no el h1** — la
    columna de texto va `shrink-0`. De `lg` para arriba vuelve a `absolute`.
  * **El contenedor reserva el alto del fuego** con un `pb` que repite la misma expresión
    del `h-` del zócalo, así la burger apoya justo encima de las llamas en vez de
    pisarlas. Sin eso llegaba hasta el borde en los cinco tamaños probados.
  * Verificado por cálculo en 280x653 (Galaxy Fold), 360x740, 375x667, 390x844, 412x915 y
    430x932: en todos entra el texto completo y la burger conserva 97px o más.
  * **El h1 se limita por ancho ADEMÁS de por alto (2026-08-21)**: era
    `clamp(38px,9vh,110px)`, y `vh` solo mide altura — en un celular alto y angosto
    (390x844) daba 76px y **"HAMBURGUESAS" se salía de la pantalla**. Ahora en móvil va
    `clamp(38px,min(9vh,11.5vw),110px)`; de `lg` para arriba queda el original, donde
    manda el `9vh`. Verificado sin desborde ni scroll horizontal de 280px a 1920px.
    **Este bug no lo detectó ningún cálculo de altura** — apareció recién al ver la
    captura del render.
  * **La mascota ahora TAMBIÉN se ve en móvil (2026-08-21, pedido del cliente)**: iba
    `hidden lg:block` porque la burger estaba detrás del texto y el diablillo caía encima
    del h1. Con el apilado eso ya no pasa —la burger tiene su espacio abajo—, así que se
    apoya sobre ella anclada por ABAJO (`bottom`, no `top`), con el mismo `min/max` del
    zócalo de fuego + 2% para no pisar las llamas, y a la derecha (`right-[6%]`) para no
    taparle la cara a la hamburguesa. Más chica que en desktop (64-92px contra 110-170px):
    al tamaño de desktop ocuparía casi un cuarto del ancho de la pantalla.
    Verificado visible y sin pisar el fuego de 280px a 1440px.
* **Jerarquía del hero en DESKTOP (2026-08-21, pedido del cliente)**: se subieron logo y
  título, y se bajó la mascota. Valores finales en `lg`:
  * **h1**: `min(13vh, 9.2vw)` con tope 150px — 117px en 1440x900, 140px en Full HD
    (venía de 90px). El `9.2vw` no es decorativo: **el límite en desktop es el ANCHO**,
    porque "HAMBURGUESAS" tiene que terminar antes de donde arranca el dibujo de la
    burger. Ese punto está en el **58.6% del viewport** (medido sobre el PNG: el dibujo
    empieza al 1.2% de su ancho, y la imagen se coloca a `right:-8%` con `w:50%`).
    **Si se mueve o redimensiona la burger, recalcular ese 9.2vw.**
  * **logo**: `16vh` con tope 190px (144px en 1440).
  * **mascota**: `8.5vw` con tope 132px — el cliente la quiso chica. Al achicarla hubo
    que correr el `right` a **33.5%** y bajarla a `top-[3%]` para que siguiera apoyada
    sobre la burger.
  * **El contenedor central lleva `lg:pb-[12svh]`**: sin él los CTAs se metían entre 7 y
    21px dentro del zócalo de fuego en las cuatro resoluciones probadas (1024x768,
    1280x720, 1366x768, 1440x900). Es el equivalente al `pb` que ya tenía móvil.
    El caso más ajustado es **1280x720**, que queda con 23px de aire.
* **Ajustes de jerarquía del hero (2026-08-21, pedido del cliente)**: el logo se veía
  chico, el h1 tenía poco peso contra la foto de la burger, y el nav dejaba ver las
  palabras del fondo cruzando los links.
  * **El logo pasó de `52-100px` a `70-150px`** de alto (13vh), en dos rondas.
  * **El h1 crece partiendo "hechas en el" en dos líneas SOLO en móvil**: el tamaño lo
    limita la línea más larga, y con tres líneas ("HAMBURGUESAS" ya al límite del ancho)
    no había margen — solo daba para un 3-5% más. Con cuatro líneas sube ~25%.
    Las dos mitades viven en `content/home.ts` (`linea2a`/`linea2b`) y se juntan en
    desktop con `lg:inline`, así el texto leído es idéntico y no hay copy hardcodeado.
  * **El h1 se limita por ALTO además de por ancho** (`min(8.5vh, 12.2vw)` en móvil,
    `10vh` con tope 124px en desktop): al agrandarlo,
    las cuatro líneas + el logo más grande dejaban la burger en 73px en un iPhone SE —una
    franja aplastada—. **Esto no se ve en desktop ni en un iPhone 14**: aparece solo en
    pantallas cortas.
  * **En pantallas BAJAS los CTAs van lado a lado** (`@media(max-height:740px)`), no
    apilados: apilados se llevan 130px y eran el verdadero cuello de botella —bajar el h1
    hasta 5.5vh no alcanzaba, y con los CTAs en fila la burger pasa de 73px a 139px—.
    La condición es por ALTURA y no por ancho, que es la restricción real.
  * **El nav recuperó su `bg-background`**: se le había sacado cuando el fondo era una
    imagen única que reservaba aire arriba; con el mosaico las palabras vuelven a llegar
    al borde superior y se leían por detrás de los links.
  * **La mascota**: se achicó y se separó del pie (+6% en vez de +2%) porque quedaba
    pegada a la barra de promos. Quedó en **48-68px en móvil y 140-210px en desktop**.
    En móvil se probó agrandarla a 66-96px y el cliente la quiso chica de nuevo: **en
    celular va discreta al lado de la burger, no compitiendo con ella.** Al agrandarla
    en desktop hubo
    que correrle el `right` de 32.7% a **31%** para que siguiera apoyada sobre la burger:
    **ese valor depende del ancho de la mascota Y del de la burger, así que si se toca
    cualquiera de los dos hay que recalcularlo.**
  * **CUIDADO — este apilado no debe filtrarse a desktop**: al agregarlo, el
    `justify-center` del contenedor se aplicó también en `lg` y **corrió el texto del hero
    al centro**, cuando el diseño lo quiere pegado a la izquierda. Toda clase del apilado
    móvil lleva su reseteo explícito en `lg`: `lg:justify-start`, `lg:pb-0`,
    `lg:order-none` y `lg:shrink`. En desktop la burger y el diablillo son `absolute`, o
    sea que el texto es el ÚNICO hijo en flujo — por eso `lg:flex-row lg:items-center
    lg:justify-start` reproduce exactamente el `flex items-center` original.
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
  logo pleno. Coreografía 3.0s: trazan (0→1.65s) → solidifica (1.87s) → pausa 0.68s → sale el telón (2.55s) → fade (3.0s).
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
  **El fondo del telón es SIEMPRE el gris de marca** (2026-08-20, decisión del cliente):
  el mismo `--background` (#1a1a1a) que usa el hero, parejo de punta a punta. Se toma
  del token con la clase `bg-background` y **no de un color escrito a mano**, así no se
  pueden desincronizar si algún día se retoca la paleta. Verificado en el CSS servido:
  `.bg-background` → `hsl(var(--background))` → `0 0% 10%`.
  Antes (2026-08-19) arrancaba en `#000000` y viraba al carbón sobre el final, para que
  se leyera como "pantalla apagada". Al unificarlo desaparece de paso el riesgo de que
  ese cambio de tono se notara como un parpadeo.
  **El frame 0 está vacío**: todo lo que aparece lo dibuja la línea. Los 28 trazos
  arrancan con `strokeDashoffset` = su largo (invisibles) y ese valor inline rige
  también durante su delay. **El SVG no lleva fade de entrada** (`initial={false}`): con
  el fade, la línea se materializaba mientras dibujaba en vez de construirse desde cero.
  Verificado en el HTML servido: 28/28 trazos con `dashoffset === dasharray` y el
  relleno en `opacity: 0`.
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
* **El trazo es NEÓN ROJO (2026-08-20, pedido del cliente)**: reemplazó al degradé
  brasa (amarillo → rojo), que el cliente pidió cambiar por algo **todo rojo**.
  Son **dos capas superpuestas**: abajo el rojo del logo (`#e3211f`, grosor 5) con el
  halo, y encima un núcleo más claro y fino (`#ff8f8a`, grosor 1.8) sin halo propio.
  Con una sola capa se lee como "contorno con sombra"; con el núcleo claro se lee como
  un tubo encendido, que es lo que satura en el centro en un neón real.
  El halo son dos desenfoques (`stdDeviation` 2 y 7) fusionados, con el `lejos` **dos
  veces** para que el resplandor tenga cuerpo: con un solo blur queda como mancha.
  El `#ff8f8a` no está en la paleta de UI — mismo criterio que las ilustraciones de
  llamas: es imagen de marca, no interfaz. **El relleno final sigue siendo
  `fill-primary`.**
* **Los trazos son POLILÍNEAS, no curvas Bézier (2026-08-20)** — y esta fue la causa
  REAL de las "líneas que sobresalen", que se buscó durante varias rondas en el viewBox
  y en el filtro, donde no estaba.
  El pipeline viejo hacía Chaikin + Catmull-Rom → Bézier, y las dos etapas deformaban:
  * **Chaikin encoge el polígono en cada iteración** y se comía las capas finas de la
    hamburguesa (la lechuga, el queso), dejándolas como barras sueltas;
  * **Catmull-Rom deformaba la silueta** y abría los contornos finos.
  Verificado aislando cada etapa: con solo Douglas-Peucker el logo sale idéntico al
  original, y al agregar cualquiera de las otras dos aparecen los trazos sueltos.
  Como el contorno ahora se traza sobre el JPG a su resolución REAL (4000x2250, antes
  se reducía), la poligonal ya se ve curva al tamaño en que se muestra (~560px) — y es
  exacta. **Si se re-vectoriza, no volver a meter suavizado.**
* **El contorno se traza siguiendo las ARISTAS, no los píxeles (2026-08-20)**: se arma
  el conjunto de aristas dirigidas entre lleno y vacío y se encadenan. Cada arista se
  consume una sola vez, así que **el recorrido siempre termina** y los 28 contornos
  salen CERRADOS (verificado: 0 abiertos).
  Esto importa: los dos intentos previos de seguir la grieta con tablas de giro
  escritas a mano se colgaban en bucle infinito y morían por falta de memoria — el
  caso de los vértices "silla" (dos diagonales opuestas) es ambiguo y hay que
  resolverlo consumiendo aristas, no adivinando el giro.
  Douglas-Peucker con ε 0.9 px deja 1.532 puntos de los 17.270 sin desviación visible.
* **El halo necesita MARGEN dentro del viewBox (2026-08-19)**: era la causa de que los
  bordes se siguieran viendo cortados. Un `feGaussianBlur` de `stdDeviation` N se
  extiende ~3N unidades, y **el filtro recorta contra el viewBox** — el
  `overflow: visible` de CSS no lo evita, porque el recorte lo hace el filtro y no la
  caja del elemento. Con 6 unidades de margen y un halo que necesitaba 22.6, el
  resplandor se cortaba en los cuatro lados.
  Ahora el viewBox lleva **28 unidades de margen** (899x527) y el filtro declara
  `x/y="-40%" width/height="180%"` — con el default (110%) también se recorta.
  **Si se sube el `stdDeviation` del halo, agrandar el margen: `3 * stdDeviation`.**
* **El viewBox tiene que ABARCAR los paths, no el tamaño de la máscara (2026-08-19)**:
  el viewBox se tomaba del tamaño de la máscara de píxeles, pero los paths no coinciden
  con ella, y el SVG recorta todo lo que cae fuera. Ahora se ajusta al bbox REAL de los
  paths, calculado **después** de generarlos, con 28 unidades de margen en los 4 lados
  (verificado: izq 28.0, der 28.2, arr 28.0, aba 28.6).
  **Si se re-vectoriza, volver a ajustar el viewBox al contenido — el vectorizador emite
  el tamaño de la máscara y reintroduce el recorte.**
* **El grosor del trazo va con `vector-effect="non-scaling-stroke"` (2026-08-20)**:
  o sea en píxeles de PANTALLA, no en unidades del viewBox. Así la línea mide lo mismo
  en un monitor que en un celular, y **deja de haber que recalcular nada cuando cambia
  el tamaño del logo**.
  Antes el grosor estaba atado al viewBox y encogía junto con el SVG. La regla era que
  la línea nunca podía bajar de 1px real —un trazo sub-pixel el navegador lo pinta
  entrecortado y grisáceo, y eso era el "pixelado" (no era el path)—, pero se cumplía
  solo en desktop: medido, **en un celular de 390px el núcleo caía a 0.55px**, así que
  en móvil venía roto desde el principio, que es justo donde está casi todo el tráfico.
  Se detectó al achicar el logo, comprobando que el problema ya existía antes.
* **Tamaño y centrado del logo de la carga (2026-08-20, pedido del cliente)**:
  `min(58vw, 440px)` —antes `min(74vw, 560px)`— y **centrado exacto**, sin corrección
  óptica. Llevaba un `-translate-y-[4%]` que lo subía a propósito (una pieza centrada
  geométricamente se percibe caída) y por eso no quedaba en el medio.
* **La pantalla dura 3.0s exactos (2026-08-20, pedido del cliente)**: bajó de ~3.9s.
  El reparto es `TRAZO_TOTAL` (1.65) + respiro (0.22) + `LUCIMIENTO` (0.68) + fade de
  salida (0.45) = 3.0s.
  **El total NO es `TRAZO_TOTAL`**: hay que sumarle las otras tres partes, y el fade de
  salida es fácil de olvidar porque vive en el `exit` del `motion.div`, no en las
  constantes. Verificado en el HTML servido.
  De los 0.87s que había que recortar, se sacaron 0.45 del trazado y 0.42 de la pausa:
  bajar solo el trazado lo dejaba acelerado (la punta ya va 27% más rápido) y bajar solo
  la pausa se come el momento de leer la marca.
  **La pausa de lucimiento no se puede eliminar** (2026-08-19, pedido del cliente): el
  logo queda `LUCIMIENTO` segundos ya sólido antes de que salga el telón. Sin ella
  cuajaba y desaparecía en el mismo gesto y no se llegaba a leer la marca, que es todo
  el punto de la pantalla.
* **El `largo` de los trazos (2026-08-20)**: al ser polilíneas, la suma de los segmentos
  ES el largo exacto — no hay que subdividir nada (con las Bézier de antes había que
  medir por subdivisión, porque sumar rectas subestimaba hasta un 18% y dejaba contornos
  sin cerrar). Se le suma **+1% de holgura** porque el `getTotalLength()` del navegador
  puede diferir unas décimas: quedarse corto deja el trazo ABIERTO, pasarse solo lo
  termina un instante antes y no se nota. Verificado: 0 trazos quedarían abiertos.
* **Todos los trazos CIERRAN EN EL MISMO INSTANTE, a una sola velocidad (2026-08-20)**:
  son las dos mitades de un mismo efecto. Misma velocidad → la punta viaja como una mano
  real (si todos duraran lo mismo habría 16.9x de diferencia entre el trazo más corto y
  el más largo). Mismo cierre → el logo se completa de una y no de a pedazos: cada trazo
  se **retrasa** lo que haga falta, así que los cortos (semillas del pan, contraformas de
  las letras) entran casi al final.
  Antes la duración era proporcional al largo pero los arranques estaban repartidos
  parejo, y los trazos cortos cerraban a los 0.2s mientras los largos seguían hasta los
  2.1s: **las semillas aparecían solas al principio**, sueltas, en vez de completarse con
  el resto. Verificado en el HTML servido: 56 paths, cierres con 0.000s de diferencia y
  velocidad con variación 1.00x.
  **Son DOS capas superpuestas, no una animando `fill`**: abajo el relleno (entra con
  fade al final) y arriba los trazos (que se apagan cuando el relleno ya entró). Con una
  sola capa, el relleno aparecería de golpe en toda la silueta.
  (El `-translate-y-[4%]` que llevaba el SVG como corrección óptica se sacó el
  2026-08-20: el cliente lo quiso centrado exacto.)
* **El logo tuvo que vectorizarse a mano (2026-08-19, re-hecho el 2026-08-20)**: la
  animación de línea necesita paths reales y el logo de marca es un **JPG de píxeles**.
  No hay potrace ni inkscape en el entorno y no se agregaron dependencias, así que se
  trazó con `sharp` + código: máscara binaria por rojez sobre `logo.jpg` **a su
  resolución real de 4000x2250** (antes se reducía, y de ahí salía casi todo el
  problema), recorrido de aristas para los 28 contornos y Douglas-Peucker.
  Vive en `components/ui/logoPath.ts` (viewBox 899x527, ~21KB). Con `fill-rule="evenodd"`
  los agujeros (contraformas de las letras, semillas del pan) se recortan solos.
  **Ojo con los umbrales de filtrado**: si se suben, el apóstrofo de "HELL'S" desaparece
  (pasó dos veces) — tienen que quedar en 28 trazos.
  **Es una aproximación, no el original**: cuando llegue el logo vectorial de marca,
  reemplazar estos trazos por los suyos y listo — el componente no cambia. Sigue siendo
  el pendiente que mejor resolvería todo esto de una.
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
* **Assets del handoff — cuidado con el aire de los PNG (2026-08-20)**: el sticker
  "Demons Crew" venía en 1580x1644 con **32% de aire arriba y 27% abajo**, y el handoff
  lo pedía a `height: 130px` — o sea que el lettering visible quedaba en ~53px y lo que
  desbordaba del nav era transparencia, no dibujo.
  Al recortarlo para optimizarlo (53KB → 30KB) ese aire desaparece, así que **a 130px se
  vería más del doble de grande que en el diseño**. Va a `h-[53px]`, verificado
  comparando los dos renders lado a lado. Por lo mismo tampoco lleva el `margin: -22px`
  del original: sin aire alrededor, el dibujo no necesita desbordar.
  **Regla: si un asset se recorta, recalcular el tamaño de display — las medidas del
  handoff están tomadas sobre el archivo CON su aire.**
  De los 4 assets del zip, `logo.png` y `burger-hero.png` son byte a byte idénticos a
  los que ya estaban (verificado por md5): solo eran nuevos el sticker y el diablillo.
  El diablillo venía en 4500x6000 (620KB) para mostrarse a ~170px.
* **La mascota nueva conserva el guiño (2026-08-20, decisión del cliente)**: el handoff
  trae un diablillo más limpio pero **es una sola imagen, sin guiño**. Se combinó con el
  `diablo-guino.png` que ya existía, que es el mismo personaje fotografiado.
  Como son cortes de origen distinto (ratio 0.921 contra 0.887), **se re-encuadraron a
  una caja común de 620x699 alineando por el ancho del dibujo**: sin eso la cabeza
  saltaba al cruzarlas. Verificado: 95.7% de silueta compartida, y lo que no coincide es
  el contorno blanco, apenas más grueso en el del guiño.
* **Assets de la mascota — versión previa (2026-08-19)**: salían de `diablos.jpg`,
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

**Última sesión**: 2026-09-04
**Próximo paso**: el sticker de Balak, que no vino (su nombre va en texto
mientras tanto). Desktop sigue con la grilla; el cliente pidió no trabajarlo
todavía. **El nav ya no anticipa ninguna sección que no exista**: los cuatro
links apuntan a su ancla. Pendiente de decisión: **reponer los videos** — el cliente los quiere
usar y la idea sobre la mesa es que la burga se arme sola al llegar al centro del
tocadiscos, con la foto como botón para repetirlo (los 12 mp4 siguen en
`public/burgas/`, sin referencia desde el código).

**Lo que está funcionando**:
* Arquitectura completa del proyecto (App Router, `src/` por secciones, tokens de diseño)
* Sistema tipográfico y paleta cargados como tokens CSS + tema de Tailwind
* Hero completo según el handoff v3: pantalla exacta con nav (`NavHero`), barra promo
  animada (`BarraPromo`), fondo ilustrado (`fondo-fuegitos.webp`, que trae las palabras
  de marca y el zócalo de fuego), burger, mascota, h1 y dos CTAs. Adaptado a móvil por
  fuera del diseño, que era solo desktop
* Favicon generado desde el isotipo (`src/app/icon.png`)
* Metadata base, Open Graph, `sitemap.ts`, `robots.ts` y JSON-LD de `Restaurant`
* 404 y error boundary diseñados con la estética del sitio
* Pantalla de carga (`components/ui/PantallaCarga.tsx`): la línea de **neón rojo** forma
  el logo —los 28 trazos crecen en paralelo y cierran todos juntos— y al cerrar se
  solidifica (3.0s). Los trazos, ordenados y con su largo precalculado, están en
  `components/ui/logoPath.ts`
* Tipografías reales de la marca servidas con `next/font/local` (Ardillah Kafi /
  Splatink / Sveningsson)
* Tira de fotos (`TiraFotos.tsx`): las 8 fotos del local pasando solas hacia la
  derecha, a todo el ancho. Reemplazó a «Nuestra historia»
* Sección «Reseñas» (`Resenas.tsx`): 10 reseñas reales de Google en loop
* Sección «Work» (`Work.tsx`): el aviso de búsqueda con el link al formulario
* Footer (`Footer.tsx`): contacto, mapa real de Olascoaga 715, logo y crédito

**Lo que está pendiente**:
* Datos reales del negocio (WhatsApp, Instagram, horarios, dominio) — marcados con
  ⚠. **Dirección, CP y teléfono ya son reales** (2026-09-02, de la ficha de Maps)
* `public/og.jpg` (1200x630)
* Logo **vectorial** (.svg): los PNG actuales se derivaron del JPG, sirven bien pero
  un SVG escalaría mejor y pesaría menos
* **Confirmar las licencias comerciales** de Ardillah Kafi y Splatink (hoy "personal use")
* **Las 8 fotos de las burgas** (`content/home.ts` → `burgasContent.items[].foto`, todas
  en `null`). Cuadradas, sobre fondo carbón para que peguen con la estética
* **Los 8 nombres** (`items[].nombre`, todos vacíos): el cliente los va a pegar como
  stickers sobre las etiquetas blancas. Si en algún momento se quieren como texto, se
  escriben ahí y la etiqueta los dibuja sola
* Resto de las secciones de la landing
* Conexión con Supabase cuando exista el sistema de gestión

**Problemas conocidos o deuda técnica**:
* Los textos del hero son una primera propuesta de copy, sin aprobar por el cliente
* `brasa-glow` sigue aplicado en 404 y `error.tsx`, pero ya no en el hero — unificar cuando
  se defina si esas pantallas conservan el degradé
* `textura-grano` quedó definida en `globals.css` pero sin uso
* Los tokens `--hundida` / `--hundida-mas` quedaron en `globals.css` sin uso desde que
  las palabras del fondo pasaron a estar dentro de la imagen (2026-08-21). Se dejaron por
  si vuelve a hacer falta una capa de texto hundido; si no, borrarlos
* **El fondo del hero es un raster con texto adentro**: las palabras ya no escalan con la
  pantalla ni se pueden editar sin volver a exportar la imagen. Es la contrapartida
  aceptada de usar el arte tal como lo entregó el cliente. Si en algún momento hay que
  cambiar una palabra, hay que pedir el archivo fuente
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
