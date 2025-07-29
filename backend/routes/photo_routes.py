from fastapi import APIRouter, HTTPException, status, File, UploadFile, Form, Depends, Request, Query,Response,Body
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
import math

import db_photoEntities
from db_entities import MongoDB, Photo, ReviewStatus,PhotoResponse
import db_userEntities
from bson.binary import Binary
from routes.rankings import auto_checkin_on_upload,reward_photo_approval
#for photo download
from starlette.responses import StreamingResponse
import io
from io import BytesIO
import zipfile
# from utils.logger import log_error

router = APIRouter()
photo_collection = MongoDB.get_instance().get_collection("photos")
users_collection = MongoDB.get_instance().get_collection("users")

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

# 新增 upload History
class UploadHistoryResponse(BaseModel):
    photos: List[PhotoResponse]
    total_count: int
    page: int
    limit: int
    total_pages: int


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
        auto_checkin_result = None
        for photo in photos:
            # 验证文件类型
            if not photo.content_type.startswith("image/"):
                raise HTTPException(status_code=400,
                                    detail=f"The uploaded file '{photo.filename}' must be in image format")
            image_binary_data = await photo.read()
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
                image_data=image_binary_data,
                content_type=photo.content_type,
                upload_time=datetime.now(timezone.utc),
                status=ReviewStatus.Pending
            )
            result = await photo_collection.insert_one(photo_obj.to_dict())
            print(f"Document inserted with ID: {result.inserted_id}")
            if not result.inserted_id:
                os.remove(file_path)
                raise HTTPException(status_code=500, detail=f"Upload failed for photo '{photo.filename}'")
            uploaded_photos.append({
                "photo_id": str(result.inserted_id),
                "filename": photo.filename
            })

        if uploaded_photos:
            auto_checkin_result = await auto_checkin_on_upload(user_id, datetime.now(timezone.utc))

        base_message = f"Successfully uploaded {len(uploaded_photos)} photos. All photos are awaiting review."
        if auto_checkin_result:
            checkin_message = f" Auto checkin completed: {auto_checkin_result['consecutive_days']} consecutive days, earned {auto_checkin_result['points_earned']} points!"
            full_message = base_message + checkin_message
        else:
            full_message = base_message

        response_data = {
            "message": full_message,
            "uploaded_photos": uploaded_photos
        }

        if auto_checkin_result:
            response_data["auto_checkin"] = auto_checkin_result

        return response_data
    except HTTPException:
        raise
    except Exception as e:
        print("upload_photo error:", traceback.format_exc())
        # log_error("An exception occurred during the photo upload process\n" + traceback.format_exc(), e, user_id=user_id)
        raise HTTPException(status_code=500, detail="Server error, upload failed")

@router.get("/{photo_id}/data")
async def get_photo(photo_id: str):
    try:
        object_id_to_find = ObjectId(photo_id)
        print(f"DEBUG: Attempting to find document with ObjectId: {object_id_to_find}")
        photo_obj = await photo_collection.find_one({"_id": ObjectId(photo_id)})
        if photo_obj is None:
            raise HTTPException(status_code=404, detail="Photo not found")
        image_data = photo_obj.get("image_data")
        if isinstance(image_data, Binary):
            image_data = bytes(image_data)
        elif image_data is None:
            raise HTTPException(status_code=404, detail="Image data not found")
        content_type = photo_obj.get("content_type", "image/jpeg")
        headers = {
            "Cache-Control": "public, max-age=3600",
            "Content-Type": content_type
        }
        return Response(content=image_data, media_type=content_type, headers=headers)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Server error, get photo failed")


@router.get("/download_photo/{photo_id}")
async def download_photo(photo_id: str):
    try:
        collection = MongoDB.get_instance().get_collection('photos')
        photo = await collection.find_one({"_id": ObjectId(photo_id)})
        if not photo:
            raise HTTPException(status_code=404, detail="Photo not found")
        image_data = photo.get("image_data")
        content_type = photo.get("content_type", "application/octet-stream")
        filename = photo.get("image_url", "downloaded_image.jpg").split("/")[-1]

        return StreamingResponse(
            io.BytesIO(image_data),
            media_type=content_type,
            headers={
                "Content-Disposition": f"attachment; filename={filename}"
            }
        )
    except Exception as e:
        print("Download error:", traceback.format_exc())
        raise HTTPException(status_code=500, detail="Server error during image download")

