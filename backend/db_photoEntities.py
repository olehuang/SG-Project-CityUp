from datetime import datetime
from fastapi import File
import dotenv

from bson import ObjectId
import db_entities
import db_userEntities
import routes.user_routes
import routes.photo_routes
from db_entities import MongoDB,Building,ReviewStatus,PhotoResponse,Photo
from error_logging import log_error
import traceback
from pydantic import BaseModel
from bson.binary import Binary
from fastapi import Request,HTTPException
from typing import Optional, List



photo_collection = MongoDB.get_instance().get_collection('photos')
user_collection = MongoDB.get_instance().get_collection('users')
buildings_collection = MongoDB.get_instance().get_collection('buildings')

"""
:return a photo list under same address and status= Approved
"""
async def get_all_photos_under_same_address(address:str,request:Request,user_id:str=None):
    try:
        return await get_photo_list(address,request,user_id=user_id)
    except Exception as e:
        log_error(f'get_all_photos_under_same_address: {e}',
                  stack_data=traceback.format_exc(),
                  time_stamp=datetime.now())
        raise


async def get_first_upload_time(address:str,request:Request):
    try:
        photo_list = await get_photo_list(address,request)
        if not photo_list:return None
        return photo_list[-1].upload_time
    except Exception as e:
        log_error(f'get_frisch_upload_time: {e}',
                  stack_data=traceback.format_exc(),
                  time_stamp=datetime.now())
        raise

async def get_photo_list(address:str,request:Request,user_id:str=None):
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
            user =await db_userEntities.get_user(photo_doc["user_id"])
            if user_id:# if argument more a user_id, can more a attribute return
                photo_doc["canLike"] = routes.user_routes.canLike(photo_doc["photo_id"],user_id)
            photo_doc["username"] = str( user.get("username"))
            photo_doc["upload_time"] = str(photo_doc["upload_time"])
            photo_doc["image_url"] = f"{request.url.scheme}://{request.url.netloc}/photos/{str(photo_doc["_id"])}/data"
            #del photo_doc["_id"]
            result_photo_list.append(PhotoResponse(**photo_doc))
        return result_photo_list
    except Exception as e:
        log_error(f'get_photo_list: {e}',
                  stack_data=traceback.format_exc(),
                  time_stamp=datetime.now())
        raise

async def get_first_nine_photo(address:str,request:Request,user_id:str=None):
    try:
        photo_list = await get_photo_list(address,request,user_id=user_id)
        if not photo_list:return None
        first_9_photo =photo_list[:9]
        return first_9_photo
    except Exception as e:
        log_error(f'get_first_9_photo: {e}',
                  stack_data=traceback.format_exc(),
                  time_stamp=datetime.now())
        raise


async def isLike(photo_id:str,user_id:str):
    """
    :brief : check user has been this photo already like or not
    :param photo_id: _id of photo
    :param user_id: use to check if photo is like should be in like[] of photo.get("like“)
    :return: boolean, if photo is already by this user liked return True,
                      in other case return False
    """
    try:
        #search one photo if photo and liked user user_id exsist
        photo = await photo_collection.find_one({"_id":ObjectId(photo_id),"like":user_id})
        if not photo:
            log_error(f"photo :{photo_id} not exist", stack_data=traceback.format_exc(),
                      time_stamp=datetime.now())
            raise
        return photo is not None
    except Exception as e:
        log_error(f'isLike: {e}', stack_data=traceback.format_exc(),
                  time_stamp=datetime.now())
        raise


async def like_photo(photo_id:str,user_id:str):
    """
    :brief : if frontend click like button, this function will be call,
             than user_id of which user click like button will add in like[] of photo.
             than photo owner 1 point add
    :param photo_id: which photo will be like
    :param user_id: which user_id will be in like of photo.get("like") add
    """
    try:
        photo = await photo_collection.find_one({"_id":ObjectId(photo_id)})
        if not photo:
            log_error("photo not exist",
                                stack_data=traceback.format_exc(),
                                time_stamp=datetime.now())
            raise HTTPException(status_code=404, detail=f"Photo {photo_id} not found")
        #get photo owner user_id
        photo_owner = photo.get("user_id")
        # insert like user_id of like user into like[] of this photo
        if photo_owner == user_id:
            return {"error": f"photo owner can not like selves photo"}

        #if like user's user_id not in like[] = this user has no liek this photo
        if not (user_id in photo.get("like") or []):
            await photo_collection.update_one(
                {"_id":photo_id},
                {"$addToSet":{"like":user_id}}
            )
            # update photo owner pointer with point 1
            return await db_userEntities.update_user_point(photo_owner,1)
        return {"message":"photo is already like"}
    except Exception as e:
        log_error(f'like_photo: {e}', stack_data=traceback.format_exc(),
                  time_stamp=datetime.now())
        raise



