"""
Renders the images the AgentiX emails use into public/email/.

Email clients do not render SVG (Gmail, Outlook) and do not run WebGL, so the
mark, the two mascots and the hero "core" are rasterised here, once, from the
same geometry the landing page draws live. Served from the landing page's own
domain, so the email and the site always show the same pictures.

    python scripts/email-assets.py

Needs PyMuPDF (SVG -> PNG) and Pillow (the core render): pip install pymupdf pillow
"""

import math
import os
import random

import pymupdf
from PIL import Image, ImageDraw, ImageFilter

OUT = os.path.join(os.path.dirname(__file__), "..", "public", "email")
os.makedirs(OUT, exist_ok=True)

# The dark-theme tokens and the default (blue) accent, from app/globals.css.
BG_DEEP = (11, 12, 14)
BG = (18, 19, 22)
FG = "#EDF2F8"
ELEVATED = "#242C3A"
PANEL = "#0D0E10"
EDGE = "#4A4D53"
PRIMARY = "#154E80"
SOFT = "#2E7BC4"
SOFT_RGB = (46, 123, 196)
PRIMARY_RGB = (21, 78, 128)


def svg_to_png(svg: str, name: str, px: int) -> None:
    doc = pymupdf.open(stream=svg.encode("utf-8"), filetype="svg")
    page = doc[0]
    zoom = px / page.rect.width
    pix = page.get_pixmap(matrix=pymupdf.Matrix(zoom, zoom), alpha=True)
    pix.save(os.path.join(OUT, name))
    print("wrote", name, pix.width, "x", pix.height)


# No gradients below: MuPDF drops stop-opacity and paints gradient glows black,
# so every glow is a stack of flat circles with fill-opacity instead.

# ── The mark: two paths crossing in a frame, the crossing lit ─────────────────
MARK = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
  <rect x="3.5" y="3.5" width="41" height="41" rx="13" fill="#15171B" stroke="#FFFFFF" stroke-opacity="0.28" stroke-width="1.6"/>
  <circle cx="24" cy="24" r="12" fill="{SOFT}" fill-opacity="0.10"/>
  <circle cx="24" cy="24" r="8" fill="{SOFT}" fill-opacity="0.14"/>
  <path d="M13 13 C 19 19, 21 21, 24 24 C 27 27, 29 29, 35 35" stroke="{SOFT}" stroke-width="3.2" stroke-linecap="round" fill="none"/>
  <path d="M35 13 C 29 19, 27 21, 24 24 C 21 27, 19 29, 13 35" stroke="{SOFT}" stroke-width="3.2" stroke-linecap="round" fill="none"/>
  <circle cx="13" cy="13" r="2.6" fill="{SOFT}"/>
  <circle cx="35" cy="13" r="2.6" fill="{SOFT}"/>
  <circle cx="24" cy="24" r="3.4" fill="{FG}"/>
  <circle cx="24" cy="24" r="6.2" stroke="{SOFT}" stroke-width="1" stroke-opacity="0.5" fill="none"/>
