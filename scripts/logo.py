"""Génère la marque d'Hugo Gillard à partir des contours de Playfair Display et de Jost (licence OFL).

Sorties :
  lib/brand.ts           données vectorielles utilisées par components/Brand.tsx
  public/brand/*.svg     fichiers autonomes (monogramme, sceau, logotype) pour l'impression et les réseaux
  public/favicon.svg     monogramme sur pastille sombre

Usage : python scripts/logo.py   (nécessite : pip install fonttools brotli)
"""
import json
import math
import os
from functools import lru_cache

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

RACINE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
POLICES = os.path.join(RACINE, 'node_modules', '@fontsource-variable')


@lru_cache(None)
def police(famille, style, wght):
    f = TTFont(os.path.join(POLICES, famille, 'files', f'{famille}-latin-wght-{style}.woff2'))
    return instancer.instantiateVariableFont(f, {'wght': wght})


def glyphe(ch, famille='playfair-display', style='normal', wght=400):
    f = police(famille, style, wght)
    return f, f.getGlyphSet(), f.getBestCmap()[ord(ch)]


def avance(ch, **k):
    f, _, nom = glyphe(ch, **k)
    return f['hmtx'][nom][0]


def chemin(ch, x=0.0, y=0.0, s=1.0, **k):
    _, gs, nom = glyphe(ch, **k)
    pen = SVGPathPen(gs, ntos=lambda v: f'{v:.1f}'.rstrip('0').rstrip('.'))
    gs[nom].draw(TransformPen(pen, (s, 0, 0, -s, x, y)))
    return pen.getCommands()


def mot(txt, x=0.0, y=0.0, s=1.0, interlettre=0, **k):
    largeur = (sum(avance(c, **k) for c in txt) + interlettre * (len(txt) - 1)) * s
    d, cx = [], x
    for c in txt:
        if c != ' ':
            d.append(chemin(c, cx, y, s, **k))
        cx += (avance(c, **k) + interlettre) * s
    return ' '.join(d), largeur


# ---------- Monogramme : H droit, G italique entrelacés ----------
DX, RESERVE = 300, 24
BANDE = (-392, 92)  # y, hauteur : zone où la barre du H passe par-dessus la boucle du G
MONO = {
    'h': chemin('H', 0, 0, 1, wght=420),
    'g': chemin('G', DX, 0, 1, style='italic', wght=400),
    'bande': BANDE,
    'reserve': RESERVE * 2,
    'viewBox': [-20, -760, DX + 790, 800],
}

# ---------- Logotype : HUGO GILLARD en capitales espacées ----------
nom_d, nom_l = mot('HUGO GILLARD', interlettre=150, wght=430)
LOGOTYPE = {'d': nom_d, 'viewBox': [-10, -735, round(nom_l + 20), 760]}

mention_d, mention_l = mot('PHOTOGRAPHIE & FILM DE MARIAGE', s=1.0, interlettre=380, famille='jost', wght=500)
MENTION = {'d': mention_d, 'viewBox': [-10, -720, round(mention_l + 20), 740]}


# ---------- Sceau : monogramme cerclé, texte circulaire ----------
def texte_cercle(txt, r, s, centre_deg, sens, interlettre, **k):
    """Chaque glyphe est un chemin en unités de police, posé par une transformation (translate, rotate, scale)."""
    pas = [(avance(c, **k) + interlettre) * s for c in txt]
    total = sum(pas) - interlettre * s
    a = math.radians(centre_deg) - sens * total / r / 2
    out = []
    for c, p in zip(txt, pas):
        largeur = avance(c, **k) * s
        milieu = a + sens * largeur / 2 / r
        if c != ' ':
            x, y = r * math.sin(milieu), -r * math.cos(milieu)
            rot = math.degrees(milieu) + (0 if sens == 1 else 180)
            out.append({
                't': f'translate({x:.1f} {y:.1f}) rotate({rot:.2f}) scale({s}) translate({-avance(c, **k) / 2:.1f} 0)',
                'd': chemin(c, **k),
            })
        a += sens * p / r
    return out


R = 1000
SCEAU = {
    'viewBox': [-R - 10, -R - 10, 2 * R + 20, 2 * R + 20],
    'cercles': [{'r': R - 8, 'w': 10}, {'r': R - 70, 'w': 3}, {'r': R - 300, 'w': 3}],
    'haut': texte_cercle('HUGO GILLARD', R - 215, 0.135, 0, 1, 34, wght=500),
    'bas': texte_cercle('PHOTOGRAPHIE · FILM', R - 155, 0.092, 180, -1, 40, famille='jost', wght=500),
    'points': [[round((R - 185) * math.sin(math.radians(a)), 1), round(-(R - 185) * math.cos(math.radians(a)), 1)] for a in (96, 264)],
    'mono': {'echelle': 0.95},
}

