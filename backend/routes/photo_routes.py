from fastapi import APIRouter, HTTPException, status, File, UploadFile, Form, Depends, Request, Query
from pydantic import BaseModel
from typing import Optional, List
from bson import ObjectId
from datetime import datetime, timezone, timedelta
import traceback
import os
import shutil
import uuid
import time
from pymongo import ReturnDocument

import db_photoEntities
from db_entities import MongoDB, Photo, ReviewStatus
import db_userEntities
# from utils.logger import log_error

router = APIRouter()
photo_collection = MongoDB.get_instance().get_collection("photos")
users_collection = MongoDB.get_instance().get_collection("users")
print(" photos_routes.py 被加载了！")


# 上传目录
UPLOAD_DIR = os.getenv("UPLOAD_DIR", "uploads/photos")
os.makedirs(UPLOAD_DIR, exist_ok=True)

# 访问URL的基础路径
UPLOAD_URL_PATH = os.getenv("UPLOAD_URL_PATH", "static/photos")
BASE_URL = os.getenv("BASE_URL", "http://localhost:8000")


class PhotoReviewRequest(BaseModel):
    photo_id: str
    status_result: str
    feedback: Optional[str] = ""
    reviewer_id: str

class ReleasePhotosRequest(BaseModel):
    reviewer_id: str

class BatchReviewRequest(BaseModel):
    ids: List[str]
    result: str
    feedback: Optional[str] = ""
    reviewer_id: str

class PhotoResponse(BaseModel):
    photo_id: str
    user_id: str
    building_addr: Optional[str] = None
    lat: Optional[float] = None  # 新增：纬度
    lng: Optional[float] = None  # 新增：经度
    # upload_time: str
    upload_time: datetime
    image_url: Optional[str]
    status: str
    feedback: Optional[str]
    reviewer_id: Optional[str]
    review_time: Optional[datetime]

#储存格式（用户id，建筑id,纬度，经度，图片组）
@router.post("/", status_code=201)
async def upload_photo(
        user_id: str = Form(...),
        building_addr: str = Form(...),
        lat: float = Form(...),
        lng: float = Form(...),
        photos: List[UploadFile] = File(...)
):
    try:
        if not photos:
            raise HTTPException(status_code=400, detail="No photos were provided")
        uploaded_photos = []
        for photo in photos:
            # 验证文件类型
            if not photo.content_type.startswith("image/"):
                raise HTTPException(status_code=400,
                                    detail=f"The uploaded file '{photo.filename}' must be in image format")
            # 生成唯一文件名
            file_extension = os.path.splitext(photo.filename)[1]
            unique_filename = f"{user_id}_{int(time.time() * 1000)}_{uuid.uuid4().hex}{file_extension}"
            file_path = os.path.join(UPLOAD_DIR, unique_filename)
            # 保存文件
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(photo.file, buffer)
            # 生成访问URL
            image_url = f"{BASE_URL}/{UPLOAD_URL_PATH}/{unique_filename}"
            photo_obj = Photo(
                user_id=user_id,
                building_addr=building_addr,# building address
                lat=lat,
                lng=lng,
                image_url=image_url,
                upload_time=datetime.now(timezone.utc),
                status=ReviewStatus.Pending
            )
            result = await photo_collection.insert_one(photo_obj.to_dict())
            print(f"Document inserted with ID: {result.inserted_id}")
            if not result.inserted_id:
                # 如果数据库插入失败，删除已上传的文件
                os.remove(file_path)
                raise HTTPException(status_code=500, detail=f"Upload failed for photo '{photo.filename}'")
            uploaded_photos.append({
                "photo_id": str(result.inserted_id),
                "filename": photo.filename
            })
        return {
            "message": f"Successfully uploaded {len(uploaded_photos)} photos. All photos are awaiting review.",
            "uploaded_photos": uploaded_photos
        }
    except HTTPException:
        raise
    except Exception as e:
        print("upload_photo error:", traceback.format_exc())
        # log_error("An exception occurred during the photo upload process\n" + traceback.format_exc(), e, user_id=user_id)
        raise HTTPException(status_code=500, detail="Server error, upload failed")


