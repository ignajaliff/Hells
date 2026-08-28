#!/bin/bash
# Procesa las 12 burgas: video comprimido + poster + imagen final.
#
# SIN all-intra (-g 1) a propósito: esa receta era para el scrub por scroll,
# que necesitaba saltar a cualquier frame. Ahora el video se reproduce solo,
# de corrido, así que un GOP normal sirve y comprime ~5x mejor.
cd "/d/new CODE/Hells -- LANDINGPAGE" || exit 1
mkdir -p public/burgas

# slug|archivo de video|archivo de imagen
LISTA="
lucifer|lucifer-video.mp4|lucifer-burga.jpeg
satanas|satanas-video.mp4|Satanas-burga.jpeg
balak|balak-video.mp4|balak-burga.jpeg
belcebu|belcebu-video.mp4|belcebu-burga.jpeg
azazel|azael-video.mp4|azazel-burga.jpeg
belfegor|belfegor-video.mp4|belfegor-burga.jpeg
mammon|mammon-video.mp4|mammon-burga.jpeg
lilith|Lilith-video.mp4|Lilith-burga.jpeg
gualicho|gualicho-video.mp4|gualicho-burga.jpeg
baal|baal-video.mp4|baal-burga.jpeg
asmodeo|asmodeo-video.mp4|asmodeo-burga.jpeg
leviatan|leviatan-video.mp4|leviatan-burga.jpeg
"

echo "$LISTA" | while IFS='|' read -r slug vid img; do
  [ -z "$slug" ] && continue
  [ -f "burgashells/$vid" ] || { echo "FALTA video: $vid"; continue; }
  [ -f "burgashells/$img" ] || { echo "FALTA imagen: $img"; continue; }

  ffmpeg -nostdin -v error -y -i "burgashells/$vid" \
    -vf "scale=720:720,fps=24" -an -c:v libx264 -crf 26 -preset slow \
    -pix_fmt yuv420p -movflags +faststart "public/burgas/$slug.mp4"

  # poster = PRIMER frame del video: es lo que se ve mientras el archivo baja,
  # asi que con cualquier otro frame habria un salto al arrancar.
  ffmpeg -nostdin -v error -y -i "burgashells/$vid" -vframes 1 \
    -vf scale=720:720 -c:v libwebp -q:v 80 "public/burgas/$slug-poster.webp"

  # la foto de producto: es la que queda fija cuando el video termina.
  ffmpeg -nostdin -v error -y -i "burgashells/$img" \
    -c:v libwebp -q:v 82 "public/burgas/$slug.webp"

  v=$(( $(stat -c%s "public/burgas/$slug.mp4") / 1024 ))
  p=$(( $(stat -c%s "public/burgas/$slug-poster.webp") / 1024 ))
  f=$(( $(stat -c%s "public/burgas/$slug.webp") / 1024 ))
  echo "$slug: video ${v}KB | poster ${p}KB | foto ${f}KB"
done

echo "--- TOTAL ---"
du -sh public/burgas
