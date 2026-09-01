"""
Genera los assets del carrusel "tocadiscos" (LasBurgasV2, 2026-09-01).

Por cada burga produce dos cosas y un dato:
  * public/burgas/<slug>-fondo.webp   — la foto original SIN la hamburguesa
    (el hueco se rellena con el degradé rojo del propio fondo).
  * public/burgas/<slug>-silueta.webp — la hamburguesa sin fondo, recortada a
    su contorno.
  * la CAJA: dónde y a qué tamaño va la silueta sobre el fondo para que
    reconstruya EXACTAMENTE la foto original (en % del lado de la foto).

Por qué hace falta: los PNG sin fondo del cliente son la misma toma que la
foto, pero reencuadrada con zoom (la burger llena el cuadrado). Para que el
carrusel muestre la foto original a ancho completo y a la vez pueda mover la
burger sola —girando hacia el costado— hay que separar las dos capas: el
fondo quieto y la burger encima, colocada donde estaba. Al reposo, fondo +
silueta = foto original; al girar, la burger se va y el fondo queda limpio.

La alineación se busca: primero por las cajas de la burger en las dos
imágenes, después afinando escala y posición hasta minimizar la diferencia
de color dentro de la silueta. Se imprime esa diferencia final por burga:
por debajo de ~8 el cambio es invisible.

Uso:  python originales/tocadiscos.py
"""
from PIL import Image, ImageChops, ImageFilter, ImageStat
import json, os

RAIZ = os.path.join(os.path.dirname(__file__), '..')
FOTOS = os.path.join(RAIZ, 'originales', 'burgashells')
PNGS = os.path.join(RAIZ, 'originales', 'burgas-sinfondo')
SALIDA = os.path.join(RAIZ, 'public', 'burgas')

# slug -> (foto, png sin fondo). Los nombres de los PNG vienen corridos, ver
# content/home.ts: AMODEO es Asmodeo; ASMODEO es en realidad Leviatán.
BURGAS = {
    'lucifer':  ('lucifer-burga.jpeg',  'LUCIFER-SFONDO.png'),
    'satanas':  ('Satanas-burga.jpeg',  'SATANAS-SFONDO.png'),  # llegó el 2026-09-01
    'balak':    ('balak-burga.jpeg',    'balak- SFONDO.png'),
    'belcebu':  ('belcebu-burga.jpeg',  'BELCEBU-SFONDO.png'),
    'azazel':   ('azazel-burga.jpeg',   'AZAZEL-SFONDO.png'),
    'belfegor': ('belfegor-burga.jpeg', 'belfegor- sfondo.png'),
    'mammon':   ('mammon-burga.jpeg',   'MAMON-SFONDO.png'),
    'lilith':   ('Lilith-burga.jpeg',   'LILITH-SFONDO.png'),
    'gualicho': ('gualicho-burga.jpeg', 'GUALICHO-SFONDO.png'),
    'baal':     ('baal-burga.jpeg',     'BAAL-SFONDO.png'),
    'asmodeo':  ('asmodeo-burga.jpeg',  'AMODEO-SFONDO.png'),
    'leviatan': ('leviatan-burga.jpeg', 'LEVIATAN-SFONDO.png'),
}

LADO = 900  # px de salida (las fotos se sirven a 900 en el carrusel)


def caja_burger_en_foto(foto):
    """Dónde está la burger en la foto: el fondo es rojo/negro (G y B ~0)."""
    _, g, b = foto.split()
    m = ImageChops.lighter(g.point(lambda v: 255 if v > 48 else 0),
                           b.point(lambda v: 255 if v > 48 else 0))
    return m.getbbox()


def recortar_sin_fondo(foto):
    """Para la burga que no trajo PNG: separa la burger del fondo rojo por
    croma. El fondo tiene G y B casi en cero; la burger no. Provisional hasta
    que el cliente mande el archivo real."""
    _, g, b = foto.split()
    m = ImageChops.lighter(g.point(lambda v: 255 if v > 26 else 0),
                           b.point(lambda v: 255 if v > 26 else 0))
    m = m.filter(ImageFilter.MaxFilter(9)).filter(ImageFilter.MinFilter(9))  # cierra huecos
    # rellenar agujeros interiores: lo que no se alcanza desde el borde es burger
    from PIL import ImageDraw
    relleno = m.copy(); ImageDraw.floodfill(relleno, (0, 0), 128)
    m = relleno.point(lambda v: 0 if v == 128 else 255)
    m = m.filter(ImageFilter.GaussianBlur(1.2))
    out = foto.convert('RGBA'); out.putalpha(m)
    return out