@router.get("/review/batch_fetch")
async def fetch_photos_for_review(reviewer_id:str):
    print(f"--- VERY IMPORTANT: Entered GET batch_fetch for reviewer: {reviewer_id} ---")
    try:
        timeout_threshold = datetime.now(timezone.utc) - timedelta(hours=1)

        potential_photos_cursor = photo_collection.find(
            {
                "$or": [
                    {"status": ReviewStatus.Pending.value},
                    {"status": ReviewStatus.Reviewing.value, "reviewer_id": reviewer_id},
                    {"status": ReviewStatus.Reviewing.value, "review_time": {"$lt": timeout_threshold}}
                ]
            }
        ).sort("upload_time", 1).limit(30)

        photo_ids_to_attempt_lock = []
        async for photo_doc in potential_photos_cursor:
            photo_ids_to_attempt_lock.append(photo_doc["_id"])

        if not photo_ids_to_attempt_lock:
            raise HTTPException(status_code=404, detail="No pending photos found for review at this moment.")

        update_result = await photo_collection.update_many(
            {
                "_id": {"$in": photo_ids_to_attempt_lock},
                "$or": [
                    {"status": ReviewStatus.Pending.value},
                    {"status": ReviewStatus.Reviewing.value, "reviewer_id": reviewer_id},
                    {"status": ReviewStatus.Reviewing.value, "review_time": {"$lt": timeout_threshold}}
                ]
            },
            {
                "$set": {
                    "status": ReviewStatus.Reviewing.value,
                    "reviewer_id": reviewer_id
                },
                "$currentDate": {"review_time": True}
            }
        )

        locked_photos_cursor = photo_collection.find(
            {"_id": {"$in": photo_ids_to_attempt_lock}, "status": ReviewStatus.Reviewing.value, "reviewer_id": reviewer_id}
        )
        locked_photos = []
        async for photo_doc in locked_photos_cursor:
            photo_doc["photo_id"] = str(photo_doc["_id"])
            del photo_doc["_id"]
            locked_photos.append(PhotoResponse(**photo_doc))

        if not locked_photos:
           raise HTTPException(status_code=404, detail="All available photos were taken by another reviewer, or none could be assigned.")

        return locked_photos

    except HTTPException:
        raise
    except Exception as e:
        print("fetch_photos_for_review error:", traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Server error while fetching photos: {e}")


@router.post("/review/single", response_model=PhotoResponse)
async def review_single_photo(request: PhotoReviewRequest):
    try:
        final_status = ReviewStatus.Approved if request.status_result == "success" else ReviewStatus.Rejected
        current_time = datetime.now(timezone.utc)

        updated_photo_doc = await photo_collection.find_one_and_update(
            {
                "_id": ObjectId(request.photo_id),
                "status": ReviewStatus.Reviewing.value,
                "reviewer_id": request.reviewer_id
            },
            {
                "$set": {
                    "status": final_status.value,
                    "feedback": request.feedback,
                    "reviewer_id": request.reviewer_id,
                    "review_time": current_time
                }
            },
            return_document=ReturnDocument.AFTER
        )

        if not updated_photo_doc:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Photo not found or not in 'reviewing' state for this reviewer."
            )

        updated_photo_doc["photo_id"] = str(updated_photo_doc["_id"])
        del updated_photo_doc["_id"]

        return PhotoResponse(**updated_photo_doc)

    except HTTPException:
        raise
    except Exception as e:
        print("review_single_photo error:", traceback.format_exc())
        raise HTTPException(status_code=500, detail="Server error while reviewing single photo.")

class BatchReviewRequest(BaseModel):
    ids: List[str]  # 直接接收数组
    result: str
    feedback: Optional[str] = ""
    reviewer_id: str