</svg>"""


# ── The mascots, level 3, geometry from components/ui/mascot.tsx ──────────────
def mascot(role: str) -> str:
    head = f"""
  <rect x="9" y="12" width="30" height="25" rx="9" fill="{ELEVATED}" stroke="{EDGE}" stroke-width="1"/>
  <rect x="12.5" y="17" width="23" height="13.5" rx="6.5" fill="{PANEL}"/>
  <circle cx="19.5" cy="23.5" r="2.7" fill="{SOFT}"/>
  <circle cx="28.5" cy="23.5" r="2.7" fill="{SOFT}"/>
  <rect x="21" y="32" width="6" height="2.2" rx="1.1" fill="{SOFT}" fill-opacity="0.6"/>"""

    antenna = f"""
  <circle cx="24" cy="5" r="7.5" fill="{SOFT}" fill-opacity="0.12"/>
  <circle cx="24" cy="5" r="5.8" fill="{SOFT}" fill-opacity="0.12"/>
  <path d="M24 12 V7" stroke="{EDGE}" stroke-width="2" stroke-linecap="round"/>
  <circle cx="24" cy="5" r="4.6" stroke="{SOFT}" stroke-opacity="0.6" stroke-width="1" fill="none"/>
  <circle cx="24" cy="5" r="2.6" fill="{SOFT}"/>"""

    if role == "consultant":
        extra_back = ""
        extra_front = f"""
  <circle cx="28.5" cy="23.5" r="4.3" stroke="{SOFT}" stroke-width="1" fill="none"/>
  <circle cx="28.5" cy="23.5" r="3.1" fill="{SOFT}" fill-opacity="0.2"/>
  <circle cx="31.6" cy="20.9" r=".65" fill="#FFFFFF"/>
  <path d="M33 22 H36.4 M33 23.6 H35.2 M33 25.2 H36.8" stroke="{SOFT}" stroke-width=".8" stroke-linecap="round"/>
  <path d="M24 37 L21.6 39.4 L24 45 L26.4 39.4 Z" fill="{PRIMARY}"/>
  <path transform="translate(20.76 37.56) scale(0.27)" d="M12 8.5 13.4 11l2.6 1-2.6 1L12 15.5 10.6 13 8 12l2.6-1Z" fill="#FFFFFF"/>"""
    else:
        extra_back = f"""
  <path d="M11 24 A13 13 0 0 1 37 24" stroke="{SOFT}" stroke-width="2.4" stroke-linecap="round" fill="none"/>
  <rect x="7.5" y="22" width="5" height="9" rx="2.5" fill="{PRIMARY}"/>
  <rect x="35.5" y="22" width="5" height="9" rx="2.5" fill="{PRIMARY}"/>"""
        extra_front = f"""
  <rect x="13" y="13" width="22" height="4" rx="2" fill="{PRIMARY}"/>
  <path d="M14 16.6 H34" stroke="{SOFT}" stroke-width="1" stroke-linecap="round"/>
  <path d="M38 29.5 Q32.5 35 27 33.6" stroke="{SOFT}" stroke-width="1" stroke-linecap="round" fill="none"/>
  <circle cx="27" cy="33.6" r="1.15" fill="{SOFT}"/>"""

    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -2 48 50" width="48" height="50">
  {antenna}{extra_back}{head}{extra_front}
</svg>"""


# ── The core: the hero object, as a still ─────────────────────────────────────
PHI = (1 + 5 ** 0.5) / 2


def icosahedron():
    v = []
    for a in (-1, 1):
        for b in (-PHI, PHI):
            v += [(0, a, b), (a, b, 0), (b, 0, a)]
    n = math.sqrt(1 + PHI * PHI)
    v = [(x / n, y / n, z / n) for x, y, z in v]
    edges = [(i, j) for i in range(12) for j in range(i + 1, 12)
             if abs(math.dist(v[i], v[j]) - 2 / n) < 1e-6]
    faces = [(i, j, k) for i in range(12) for j in range(i + 1, 12) for k in range(j + 1, 12)
             if (i, j) in edges and (j, k) in edges and (i, k) in edges]
    return v, edges, faces


def subdivide(v, faces):
    v = list(v)
    cache = {}

    def mid(a, b):
        key = tuple(sorted((a, b)))
        if key not in cache:
            p = [(v[a][i] + v[b][i]) / 2 for i in range(3)]
            l = math.sqrt(sum(c * c for c in p))
            v.append(tuple(c / l for c in p))
            cache[key] = len(v) - 1
        return cache[key]

    out = []
    for a, b, c in faces:
        ab, bc, ca = mid(a, b), mid(b, c), mid(c, a)
        out += [(a, ab, ca), (b, bc, ab), (c, ca, bc), (ab, bc, ca)]
    return v, out


def rot(p, ax, ay):
    x, y, z = p
    y, z = y * math.cos(ax) - z * math.sin(ax), y * math.sin(ax) + z * math.cos(ax)
    x, z = x * math.cos(ay) + z * math.sin(ay), -x * math.sin(ay) + z * math.cos(ay)
    return x, y, z