def alinear(png, foto):
    """Escala y offset (en px de la foto) que superponen el PNG a la burger."""
    alpha = png.getchannel('A').point(lambda v: 255 if v > 128 else 0)
    ba = alpha.getbbox(); bb = caja_burger_en_foto(foto)
    esc = (bb[2] - bb[0]) / (ba[2] - ba[0])
    ox = bb[0] - ba[0] * esc; oy = bb[1] - ba[1] * esc

    # afinado: minimizar la diferencia dentro de la silueta, a 360px
    R = 360 / foto.size[0]
    chica = foto.resize((360, 360), Image.LANCZOS)
    mejor = (1e9, esc, ox, oy)
    for de in (-0.03, -0.015, 0, 0.015, 0.03):
        e = esc * (1 + de)
        w = round(png.size[0] * e * R)
        p = png.resize((w, w), Image.LANCZOS)
        mask = p.getchannel('A').point(lambda v: 255 if v > 200 else 0)
        for dx in range(-14, 15, 2):
            for dy in range(-14, 15, 2):
                x = round((ox + dx) * R); y = round((oy + dy) * R)
                comp = chica.copy(); comp.paste(p, (x, y), p)
                mk = Image.new('L', chica.size, 0); mk.paste(mask, (x, y))
                st = ImageStat.Stat(ImageChops.difference(comp, chica), mk)
                d = sum(st.mean) / 3
                if d < mejor[0]:
                    mejor = (d, e, ox + dx, oy + dy)
    return mejor


def fondo_sin_burger(foto, silueta_alineada, pos):
    """Rellena el hueco de la burger con el degradé del propio fondo: se
    difumina el resto y se vuelve a fijar lo conocido, muchas veces. Para un
    degradé suave da un relleno sin costuras."""
    mask = Image.new('L', foto.size, 0)
    mask.paste(silueta_alineada.getchannel('A'), pos)
    mask = mask.point(lambda v: 255 if v > 40 else 0).filter(ImageFilter.MaxFilter(25))
    img = foto.copy()
    # ARRANQUE POR COLUMNAS: cada píxel del hueco se interpola entre el
    # último conocido de arriba y el primero de abajo en su misma columna.
    # El degradé del fondo es vertical/radial, así que esto lo sigue de
    # entrada; arrancar con un color medio dejaba una banda más clara donde
    # había estado la burger.
    px = img.load(); mk = mask.load(); W, H = img.size
    for x in range(W):
        y = 0
        while y < H:
            if mk[x, y]:
                y0 = y
                while y < H and mk[x, y]: y += 1
                arriba = px[x, y0 - 1] if y0 > 0 else px[x, min(y, H - 1)]
                abajo = px[x, y] if y < H else arriba
                n = y - y0
                for k in range(n):
                    t = (k + 1) / (n + 1)
                    px[x, y0 + k] = tuple(round(arriba[c] * (1 - t) + abajo[c] * t) for c in range(3))
            else:
                y += 1
    conocido = ImageChops.invert(mask)
    for radio in (16, 16, 8, 8, 4, 4, 2):
        borroso = img.filter(ImageFilter.GaussianBlur(radio))
        borroso.paste(foto, None, conocido)
        img = borroso
    img.paste(foto, None, conocido)
    return img


def main():
    os.makedirs(SALIDA, exist_ok=True)
    cajas = {}
    for slug, (nombre_foto, nombre_png) in BURGAS.items():
        foto = Image.open(os.path.join(FOTOS, nombre_foto)).convert('RGB')
        if nombre_png:
            png = Image.open(os.path.join(PNGS, nombre_png)).convert('RGBA')
            diff, esc, ox, oy = alinear(png, foto)
            w = round(png.size[0] * esc)
            silueta = png.resize((w, w), Image.LANCZOS)
            pos = (round(ox), round(oy))
        else:
            silueta = recortar_sin_fondo(foto); pos = (0, 0); diff = 0.0
        # la silueta se recorta a su contorno; la caja es esa en coordenadas de la foto
        bb = silueta.getchannel('A').point(lambda v: 255 if v > 8 else 0).getbbox()
        rec = silueta.crop(bb)
        caja = {'x': (pos[0] + bb[0]) / foto.size[0], 'y': (pos[1] + bb[1]) / foto.size[1],
                'w': (bb[2] - bb[0]) / foto.size[0]}
        fondo = fondo_sin_burger(foto, silueta, pos)

        f = fondo.resize((LADO, LADO), Image.LANCZOS)
        f.save(os.path.join(SALIDA, f'{slug}-fondo.webp'), 'WEBP', quality=80, method=6)
        rw = round(rec.size[0] * LADO / foto.size[0]); rh = round(rec.size[1] * LADO / foto.size[1])
        r = rec.resize((max(rw, 1), max(rh, 1)), Image.LANCZOS)
        r.save(os.path.join(SALIDA, f'{slug}-silueta.webp'), 'WEBP', quality=86, method=6)
        cajas[slug] = {k: round(v, 4) for k, v in caja.items()}
        kb = lambda n: os.path.getsize(os.path.join(SALIDA, n)) // 1024
        print(f"{slug:9s} diff {diff:5.1f} | caja x={caja['x']:.3f} y={caja['y']:.3f} w={caja['w']:.3f} "
              f"| fondo {kb(slug+'-fondo.webp')}KB silueta {kb(slug+'-silueta.webp')}KB")
    with open(os.path.join(RAIZ, 'originales', 'tocadiscos-cajas.json'), 'w') as fh:
        json.dump(cajas, fh, indent=2)
    print('cajas ->', 'originales/tocadiscos-cajas.json')


if __name__ == '__main__':
    main()
