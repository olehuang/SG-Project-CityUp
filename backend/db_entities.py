import os
from datetime import datetime
from enum import Enum
from typing import Optional

from bson import ObjectId
from pymongo import MongoClient
from pymongo import AsyncMongoClient
# MongoDB初始化

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
    def __init__(self, user_id: str, username: str, email: str, role: str):
        self.user_id = user_id
        self.username = username
        self.email = email
        self.role = "user"

    def to_dict(self):
        return {
            "user_id": self.user_id,
            "username": self.username,
            "email": self.email,
            "role": self.role,
        }

    @classmethod
    def from_dict(cls, data):
        return cls(
            user_id=data["user_id"],
            username=data["username"],
            email=data["email"],
            role=data["role"],
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
                 status: ReviewStatus = ReviewStatus.Pending,
                 feedback: Optional[str] = None,
                 reviewer_id: Optional[str] = None,
                 review_time: Optional[datetime] = None,
                 _id: Optional[ObjectId] = None):
        self._id = _id or ObjectId()
        self.user_id = user_id
        self.building_addr = building_addr
        self.lat = lat;
        self.lng = lng;
        self.upload_time = upload_time or datetime.now()
        self.image_url = image_url
        self.status = status
        self.feedback = feedback
        self.reviewer_id = reviewer_id
        self.review_time = review_time

    def to_dict(self):
        return {
            "_id": self._id,
            "user_id": self.user_id,
            "building_addr": self.building_addr,
            "lat": self.lat,
            "lng": self.lng,
            "upload_time": self.upload_time,
            "image_url": self.image_url,
            "status": self.status.value,
            "feedback": self.feedback,
            "reviewer_id": self.reviewer_id,
            "review_time": self.review_time
        }

    @classmethod
    def from_dict(cls, data):
        return cls(
            _id=data.get("_id"),
            user_id=data["user_id"],
            building_addr=data["building_addr"],
            upload_time=data.get("upload_time"),
            image_url=data.get("image_url"),
            status=ReviewStatus(data.get("status", ReviewStatus.Pending.value)),
            feedback=data.get("feedback"),
            reviewer_id = data.get("reviewer_id"),
            review_time = data.get("review_time")
        )
