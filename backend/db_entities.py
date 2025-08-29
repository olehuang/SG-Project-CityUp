import os
from datetime import datetime
from enum import Enum
from typing import Optional,List

from bson import ObjectId,Binary
from pymongo import MongoClient
from pymongo import AsyncMongoClient
from typing import Set
# MongoDB初始化
from pydantic import BaseModel,Field
from bson.binary import Binary

class MongoDB:
    _instance = None

    @staticmethod
    def get_instance():
        if MongoDB._instance is None:
            MongoDB()
        return MongoDB._instance

    def __init__(self):
        if MongoDB._instance is not None:
            raise Exception("This class is a singleton!")
        else:
            MongoDB._instance = self
            uri = os.getenv("MONGO_DB_URL")
            if not uri:
                raise ValueError("MONGO_DB_URL environment variable not set.")

            self.client = AsyncMongoClient(uri)
            self.db = self.client["city_photo_app"]


    def get_collection(self, collection_name):
        return self.db[collection_name]


# User information table
class User:
    def __init__(self, user_id: str, username: str, email: str, role: str,point=0, language: str = "en"):
        self.user_id = user_id
        self.username = username
        self.email = email
        self.role = "user"
        self.point = point
        self.language = language if language else "en"

    def to_dict(self):
        return {
            "user_id": self.user_id,
            "username": self.username,
            "email": self.email,
            "role": self.role,
            "point": self.point,
            "language": self.language
        }

    @classmethod
    def from_dict(cls, data):
        return cls(
            user_id=data["user_id"],
            username=data["username"],
            email=data["email"],
            role=data["role"],
            point=data["point"],
            language = data.get("language", "en")
        )


# 建筑信息
class Building:
    def __init__(self, address: str,
                 geo_coords: Optional[dict] = None):
        self.address = address
        self.geo_coords = geo_coords  # {"lat": ..., "lon": ...}

    def to_dict(self):
        return {
            "address": self.address,
            "geo_coords": self.geo_coords
        }

    @classmethod
    def from_dict(cls, data):
        return cls(
            address=data["address"],
            geo_coords=data.get("geo_coords")
        )


# 审核状态
class ReviewStatus(Enum):
    Pending = "pending"  #待审核
    Reviewing = "reviewing"  # 审核中
    Approved = "approved" #成功
    Rejected = "rejected"  #失败


# 上传的照片信息
class Photo:
    def __init__(self, user_id: str, building_addr: str,
                 lat:Optional[float]=None,
                 lng:Optional[float]=None,
                 upload_time: Optional[datetime] = None,
                 image_url: Optional[str] = None,
                 image_data: Optional[bytes] = None,
                 content_type: Optional[str] = None,
                 status: ReviewStatus = ReviewStatus.Pending,
                 feedback: Optional[str] = None,
                 reviewer_id: Optional[str] = None,
                 review_time: Optional[datetime] = None,
                 like:Optional[Set[str]]=None,#storage user_id, which user like this photo
                 _id: Optional[ObjectId] = None):
        self._id = _id or ObjectId()
        self.user_id = user_id
        self.building_addr = building_addr
        self.lat = lat
        self.lng = lng
        self.upload_time = upload_time or datetime.now()
        self.image_url = image_url
        self.image_data = image_data
        self.content_type = content_type
        self.status = status
        self.feedback = feedback
        self.reviewer_id = reviewer_id
        self.review_time = review_time
        self.like = set(like) if like is not None else set()

    def to_dict(self):
        return {
            "_id": self._id,
            "user_id": self.user_id,
            "building_addr": self.building_addr,
            "lat": self.lat,
            "lng": self.lng,
            "upload_time": self.upload_time,
            "image_url": self.image_url,
            "image_data": Binary(self.image_data),
            "content_type":self.content_type,
            "status": self.status.value,
            "feedback": self.feedback,
            "reviewer_id": self.reviewer_id,
            "review_time": self.review_time,
            "like": list(self.like)
        }

    @classmethod
    def from_dict(cls, data):
        image_data = data.get("image_data")
        if isinstance(image_data, Binary):
            image_data = bytes(image_data)
        return cls(
            _id=data.get("_id"),
            user_id=data["user_id"],
            building_addr=data["building_addr"],
            upload_time=data.get("upload_time"),
            image_url=data.get("image_url"),
            image_data=data.get("image_data"),
            content_type=data.get("content_type"),
            status=ReviewStatus(data.get("status", ReviewStatus.Pending.value)),
            feedback=data.get("feedback"),
            reviewer_id = data.get("reviewer_id"),
            review_time = data.get("review_time"),
            like=set(data.get("like",[]))
        )


class PhotoResponse(BaseModel):
    photo_id: str
    user_id: str
    # upload_time: str
    upload_time: datetime
    status: str

    username: Optional[str] = None
    building_addr: Optional[str] = None
    lat: Optional[float] = None  # 新增：纬度
    lng: Optional[float] = None  # 新增：经度

    image_url: Optional[str]
    #image_data: Photo=None

    feedback: Optional[str]
    reviewer_id: Optional[str]
    review_time: Optional[datetime]
    like: Optional[List[str]]=None
    canLike:Optional[bool] = None #new, tall frontend this user can like or not for this photo
    is_like:Optional[bool]=None # new, markt has been user liked or not
    likeCount:Optional[int]=None #new, count how many people likes