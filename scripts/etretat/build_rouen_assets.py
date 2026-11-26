"""Register the supplied Rouen photo to Monet's painting and build gallery assets.

  python build_rouen_assets.py <painting scan> <IMG_8460.JPG> <output directory>

Needs Pillow and NumPy. Coordinates are in the 444 × 700 reference views
used to mark corresponding features, from the towers down to the portals.
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageOps

from stroke_flow import save_stroke_flow


LANDMARKS = [
    # Painting x/y, photograph x/y.
    (0, 0, 0, 0), (220, 0, 198, 0), (444, 0, 443, 0),
    (0, 340, 0, 331), (444, 340, 443, 327),
    (0, 700, 0, 689), (220, 700, 209, 687), (444, 700, 443, 690),
    (80, 135, 74, 123), (122, 152, 119, 140), (340, 37, 354, 39),
    (255, 156, 250, 144),   # Arch above the rose window
    (257, 260, 265, 236),   # Rose window
    (225, 371, 216, 341),   # Clock over the main portal
    (226, 418, 212, 377),   # Main portal
    (86, 489, 82, 459), (393, 470, 399, 451),  # Side portals
    (262, 576, 256, 541), (273, 677, 265, 661),  # Main door
]


def kernel(a, b):
    squared = np.sum((a[:, None, :] - b[None, :, :]) ** 2, axis=2)
    return squared * np.log(np.maximum(squared, 1e-12))


def register(photo, size):
    # Fit a smooth thin-plate spline. Regularization keeps the stonework
    # continuous where Monet compressed or shifted architectural details.
    source, target = np.hsplit(np.array(LANDMARKS, dtype=float) / 700, 2)
    affine = np.column_stack((np.ones(len(source)), source))
    system = np.block([
        [kernel(source, source) + np.eye(len(source)) * 0.002, affine],
        [affine.T, np.zeros((3, 3))],
    ])
    weights = np.linalg.solve(system, np.vstack((target, np.zeros((3, 2)))))

    width, height = size
    xs = np.append(np.arange(0, width, 20), width)
    ys = np.append(np.arange(0, height, 20), height)
    x, y = np.meshgrid(xs, ys)
    points = np.column_stack((x.ravel() / width * 444 / 700, y.ravel() / height))
    basis = np.column_stack((kernel(points, source), np.ones(len(points)), points))
    mapped = (basis @ weights) * [photo.width * 700 / 444, photo.height]
    mapped = np.clip(mapped, [0, 0], [photo.width - 1, photo.height - 1])
    mapped = mapped.reshape(len(ys), len(xs), 2)
    mesh = []
    for row in range(len(ys) - 1):
        for col in range(len(xs) - 1):
            box = (xs[col], ys[row], xs[col + 1], ys[row + 1])
            quad = mapped[[row, row + 1, row + 1, row], [col, col, col + 1, col + 1]]
            mesh.append((box, tuple(quad.ravel())))
    return photo.transform(size, Image.Transform.MESH, mesh, Image.Resampling.BICUBIC)


if __name__ == "__main__":
    painting_path, photo_path, output_path = sys.argv[1:4]
    output = Path(output_path)
    output.mkdir(parents=True, exist_ok=True)
    painting = Image.open(painting_path).convert("RGB")
    photo = ImageOps.exif_transpose(Image.open(photo_path)).convert("RGB")
    registered = register(photo, painting.size)
    registered.save(output / "photo.webp", quality=85, method=6)
    painting.save(output / "painting.webp", quality=88, method=6)
    save_stroke_flow(painting, output / "flow.png")
