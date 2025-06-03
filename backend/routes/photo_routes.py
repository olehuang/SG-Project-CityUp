from fastapi import APIRouter, HTTPException, status, File, UploadFile, Form, Depends
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

class PhotoReviewRequest(BaseModel):
    photo_id: str
    # status: ReviewStatus
    status: str  # "success" or "fail" from frontend
    feedback: Optional[str] = None
    reviewer_id: str  # Added reviewer_id

class BatchReviewRequest(BaseModel):
    ids: List[str]
    result: str  # "success" 或 "fail"
    feedback: Optional[str] = ""
    reviewer_id: str  # Added reviewer_id

class PhotoResponse(BaseModel):
    photo_id: str
    user_id: str
    building_id: str
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
        building_id: str = Form(...),
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
            timestamp = int(time.time())
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
                building_id=building_id,# building address
                lat=lat,#纬度
                lng=lng,#经度
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
#
#
# @router.post("/review/batch", response_model=List[PhotoResponse])
# async def get_batch_pending_photos(batch_size: int = 30):
#     try:
#         # 获取前 batch_size 条待审核照片（pending 状态）
#         pending_photos = list(photo_collection.find(
#             {"status": ReviewStatus.Pending.value}
#         ).sort("upload_time", 1).limit(batch_size))
#
#         if not pending_photos:
#             raise HTTPException(status_code=404, detail="No pending photos to review.")
#
#         # 拿到这些照片的 ID
#         photo_ids = [doc["_id"] for doc in pending_photos]
#
#         # 批量更新它们的状态为 reviewing
#         result = photo_collection.update_many(
#             {"_id": {"$in": photo_ids}},
#             {"$set": {"status": ReviewStatus.Reviewing.value}}
#         )
#
#         print(f"Marked {result.modified_count} photos as reviewing.")
#
#         return [
#             PhotoResponse(
#                 photo_id=str(doc["_id"]),
#                 user_id=doc["user_id"],
#                 building_id=doc["building_id"],
#                 upload_time=doc["upload_time"].isoformat(),
#                 image_url=doc.get("image_url"),
#                 status=ReviewStatus.Reviewing.value,
#                 feedback=doc.get("feedback")
#             )
#             for doc in pending_photos
#         ]
#     except Exception as e:
#         print("get_batch_pending_photos error:", traceback.format_exc())
#         raise HTTPException(status_code=500, detail="Server error while retrieving photo batch.")

