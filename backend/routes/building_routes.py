from fastapi import APIRouter, HTTPException, status, File, UploadFile, Form, Depends
from pydantic import BaseModel
from typing import Optional
import traceback
import db_buildingEntities
router = APIRouter()


class Building(BaseModel):
    building_addr:str
    building_address:str
    geo_coords:Optional[dict] = None


@router.get("/get_all_build_addr")
async def get_all_build_addr():
    try:
        response = await db_buildingEntities.take_all_building_address()
        return response
    except Exception as e:
        print("Get All building addresse error:",traceback.format_exc())
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))



