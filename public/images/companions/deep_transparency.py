from PIL import Image
import os

def remove_background_aggressive(image_path, output_path, threshold=250):
    """
    Remove background more aggressively from PNG image
    """
    img = Image.open(image_path).convert("RGBA")
    datas = img.getdata()
    
    newData = []
    for item in datas:
        # If the pixel is very light (near white/gray), make it fully transparent
        if item[0] > threshold and item[1] > threshold and item[2] > threshold:
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)
    
    img.putdata(newData)
    img.save(output_path, "PNG")
    print(f"Processed: {output_path}")

# Process all companion images
companions = [
    'companion-draguito-dragon.png',
    'companion-elfo-elf.png',
    'companion-fabel-animal.png',
    'companion-hada-fairy.png',
    'companion-human-warm.png',
    'companion-lumi-light.png',
    'companion-nimbo-cloud.png',
    'companion-sprig-plant.png',
    'companion-unicornito-unicorn.png'
]

for companion in companions:
    if os.path.exists(companion):
        remove_background_aggressive(companion, companion, threshold=240)
        print(f"✓ {companion} - fondo eliminado completamente")
    else:
        print(f"✗ {companion} - no encontrado")

print("\n¡Todas las imágenes procesadas con transparencia total!")
