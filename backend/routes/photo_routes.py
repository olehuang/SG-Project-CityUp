from fastapi import APIRouter, HTTPException, status, File, UploadFile, Form, Depends
from pydantic import BaseModel
from typing import Optional, List
from bson import ObjectId
from datetime import datetime, timezone
import traceback
import os
import shutil
import uuid
import time
from pymongo import ReturnDocument

from db_entities import MongoDB, Photo, ReviewStatus
# from utils.logger import log_error

router = APIRouter()
photo_collection = MongoDB.get_instance().get_collection("photos")

# 上传目录
UPLOAD_DIR = os.getenv("UPLOAD_DIR", "uploads/photos")
os.makedirs(UPLOAD_DIR, exist_ok=True)

# 访问URL的基础路径
UPLOAD_URL_PATH = os.getenv("UPLOAD_URL_PATH", "static/photos")
BASE_URL = os.getenv("BASE_URL", "http://localhost:8000")
#
# class PhotoUploadRequest(BaseModel):
#     user_id: str
#     building_id: str
#     image_url: Optional[str] = None


class PhotoReviewRequest(BaseModel):
    photo_id: str
    status: ReviewStatus
    feedback: Optional[str] = None


class PhotoResponse(BaseModel):
    photo_id: str
    user_id: str
    building_id: str
    upload_time: str
    image_url: Optional[str]
    status: str
    feedback: Optional[str]


@router.post("/", status_code=201)
async def upload_photo(
        user_id: str = Form(...),
        building_id: str = Form(...),
        photo: UploadFile = File(...)
):
    try:
        # 验证文件类型
        if not photo.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="The uploaded file must be in image format")

        # 生成唯一文件名
        timestamp = int(time.time())
        file_extension = os.path.splitext(photo.filename)[1]
        # unique_filename = f"{user_id}_{timestamp}{file_extension}"
        unique_filename = f"{user_id}_{int(time.time() * 1000)}_{uuid.uuid4().hex}{file_extension}"
        file_path = os.path.join(UPLOAD_DIR, unique_filename)

        # 保存文件
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(photo.file, buffer)

        # 生成访问URL
        # image_url = f"{BASE_URL}/{UPLOAD_DIR}/{unique_filename}"
        image_url = f"{BASE_URL}/{UPLOAD_URL_PATH}/{unique_filename}"


        photo_obj = Photo(
            user_id=user_id,
            building_id=building_id,
            image_url=image_url,
            upload_time=datetime.now(timezone.utc),
            status = ReviewStatus.Pending
        )
        result = photo_collection.insert_one(photo_obj.to_dict())
        if not result.inserted_id:
            # 如果数据库插入失败，删除已上传的文件
            os.remove(file_path)
            raise HTTPException(status_code=500, detail="Photo upload failed")

        return {"message": "The photo was uploaded successfully and is awaiting review.",
                "photo_id": str(result.inserted_id)}

    except HTTPException:
        raise
    except Exception as e:
        print("upload_photo error:", traceback.format_exc())
        # log_error("An exception occurred during the photo upload process\n" + traceback.format_exc(), e, user_id=user_id)
        raise HTTPException(status_code=500, detail="Server error, upload failed")



@router.get("/review/next", response_model=PhotoResponse)
async def get_next_pending_photo():
    try:
        doc = photo_collection.find_one_and_update(
            {"status": ReviewStatus.Pending.value},
            {"$set": {"status": ReviewStatus.Reviewing.value}},
            sort=[("upload_time", 1)],
            return_document=ReturnDocument.AFTER
        )

        if not doc:
            raise HTTPException(status_code=404, detail="There are no photos to review")

        return PhotoResponse(
            photo_id=str(doc["_id"]),
            user_id=doc["user_id"],
            building_id=doc["building_id"],
            upload_time=doc["upload_time"].isoformat(),
            image_url=doc.get("image_url"),
            status=doc["status"],
            feedback=doc.get("feedback")
        )
    except Exception as e:
        print("get_next_pending_photo error:", traceback.format_exc())
        raise HTTPException(status_code=500, detail="Server error, failed to retrieve photos to be reviewed")



@router.post("/review")
async def review_photo(data: PhotoReviewRequest):
    try:
        result = photo_collection.update_one(
            {"_id": ObjectId(data.photo_id)},
            {"$set": {
                "status": data.status.value,
                "feedback": data.feedback
            }}
        )

        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="No photos found")

        return {"message":f"Photo reviewed successfully. Status updated to: {data.status.value}",
                "photo_id": data.photo_id}

    except Exception as e:
        print("review_photo error:", traceback.format_exc())
        # log_error("Exception during photo review\n" + traceback.format_exc(), e)
        raise HTTPException(status_code=500, detail="Server error, review failed")


# history
@router.get("/user/{user_id}", response_model=List[PhotoResponse])
async def get_user_photos(user_id: str):
    try:
        cursor = photo_collection.find({"user_id": user_id}).sort("upload_time", -1)
        photos = []

        for doc in cursor:
            photos.append(PhotoResponse(
                photo_id=str(doc["_id"]),
                user_id=doc["user_id"],
                building_id=doc["building_id"],
                image_url=doc.get("image_url"),
                upload_time=doc["upload_time"].isoformat(),
                status=doc["status"],
                feedback=doc.get("feedback")
            ))

        return photos

    except Exception as e:
        print("get_user_photos error:", traceback.format_exc())
        # log_error("Exception while retrieving user photo history\n" + traceback.format_exc(), e, user_id=user_id)
        raise HTTPException(status_code=500, detail="Server error, failed to retrieve photo records")
