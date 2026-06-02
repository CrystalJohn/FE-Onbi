"""
Auto-crop transparent padding from avatar images using Pillow.
Backs up originals to ./avatar_backup/ before overwriting.
"""
from PIL import Image
import os
import shutil

AVATAR_FILES = [
    "nguyen_tan_dat_avatar.webp",
    "Khang.webp",
    "kha.webp",
    "thien.webp",
    "phuc.webp",
    "Quy.webp",
]

PUBLIC_DIR = os.path.dirname(os.path.abspath(__file__))
BACKUP_DIR = os.path.join(PUBLIC_DIR, "avatar_backup")

os.makedirs(BACKUP_DIR, exist_ok=True)

def trim_transparency(img: Image.Image, padding: int = 20) -> Image.Image:
    """Remove transparent borders and add a small safe padding around the subject."""
    if img.mode != "RGBA":
        img = img.convert("RGBA")
    
    # Get the bounding box of non-transparent pixels
    bbox = img.getbbox()
    if bbox is None:
        print("  WARNING: Image is fully transparent, skipping.")
        return img
    
    left, top, right, bottom = bbox
    
    # Apply safe padding so we don't clip the subject
    width, height = img.size
    left   = max(0, left - padding)
    top    = max(0, top - padding)
    right  = min(width, right + padding)
    bottom = min(height, bottom + padding)
    
    cropped = img.crop((left, top, right, bottom))
    return cropped

for filename in AVATAR_FILES:
    src_path = os.path.join(PUBLIC_DIR, filename)
    
    if not os.path.exists(src_path):
        print(f"[SKIP] {filename} not found.")
        continue
    
    # Backup original
    backup_path = os.path.join(BACKUP_DIR, filename)
    shutil.copy2(src_path, backup_path)
    print(f"[BACKUP] {filename} -> avatar_backup/")
    
    # Open, trim, save
    with Image.open(src_path) as img:
        original_size = img.size
        img_rgba = img.convert("RGBA")
        trimmed = trim_transparency(img_rgba, padding=20)
        trimmed_size = trimmed.size
        
        # Save back as WebP with highest quality
        trimmed.save(src_path, format="WEBP", quality=95, method=6)
        
        reduction = (1 - (trimmed_size[0] * trimmed_size[1]) / (original_size[0] * original_size[1])) * 100
        print(f"[DONE]  {filename}: {original_size} -> {trimmed_size} ({reduction:.1f}% canvas reduced)")

print("\nAll avatars processed. Originals saved in ./avatar_backup/")
