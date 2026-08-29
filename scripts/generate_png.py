#!/usr/bin/env python3
"""
Generate foxai branded PNG icons using stdlib only (no PIL/ImageMagick).
Creates simple gradient-rounded-square icons that pair with the SVG.
"""
import struct
import zlib
import os

def png_chunk(chunk_type: bytes, data: bytes) -> bytes:
    return (
        struct.pack(">I", len(data))
        + chunk_type
        + data
        + struct.pack(">I", zlib.crc32(chunk_type + data) & 0xFFFFFFFF)
    )

def make_png(path: str, size: int):
    """Generate a foxai-branded rounded-square gradient PNG."""
    width = height = size
    radius = size * 14 // 56  # match SVG rx=14 in 56x56 box, scaled

    # Pre-build raw RGBA scanlines (with filter byte 0 at start of each row)
    rows = bytearray()
    cx, cy = size / 2, size / 2

    # foxai palette
    C_BG_TOP = (15, 23, 42)       # #0F172A
    C_BG_BOT = (30, 41, 59)       # #1E293B
    C_ORANGE = (251, 146, 60)     # #FB923C
    C_AMBER = (251, 191, 36)      # #FBBF24
    C_WHITE = (255, 255, 255)
    C_BLACK = (15, 23, 42)
    C_CREAM = (253, 215, 170)     # #FED7AA

    def lerp(a, b, t):
        return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))

    for y in range(height):
        rows.append(0)  # filter type
        for x in range(width):
            # Rounded square mask
            inside = True
            corners = [
                (radius, radius),
                (width - radius, radius),
                (radius, height - radius),
                (width - radius, height - radius),
            ]
            for (cx0, cy0) in corners:
                if (
                    (x < cx0 and y < cy0 and x < radius and y < radius)
                    or (x > cx0 and y < cy0 and x > width - radius and y < radius)
                    or (x < cx0 and y > cy0 and x < radius and y > height - radius)
                    or (x > cx0 and y > cy0 and x > width - radius and y > height - radius)
                ):
                    dx = x - cx0
                    dy = y - cy0
                    if dx * dx + dy * dy > radius * radius:
                        inside = False
                        break

            if not inside:
                rows.extend((0, 0, 0, 0))
                continue

            # Background gradient (slate-900 -> slate-800 diagonal)
            t = (x + y) / (width + height)
            color = lerp(C_BG_TOP, C_BG_BOT, t)

            # Fox face: diamond shape from (cx, 18%) to top of (cx, 88%)
            # Approximate a centered diamond at scale
            fx, fy = x / size, y / size  # 0..1
            # Diamond: |fx-0.5| + |fy-0.5|*1.5 <= 0.32
            dist = abs(fx - 0.5) + abs(fy - 0.55) * 1.4
            if dist <= 0.30:
                ft = (fy - 0.30) / 0.50
                ft = max(0, min(1, ft))
                color = lerp(C_AMBER, C_ORANGE, ft)

            # Left/right ear triangles
            # Left ear: around (0.20, 0.20) -> (0.30, 0.40)
            in_left_ear = (
                0.10 <= fx <= 0.35 and 0.05 <= fy <= 0.35
                and (fy - 0.05) >= 1.6 * abs(fx - 0.225)
            )
            in_right_ear = (
                0.65 <= fx <= 0.90 and 0.05 <= fy <= 0.35
                and (fy - 0.05) >= 1.6 * abs(fx - 0.775)
            )
            if in_left_ear or in_right_ear:
                color = lerp(C_AMBER, C_ORANGE, fy * 1.2)

            # Inner cheek triangles (cream)
            # Left inner cheek
            in_lcheek = (
                0.20 <= fx <= 0.50 and 0.28 <= fy <= 0.55
                and (fy - 0.28) >= 2.0 * abs(fx - 0.355)
            )
            in_rcheek = (
                0.50 <= fx <= 0.80 and 0.28 <= fy <= 0.55
                and (fy - 0.28) >= 2.0 * abs(fx - 0.645)
            )
            if (in_lcheek or in_rcheek) and not (in_left_ear or in_right_ear):
                color = C_CREAM

            # Snout (white) - smaller diamond in lower half
            snout = abs(fx - 0.5) + abs(fy - 0.61) * 1.8
            if snout <= 0.18:
                color = C_WHITE

            # Eyes (two small black dots)
            for ex in (0.39, 0.61):
                if (fx - ex) ** 2 + (fy - 0.50) ** 2 < 0.012 ** 2 * (size / 56):
                    color = C_BLACK
                # Highlight
                if (fx - (ex - 0.005)) ** 2 + (fy - 0.493) ** 2 < 0.003 ** 2:
                    color = C_WHITE

            # Nose diamond at center-bottom
            nose_dist = abs(fx - 0.5) + abs(fy - 0.68) * 2.5
            if nose_dist < 0.045:
                color = C_BLACK

            rows.extend(color + (255,))

    # Build PNG
    sig = b"\x89PNG\r\n\x1a\n"
    ihdr = struct.pack(">IIBBBBB", width, height, 8, 6, 0, 0, 0)  # RGBA
    idat = zlib.compress(bytes(rows), 9)
    iend = b""

    with open(path, "wb") as f:
        f.write(sig)
        f.write(png_chunk(b"IHDR", ihdr))
        f.write(png_chunk(b"IDAT", idat))
        f.write(png_chunk(b"IEND", iend))

    print(f"  wrote {path} ({size}x{size})")


if __name__ == "__main__":
    base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    public_dir = os.path.join(base, "public")
    os.makedirs(public_dir, exist_ok=True)
    sizes = [
        ("icon-128x128.png", 128),
        ("icon-512x512.png", 512),
        ("apple-touch-icon.png", 180),
    ]
    print("Generating foxai PNG icons:")
    for name, size in sizes:
        make_png(os.path.join(public_dir, name), size)
    print("Done.")