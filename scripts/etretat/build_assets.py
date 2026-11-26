"""Builds the Étretat Canvas assets in public/etretat/.

  python build_assets.py <painting scan> <photo> <out dir>

Needs Pillow and numpy. Sources (not committed):
  painting: commons.wikimedia.org/wiki/File:Monet_-_Sonnenaufgang_bei_Etretat.jpg (public domain)
  photo:    Heeyun's own photograph of the Porte d'Aval, IMG_8462.JPG

Outputs, all the same aspect ratio:
  painting.webp  the Painting, bare-canvas edges cropped
  photo.webp     the Photo in Registration with the Painting
  flow.png       Monet's stroke direction per area: R,G = cos/sin of twice the
                 angle (0..255), B = how consistent the direction is there

All landmark maths is in "permille of the image's own width".
"""
import sys
from PIL import Image

from stroke_flow import save_stroke_flow

paint_src, photo_src, out = sys.argv[1:4]

# Registration: painting = S * photo + T, least-squares fit on the needle tip,
# the needle's base, the foot of the cliff and the top of the arch opening.
S_, TX, TY = 1.142, -104.1, -150.4
CROP = (7.0, 5.0, 997.0, 735.0)  # painting crop
SPLIT = 425.0  # painting y below which there is only water
OW = 2560

k = (CROP[2] - CROP[0]) / OW  # permille per output px
OH = round((CROP[3] - CROP[1]) / k)

P = Image.open(paint_src).convert("RGB")
pw = P.size[0] / 1000
paint = P.crop(tuple(round(v * pw) for v in CROP)).resize((OW, OH), Image.LANCZOS)

F = Image.open(photo_src).convert("RGB")
fw = F.size[0] / 1000
fh_pm = F.size[1] / fw


def aff(ys, y0p, y0q):
    """Output px -> photo px; y scale `ys`, anchored so painting y0p -> photo y0q."""
    return (k / S_ * fw, 0, (CROP[0] - TX) / S_ * fw,
            0, k * ys * fw, (y0q + (CROP[1] - y0p) * ys) * fw)


# The photo is ~4% too short to reach the painting's bottom edge at this scale,
# so the water below SPLIT is stretched vertically; everything above is uniform.
q_split = (SPLIT - TY) / S_
top = F.transform((OW, OH), Image.AFFINE, aff(1 / S_, SPLIT, q_split), Image.BICUBIC)
ys_b = (fh_pm - 1.0 - q_split) / (CROP[3] - SPLIT)
bot = F.transform((OW, OH), Image.AFFINE, aff(ys_b, SPLIT, q_split), Image.BICUBIC)
Ys = round((SPLIT - CROP[1]) / k)
photo = top.copy()
photo.paste(bot.crop((0, Ys, OW, OH)), (0, Ys))

paint.save(f"{out}/painting.webp", quality=84, method=6)
photo.save(f"{out}/photo.webp", quality=82, method=6)


save_stroke_flow(paint, f"{out}/flow.png")
print("size", OW, OH, "water stretch x%.3f" % (1 / S_ / ys_b))
