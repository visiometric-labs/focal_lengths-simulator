import os
from PIL import Image, ImageDraw, ImageFont

def generate_og_cover():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    branding_dir = os.path.join(project_root, 'public', 'branding')
    
    # 1. Base 3D Hero image (1200x630)
    # The master render is located in artifacts or branding
    output_path = os.path.join(branding_dir, 'og-cover.jpg')
    print(f"Target OG Cover: {output_path}")

if __name__ == '__main__':
    generate_og_cover()
