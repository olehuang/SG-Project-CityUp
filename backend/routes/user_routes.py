from fastapi import APIRouter, HTTPException, status, Query,File, UploadFile, Form, Depends
from pydantic import BaseModel
from typing import Optional, List
from bson import ObjectId
from datetime import datetime
from db_entities import User,MongoDB
import db_userEntities
import traceback
from fastapi import FastAPI
from fastapi.encoders import jsonable_encoder
import math


router = APIRouter()

class User(BaseModel):
    user_id: str
    username: str
    email: str
    role:str ="user"

class RoleUpdate(BaseModel):
    user_id: str
    role: str = "user"
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
        return await db_userEntities.get_userRanking(user_id)
    except Exception as e:
        print("Exception while getting user",traceback.format_exc())
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.get("/get_all_user_after_order")
async def get_all_user_after_order(
        page:int = Query(1,ge=1),
        limit:int = Query(10,ge=1,le=50)
):
    try:
        skip = (page-1)*limit
        users = MongoDB.get_instance().get_collection('users')
        print("total")
        total= 50
        total_page=math.ceil(total/limit)
        users_cursor=users.find().skip(skip).limit(limit)
        users_list= await users_cursor.to_list(length=limit)


        result_user =[]
        for user in users_list:
            if user:
                user["_id"] = str(user["_id"])
                del user["_id"]
            print("user: ",user)
            result_user.append({
                "user_id":user.get("user_id"),
                "username" :user.get("username"),
                "point":user.get("point")
            })

        return{
            "total":total,
            "page":page,
            "limit":limit,
            "total_page":total_page,
            "users":result_user,
        }
    except Exception as e:
        print("Exception while getting all_user_after_order",traceback.format_exc())
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