def core(name: str, w: int, h: int) -> None:
    s = 2  # supersample, then downsample for anti-aliasing
    W, H = w * s, h * s
    cx, cy = W / 2, H * 0.52
    img = Image.new("RGB", (W, H), BG_DEEP)

    # vertical wash and the central glow
    grad = Image.new("RGB", (1, H))
    for y in range(H):
        t = y / H
        grad.putpixel((0, y), tuple(int(BG_DEEP[i] + (BG[i] - BG_DEEP[i]) * t) for i in range(3)))
    img = grad.resize((W, H))

    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    for r, a in ((H * 0.62, 38), (H * 0.4, 60), (H * 0.24, 90)):
        gd.ellipse((cx - r, cy - r, cx + r, cy + r), fill=SOFT_RGB + (a,))
    glow = glow.filter(ImageFilter.GaussianBlur(H * 0.12))
    img.paste(glow, (0, 0), glow)

    lines = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ld = ImageDraw.Draw(lines)

    # faint grid, fading out from the centre
    step = 64 * s
    for x in range(0, W, step):
        ld.line((x, 0, x, H), fill=(255, 255, 255, 9), width=s)
    for y in range(0, H, step):
        ld.line((0, y, W, y), fill=(255, 255, 255, 9), width=s)

    R = H * 0.36
    v, edges, faces = icosahedron()

    def proj(p, radius, ax, ay):
        x, y, z = rot(p, ax, ay)
        k = 1 / (1 - z * 0.18)
        return cx + x * radius * k, cy + y * radius * k, z

    # orbit rings (tilted ellipses)
    for rr, a in ((1.42, 120), (1.75, 55)):
        rx, ry = R * rr, R * rr * 0.3
        ld.ellipse((cx - rx, cy - ry, cx + rx, cy + ry), outline=SOFT_RGB + (a,), width=2 * s)

    # inner, denser shell
    v2, f2 = subdivide(v, faces)
    seen = set()
    for a, b, c in f2:
        for e in ((a, b), (b, c), (c, a)):
            e = tuple(sorted(e))
            if e in seen:
                continue
            seen.add(e)
            p, q = proj(v2[e[0]], R * 0.9, 0.5, 0.35), proj(v2[e[1]], R * 0.9, 0.5, 0.35)
            ld.line((p[0], p[1], q[0], q[1]), fill=PRIMARY_RGB + (70,), width=s)

    # outer shell
    for i, j in edges:
        p, q = proj(v[i], R, 0.2, 0.6), proj(v[j], R, 0.2, 0.6)
        depth = (p[2] + q[2]) / 2
        ld.line((p[0], p[1], q[0], q[1]), fill=SOFT_RGB + (int(110 + 70 * depth),), width=2 * s)

    img.paste(lines, (0, 0), lines)

    # the faceted core, painter-sorted, lit from the upper right
    vc, fc = subdivide(*subdivide(v, faces))
    light = (0.5, -0.6, 0.62)
    polys = []
    for a, b, c in fc:
        pa, pb, pc = (rot(vc[i], 0.4, 0.9) for i in (a, b, c))
        n = [(pa[k] + pb[k] + pc[k]) / 3 for k in range(3)]
        if n[2] <= 0:
            continue
        lam = max(0, sum(n[k] * light[k] for k in range(3)))
        col = tuple(int(PRIMARY_RGB[k] * 0.55 + (SOFT_RGB[k] - PRIMARY_RGB[k] * 0.55) * lam + 40 * lam ** 6) for k in range(3))
        pts = [(cx + p[0] * R * 0.44, cy + p[1] * R * 0.44) for p in (pa, pb, pc)]
        polys.append((n[2], pts, col))
    cd = ImageDraw.Draw(img)
    for _, pts, col in sorted(polys):
        cd.polygon(pts, fill=col)

    # the two agents on their orbit, each with a halo
    agents = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ad = ImageDraw.Draw(agents)
    for ang in (math.radians(200), math.radians(20)):
        x = cx + math.cos(ang) * R * 1.42
        y = cy + math.sin(ang) * R * 1.42 * 0.3
        for r, a in ((34 * s, 40), (20 * s, 80)):
            ad.ellipse((x - r, y - r, x + r, y + r), fill=SOFT_RGB + (a,))
        agents_blur = None
        ad.ellipse((x - 10 * s, y - 10 * s, x + 10 * s, y + 10 * s), fill=(110, 230, 220, 255))
    halo = agents.filter(ImageFilter.GaussianBlur(6 * s))
    img.paste(halo, (0, 0), halo)
    img.paste(agents, (0, 0), agents)

    # dust
    rnd = random.Random(7)
    dd = ImageDraw.Draw(img)
    for _ in range(180):
        x, y = rnd.uniform(0, W), rnd.uniform(0, H)
        r = rnd.uniform(0.6, 1.8) * s
        a = rnd.uniform(0.25, 0.8)
        col = tuple(int(BG[k] + (SOFT_RGB[k] - BG[k]) * a) for k in range(3))
        dd.ellipse((x - r, y - r, x + r, y + r), fill=col)

    img = img.resize((w, h), Image.LANCZOS)
    img.save(os.path.join(OUT, name), quality=88, optimize=True)
    print("wrote", name, w, "x", h)


if __name__ == "__main__":
    svg_to_png(MARK, "mark.png", 120)
    svg_to_png(mascot("consultant"), "consultant.png", 168)
    svg_to_png(mascot("coach"), "coach.png", 168)
    # 2x of the 600 x 260 slot it fills in the email
    core("core.jpg", 1200, 520)
