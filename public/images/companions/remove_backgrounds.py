from rembg import remove
from PIL import Image
import os

# List of companion images to process
companions = [
    "companion-hada-fairy.png",
    "companion-unicornito-unicorn.png",
    "companion-fabel-animal.png",
    "companion-lumi-light.png",
    "companion-nimbo-cloud.png",
    "companion-sprig-plant.png",
    "companion-draguito-dragon.png",
    "companion-elfo-elf.png",
    "companion-human-warm.png"
]

print("🎨 Processing companion images to remove backgrounds...\n")

for filename in companions:
    if os.path.exists(filename):
        print(f"Processing {filename}...")
        
        # Open the image
        input_image = Image.open(filename)
        
        # Remove background with alpha matting for smooth edges
        # This preserves glows, gradients, and all visual effects
        output_image = remove(
            input_image,
            alpha_matting=True,
            alpha_matting_foreground_threshold=240,
            alpha_matting_background_threshold=10,
            alpha_matting_erode_size=10
        )
        
        # Save with transparency
        output_image.save(filename, "PNG")
        print(f"✓ {filename} - Background removed successfully!\n")
    else:
        print(f"⚠ {filename} not found, skipping...\n")

print("=" * 50)
print("✨ All companion images processed successfully!")
print("=" * 50)
print("\nAll images now have transparent backgrounds while")
print("preserving their glows, gradients, and visual effects.")