#
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
@router.post("/review/batch_fetch", response_model=List[PhotoResponse], summary="Fetch pending photos for review")
async def fetch_photos_for_review(reviewer_id: str):
    """
    Fetches up to 30 pending photos for review and marks them as 'reviewing' for the given reviewer.
    It also handles photos that might have been 'stuck' in 'reviewing' status by an inactive reviewer.
    """
    try:
        # Define a timeout for 'stuck' reviewing photos (e.g., 1 hour)
        timeout_threshold = datetime.now(timezone.utc) - timedelta(hours=1)

        # 1. Find photos that are:
        #    a) Pending (never reviewed)
        #    b) Currently reviewing by THIS reviewer (to allow re-fetching if session refreshes)
        #    c) Reviewing by ANY reviewer but the 'review_time' is older than the timeout_threshold (stuck photos)
        potential_photos_cursor = photo_collection.find(
            {
                "$or": [
                    {"status": ReviewStatus.Pending.value},
                    {"status": ReviewStatus.Reviewing.value, "reviewer_id": reviewer_id},
                    {"status": ReviewStatus.Reviewing.value, "review_time": {"$lt": timeout_threshold}}
                ]
            }
        ).sort("upload_time", 1).limit(30) # Prioritize older uploads, limit batch size

        photo_ids_to_attempt_lock = []
        async for photo_doc in potential_photos_cursor:
            photo_ids_to_attempt_lock.append(photo_doc["_id"])

        if not photo_ids_to_attempt_lock:
            raise HTTPException(status_code=404, detail="No pending photos found for review at this moment.")

        # 2. Atomically attempt to acquire a "lock" on these photos
        # Update their status to 'reviewing' and assign them to the current reviewer
        # This operation is critical for concurrency: only photos matching the $or criteria
        # and not simultaneously updated by another reviewer will be locked.
        update_result = await photo_collection.update_many(
            {
                "_id": {"$in": photo_ids_to_attempt_lock},
                "$or": [
                    {"status": ReviewStatus.Pending.value}, # Lock truly pending photos
                    {"status": ReviewStatus.Reviewing.value, "reviewer_id": reviewer_id}, # Re-lock for this reviewer
                    {"status": ReviewStatus.Reviewing.value, "review_time": {"$lt": timeout_threshold}} # Re-lock stuck photos
                ]
            },
            {
                "$set": {
                    "status": ReviewStatus.Reviewing.value, # Set status to 'reviewing'
                    "reviewer_id": reviewer_id # Assign to current reviewer
                },
                "$currentDate": {"review_time": True} # Set review_time to now (UTC)
            }
        )

        # 3. Retrieve the photos that were SUCCESSFULLY marked as 'reviewing' by THIS reviewer
        # This is the actual set of photos that the current reviewer can work on.
        locked_photos_cursor = photo_collection.find(
            {"_id": {"$in": photo_ids_to_attempt_lock}, "status": ReviewStatus.Reviewing.value, "reviewer_id": reviewer_id}
        )
        locked_photos = []
        async for photo_doc in locked_photos_cursor:
            # Convert ObjectId to string for the frontend response
            photo_doc["photo_id"] = str(photo_doc["_id"])
            del photo_doc["_id"] # Remove the _id field
            locked_photos.append(PhotoResponse(**photo_doc)) # Convert to Pydantic model

        if not locked_photos:
            # This can happen if another reviewer grabbed all photos before this update_many
            raise HTTPException(status_code=404, detail="All available photos were taken by another reviewer, or none could be assigned.")

        return locked_photos

    except HTTPException:
        raise # Re-raise FastAPI HTTPExceptions
    except Exception as e:
        print("fetch_photos_for_review error:", traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Server error while fetching photos: {e}")

@router.post("/review/single", response_model=PhotoResponse, summary="Review a single photo")
async def review_single_photo(request: PhotoReviewRequest):
    """
    Updates the review status for a single photo.
    """
    try:
        # Determine final status based on frontend result
        final_status = ReviewStatus.Approved if request.status == "success" else ReviewStatus.Rejected
        current_time = datetime.now(timezone.utc)

        # Find and update the document.
        # Ensure only photos currently in 'reviewing' state by the same reviewer can be updated.
        # This prevents accidental updates by other reviewers or if the status changed.
        updated_photo_doc = await photo_collection.find_one_and_update(
            {
                "_id": ObjectId(request.photo_id),
                "status": ReviewStatus.Reviewing.value,
                "reviewer_id": request.reviewer_id # Ensure this reviewer is the one assigned
            },
            {
                "$set": {
                    "status": final_status.value,
                    "feedback": request.feedback,
                    "reviewer_id": request.reviewer_id, # Re-confirm reviewer
                    "review_time": current_time
                }
            },
            return_document=ReturnDocument.AFTER # Return the updated document
        )

        if not updated_photo_doc:
            # This photo might have been already reviewed, or reviewer_id mismatch
            # Or it was not in 'reviewing' status for this reviewer
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Photo not found or not in 'reviewing' state for this reviewer."
            )

        # Convert _id to photo_id string
        updated_photo_doc["photo_id"] = str(updated_photo_doc["_id"])
        del updated_photo_doc["_id"]

        return PhotoResponse(**updated_photo_doc)

    except HTTPException:
        raise
    except Exception as e:
        print("review_single_photo error:", traceback.format_exc())
        raise HTTPException(status_code=500, detail="Server error while reviewing single photo.")


@router.post("/review/batch_submit", response_model=List[PhotoResponse])
async def review_batch_photos(request: BatchReviewRequest):
    """
    Updates the review status for a batch of photos.
    """
    try:
        final_status = ReviewStatus.Approved if request.result == "success" else ReviewStatus.Rejected
        current_time = datetime.now(timezone.utc)

        # Convert string IDs to ObjectIds
        object_ids = [ObjectId(photo_id) for photo_id in request.ids]

        # Atomically update all selected photos
        # Only update if they are in 'reviewing' state by the specified reviewer
        update_result = await photo_collection.update_many(
            {
                "_id": {"$in": object_ids},
                "status": ReviewStatus.Reviewing.value,
                "reviewer_id": request.reviewer_id # Ensure these photos were assigned to this reviewer
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

        # Retrieve the updated documents to send back
        # This is important for the frontend to confirm what was actually processed
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
async def release_all_reviewing_photos(reviewer_id: str):
    """
    Releases all photos currently in 'reviewing' status by a specific reviewer back to 'pending'.
    This is for when a reviewer exits without finishing.
    """
    try:
        update_result = await photo_collection.update_many(
            {
                "status": ReviewStatus.Reviewing.value,
                "reviewer_id": reviewer_id
            },
            {
                "$set": {
                    "status": ReviewStatus.Pending.value,
                    "reviewer_id": None, # Clear reviewer_id
                    "review_time": None # Clear review time
                }
            }
        )
        print(f"Released {update_result.modified_count} photos for reviewer {reviewer_id}.")
        return {"message": f"Successfully released {update_result.modified_count} photos back to pending."}
    except Exception as e:
        print("release_all_reviewing_photos error:", traceback.format_exc())
        raise HTTPException(status_code=500, detail="Server error while releasing photos.")