@router.post("/review/batch_submit", response_model=List[PhotoResponse])
async def review_batch_photos(request: BatchReviewRequest):
    try:
        if not request.ids:
            raise HTTPException(status_code=400, detail="No photo IDs provided")

        final_status = ReviewStatus.Approved if request.result == "success" else ReviewStatus.Rejected
        current_time = datetime.now(timezone.utc)

        object_ids = [ObjectId(photo_id) for photo_id in request.ids]

        update_result = await photo_collection.update_many(
            {
                "_id": {"$in": object_ids},
                "status": ReviewStatus.Reviewing.value,
                "reviewer_id": request.reviewer_id
            },
            {
                "$set": {
                    "status": final_status.value,
                    "feedback": request.feedback,
                    "reviewer_id": request.reviewer_id,
                    "review_time": current_time
                }
            }
        )

        if update_result.modified_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No photos found or updated. They might not be in 'reviewing' state by this reviewer."
            )

        # 获取更新后的照片信息
        updated_photos_cursor = photo_collection.find(
            {"_id": {"$in": object_ids},
             "status": final_status.value,
             "reviewer_id": request.reviewer_id})
        updated_photos_list = []
        async for photo_doc in updated_photos_cursor:
            photo_doc["photo_id"] = str(photo_doc["_id"])
            del photo_doc["_id"]
            updated_photos_list.append(PhotoResponse(**photo_doc))

        return updated_photos_list

    except HTTPException:
        raise
    except Exception as e:
        print("review_batch_photos error:", traceback.format_exc())
        raise HTTPException(status_code=500, detail="Server error while reviewing batch photos.")

@router.post("/review/release_all")
async def release_all_reviewing_photos(request: ReleasePhotosRequest):
    try:
        update_result = await photo_collection.update_many(
            {
                "status": ReviewStatus.Reviewing.value,
                "reviewer_id": request.reviewer_id
            },
            {
                "$set": {
                    "status": ReviewStatus.Pending.value,
                    "reviewer_id": None,
                    "review_time": None
                }
            }
        )
        print(f"Released {update_result.modified_count} photos for reviewer {request.reviewer_id}.")
        return {
            "message": f"Successfully released {update_result.modified_count} photos back to pending.",
            "reviewer_id": request.reviewer_id,
            "released_count": update_result.modified_count
        }
    except Exception as e:
        print("release_all_reviewing_photos error:", traceback.format_exc())
        raise HTTPException(status_code=500, detail="Server error while releasing photos.")


@router.get("/user/{user_id}", response_model=List[PhotoResponse])
async def get_user_photos(user_id: str):
    """
    Retrieves all photos uploaded by a specific user.
    """
    try:
        photos_cursor = photo_collection.find({"user_id": user_id}).sort("upload_time", -1)
        user_photos = []
        async for photo_doc in photos_cursor:
            photo_doc["photo_id"] = str(photo_doc["_id"])
            del photo_doc["_id"]
            if "building_id" in photo_doc and "building_addr" not in photo_doc:
                photo_doc["building_addr"] = photo_doc["building_id"] # Use building_id as building_addr for old data

            user_photos.append(PhotoResponse(**photo_doc))

        if not user_photos:
            raise HTTPException(status_code=404, detail=f"No photos found for user {user_id}")

        return user_photos
    except HTTPException:
        raise
    except Exception as e:
        print(f"get_user_photos error for user {user_id}:", traceback.format_exc())
        raise HTTPException(status_code=500, detail="Server error while fetching user photos.")

# # history
# @router.get("/user/{user_id}", response_model=List[PhotoResponse])
# async def get_user_photos(user_id: str):
#     try:
#         cursor = photo_collection.find({"user_id": user_id}).sort("upload_time", -1)
#         photos = []
#
#         for doc in cursor:
#             photos.append(PhotoResponse(
#                 photo_id=str(doc["_id"]),
#                 user_id=doc["user_id"],
#                 building_id=doc["building_id"],
#                 image_url=doc.get("image_url"),
#                 upload_time=doc["upload_time"].isoformat(),
#                 status=doc["status"],
#                 feedback=doc.get("feedback")
#             ))
#
#         return photos
#
#     except Exception as e:
#         print("get_user_photos error:", traceback.format_exc())
#         # log_error("Exception while retrieving user photo history\n" + traceback.format_exc(), e, user_id=user_id)
#         raise HTTPException(status_code=500, detail="Server error, failed to retrieve photo records")
# Backend: photos_routes.py


@router.get("/photo/get_photo_under_same_address")
async def get_photo_list(address: str):
    try:
        photo_list=await db_photoEntities.get_all_photos_under_same_address(address)
        return photo_list
    except Exception as e:
        print(f"get_photo_list error:", traceback.format_exc())
        raise HTTPException(status_code=500, detail="Server error while fetching photo list.")
