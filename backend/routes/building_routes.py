from fastapi import APIRouter, HTTPException, status, File, UploadFile, Form, Depends
from pydantic import BaseModel
from typing import Optional
import traceback
from error_logging import log_error
import db_buildingEntities
from db_entities import MongoDB,Building,ReviewStatus,PhotoResponse,Photo
from datetime import datetime
router = APIRouter()


class Building(BaseModel):
    building_address:str
    geo_coords:Optional[dict] = None


@router.get("/get_all_build_addr")
async def get_all_build_addr():
    try:
        await db_buildingEntities.update_addr_from_photo() # fresh_building_addresses
        response = await db_buildingEntities.take_all_building_address()
        return response
    except Exception as e:
        print("Get All building addresse error:",traceback.format_exc())
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


async def get_photo_status_by_address():
    try:
        photo = MongoDB.get_instance().get_collection("photos");

        pipeline = [
            {
                "$group": {
                    "_id": "$building_addr",
                    "photo_count": {"$sum": 1},
                    "last_update_time": {"$max": "$upload_time"}
                }
            },
            {"$sort": {"_id": 1}}
        ]
        result_cursor = await photo.aggregate(pipeline)
        result=[]
        async for doc in result_cursor:
            result.append({
                "building_addr": str(doc["_id"]),
                "photo_count": doc["photo_count"],
                "last_update_time": str(doc["last_update_time"]),
            })
        return result
    except Exception as e:
        log_error("get_photo_status_by_address error:",traceback.format_exc(),
                  stack_data=traceback.format_exc(),
                  time_stamp=datetime.now())
        raise


@router.get("/get_addr_with_status")
async def get_addr_with_status():
    try:
        await db_buildingEntities.update_addr_from_photo()
        add_list = await db_buildingEntities.take_all_building_address()

        status = await get_photo_status_by_address()
        status_map = {s["building_addr"]: s for s in status}

        combin=[]
        for addr in add_list:
            status =status_map.get(addr,{"photo_count":0,"last_update_time":None})

            combin.append({
                "building_addr":addr,
                "photo_count":status["photo_count"],
                "last_update_time":status["last_update_time"]
            })
        return combin
    except Exception as e:
        log_error("get_addr_with_status error:",traceback.format_exc(),
                  stack_data=traceback.format_exc(),
                  time_stamp=datetime.now())
        return HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
