from datetime import datetime
import dotenv

import db_entities
from db_entities import MongoDB,Building,ReviewStatus
from error_logging import log_error
import traceback


"""
@:parameter building : Building object include(building_id, building_address,geo information)
brief: save/create Building Information into DB
"""
async def save_building(building: Building):
    query={"address": building.address}
    try:
        buildings = MongoDB.get_instance().get_collection("buildings")
        neu_building_dict = {
            "address": building.address,
            "geo_coords": building.geo_coords
        }

        await buildings.insert_one(neu_building_dict)
        print(f"Building '{building.address}' Saved")
    except Exception as e:
        log_error("Error from save_Building : {}".format(e),
                  stack_data=traceback.format_exc(),
                  time_stamp=datetime.now())
        raise


"""
@:parameter string : address of building
brief: whith address can take Building Information from DB
"""
async def take_building_info(address:str):
    query={"address":address}
    try:
        buildings=MongoDB.get_instance().get_collection("buildings")
        result = await buildings.find_one(query)
        if result is None:
            return None
        else:
            return result
    except Exception as e:
        log_error("Error from take_building : {}".format(e),
                  stack_data=traceback.format_exc(),
                  time_stamp=datetime.now())
        raise

"""
brief: give back all Building address from DB
"""
async def take_all_building_address():
    try:
        buildings=MongoDB.get_instance().get_collection("buildings")
        building_list= await buildings.find({}, {"address": 1, "_id": 0}).sort("address",1).to_list(length=None)
        buildings_address_list = [b["address"] for b in building_list if "address" in b]
        return buildings_address_list
    except Exception as e:
        log_error("Error from take_all_building_address : {}".format(e),
                  stack_data=traceback.format_exc(),
                  time_stamp=datetime.now())
        raise


"""
@brief: save addresse from photo collection
"""
async def update_addr_from_photo():
    try:
        photos_collection=MongoDB.get_instance().get_collection("photos")  #table of photos
        photos= photos_collection.find({}, batch_size=1000)
        buildings=MongoDB.get_instance().get_collection("buildings")

        existing_addresses = set() #caching existing_addr
        async for building in buildings.find({}, {"address": 1, "_id": 0}):
            if building.get("address"):
              existing_addresses.add(building["address"])

        async for photo in photos:
            address = photo.get("building_addr")
            if not address or address in existing_addresses:
                continue
            if photo.get("status") != ReviewStatus.Approved.value:continue

            geo_coords = {"lat": photo.get("lat"), "lng": photo.get("lng")}
            building = Building(address=address, geo_coords=geo_coords)
            await save_building(building)
            existing_addresses.add(address) #address add in caching existing_addr
    except Exception as e:
        log_error("fError saving building for photo: {photo}",
                  stack_data=traceback.format_exc(),
                  time_stamp=datetime.now())
        raise


async def delete_all_addr():
    """
    Clear all Address from Database
    WARNING: This will delete all Address from Database
    """
    buildings=MongoDB.get_instance().get_collection("buildings")
    result = await buildings.delete_many({})
    print(f"Deleted {result.deleted_count} building Address")