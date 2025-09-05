import os

from photo_auto_review import get_exif_gps, check_photo_location, is_image_blurry

# Specify the path to the test photograph: the photograph of the Louvre Pyramid in the local directory.
image_path = r"E:\anyFile\Louvre_test.jpg"

# Der offizielle Breiten- und Längengrad der Pyramide des Louvre
building_gps = (48.86105, 2.33586)

# 读取图片为二进制
with open(image_path, "rb") as f:
    image_bytes = f.read()

print("_________________________________________________________")
# 1. test get_exif_gps
photo_gps = get_exif_gps(image_bytes)
print("Test: get_exif_gps Methode： Photo GPS:", photo_gps)

if photo_gps is None:
    print("EXIF。Failed to extract GPS information from image, please check image EXIF.")
else:
    # 2. test check_photo_location
    result, info = check_photo_location(photo_gps, building_gps, threshold=100)
    print("Test check_photo_location Methode")
    if result:
        print(f"The photograph was taken within 100 metres of the building at a distance of: {info:.2f} Meter")
    else:
        print(f"The location where the photo was taken is not within the boundaries of the building. Actual distance: {info if isinstance(info, float) else info}")

with open(image_path, "rb") as f:
    image_bytes = f.read()
print("_________________________________________________________")
is_clear, var = is_image_blurry(image_bytes, threshold=400)
print("Test is_image_blurry Methode, standard is > 350")
print(f"Image clarity judgement: {'clear' if is_clear else 'blurring'}，Laplace var={var:.2f}")