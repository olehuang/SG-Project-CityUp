from datetime import datetime
import dotenv

import db_entities
import routes.photo_routes
from db_entities import MongoDB,Building,ReviewStatus,PhotoResponse
from error_logging import log_error
import traceback
from pydantic import BaseModel
from typing import Optional, List




"""
:return a photo list under same address and status= Approved
"""
async def get_all_photos_under_same_address(address:str):
    try:
        return await get_photo_list(address)
    except Exception as e:
        log_error(f'get_all_photos_under_same_address: {e}',
                  stack_data=traceback.format_exc(),
                  time_stamp=datetime.now())
        raise


async def get_first_upload_time(address:str):
    try:
        photo_list = await get_photo_list(address)
        if not photo_list:return None
        return photo_list[-1].upload_time
    except Exception as e:
        log_error(f'get_frisch_upload_time: {e}',
                  stack_data=traceback.format_exc(),
                  time_stamp=datetime.now())
        raise

async def get_photo_list(address:str):
    try:
        collection = MongoDB.get_instance().get_collection('photos')
        query = {
            'building_addr': address,
            'status': ReviewStatus.Approved.value
        }
        photo_list = await (collection
                            .find(query)
                            .sort("upload_time", -1)  # Sort descending earlier is first / ascending(1)
                            .to_list(length=None))
        result_photo_list = []
        for photo_doc in photo_list:
            photo_doc["photo_id"] = str(photo_doc["_id"])
            photo_doc["upload_time"] = str(photo_doc["upload_time"])
            del photo_doc["_id"]
            result_photo_list.append(PhotoResponse(**photo_doc))
        return result_photo_list
    except Exception as e:
        log_error(f'get_photo_list: {e}',
                  stack_data=traceback.format_exc(),
                  time_stamp=datetime.now())
        raise

async def get_first_nine_photo(address:str):
    try:
        photo_list = await get_photo_list(address)
        if not photo_list:return None
        first_9_photo =photo_list[:9]
        return first_9_photo
    except Exception as e:
        log_error(f'get_first_9_photo: {e}',
                  stack_data=traceback.format_exc(),
                  time_stamp=datetime.now())
        raise


def serialize_photo(photo: dict) -> dict:
    return {
        "src": photo.get("src", ""),
        "title": photo.get("title", ""),
        "uploader": photo.get("uploader", ""),
        "uploadTime": photo.get("upload_time", ""),
        # "_id": str(photo["_id"])  # 可选：如果你想保留 _id 传到前端
    }