# ---------- lib/brand.ts ----------
ts = '// Généré par scripts/logo.py : ne pas modifier à la main.\n'
for nom, val in [('MONO', MONO), ('LOGOTYPE', LOGOTYPE), ('MENTION', MENTION), ('SCEAU', SCEAU)]:
    ts += f'export const {nom} = {json.dumps(val, ensure_ascii=False)} as const;\n'
open(os.path.join(RACINE, 'lib', 'brand.ts'), 'w', encoding='utf-8', newline='\n').write(ts)


# ---------- Fichiers SVG autonomes ----------
def mono_svg(c_h, c_g, ident='m'):
    y, h = BANDE
    return (
        f'<defs><clipPath id="{ident}b"><rect x="-500" y="{y}" width="3000" height="{h}"/></clipPath>'
        f'<mask id="{ident}h" maskUnits="userSpaceOnUse" x="-500" y="-1200" width="3000" height="2000">'
        f'<rect x="-500" y="-1200" width="3000" height="2000" fill="#fff"/>'
        f'<path d="{MONO["g"]}" stroke="#000" stroke-width="{MONO["reserve"]}" stroke-linejoin="round"/>'
        f'<rect x="-500" y="{y}" width="3000" height="{h}" fill="#fff"/></mask>'
        f'<mask id="{ident}g" maskUnits="userSpaceOnUse" x="-500" y="-1200" width="3000" height="2000">'
        f'<rect x="-500" y="-1200" width="3000" height="2000" fill="#fff"/>'
        f'<path d="{MONO["h"]}" stroke="#000" stroke-width="{MONO["reserve"]}" stroke-linejoin="round" clip-path="url(#{ident}b)"/></mask></defs>'
        f'<path d="{MONO["h"]}" fill="{c_h}" mask="url(#{ident}h)"/><path d="{MONO["g"]}" fill="{c_g}" mask="url(#{ident}g)"/>'
    )


def vb(v):
    return ' '.join(str(x) for x in v)


def sceau_svg(c1, c2, fond=None):
    x, y, w, h = MONO['viewBox']
    e = SCEAU['mono']['echelle']
    cx, cy = x + w / 2, y + h / 2
    parts = [f'<rect x="-1010" y="-1010" width="2020" height="2020" fill="{fond}"/>'] if fond else []
    parts += [f'<circle r="{c["r"]}" fill="none" stroke="{c2}" stroke-width="{c["w"]}"/>' for c in SCEAU['cercles']]
    parts += [f'<path fill="{c1}" transform="{g["t"]}" d="{g["d"]}"/>' for g in SCEAU['haut']]
    parts += [f'<path fill="{c2}" transform="{g["t"]}" d="{g["d"]}"/>' for g in SCEAU['bas']]
    parts += [f'<circle cx="{px}" cy="{py}" r="9" fill="{c2}"/>' for px, py in SCEAU['points']]
    parts.append(f'<g transform="scale({e}) translate({-cx:.1f} {-cy:.1f})">{mono_svg(c1, c2, "s")}</g>')
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb(SCEAU["viewBox"])}">{"".join(parts)}</svg>'


dossier = os.path.join(RACINE, 'public', 'brand')
os.makedirs(dossier, exist_ok=True)
fichiers = {
    'monogramme.svg': f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb(MONO["viewBox"])}">{mono_svg("#221c17", "#9c7d38")}</svg>',
    'monogramme-clair.svg': f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb(MONO["viewBox"])}">{mono_svg("#efe8dc", "#d4bb85")}</svg>',
    'sceau.svg': sceau_svg('#221c17', '#9c7d38'),
    'sceau-clair.svg': sceau_svg('#efe8dc', '#d4bb85'),
    'logotype.svg': f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb(LOGOTYPE["viewBox"])}"><path fill="#221c17" d="{LOGOTYPE["d"]}"/></svg>',
    'logotype-clair.svg': f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb(LOGOTYPE["viewBox"])}"><path fill="#efe8dc" d="{LOGOTYPE["d"]}"/></svg>',
}
for nom, contenu in fichiers.items():
    open(os.path.join(dossier, nom), 'w', encoding='utf-8', newline='\n').write(contenu)

# Favicon : monogramme clair sur pastille sombre.
x, y, w, h = MONO['viewBox']
cote = max(w, h) * 1.32
favicon = (
    f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{x + w / 2 - cote / 2:.0f} {y + h / 2 - cote / 2:.0f} {cote:.0f} {cote:.0f}">'
    f'<circle cx="{x + w / 2:.0f}" cy="{y + h / 2:.0f}" r="{cote / 2:.0f}" fill="#16120f"/>{mono_svg("#efe8dc", "#d4bb85", "f")}</svg>'
)
open(os.path.join(RACINE, 'public', 'favicon.svg'), 'w', encoding='utf-8', newline='\n').write(favicon)
print('marque générée :', ', '.join(fichiers), '+ favicon.svg + lib/brand.ts')
