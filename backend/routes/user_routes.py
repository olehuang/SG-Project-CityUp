from fastapi import APIRouter, HTTPException, status, Query,File, UploadFile, Form, Depends
from pydantic import BaseModel
from typing import Optional, List
from bson import ObjectId
from datetime import datetime
from . import rankings

import db_photoEntities
from db_entities import User,MongoDB
import db_userEntities
import traceback
from fastapi import FastAPI
from fastapi.encoders import jsonable_encoder
import math
from bson import json_util

router = APIRouter()

class User(BaseModel):
    user_id: str
    username: str
    email: str
    role:str ="user"

class RoleUpdate(BaseModel):
    user_id: str
    role: str = "user"

class UpdateLanguageRequest(BaseModel):
    language: str

@router.post("/save_user")
async def save_user(user: User):
    try:
        response= await db_userEntities.save_user_or_create(user)
        print(response)
        return jsonable_encoder(response)
    except Exception as e:
        print("Exception while saving user",traceback.format_exc())
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.post("/update_user")
async def update_user(data:RoleUpdate):
    try:
        response= await db_userEntities.update_user_role(data.user_id,data.role)
        return jsonable_encoder(response)
    except Exception as e:
        print("Exception while updating user role",traceback.format_exc())
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.post("/delete_user")
async def delete_user(user_id:str):
    try:
        response= await db_userEntities.delete_user(user_id)
        return jsonable_encoder(response)
    except Exception as e:
        print("Exception while deleting user",traceback.format_exc())
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.get("/check_user")
async def check_user(user_id:str):
    try:
        response= await db_userEntities.get_user(user_id)
        if response is None:
            return False
        else:
            return True
    except Exception as e:
        print("Exception while getting user",traceback.format_exc())
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.get("/check_role")
async def check_role(user_id:str):
    try:
        response= await db_userEntities.get_user_role_in_DB(user_id)
        if response is None:
            return False
        else:
            return response
    except Exception as e:
        print("Exception while getting user",traceback.format_exc())
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.get("/get_user_name")
async def get_user_name(user_id:str):
    try:
        user= await db_userEntities.get_user(user_id)
        return user.get("username")
    except Exception as e:
        print("Exception while getting user",traceback.format_exc())
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.get("/get_usernames")
async def get_user_name(user_ids:List[str] = Query(...)):
    result={}
    try:
        for user_id in user_ids:
            user= await db_userEntities.get_user(user_id)
            if user:
                result[user_id]=user.get("username")
            else:
                result[user_id]="Unknow"
        return result
    except Exception as e:
        print("Exception while getting user",traceback.format_exc())
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))



@router.post("/update_point")
async def update_point(user_id:str,point:int):
    """
    :motivation: frontend event triggered by a user(exp. like the photo) or backend reference
    :param user_id: which user to update
    :param point: how many points to update the user
    :return: message
    """
    try:
        #return await db_userEntities.initial_user_point()
        return await db_userEntities.update_user_point(user_id,point)
    except Exception as e:
        print("Exception while updating user point",traceback.format_exc())
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.get("/get_user")
async def get_user(user_id:str):
    try:
        user = await db_userEntities.get_user(user_id)
        if user:
            user["_id"] = str(user["_id"])
            del user["_id"]
        return user
    except Exception as e:
        print("Exception while getting user",traceback.format_exc())
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.get("/get_user_rank")
async def get_user_rank(user_id:str):
    try:
        # return await db_userEntities.get_userRanking(user_id)
        return await rankings.get_user_ranking(user_id)
    except Exception as e:
        print("Exception while getting user",traceback.format_exc())
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.get("/get_all_user_after_order")
async def get_all_user_after_order(
        page: int = Query(1, ge=1),
        limit: int = Query(10, ge=1, le=50)
):
    try:
        result = await rankings.get_leaderboard_data(page, limit, include_checkin_info=False)

        return {
            "total": result["pagination"]["total"],
            "page": result["pagination"]["page"],
            "limit": result["pagination"]["limit"],
            "total_page": result["pagination"]["total_pages"],
            "users": result["users"]
        }

    except Exception as e:
        print("Exception while getting all_user_after_order", traceback.format_exc())
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.get("/canLike")
async def canLike(photo_id:str,user_id:str):
    """
    if isLike==True that meaning already like by same user,than can not like again
    else isLike==False that photo has not like by this user,than can like
   :param photo_id: id of photo
   :param user_id: use to check if photo is like should be in like[] of photo.get("like“)
   :return: boolean, if islike=true return false, in other case return false
   """
    try:
        isLike = await db_photoEntities.isLike(photo_id,user_id)
        if isLike: return False
        return True
    except Exception as e:
        print("Exception while canLike",traceback.format_exc())
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)


@router.post("/like")
async def like(photo_id:str,user_id:str):
    try:
        return await db_photoEntities.like_photo(photo_id,user_id)
    except Exception as e:
        print("Exception while like",traceback.format_exc())
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.post("/dislike")
async def disLike(photo_id:str,user_id:str):
    try:
        return await db_photoEntities.disLike(photo_id,user_id)
    except Exception as e:
        print("Exception while dislike",traceback.format_exc())
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.post("/update_language")
async def update_language(user_id: str, request: UpdateLanguageRequest):
    try:
        print(user_id,request)
        result = await db_userEntities.update_user_language(user_id,
                                                                request.language)

        return result
    except ConnectionError as conn_err:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail="Database connection error. Please try again later.")

    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail="An unexpected error occurred while updating dark mode.")

@router.get("/get_or_create_user")
async def get_or_create_user(user_id: str):
    try:
        # Attempt to get or create the user in the database
        response = await db_userEntities.get_or_create_user(user_id)
        # Return the user data as a JSON response
        return jsonable_encoder(response)

    except ConnectionError as conn_err:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail="Database connection error. Please try again later.")

    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail="An unexpected error occurred while retrieving or creating the user.")

