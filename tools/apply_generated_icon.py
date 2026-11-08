"""Processes AI-generated flagship icon into PWA assets."""
import os
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BRAIN_DIR = r"C:\Users\TOSHIBA\.gemini\antigravity\brain\00c278b6-9039-48e9-afda-fb8260b90be8"
SRC_ICON = os.path.join(BRAIN_DIR, "icon_option_1.jpg")
ICONS_DIR = os.path.join(ROOT, "icons")
os.makedirs(ICONS_DIR, exist_ok=True)

im = Image.open(SRC_ICON).convert("RGBA")
print(f"Loaded source icon: {im.size}")

sizes = [
    ("icon-512.png", 512),
    ("icon-192.png", 192),
    ("apple-touch-icon.png", 180),
    ("icon-64.png", 64),
    ("favicon.png", 32),
]

for filename, sz in sizes:
    dest = os.path.join(ICONS_DIR, filename)
    resized = im.resize((sz, sz), Image.Resampling.LANCZOS)
    resized.save(dest, "PNG", optimize=True)
    print(f"Saved {sz}x{sz} -> {dest}")

print("All PWA icon assets generated successfully!")

