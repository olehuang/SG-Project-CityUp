import io
import math
import cv2
import numpy as np
from PIL import Image
from PIL.ExifTags import TAGS, GPSTAGS

"""
# utils/photo_auto_review.py 用于检测图片是否符合贴图要求
1：所选照片是否属于目标建筑
  (harversine + check_photo_location）)
2：检查图片清晰度(Laplacian 方差（Var）> 350)
准备工作：提取EXIF内经纬度信息；get_exif_gps
----------- english version -----------
# utils/photo_auto_review.py 
Used to check whether the uploaded photo meets the requirements for texture mapping
1: Whether the selected photo belongs to the target building
   (haversine + check_photo_location)
2: Check the sharpness of the photo
Preparation: Extract GPS latitude and longitude information from EXIF; get_exif_gps
"""

def get_exif_gps(image_bytes):
    """
    Prepare the latitude and longitude information within the EXIF of a photo
    Extracts the GPS latitude and longitude from the image binary data, returning (lat, lng) or None
    Prepare the GPS latitude and longitude information from the photo’s EXIF metadata
    """
    try:
        img = Image.open(io.BytesIO(image_bytes)) #Open photo file to extract EXIF
        exif = img._getexif()
        if not exif:
            return None #NO EXIF
        gps_info = {}
        for tag, value in exif.items():
            decoded = TAGS.get(tag, tag)
            if decoded == "GPSInfo": #Find the GPSInfo item in the EXIF.
                for t in value:
                    sub_decoded = GPSTAGS.get(t, t)
                    gps_info[sub_decoded] = value[t]
        if not gps_info or 'GPSLatitude' not in gps_info or 'GPSLongitude' not in gps_info:
            return None
        # 兼容Pillow的IFDRational Compatible with Pillow's IFDRational
        def to_float(x):
                try:
                    return float(x)
                except Exception:
                    return x[0] / x[1]
        #DMS（度分秒）转为十进制度 degrees minutes seconds to decimal degrees
        def dms_to_dd(dms, ref):
            degrees = to_float(dms[0])
            minutes = to_float(dms[1])
            seconds = to_float(dms[2])
            dd = degrees + minutes / 60.0 + seconds / 3600.0
            if ref in ['S', 'W']:
                dd = -dd
            return dd

        lat = dms_to_dd(gps_info['GPSLatitude'], gps_info['GPSLatitudeRef'])
        lng = dms_to_dd(gps_info['GPSLongitude'], gps_info['GPSLongitudeRef'])
        return lat, lng
    except Exception as e:
        print("Failed to parse EXIF GPS:", e)
        return None


def haversine(lat1, lon1, lat2, lon2):
    """ 1.1 Haversine距离算法（用于经纬度距离判断）
    Haversine distance algorithm (for latitude and longitude distance determination)
    """

    lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])# 将经纬度转换为弧度 Converting latitude and longitude to radians
    # 计算经纬度差Calculation of latitude/longitude differences
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    # 应用Haversine公式 Applying the Haversine formula
    a = math.sin(dlat / 2) ** 2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    R = 6371000  # Radius of the Earth in metres
    distance = R * c

    return distance


def check_photo_location(photo_gps, building_gps, threshold=100):
    """
    1.2 check_photo_location检查照片与目标建筑GPS信息是否在偏差值内
    Check if the latitude and longitude distance between the photo and the target building is within the specified threshold value
    :param photo_gps: (lat, lng) tuple from get_exif_gps
    :param building_gps: (lat, lng) tuple from DB
    :param threshold: distance threshold in meter
    :return: (bool, distance or error info)
    """
    if not photo_gps or not building_gps:
        return False, "GPS Information is missing"
    dist = haversine(photo_gps[0], photo_gps[1], building_gps[0], building_gps[1])
    return dist <= threshold, dist

""" 
   If you think it's not clear enough, just turn up the threshold. 
   Usually the threshold is around 700 if you want to see the texture details clearly. 
   如果觉得不够清晰把threshold调大就好 一般看清楚纹理细节的话 @threshold 在700左右
   """
def is_image_blurry(image_bytes, threshold=350):
    """
    2. 检测图片是否清晰，拉普拉斯方差法。
    :param image_bytes: Image binary data
    :param threshold: Variance threshold, below which it is considered fuzzy
    :return: (bool, variance)
    如果觉得不够清晰，把threshold调大就好
    """
    # 将二进制转换为numpy数组
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_GRAYSCALE)  # 只取灰度
    if img is None:
        raise ValueError("Image cannot be decoded, please change the image")

    laplacian_var = cv2.Laplacian(img, cv2.CV_64F).var()
    return laplacian_var > threshold, laplacian_var

