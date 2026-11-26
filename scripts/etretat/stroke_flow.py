"""Build a painting's local brush direction map from its luminance."""

import numpy as np
from PIL import Image


def blur(a, sigma):
    r = int(sigma * 3)
    x = np.arange(-r, r + 1)
    g = np.exp(-x * x / (2 * sigma * sigma))
    g /= g.sum()
    for axis in (0, 1):
        pad = [(r, r) if i == axis else (0, 0) for i in range(2)]
        ap = np.pad(a, pad, mode="edge")
        a = sum(w * np.take(ap, np.arange(i, i + a.shape[axis]), axis=axis)
                for i, w in enumerate(g))
    return a


def save_stroke_flow(paint, destination):
    FW = 512
    FH = round(FW * paint.height / paint.width)
    lum = np.asarray(paint.resize((FW, FH), Image.LANCZOS).convert("L"), dtype=np.float64) / 255
    lum = blur(lum, 1.0)
    gy, gx = np.gradient(lum)
    jxx, jyy, jxy = blur(gx * gx, 7), blur(gy * gy, 7), blur(gx * gy, 7)
    # Gradient orientation is 0.5*atan2(2jxy, jxx-jyy); strokes run across it,
    # which in doubled-angle form is simply the negated vector.
    c2, s2 = -(jxx - jyy), -2 * jxy
    mag = np.hypot(c2, s2) + 1e-12
    coh = mag / (jxx + jyy + 1e-12)
    # Where the brushwork has no clear direction, lean towards horizontal dabs.
    w = np.clip(coh / 0.25, 0, 1)
    c2 = w * c2 / mag + (1 - w) * 1.0
    s2 = w * s2 / mag
    c2, s2 = blur(c2, 4), blur(s2, 4)
    n = np.hypot(c2, s2) + 1e-12
    flow = np.stack([c2 / n * 0.5 + 0.5, s2 / n * 0.5 + 0.5, np.clip(coh, 0, 1)], -1)
    Image.fromarray((flow * 255 + 0.5).astype(np.uint8)).save(destination, optimize=True)
