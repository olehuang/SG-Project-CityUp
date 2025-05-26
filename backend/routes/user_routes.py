from fastapi import APIRouter, HTTPException, status, File, UploadFile, Form, Depends
from pydantic import BaseModel
from typing import Optional, List
from bson import ObjectId
from datetime import datetime
from db_entities import User
import db_userEntities
import traceback


router = APIRouter()

class User(BaseModel):
    user_id: str
    username: str
    email: str
    role="user"

@router.post("/user/save_user")
async def save_user(user: User):
    try:
        response= await db_userEntities.save_user(user)
        return response
    except Exception as e:
        print("Exception while saving user",traceback.format_exc())
        return HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.post("/user/update_user")
async def update_user(user_id:str,role="user"):
    try:
        response= await db_userEntities.update_user_role(user_id,role)
        return response
    except Exception as e:
        print("Exception while updating user role",traceback.format_exc())
        return HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.post("/user/delete_user")
async def delete_user(user_id:str):
    try:
        response= await db_userEntities.delete_user(user_id)
        return response
    except Exception as e:
        print("Exception while deleting user",traceback.format_exc())
        return HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