@router.get("/download_zip")
async def download_photos_zip(photo_ids: List[str] = Query(...)):
    try:
        #photo_id_list = photo_ids.split(",")
        zip_stream = BytesIO()
        with zipfile.ZipFile(zip_stream, "w", zipfile.ZIP_DEFLATED) as zip_file:
            for pid in photo_ids:
                try:
                    photo = await photo_collection.find_one({"_id": ObjectId(pid)})
                    if photo and "image_data" in photo:
                        image_bytes = photo["image_data"]
                        filename = f"{photo.get('title', 'photo')}_{pid}.jpg"
                        zip_file.writestr(filename, image_bytes)
                except Exception as e:
                    print(f"Skipping photo {pid} due to error: {e}")
        zip_stream.seek(0)
        return StreamingResponse(
            zip_stream,
            media_type="application/x-zip-compressed",
            headers={"Content-Disposition": "attachment; filename=photos.zip"}
        )
    except Exception as e:
        print("Error generating ZIP:", e)
        raise HTTPException(status_code=500, detail="Failed to generate ZIP.")

@router.get("/review/batch_fetch")
async def fetch_photos_for_review(reviewer_id:str, request: Request):
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
            photo_doc["image_url"] = f"{request.url.scheme}://{request.url.netloc}/photos/{str(photo_doc["_id"])}/data"
            del photo_doc["_id"]

            try:
                user_info = await db_userEntities.get_user(photo_doc["user_id"])
                if user_info and "username" in user_info:
                    photo_doc["username"] = user_info["username"]
                else:
                    photo_doc["username"] = photo_doc["user_id"]
            except Exception as e:
                print(f"Failed to get username for user_id {photo_doc['user_id']}: {e}")
                photo_doc["username"] = photo_doc["user_id"]

            if "image_data" in photo_doc:
                del photo_doc["image_data"]
            locked_photos.append(PhotoResponse(**photo_doc))


        if not locked_photos:
           raise HTTPException(status_code=404, detail="All available photos were taken by another reviewer, or none could be assigned.")

        return locked_photos

    except HTTPException:
        raise
    except Exception as e:
        print("fetch_photos_for_review error:", traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Server error while fetching photos: {e}")


@router.post("/review/single")
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

        if final_status == ReviewStatus.Approved:
            await reward_photo_approval(updated_photo_doc["user_id"], request.photo_id)
        updated_photo_doc["photo_id"] = str(updated_photo_doc["_id"])
        del updated_photo_doc["_id"]
        if "image_data" in updated_photo_doc:
            del updated_photo_doc["image_data"]

        return PhotoResponse(**updated_photo_doc)

    except HTTPException:
        raise
    except Exception as e:
        print("review_single_photo error:", traceback.format_exc())
        raise HTTPException(status_code=500, detail="Server error while reviewing single photo.")


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

        updated_photos_cursor = photo_collection.find(
            {"_id": {"$in": object_ids},
             "status": final_status.value,
             "reviewer_id": request.reviewer_id})
        updated_photos_list = []
        async for photo_doc in updated_photos_cursor:
            if final_status == ReviewStatus.Approved:
                await reward_photo_approval(photo_doc["user_id"], str(photo_doc["_id"]))
            photo_doc["photo_id"] = str(photo_doc["_id"])
            del photo_doc["_id"]
            if "image_data" in photo_doc:
                del photo_doc["image_data"]
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

@router.get("/get_photo_list")
async def get_photo_list(address: str,request:Request,user_id:str=None):
    try:
        photo_list= await db_photoEntities.get_all_photos_under_same_address(address,request,user_id=user_id)
        return photo_list
    except Exception as e:
        print("get_photo_list in photo_router error:",str(e), traceback.format_exc())
        raise HTTPException(status_code=500, detail="Server error while fetching photo list.")

@router.get("/get_first_9_photo")
async def get_first_9_photo(address: str,request: Request,user_id:str=None):
    try:
        photo_list= await db_photoEntities.get_first_nine_photo(address,request,user_id=user_id)
        return photo_list
    except Exception as e:
        print(f"get_photo_list error:", traceback.format_exc())
        raise HTTPException(status_code=500, detail="Server error while fetching photo list.")


@router.get("/photoNumber")
async def get_photo_number(address: str,request:Request):
    try:
       photo_list= await db_photoEntities.get_photo_list(address,request)
       return len(photo_list)
    except Exception as e:
        print(f"get_photo_number error:", traceback.format_exc())
        raise HTTPException(status_code=500, detail="Server error while fetching photo list.")

@router.get("/get_first_upload_time")
async def get_first_upload_time(address: str,request:Request):
    try:
        return await db_photoEntities.get_first_upload_time(address,request)
    except Exception as e:
        print(f"get_firsh_upload_time error:", traceback.format_exc())
        raise HTTPException(status_code=500, detail="Server error while fetching photo list.")


# 新增：上传历史记录接口
@router.get("/history", response_model=UploadHistoryResponse)
async def get_upload_history(
        request: Request,
        user_id: str = Query(..., description="用户ID"),
        page: int = Query(1, ge=1, description="页码"),
        limit: int = Query(10, ge=1, le=100, description="每页数量"),
        status: Optional[str] = Query(None, description="筛选状态: pending, reviewing, approved, rejected")
):
    """
    获取用户的上传历史记录，支持分页和状态筛选
    """
    try:
        # 构建查询条件
        query = {"user_id": user_id}
        if status:
            # 将状态字符串转换为对应的枚举值
            status_mapping = {
                "pending": ReviewStatus.Pending.value,
                "reviewing": ReviewStatus.Reviewing.value,
                "approved": ReviewStatus.Approved.value,
                "rejected": ReviewStatus.Rejected.value
            }
            if status in status_mapping:
                query["status"] = status_mapping[status]
            else:
                raise HTTPException(status_code=400, detail=f"Invalid status: {status}")

        # 计算总数
        total_count = await photo_collection.count_documents(query)

        if total_count == 0:
            return UploadHistoryResponse(
                photos=[],
                total_count=0,
                page=page,
                limit=limit,
                total_pages=0
            )

        # 计算分页
        total_pages = math.ceil(total_count / limit)

        # 计算跳过的文档数
        skip = (page - 1) * limit
        print(f"DEBUG: Total count: {total_count}, Page: {page}, Limit: {limit}")
        print(f"DEBUG: Query conditions: {query}")

        # 查询数据
        photos_cursor = photo_collection.find(query).sort("upload_time", -1).skip(skip).limit(limit)
        print("Query for history:", query)

        photos = []
        async for photo_doc in photos_cursor:
            photo_doc["photo_id"] = str(photo_doc["_id"])
            photo_id = str(photo_doc["_id"])
            del photo_doc["_id"]

            # 兼容旧数据
            if "building_id" in photo_doc and "building_addr" not in photo_doc:
                photo_doc["building_addr"] = photo_doc["building_id"]

            photo_doc["image_url"] = f"{request.url.scheme}://{request.url.netloc}/photos/{photo_id}/data"
            # 拼接完整图片 URL
            # filename = photo_doc.get("filename")
            # if filename:
            #     photo_doc["image_url"] = str(request.base_url) + f"static/photos/{filename}"
            print(f"DEBUG: Successfully processed {len(photos)} photos")
            photos.append(PhotoResponse(**photo_doc))

        return UploadHistoryResponse(
            photos=photos,
            total_count=total_count,
            page=page,
            limit=limit,
            total_pages=total_pages
        )

    except HTTPException:
        raise
    except Exception as e:
        print(f"get_upload_history error for user {user_id}:", traceback.format_exc())
        raise HTTPException(status_code=500, detail="Server error while fetching upload history.")

# 新增：获取照片统计信息
@router.get("/stats/{user_id}")
async def get_user_photo_stats(user_id: str):
    """
    获取用户照片统计信息
    """
    try:
        # 使用聚合管道统计各状态照片数量
        pipeline = [
            {"$match": {"user_id": user_id}},
            {"$group": {
                "_id": "$status",
                "count": {"$sum": 1}
            }}
        ]

        stats_cursor = photo_collection.aggregate(pipeline)
        stats_dict = {}
        total_count = 0

        async for stat in stats_cursor:
            status = stat["_id"]
            count = stat["count"]
            stats_dict[status] = count
            total_count += count

        return {
            "user_id": user_id,
            "total_photos": total_count,
            "pending": stats_dict.get(ReviewStatus.Pending.value, 0),
            "reviewing": stats_dict.get(ReviewStatus.Reviewing.value, 0),
            "approved": stats_dict.get(ReviewStatus.Approved.value, 0),
            "rejected": stats_dict.get(ReviewStatus.Rejected.value, 0)
        }

    except Exception as e:
        print(f"get_user_photo_stats error for user {user_id}:", traceback.format_exc())
        raise HTTPException(status_code=500, detail="Server error while fetching photo statistics.")
