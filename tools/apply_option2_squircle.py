"""Crops Option 2 squircle tile to metallic boundary with antialiased transparency and generates all PWA assets."""
import os
from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BRAIN_DIR = r"C:\Users\TOSHIBA\.gemini\antigravity\brain\00c278b6-9039-48e9-afda-fb8260b90be8"
SRC_ICON = os.path.join(BRAIN_DIR, "pyatlas_sleek_icon_v2_1794169448278.jpg")
ICONS_DIR = os.path.join(ROOT, "icons")
os.makedirs(ICONS_DIR, exist_ok=True)

orig = Image.open(SRC_ICON).convert("RGBA")
print("Original size:", orig.size)

# Bounding box of the squircle tile
# left=103, top=104, right=920, bottom=921 -> 817x817
crop_box = (103, 104, 920, 921)
cropped = orig.crop(crop_box)
W, H = cropped.size
print(f"Cropped squircle tile: {W}x{H}")

# 4x Supersampled antialiased squircle alpha mask
SS = 4
mask_w, mask_h = W * SS, H * SS
corner_radius = int(mask_w * 0.222)

ss_mask = Image.new("L", (mask_w, mask_h), 0)
draw = ImageDraw.Draw(ss_mask)
draw.rounded_rectangle([(0, 0), (mask_w, mask_h)], radius=corner_radius, fill=255)

# Downsample mask with Lanczos filter for perfectly smooth antialiased edges
smooth_mask = ss_mask.resize((W, H), Image.Resampling.LANCZOS)

# Apply mask to cropped squircle tile
master_icon = cropped.copy()
master_icon.putalpha(smooth_mask)

# Save master cropped icon to brain dir for review
preview_path = os.path.join(BRAIN_DIR, "option2_cropped_squircle.png")
master_icon.save(preview_path, "PNG", optimize=True)
print(f"Saved master preview: {preview_path}")

# Generate standard PWA icon formats (transparent squircle background)
sizes = [
    ("icon-512.png", 512),
    ("icon-192.png", 192),
    ("apple-touch-icon.png", 180),
    ("icon-64.png", 64),
    ("favicon.png", 32),
]

for filename, sz in sizes:
    dest = os.path.join(ICONS_DIR, filename)
    resized = master_icon.resize((sz, sz), Image.Resampling.LANCZOS)
    resized.save(dest, "PNG", optimize=True)
    print(f"Generated {sz}x{sz} -> {dest}")

# Generate Android Maskable icons (padded with safe area on solid dark background #0a0e16)
for filename, sz in [("icon-maskable-512.png", 512), ("icon-maskable-192.png", 192)]:
    canvas = Image.new("RGBA", (sz, sz), (10, 14, 22, 255))
    # Android maskable safe zone is inner 80% (scale by 0.82)
    inner_sz = int(sz * 0.84)
    offset = (sz - inner_sz) // 2
    resized_inner = master_icon.resize((inner_sz, inner_sz), Image.Resampling.LANCZOS)
    canvas.paste(resized_inner, (offset, offset), resized_inner)
    dest = os.path.join(ICONS_DIR, filename)
    canvas.save(dest, "PNG", optimize=True)
    print(f"Generated Maskable {sz}x{sz} -> {dest}")

print("All Option 2 assets successfully created!")
