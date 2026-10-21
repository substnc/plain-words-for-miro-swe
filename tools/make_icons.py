"""Ritar tilläggets ikoner: monogrammet "pw" (Plain Words) i svart på en gul cirkel.

Gult på Anthons önskan, i en ljus post-it-gul ton (#FFE873), inte Miros gula
(#FFD02F). Cirkeln och bokstäverna är våra egna, inte Miros rundade ruta med
streck. Miros regler och Chrome Web Store förbjuder att likna Miros egen app.

Skapar:
  extension/icons/icon-16/32/48/128.png   ikonerna i tillägget
  store/icon_store_128.png                butikens ikon: 96x96 bild med 16 px
                                          genomskinlig kant, som Chrome Web Store kräver

Kör: python3 tools/make_icons.py   (kräver Pillow: pip install pillow)
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "extension" / "icons"
STORE = ROOT / "store"
BLACK = (0, 0, 0, 255)
YELLOW = (255, 232, 115, 255)  # post-it-gul, ljusare än Miros
FONTS = [
    ("/System/Library/Fonts/HelveticaNeue.ttc", 1),  # Bold på macOS
    ("/System/Library/Fonts/Helvetica.ttc", 1),
    ("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 0),
]
TEXT = "pw"
TRACKING = -0.045  # bokstäverna lite närmare varandra, i andel av teckenstorleken


def font(px: int) -> ImageFont.FreeTypeFont:
    for path, index in FONTS:
        if Path(path).exists():
            return ImageFont.truetype(path, px, index=index)
    return ImageFont.load_default()


def draw(size_px: int = 1024, letters: float = 66) -> Image.Image:
    """Ritar på en yta av 128 enheter. letters är teckenstorleken i samma enheter."""
    img = Image.new("RGBA", (size_px, size_px), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    s = size_px / 128
    d.ellipse([2 * s, 2 * s, 126 * s, 126 * s], fill=YELLOW)

    f = font(int(letters * s))
    gap = TRACKING * letters * s
    widths = [d.textlength(ch, font=f) for ch in TEXT]
    total = sum(widths) + gap * (len(TEXT) - 1)
    # Centrera på x-höjden (w:ets höjd), så att p:ets nedstapel inte drar ned allt.
    xb = d.textbbox((0, 0), "x", font=f)
    x = 64 * s - total / 2
    y = 64 * s - (xb[1] + xb[3]) / 2
    for ch, w in zip(TEXT, widths):
        d.text((x, y), ch, font=f, fill=BLACK)
        x += w + gap
    return img


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    STORE.mkdir(parents=True, exist_ok=True)
    big = draw()
    # I 16 px blir bokstäverna lite större, annars flyter de ihop.
    small = draw(letters=74)
    for size in (16, 32, 48, 128):
        src = small if size <= 32 else big
        src.resize((size, size), Image.LANCZOS).save(OUT / f"icon-{size}.png")
    store = Image.new("RGBA", (128, 128), (0, 0, 0, 0))
    store.paste(big.resize((96, 96), Image.LANCZOS), (16, 16))
    store.save(STORE / "icon_store_128.png")
    print("Ikoner sparade i", OUT, "och", STORE)


if __name__ == "__main__":
    main()
