from PIL import Image, ImageDraw, ImageFont
import os

# Create a test image showing one companion on different colored backgrounds
test_companion = "companion-lumi-light.png"

if os.path.exists(test_companion):
    companion = Image.open(test_companion).convert("RGBA")
    
    # Create a composite image with 4 different background colors
    bg_width = 400
    bg_height = 400
    composite_width = bg_width * 2
    composite_height = bg_height * 2
    
    composite = Image.new("RGBA", (composite_width, composite_height))
    
    # Define 4 different background colors
    colors = [
        (255, 182, 193),  # Light pink
        (173, 216, 230),  # Light blue
        (144, 238, 144),  # Light green
        (255, 255, 255),  # White
    ]
    
    positions = [(0, 0), (bg_width, 0), (0, bg_height), (bg_width, bg_height)]
    
    for i, (color, pos) in enumerate(zip(colors, positions)):
        # Create background
        bg = Image.new("RGBA", (bg_width, bg_height), color)
        
        # Resize companion to fit
        companion_resized = companion.copy()
        companion_resized.thumbnail((300, 300), Image.Resampling.LANCZOS)
        
        # Center the companion on the background
        x = (bg_width - companion_resized.width) // 2
        y = (bg_height - companion_resized.height) // 2
        
        # Paste companion with transparency
        bg.paste(companion_resized, (x, y), companion_resized)
        
        # Paste to composite
        composite.paste(bg, pos)
    
    # Save the test image
    composite.save("transparency_test.png", "PNG")
    print("✓ Transparency test image created: transparency_test.png")
    print("  This shows Lumi on 4 different colored backgrounds")
    print("  to verify the transparent background is working correctly.")
else:
    print(f"⚠ {test_companion} not found")
