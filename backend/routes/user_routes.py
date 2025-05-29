from fastapi import APIRouter, HTTPException, status, File, UploadFile, Form, Depends
from pydantic import BaseModel
from typing import Optional, List
from bson import ObjectId
from datetime import datetime
from db_entities import User
import db_userEntities
import traceback
from fastapi import FastAPI
from fastapi.encoders import jsonable_encoder


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
        response= await db_userEntities.get_user(user_id)
        print("response：",response)
        if response is None:
            return False
        else:
            return response
    except Exception as e:
        print("Exception while getting user",traceback.format_exc())
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))