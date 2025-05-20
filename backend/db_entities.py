import os
from datetime import datetime
from enum import Enum
from typing import Optional

from bson import ObjectId
from pymongo import MongoClient

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
            uri = os.getenv("MONGO_DB_URL", "mongodb://localhost:27017")
            self.client = MongoClient(uri)
            self.db = self.client["city_photo_app"]

    def get_collection(self, collection_name):
        return self.db[collection_name]


# 用户信息
class User:
    def __init__(self, user_id: str, username: str, email: str):
        self.user_id = user_id
        self.username = username
        self.email = email

    def to_dict(self):
        return {
            "user_id": self.user_id,
            "username": self.username,
            "email": self.email,
        }

    @classmethod
    def from_dict(cls, data):
        return cls(
            user_id=data["user_id"],
            username=data["username"],
            email=data["email"]
        )


# 建筑信息
class Building:
    def __init__(self, building_id: str, address: str,
                 geo_coords: Optional[dict] = None):
        self.building_id = building_id
        self.address = address
        self.geo_coords = geo_coords  # {"lat": ..., "lon": ...}

    def to_dict(self):
        return {
            "building_id": self.building_id,
            "address": self.address,
            "geo_coords": self.geo_coords
        }

    @classmethod
    def from_dict(cls, data):
        return cls(
            building_id=data["building_id"],
            address=data["address"],
            geo_coords=data.get("geo_coords")

        )


# 审核状态
class ReviewStatus(Enum):
    Pending = "pending"  #待审核
    Approved = "approved" #成功
    Rejected = "rejected"  #失败


# 上传的照片信息
class Photo:
    def __init__(self, user_id: str, building_id: str,
                 upload_time: Optional[datetime] = None,
                 image_url: Optional[str] = None,
                 status: ReviewStatus = ReviewStatus.Pending,
                 feedback: Optional[str] = None,
                 _id: Optional[ObjectId] = None):
        self._id = _id or ObjectId()
        self.user_id = user_id
        self.building_id = building_id
        self.upload_time = upload_time or datetime.now()
        self.image_url = image_url
        self.status = status
        self.feedback = feedback

    def to_dict(self):
        return {
            "_id": self._id,
            "user_id": self.user_id,
            "building_id": self.building_id,
            "upload_time": self.upload_time,
            "image_url": self.image_url,
            "status": self.status.value,
            "feedback": self.feedback
        }

    @classmethod
    def from_dict(cls, data):
        return cls(
            _id=data.get("_id"),
            user_id=data["user_id"],
            building_id=data["building_id"],
            upload_time=data.get("upload_time"),
            image_url=data.get("image_url"),
            status=ReviewStatus(data.get("status", "pending")),
            feedback=data.get("feedback")
        )
